const { School, SchoolUser, User } = require("../../db/models");

const { FORBIDDEN, requireAuth } = require("../../utils/auth");

const router = require("express").Router();
router.use(requireAuth);

/* MIDDLEWARE */

async function getTeacher(req, res, next) {
  const { teacherId } = req.params;

  const teacher = await SchoolUser.findByPk(teacherId);

  if (teacher.toJSON().role !== "TEACHER") {
    req.teacher = null;
    return next();
  }
  req.teacher = teacher;

  return next();
}

function teacherExists(req, res, next) {
  if (req.teacher) {
    return next();
  }
  return res.status(400).json({ message: "Teacher Not Found" });
}

async function isMyTeacher(req, res, next) {
  const validSchoolIds = req.roles
    .filter(({ role }) => role === "OWNER")
    .map(({ id }) => id);
  const schools = await Promise.all(
    validSchoolIds.map(async (id) => await School.findByPk(id))
  );
  const valid = schools.find(
    (school) => school.toJSON().id == req.teacher.schoolId
  );
  if (valid) {
    return next();
  }
  return FORBIDDEN(res);
}

function isMe(req) {
  const { teacher, user } = req;
  const teacherData = teacher.toJSON();
  const userData = user.toJSON();
  return teacherData.userId === userData.id;
}

async function isMeOrMyTeacher(req, res, next) {
  if (isMe(req)) {
    return next();
  }
  return isMyTeacher(req, res, next);
}

/* GET ROUTES */

router.get(
  "/:teacherId",
  [getTeacher, teacherExists, isMyTeacher],
  async (req, res, next) => {
    const { teacher } = req;
    const userData = await teacher.getUser();
    return res.json({ ...userData.toJSON(), role: "TEACHER" });
  }
);

/* POST ROUTES */

router.post("/", async (req, res, next) => {
  const { schoolId, userId } = req.body;
  const { roles } = req;
  const valid = roles.find(({ id, role }) => id == schoolId && role == "OWNER");
  if (!valid) {
    return FORBIDDEN(res);
  }
  const school = await School.findByJoinCode(joinCode);
  const newSchoolUser = await SchoolUser.create({
    schoolId: school.toJSON().id,
    userId,
    role: "TEACHER",
  });
  const user = await newSchoolUser.getUser();
  return res.json({ ...newSchoolUser.toJSON(), user: user.toJSON() });
});

/* PUT ROUTES */

router.put(
  "/:teacherId",
  [getTeacher, teacherExists, isMyTeacher],
  async (req, res, next) => {
    const { teacher } = req;

    const updatedTeacher = await teacher.update({ role: "STUDENT" });

    return res.json(updatedTeacher.toJSON());
  }
);

/* DELETE ROUTES */

router.delete(
  "/:teacherId",
  [getTeacher, teacherExists, isMeOrMyTeacher],
  async (req, res, next) => {
    await req.teacher.update({ role: "NONE" });

    return res.json({ message: "Delete Successful" });
  }
);

router.delete(
  "/:teacherId/data",
  [getTeacher, teacherExists, isMeOrMyTeacher],
  async (req, res, next) => {
    await req.teacher.destroy();

    return res.json({ message: "Data Deleted Successfully" });
  }
);

module.exports = router;
