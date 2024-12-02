const { School, SchoolUser, User } = require("../../db/models");

const { FORBIDDEN, requireAuth } = require("../../utils/auth");

const router = require("express").Router();

router.use(requireAuth);

/* MIDDLEWARE */

async function getStudent(req, res, next) {
  const { studentId } = req.params;

  const student = await SchoolUser.findByPk(studentId);

  if (student.toJSON().role !== "STUDENT") {
    req.student = null;
    return next();
  }
  req.student = student;

  return next();
}

function studentExists(req, res, next) {
  if (req.student) {
    return next();
  }
  return res.status(400).json({ message: "Student Not Found" });
}

async function isMyStudent(req, res, next) {
  const validSchoolIds = req.roles
    .filter(({ role }) => ["OWNER", "TEACHER"].includes(role))
    .map(({ id }) => id);
  const schools = await Promise.all(
    validSchoolIds.map(async (id) => School.findByPk(id))
  );
  const valid = schools.find(
    (school) => school.toJSON().id == req.student.schoolId
  );
  if (valid) {
    return next();
  }
  return FORBIDDEN(res);
}

function isMe(req) {
  const { student, user } = req;
  const studentData = student.toJSON();
  const userData = user.toJSON();
  return studentData.userId === userData.id;
}

async function isMeOrMyStudent(req, res, next) {
  if (isMe(req)) {
    return next();
  }
  return isMyStudent(req, res, next);
}

/* GET ROUTES */

router.get(
  "/:studentId",
  [getStudent, studentExists, isMyStudent],
  async (req, res, next) => {
    const { student } = req;
    const userData = await student.getUser();
    return res.json({ ...userData.toJSON(), role: "STUDENT" });
  }
);

/* POST ROUTES */

router.post("/", async (req, res, next) => {
  const { joinCode, userId, username, schoolId } = req.body;
  let school;
  if (joinCode) {
    school = await School.findByJoinCode(joinCode);
    if (!school) {
      return res.status(400).json({ message: "Join Code Does Not Exist" });
    }
  } else {
    if (!schoolId) {
      return res.status(400).json({ message: "Incorrect School Id" });
    }
    school = await School.findByPk(schoolId);
    if (!school) {
      return res.status(404).json({ message: "School Not Found" });
    }
  }
  if (
    (school.toJSON().ownerId == req.user.id && !userId && !username) ||
    (userId && school.toJSON().ownerId == userId)
  ) {
    return res.status(403).json({ message: "You cannot join your own school" });
  }
  const options = {
    where: {
      schoolId: school.toJSON().id,
      userId: userId ? userId : req.user.id,
    },
    limit: 1,
  };
  if (username) {
    const user = await User.findByUsername(username);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User by that username could not be found" });
    }
    if (user.id == req.user.id) {
      return res
        .status(403)
        .json({ message: "You cannot join your own school" });
    }
    options.where.userId = user.id;
  }
  const [newSchoolUser, created] = await SchoolUser.findOrCreate(options);

  if (newSchoolUser.toJSON().role == "STUDENT" && !created) {
    return res
      .status(400)
      .json({ message: "That student already attends your school" });
  }

  await newSchoolUser.update({ role: "STUDENT" });

  const user = await newSchoolUser.getUser();
  return res.json({ ...newSchoolUser.toJSON(), User: user.toJSON() });
});

/* PUT ROUTES */

router.put(
  "/:studentId",
  [getStudent, studentExists, isMyStudent],
  async (req, res, next) => {
    const { student } = req;

    const updatedStudent = await student.update({ role: "TEACHER" });

    return res.json(updatedStudent.toJSON());
  }
);

/* DELETE ROUTES */

router.delete(
  "/:studentId",
  [getStudent, studentExists, isMeOrMyStudent],
  async (req, res, next) => {
    await req.student.update({ role: "NONE" });

    return res.json({ message: "Delete Successful" });
  }
);

router.delete(
  "/:studentId/data",
  [getStudent, studentExists, isMeOrMyStudent],
  async (req, res, next) => {
    await req.student.destroy();

    return res.json({ message: "Data Deleted Successfully" });
  }
);

module.exports = router;
