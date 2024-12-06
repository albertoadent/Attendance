const jwt = require("jsonwebtoken");
const { jwtConfig } = require("../config");
const { User, Sequelize } = require("../db/models");

function generateUserToken(user) {
  const { id, hashedPassword, username } = user;
  return jwt.sign(
    {
      id,
      hashedPassword,
      username,
    },
    jwtConfig.secret,
    {
      expiresIn: parseInt(jwtConfig.expiresIn),
    }
  );
}

function getObjectFromToken(token) {
  return jwt.verify(token, jwtConfig.secret);
}

function sendSafeUser(req, res) {
  if (!req.user) {
    return res.json({ user: null });
  }
  const userData = req.user.toJSON();
  const safeUser = {
    id: userData.id,
    username: userData.username,
    email: userData.email,
    phoneNumber: userData.phoneNumber,
    firstName: userData.firstName,
    lastName: userData.lastName,
  };
  return res.json({ user: safeUser });
}

async function signIn(req, res, next) {
  console.log("SIGNING IN");
  const { credential, password } = req.body;
  const user = await User.unscoped().findOne({
    where: {
      [Sequelize.Op.or]: [{ username: credential }, { email: credential }],
    },
  });
  try {
    user?.login(password);
    req.user = user ?? null;
  } catch (err) {
    console.log(err);
    return res.status(403).json({ message: "Incorrect Password" });
  }

  if (!req.user) {
    return res.status(404).json({ message: "User Not Found" });
  }

  res.setHeader("XSRF-TOKEN", generateUserToken(req.user.toJSON()));

  return sendSafeUser(req, res);
}

async function signUp(req, res, next) {
  const user = await User.create(req.body);
  req.user = user ?? null;

  res.setHeader("XSRF-TOKEN", generateUserToken(req.user.toJSON()));

  return sendSafeUser(req, res);
}

async function requireAuth(req, res, next) {
  if (req.user) {
    return next();
  }

  return res.status(401).json({ message: "Unauthorized" });
}

async function restoreUser(req, res, next) {
  const { ["XSRF-TOKEN".toLowerCase()]: csrfToken } = req.headers;
  if (!csrfToken) {
    req.user = null;
    return next();
  }

  let userData;
  try {
    userData = getObjectFromToken(csrfToken);
  } catch (error) {
    console.log("JWT EXPIRED");
    req.user = null;
    return next();
  }
  const user = await User.findByPk(userData.id);

  if (user.verifyHash(userData.hashedPassword)) {
    req.user = user;
    return next();
  }

  req.user = null;
  return next();
}

function logout(req, res, next) {
  res.setHeader("XSRF-TOKEN", "");
  res.json({ message: "Logout Successful" });
}

function FORBIDDEN(res) {
  return res.status(403).json({ message: "Forbidden" });
}

module.exports = {
  signIn,
  signUp,
  requireAuth,
  restoreUser,
  sendSafeUser,
  logout,
  FORBIDDEN,
};
