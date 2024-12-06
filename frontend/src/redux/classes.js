import { del, get, post, put } from "./csrf.js";
import { updateClass } from "./schools.js";

const SET_CLASS = "classes/setClass";
const REMOVE_CLASS = "classes/removeClass";
const CLEAR_CLASSES = "classes/clearClasses";
const ADD_CLASS_USER = "classes/addClassUser";

export const setClass = (cls) => {
  return {
    type: SET_CLASS,
    cls,
  };
};

const removeClass = (id) => {
  return {
    type: REMOVE_CLASS,
    id,
  };
};

export const clearClasses = () => {
  return {
    type: CLEAR_CLASSES,
  };
};

const addClassUser = (classUser) => {
  return {
    type: ADD_CLASS_USER,
    classUser,
  };
};

function updateSchoolsStore(dispatch, cls) {
  dispatch(updateClass(cls.schoolId, cls.id, cls));
}

export const getClasses = () => async (dispatch) => {
  const data = await get("/api/classes");
  data.forEach((cls) => {
    dispatch(setClass(cls));
    updateSchoolsStore(dispatch, cls);
  });
  return data;
};

export const getClass = (id) => async (dispatch) => {
  const cls = await get("/api/classes/" + id);
  dispatch(setClass(cls));
  updateSchoolsStore(dispatch, cls);
  return cls;
};

export const editClass = (classData) => async (dispatch) => {
  const cls = await put("/api/classes/" + classData.id, classData);
  dispatch(setClass(cls));
  updateSchoolsStore(dispatch, cls);
  return cls;
};

export const deleteClass = (id, data = false) => async (dispatch) => {
  if (data) {
    const response = await del("/api/classes/" + id + "/data");
    dispatch(removeClass(id));
    return response;
  }
  const response = await del("/api/classes/" + id);
  dispatch(setClass(response));
  return response;
};

export const activateClass = (id) => async (dispatch) => {
  const cls = await post(`/api/classes/${id}/activate`);
  dispatch(setClass(cls));
  updateSchoolsStore(dispatch, cls);
  return cls;
};

export const addUserToClass =
  (schoolId, classId, userId) => async (dispatch) => {
    const classUser = await post(
      `/api/schools/${schoolId}/classes/${classId}/users`,
      { userId }
    );
    dispatch(addClassUser(classUser));
    return classUser;
  };

const initialState = {};

const classReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CLASS: {
      return {
        ...state,
        [action.cls.id]: { ...state[action.cls.id], ...action.cls },
      };
    }
    case REMOVE_CLASS: {
      const { [action.id]: _, ...rest } = state;
      _;
      return rest;
    }
    case CLEAR_CLASSES: {
      return {};
    }
    case ADD_CLASS_USER: {
      const { classUser } = action;
      const { classId, role } = classUser;
      if (role == "STUDENT") {
        return {
          ...state,
          [classId]: {
            ...state[classId],
            students: [...(state[classId].students || []), classUser],
          },
        };
      }
      return {
        ...state,
        [classId]: {
          ...state[classId],
          teachers: [...(state[classId].teachers || []), classUser],
        },
      };
    }
    default:
      return state;
  }
};

export default classReducer;
