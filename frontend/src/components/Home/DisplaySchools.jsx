import { useDispatch, useSelector } from "react-redux";
import SchoolCard from "../Schools/SchoolCard";
import { useEffect, useCallback } from "react";
import { clearSchools, getSchools } from "../../redux/schools";
import { useNavigate } from "react-router-dom";

export default function DisplaySchools() {
  const schoolsObj = useSelector((state) => state.schools);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function refreshSchools() {
    return dispatch(getSchools());
  }
  const refreshListener = useCallback(refreshSchools, [dispatch]);
  async function removeSchools() {
    return dispatch(clearSchools());
  }
  const removeListener = useCallback(removeSchools, [dispatch]);

  useEffect(() => {
    document.addEventListener("login", refreshListener);
    document.addEventListener("logout", removeListener);
    refreshSchools();
    return () => {
      document.removeEventListener("login", refreshListener);
      document.removeEventListener("logout", removeListener);
    };
  }, [dispatch, refreshListener, removeListener]);

  function getSchoolsArray() {
    return schoolsObj ? Object.values(schoolsObj) : [];
  }
  function haveOneSchool() {
    const schools = getSchoolsArray();
    if (schools.length == 1) {
      return schools[0];
    }
    return false;
  }

  useEffect(() => {
    const oneSchool = haveOneSchool();
    if (oneSchool) {
      navigate("/schools/" + oneSchool.id);
    }
  }, [schoolsObj,haveOneSchool]);

  return (
    <div className="w-full bg-secondary border p-2">
      <h1 className="text-center text-accent text-lg">Schools</h1>
      <ul className="h-[300px] overflow-auto">
        {getSchoolsArray().map((school, i) => (
          <li key={i}>
            <SchoolCard school={school} />
          </li>
        ))}
      </ul>
    </div>
  );
}
