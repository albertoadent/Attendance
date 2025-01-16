const { ClassTime } = require("../../db/models");

const router = require("express").Router();

/* MIDDLEWARE */

async function getClassTime(req, res, next) {
  const { classTimeId } = req.params;
  req.classTime = await ClassTime.findByPk(classTimeId);
  return next();
}

function classTimeExists(req, res, next) {
  if (req.classTime) {
    return next();
  }
  return res.status(400).json({ message: "Model Not Found" });
}

/* GET ROUTES */

router.get("/", async (req, res, next) => {
  const classTimes = await ClassTime.findAll();

  return res.json(classTimes.map((e) => e.toJSON()));
});

router.get(
  "/:classTimeId",
  [getClassTime, classTimeExists],
  async (req, res, next) => {
    const { classTimeId } = req.params;
    const classTime = await ClassTime.findByPk(classTimeId);

    return res.json(classTime.toJSON());
  }
);

/* POST ROUTES */

router.post("/", async (req, res, next) => {
  const newClassTime = await ClassTime.create(req.body);
  return res.json(newClassTime.toJSON());
});

/* PUT ROUTES */

router.put(
  "/:classTimeId",
  [getClassTime, classTimeExists],
  async (req, res, next) => {
    const updatedClassTime = await req.classTime.update(req.body);
    return res.json(updatedClassTime.toJSON());
  }
);

/* DELETE ROUTES */

router.delete(
  "/:classTimeId",
  [getClassTime, classTimeExists],
  async (req, res, next) => {
    await req.classTime.destroy();
    return res.json({ message: "Delete Successful" });
  }
);

module.exports = router;
