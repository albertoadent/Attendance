const {
  Class,
  Sequelize,
  User,
  SchoolUser,
  ClassUser,
} = require("../../db/models");
const { FORBIDDEN } = require("../../utils/auth");

const router = require("express").Router();

/* MIDDLEWARE */

async function getClass(req, res, next) {
  const { classId } = req.params;
  req.class = await Class.findByPk(classId);
  return next();
}

function classExists(req, res, next) {
  if (req.class) {
    return next();
  }
  return res.status(400).json({ message: "Class Not Found" });
}

function hasAccess(req, roles = ["OWNER"]) {
  return !!req.roles.find(
    ({ id, role }) => roles.includes(role) && id == req.class.toJSON().schoolId
  );
}

function onlyRoles(...roles) {
  return (req, res, next) => {
    if (hasAccess(req, roles)) {
      return next();
    }
    return FORBIDDEN(res);
  };
}

/* GET ROUTES */

router.get("/", async (req, res, next) => {
  const schoolsIOwn = req.roles
    .filter(({ role }) => "OWNER" === role)
    .map(({ id }) => id);

  const classUsers = await req.user.getClassUsers(); //Classes I attend or teach
  const classIds = Object.keys(
    classUsers.reduce(
      (classIdObj, classUser) => ({
        ...classIdObj,
        [classUser.toJSON().classId]: true,
      }),
      {} //use this object as a set since there's a hight change that you attend more than one class at any certain school
    )
  );

  const classes = await Class.findAll({
    where: {
      [Sequelize.Op.or]: {
        id: { [Sequelize.Op.in]: classIds },
        schoolId: { [Sequelize.Op.in]: schoolsIOwn },
      },
    },
  });

  return res.json(classes.map((c) => c.toJSON()));
});

router.get("/:classId", [getClass, classExists], async (req, res, next) => {
  const cls = req.class.toJSON();
  const { schoolId } = cls;
  const canSeeClass = req.roles
    .filter(({ role }) => role !== "NONE")
    .find(({ id }) => id == schoolId);

  if (!canSeeClass || (canSeeClass.role != "OWNER" && !cls.isActive)) {
    return FORBIDDEN(res);
  }

  const classUsers = await req.class.getClassUsers({
    include: [
      {
        model: User,
        include: [{ model: SchoolUser, attributes: ["role", "schoolId"] }],
      },
    ],
  });

  const clsUsers = classUsers.map((clsUsr) => {
    const data = {
      ...clsUsr.toJSON(),
      role: clsUsr
        .toJSON()
        .User.SchoolUsers.find((su) => su.schoolId == schoolId).role,
    };
    return data;
  });

  const [students, teachers] = clsUsers.reduce(
    (arr, curr) => {
      if (curr.role == "STUDENT") {
        arr[0].push(curr);
        return arr;
      }
      arr[1].push(curr);
      return arr;
    },
    [[], []]
  );

  const data = {
    ...cls,
    students,
    teachers,
  };

  return res.json(data);
});

/* POST ROUTES */

router.post("/", async (req, res, next) => {
  const { schoolId } = req.body;
  const canCreateClass = req.roles.find(
    ({ id, role }) => role === "OWNER" && id == schoolId
  );
  if (!canCreateClass) {
    return FORBIDDEN(res);
  }
  const newModel = await Class.create(req.body);
  return res.json(newModel.toJSON());
});

router.post(
  "/:classId/activate",
  [getClass, classExists, onlyRoles("OWNER")],
  async (req, res, next) => {
    const data = await req.class.update({ isActive: true });
    return res.json(data.toJSON());
  }
);

/* PUT ROUTES */

router.put(
  "/:classId",
  [getClass, classExists, onlyRoles("OWNER")],
  async (req, res, next) => {
    const updatedModel = await req.class.update(req.body);
    return res.json(updatedModel.toJSON());
  }
);

/* DELETE ROUTES */

router.delete(
  "/:classId",
  [getClass, classExists, onlyRoles("OWNER")],
  async (req, res, next) => {
    const data = await req.class.update({ isActive: false });
    return res.json(data.toJSON());
  }
);

router.delete(
  "/:classId/data",
  [getClass, classExists, onlyRoles("OWNER")],
  async (req, res, next) => {
    const data = await req.class.destroy();
    return res.json({ message: "Successfully Deleted Data" });
  }
);

router.delete(
  "/:classId/join/:userId",
  [getClass, classExists, onlyRoles("OWNER", "TEACHER")],
  async (req, res, next) => {
    const { userId, classId } = req.params;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "That user does not exist" });
    }
    const [classUser] = await user.getClassUsers({ where: { classId } });
    if (!classUser) {
      return res
        .status(404)
        .json({ message: "That user does not attend that class" });
    }
    await classUser.destroy();
    return res.json({ message: "User successfully removed from class" });
  }
);

module.exports = router;
