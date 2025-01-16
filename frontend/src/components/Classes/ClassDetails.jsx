import { useDispatch, useSelector } from "react-redux";
import StudentCard from "../Students/StudentCard";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { addUserToClass, getClass } from "../../redux/classes";
import TeacherCard from "../Teachers/TeacherCard";
import { getSchool } from "../../redux/schools";
import CreateClassTime from "./ClassTimes/CreateClassTime";
import ClassTimeCalendar from "./ClassTimes/ClassTimeCalendar";

export default function ClassDetails() {
  const { classId } = useParams();
  const cls = useSelector((state) => state.classes[classId]);
  const school = useSelector((state) => state.schools[cls?.schoolId]);
  const user = useSelector((state) => state.session.user);
  const isOwner = user?.id == school?.ownerId;
  const isTeacher = !!cls?.teachers?.find(({ userId }) => userId == user?.id);
  const isStudent = !!cls?.students?.find(({ userId }) => userId == user?.id);
  isStudent;
  const classTeachers = school?.teachers?.filter((teacher) =>
    cls?.teachers?.find(({ userId }) => userId == teacher.userId)
  );
  const classStudents = school?.students?.filter((student) =>
    cls?.students?.find(({ userId }) => userId == student.userId)
  );

  const [allSchoolStudents, setAllSchoolStudents] = useState(false);
  const [allSchoolTeachers, setAllSchoolTeachers] = useState(false);
  const [toDrop, setToDrop] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onDropEnter(e) {
    e.preventDefault();
    setToDrop(true);
  }

  function onDropLeave() {
    setToDrop(false);
  }

  async function onDrop(e) {
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    try {
      await dispatch(addUserToClass(cls.schoolId, cls.id, data.User.id));
    } catch (error) {
      const { message } = await error.json();
      alert(message);
    }
    setToDrop(false);
  }

  useEffect(() => {
    if (!classId) {
      return;
    }
    dispatch(getClass(classId)).then((c) => dispatch(getSchool(c.schoolId)));
  }, [dispatch, classId, user]);

  return (
    <div className="flex justify-start border">
      {!isStudent && (
        <div className="flex flex-col items-center border">
          <div
            className={
              toDrop
                ? "border rounded w-full p-2 flex items-center justify-center h-20 border-green-500 text-green-500 flex-col"
                : "border rounded w-full p-2 flex items-center justify-center h-20 flex-col"
            }
            onDragOver={onDropEnter}
            onDragLeave={onDropLeave}
            onDrop={onDrop}
          >
            Add To This Class{" "}
            <span className="text-xs">(drop here to add)</span>
          </div>
          {isOwner && (
            <div className="flex w-full items-center justify-center flex-col p-1">
              <h1>{allSchoolTeachers ? school?.name : cls?.name} Teachers</h1>
              <div className="flex gap-2 items-center">
                <p className="text-xs">All Teachers?</p>
                <input
                  type="checkbox"
                  value={allSchoolTeachers}
                  onChange={() => setAllSchoolTeachers(!allSchoolTeachers)}
                />
              </div>
            </div>
          )}
          {isOwner && (
            <ul className="w-64 border overflow-auto h-48">
              {(allSchoolTeachers ? school?.teachers : classTeachers)?.map(
                (teacher) => (
                  <TeacherCard
                    teacher={teacher}
                    isOwner={isOwner}
                    disable={classTeachers?.includes(teacher)}
                    key={teacher.id}
                  />
                )
              )}
            </ul>
          )}
          <div className="flex w-full items-center justify-center flex-col p-1">
            {(isOwner || isTeacher) && (
              <h1>{allSchoolStudents ? school?.name : cls?.name} Students</h1>
            )}
            <div className="flex gap-2 items-center">
              <p className="text-xs">All Students?</p>
              <input
                type="checkbox"
                value={allSchoolStudents}
                onChange={() => setAllSchoolStudents(!allSchoolStudents)}
              />
            </div>
          </div>
          {(isOwner || isTeacher) && (
            <ul className="w-64 border overflow-auto h-96">
              {(allSchoolStudents ? school?.students : classStudents)?.map(
                (student) => (
                  <StudentCard
                    student={student}
                    isOwner={isOwner}
                    isTeacher={isTeacher}
                    disable={classStudents?.includes(student)}
                    key={student.id}
                  />
                )
              )}
            </ul>
          )}
        </div>
      )}
      <div className="flex flex-col items-center border rounded p-2 w-full">
        <button className="self-start" onClick={() => navigate(-1)}>
          Back
        </button>
        <h1 className="text-xl">{cls?.name}</h1>
        <h2 className="text-lg">{cls?.level}</h2>
        <div className="flex justify-start w-full h-full border gap-2">
          <ClassTimeCalendar classTimes={cls?.ClassTimes} isOwner={isOwner} />
          <div className="mx-auto">
            {isOwner && <CreateClassTime classId={classId} />}
          </div>
        </div>
      </div>
    </div>
  );
}
