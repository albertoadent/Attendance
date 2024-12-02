import { del, get, post, put } from "./csrf.js";

const SET_SCHOOL = "schools/setSchool";
const REMOVE_SCHOOL = "schools/removeSchool";
const CLEAR_SCHOOLS = "schools/clearSchools";
const LOAD_STUDENTS = "schools/loadStudents";
const ADD_STUDENT = "schools/addStudent";
const LOAD_TEACHERS = "schools/loadTeachers";
const ADD_TEACHER = "schools/addTeacher";
const LOAD_CLASSES = "schools/loadClasses";
const ADD_CLASS = "schools/addClass";

const setSchool = (school) => {
  return {
    type: SET_SCHOOL,
    school,
  };
};

const removeSchool = (id) => {
  return {
    type: REMOVE_SCHOOL,
    id,
  };
};

const loadStudents = (id, students) => {
  return {
    type: LOAD_STUDENTS,
    id,
    students,
  };
};
const addStudent = (id, student) => {
  return {
    type: ADD_STUDENT,
    id,
    student,
  };
};
const loadTeachers = (id, teachers) => {
  return {
    type: LOAD_TEACHERS,
    id,
    teachers,
  };
};
const addTeacher = (id, teacher) => {
  return {
    type: ADD_TEACHER,
    id,
    teacher,
  };
};
const loadClasses = (id, classes) => {
  return {
    type: LOAD_CLASSES,
    id,
    classes,
  };
};
const addClass = (id, cls) => {
  return {
    type: ADD_CLASS,
    id,
    class: cls,
  };
};

export const clearSchools = () => {
  return {
    type: CLEAR_SCHOOLS,
  };
};

export const getSchools = () => async (dispatch) => {
  const data = await get("/api/schools");
  data.forEach((school) => dispatch(setSchool(school)));
  return data;
};

export const getSchool = (id) => async (dispatch) => {
  const school = await get("/api/schools/" + id);
  dispatch(setSchool(school));
  return school;
};

export const getStudents = (id) => async (dispatch) => {
  try {
    const students = await get(`/api/schools/${id}/students`);
    dispatch(loadStudents(id, students));
    return students;
  } catch (error) {
    dispatch(loadStudents(id, []));
    return [];
  }
};
export const getTeachers = (id) => async (dispatch) => {
  try {
    const teachers = await get(`/api/schools/${id}/teachers`);
    dispatch(loadTeachers(id, teachers));
    return teachers;
  } catch (error) {
    dispatch(loadTeachers(id, []));
    return [];
  }
};
export const getClasses = (id) => async (dispatch) => {
  try {
    const classes = await get(`/api/schools/${id}/classes`);
    dispatch(loadClasses(id, classes));
    return classes;
  } catch (error) {
    dispatch(loadClasses(id, []));
    return [];
  }
};

export const createSchool = (schoolData) => async (dispatch) => {
  const school = await post("/api/schools", schoolData);
  dispatch(setSchool(school));
  return school;
};

export const editSchool = (schoolData) => async (dispatch) => {
  const school = await put("/api/schools/" + schoolData.id, schoolData);
  dispatch(setSchool(school));
  return school;
};

export const deleteSchool = (id) => async (dispatch) => {
  const response = await del("/api/schools/" + id);
  dispatch(removeSchool(id));
  return response;
};

export const joinSchool = (joinCode) => async (dispatch) => {
  const response = await post("/api/students", { joinCode });
  await dispatch(getSchool(response.schoolId));
  dispatch(addStudent(response.schoolId, response));
  return response;
};

export const addToSchool = (schoolId, username) => async (dispatch) => {
  const response = await post("/api/students", { schoolId, username });
  dispatch(addStudent(schoolId, response));
  return response;
};
export const addTeacherToSchool = (schoolId, username) => async (dispatch) => {
  const response = await post("/api/teachers", { schoolId, username });
  dispatch(addTeacher(schoolId, response));
  return response;
};
export const addClassToSchool = (classData) => async (dispatch) => {
  const response = await post("/api/classes", classData);
  dispatch(addClass(classData.schoolId, response));
  return response;
};

export const leaveSchool = (id) => async (dispatch) => {
  const response = await del("/api/schools/" + id + "/join");
  await dispatch(removeSchool(id));
  return response;
};

const initialState = {};

const schoolReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SCHOOL: {
      return { ...state, [action.school.id]: action.school };
    }
    case REMOVE_SCHOOL: {
      const { [action.id]: _, ...rest } = state;
      _;
      return rest;
    }
    case CLEAR_SCHOOLS: {
      return {};
    }
    case LOAD_STUDENTS: {
      return {
        ...state,
        [action.id]: { ...state[action.id], students: action.students },
      };
    }
    case ADD_STUDENT: {
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          students: [...(state[action.id].students || []), action.student],
        },
      };
    }
    case LOAD_TEACHERS: {
      return {
        ...state,
        [action.id]: { ...state[action.id], teachers: action.teachers },
      };
    }
    case ADD_TEACHER: {
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          teachers: [...(state[action.id].teachers || []), action.teacher],
        },
      };
    }
    case LOAD_CLASSES: {
      return {
        ...state,
        [action.id]: { ...state[action.id], classes: action.classes },
      };
    }
    case ADD_CLASS: {
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          classes: [...(state[action.id].classes || []), action.class],
        },
      };
    }
    default:
      return state;
  }
};

export default schoolReducer;
