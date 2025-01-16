const allRoutes = ["schools", "students", "teachers", "classes", "classTimes"];

const router = require("express").Router();
const {
  signIn,
  signUp,
  logout,
  restoreUser,
  sendSafeUser,
} = require("../../utils/auth");
const { getRoles } = require("../../utils/permissions");
router.post("/login", signIn);
router.post("/signup", signUp);
router.get("/session", restoreUser, sendSafeUser);
router.delete("/logout", logout);
router.post("/logout", logout);
router.use(restoreUser);
router.use(getRoles);

const newRoute = (name) => {
  router.use(`/${name}`, require(`./${name}`));
};
allRoutes.forEach(newRoute);

module.exports = router;
