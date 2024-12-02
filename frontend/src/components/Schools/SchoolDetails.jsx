import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import LeaveSchoolButton from "./LeaveSchoolButton";
import { useEffect } from "react";
import {
  getClasses,
  getSchool,
  getStudents,
  getTeachers,
} from "../../redux/schools";
import StudentCard from "../Students/StudentCard";
import AddStudentByUsername from "../Students/AddStudentByUsername";
import CreateSchoolButton from "./CreateSchoolButton";
import TeacherCard from "../Teachers/TeacherCard";
import CreateClass from "../Classes/CreateClass";

export default function SchoolDetails() {
  const { schoolId } = useParams();
  const id = Number(schoolId);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      return;
    }
    dispatch(getSchool(id))
      .then(() => dispatch(getClasses(id)))
      .then(() => dispatch(getTeachers(id)))
      .then(() => dispatch(getStudents(id)));
  }, [dispatch, schoolId, id]);

  const school = useSelector((state) => state.schools[id]);
  const user = useSelector((state) => state.session.user);

  function editSchool() {
    navigate("edit");
  }

  if (!schoolId) {
    return <h1>Loading...</h1>;
  }
  if (!school) {
    return <h1>Loading...</h1>;
  }
  const isOwner = school.ownerId == user?.id;

  return (
    <div className="flex flex-col items-center">
      {isOwner ? (
        <div>
          <button onClick={editSchool}>Edit My School</button>
          <CreateSchoolButton />
        </div>
      ) : (
        <LeaveSchoolButton schoolId={id} />
      )}
      <h1>{school.name}</h1>
      <h2>Join Code: {school.joinCode}</h2>
      {isOwner && (
        <div className="flex">
          <AddStudentByUsername schoolId={id} />
          <CreateClass schoolId={id} />
        </div>
      )}
      <div className="flex gap-2">
        {school.classes && !!school.classes.length && (
          <div className="min-w-64">
            <h1>Classes:</h1>
            <ul className="border rounded">
              {school.classes &&
                school.classes.map((cls) => (
                  <li key={cls.id} className="p-2 border">{`${
                    cls.name || "Loading..."
                  } ${cls.level ? "- " + cls.level : ""}`}</li>
                ))}
            </ul>
          </div>
        )}
        {school.teachers && !!school.teachers.length && (
          <div className="min-w-64">
            <h1>Teachers:</h1>
            <ul className="border rounded">
              {school.teachers &&
                school.teachers.map((teacher) => (
                  <TeacherCard
                    key={teacher.id}
                    teacher={teacher}
                    isOwner={isOwner}
                  />
                ))}
            </ul>
          </div>
        )}
        {school.students && !!school.students.length && (
          <div className="min-w-64">
            <h1>Students:</h1>
            <ul className="border rounded">
              {school.students &&
                school.students.map((student) => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    isOwner={isOwner}
                  />
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
