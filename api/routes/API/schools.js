const {
  School,
  User,
  Sequelize,
  SchoolUser,
  ClassUser,
} = require("../../db/models");
const { currentSchoolRole } = require("../../utils/permissions");
const { FORBIDDEN, requireAuth } = require("../../utils/auth");

const router = require("express").Router();

/* MIDDLEWARE */

async function getSchool(req, res, next) {
  const { schoolId } = req.params;
  if (Number(schoolId) == schoolId) {
    req.school = await School.findByPk(schoolId);
    return next();
  }
  req.school = await School.findByJoinCode(schoolId);
  return next();
}

function schoolExists(req, res, next) {
  if (req.school) {
    return next();
  }
  return res.status(400).json({ message: "School Not Found" });
}

function getRole(req, res, next) {
  req.role = currentSchoolRole(req);
  return next();
}

function onlySchoolUsers(req, res, next) {
  if (req.role == "NONE") {
    return FORBIDDEN(res);
  }
  return next();
}
router.use(requireAuth);

/* GET ROUTES */

router.get("/", async (req, res, next) => {
  const schools = await School.findAll({
    where: {
      id: { [Sequelize.Op.in]: req.roles.map(({ id }) => id) },
    },
  });
  return res.json(schools.map((e) => e.toJSON()));
});

router.get(
  "/:schoolId",
  [getSchool, schoolExists, getRole, onlySchoolUsers],
  async (req, res, next) => {
    const data = req.school.toJSON();

    const role = req.role;
    if (["OWNER", "TEACHER"].includes(role)) {
      const students = await req.school.getStudents({
        include: [{ model: User }],
      });
      data.students = students.map((s) => s.toJSON());
    }

    if (["OWNER", "TEACHER", "STUDENT"].includes(role)) {
      const teachers = await req.school.getTeachers({
        include: [{ model: User }],
      });
      data.teachers = teachers.map((t) => t.toJSON());
    }
    const options = role == "OWNER" ? {} : { where: { isActive: true } };
    const classes = await req.school.getClasses(options);
    data.classes = classes.map((c) => c.toJSON());

    return res.json(data);
  }
);

router.get(
  "/:schoolId/students",
  [getSchool, schoolExists, getRole, onlySchoolUsers],
  async (req, res, next) => {
    if (!["OWNER", "TEACHER"].includes(req.role)) {
      return FORBIDDEN(res);
    }
    const students = await req.school.getStudents({
      include: [{ model: User }],
    });
    return res.json(students.map((s) => s.toJSON()));
  }
);
router.get(
  "/:schoolId/teachers",
  [getSchool, schoolExists, getRole, onlySchoolUsers],
  async (req, res, next) => {
    if (!req.role === "OWNER") {
      return FORBIDDEN(res);
    }
    const teachers = await req.school.getTeachers({
      include: [{ model: User }],
    });
    return res.json(teachers.map((t) => t.toJSON()));
  }
);

router.get(
  "/:schoolId/classes",
  [getSchool, schoolExists, getRole, onlySchoolUsers],
  async (req, res, next) => {
    const { schoolId } = req.school.toJSON();
    const role = req.roles.find(({ id }) => id == schoolId)?.role;
    const options = role == "OWNER" ? {} : { where: { isActive: true } };
    const classes = await req.school.getClasses(options);
    return res.json(classes.map((c) => c.toJSON()));
  }
);

/* POST ROUTES */

router.post("/", async (req, res, next) => {
  const joinCodeExists = await School.findByJoinCode(req.body.joinCode);
  if (joinCodeExists) {
    return res.status(400).json({ message: "That Join Code has been taken" });
  }
  const newModel = await School.create({
    ...req.body,
    ownerId: req.user.toJSON().id,
  });
  return res.json(newModel.toJSON());
});

router.post(
  "/:schoolId/classes/:classId/users",
  [getSchool, schoolExists, getRole, onlySchoolUsers],
  async (req, res, next) => {
    const { school, role } = req;
    const { classId } = req.params;
    const { userId } = req.body;
    if (!["OWNER", "TEACHER"].includes(role)) {
      return FORBIDDEN(res);
    }
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const [schoolHasUser] = await school.getSchoolUsers({
      where: {
        userId,
      },
    });
    if (!schoolHasUser) {
      return res
        .status(400)
        .json({ message: "Student Does Not Attend School" });
    }
    const [newClassUser, created] = await ClassUser.findOrCreate({
      where: {
        userId,
        classId,
      },
    });
    if (!created) {
      return res
        .status(400)
        .json({ message: "That User already is in that class" });
    }
    const data = {
      ...newClassUser.toJSON(),
      User: user.toJSON(),
      role: schoolHasUser.toJSON().role,
    };
    return res.json(data);
  }
);

/* PUT ROUTES */

router.put(
  "/:schoolId",
  [getSchool, schoolExists, getRole],
  async (req, res, next) => {
    const role = req.role;
    if (!role == "OWNER") {
      return FORBIDDEN(res);
    }
    const updatedModel = await req.school.update(req.body);
    return res.json(updatedModel.toJSON());
  }
);

/* DELETE ROUTES */

router.delete(
  "/:schoolId",
  [getSchool, schoolExists, getRole],
  async (req, res, next) => {
    if (!req.role == "OWNER") {
      return FORBIDDEN(res);
    }
    await req.school.destroy();
    return res.json({ message: "Delete Successful" });
  }
);

router.delete(
  "/:schoolId/join",
  [getSchool, schoolExists, getRole],
  async (req, res, next) => {
    if (req.role == "OWNER") {
      return FORBIDDEN(res);
    }
    const toLeave = await SchoolUser.findOne({
      where: {
        userId: req.user.id,
        schoolId: req.school.id,
        role: { [Sequelize.Op.in]: ["STUDENT", "TEACHER"] },
      },
    });
    if (!toLeave) {
      return FORBIDDEN(res);
    }
    await toLeave.update({ role: "NONE" });
    return res.json({ message: "Delete Successful" });
  }
);
router.delete(
  "/:schoolId/join/:userId",
  [getSchool, schoolExists, getRole],
  async (req, res, next) => {
    if (!["OWNER", "TEACHER"].includes(req.role)) {
      return FORBIDDEN(res);
    }
    const toLeave = await SchoolUser.findOne({
      where: {
        userId: req.params.userId,
        schoolId: req.school.id,
        role: { [Sequelize.Op.in]: ["STUDENT", "TEACHER"] },
      },
    });
    if (!toLeave) {
      return FORBIDDEN(res);
    }
    await toLeave.update({ role: "NONE" });
    return res.json({ message: "Delete Successful" });
  }
);

module.exports = router;
