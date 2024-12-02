const { Model } = require("../../db/models");

const router = require("express").Router();

/* MIDDLEWARE */

async function getModel(req, res, next) {
  const { modelId } = req.params;
  req.model = await School.findByPk(schoolId);
  return next();
}

function modelExists(req, res, next) {
  if (req.model) {
    return next();
  }
  return res.status(400).json({ message: "Model Not Found" });
}

/* GET ROUTES */

router.get("/", async (req, res, next) => {
  const models = await Model.findAll();

  return res.json(models.map((e) => e.toJSON()));
});

router.get("/:modelId", async (req, res, next) => {
  const { modelId } = req.params;
  const model = await Model.findByPk(modelId);

  return res.json(model.toJSON());
});

/* POST ROUTES */

router.post("/", async (req, res, next) => {
  const newModel = await Model.create(req.body);
  return res.json(newModel.toJSON());
});

/* PUT ROUTES */

router.put("/:modelId", async (req, res, next) => {
  const { modelId } = req.params;
  const updateModel = await Model.findByPk(modelId);

  const updatedModel = await updateModel.update(req.body);

  return res.json(updatedModel.toJSON());
});

/* DELETE ROUTES */

router.delete("/:modelId", async (req, res, next) => {
  const { modelId } = req.params;
  const instance = await Model.findByPk(modelId);

  await instance.destroy();

  return res.json({ message: "Delete Successful" });
});

module.exports = router;
