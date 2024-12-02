const { Class } = require("../db/models");

async function getRoles(req, res, next) {
  if (!req.user) {
    req.roles = [];
    return next();
  }

  const schoolsOwned = await req.user.getSchools();
  const schoolsJoined = await req.user.getSchoolUsers();

  const owned = schoolsOwned.map((school) => {
    const data = school.toJSON();
    return { id: data.id, role: "OWNER" };
  });
  const joined = schoolsJoined.map((schoolUser) => {
    const data = schoolUser.toJSON();
    return { id: data.schoolId, role: data.role };
  });

  req.roles = [...owned, ...joined].filter(({ role }) => role != "NONE");
  return next();
}

function isAllowedSchoolRole(
  schoolId,
  roles,
  allowedRoles = ["OWNER", "TEACHER"]
) {
  return !!roles.filter(
    ({ id, role }) => allowedRoles.includes(role) && id == schoolId
  ).length;
}

function currentSchoolRole(req) {
  const { id } = req.school?.toJSON() ?? { id: null };
  if (id) {
    const { role } = req.roles.find((r) => r.id == id) || {};
    return role ?? "NONE";
  }
  throw new Error("No School Found in request");
}

module.exports = {
  getRoles,
  isAllowedSchoolRole,
  currentSchoolRole,
};
