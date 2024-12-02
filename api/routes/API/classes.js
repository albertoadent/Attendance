const { Class, Sequelize } = require("../../db/models");
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

  const classUsers = await req.user.getClassUsers({
    where: {
      isActive: true,
    },
  }); //Classes I attend or teach
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

router.get("/:classId", [getClass, classExists], (req, res, next) => {
  const cls = req.class.toJSON();
  const { schoolId } = cls;
  const canSeeClass = req.roles
    .filter(({ role }) => role !== "NONE")
    .find(({ id }) => id == schoolId);

  if (!canSeeClass || (canSeeClass.role != "OWNER" && !cls.isActive)) {
    return FORBIDDEN(res);
  }

  return res.json(cls);
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

router.delete("/:classId",[getClass, classExists, onlyRoles("OWNER")],
async (req, res, next) => {
  const data = await req.class.update({ isActive: false });
  return res.json(data.toJSON());
});

router.delete("/:classId/data",[getClass, classExists, onlyRoles("OWNER")],
async (req, res, next) => {
  const data = await req.class.destroy();
  return res.json({message:"Successfully Deleted Data"});
});

module.exports = router;
