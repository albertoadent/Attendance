import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import LeaveSchoolButton from "./LeaveSchoolButton";
import { useEffect } from "react";
import { getSchool } from "../../redux/schools";
import StudentCard from "../Students/StudentCard";
import TeacherCard from "../Teachers/TeacherCard";
import OwnerSidebar from "../../layout/OwnerSidebar";
import ClassCard from "../Classes/ClassCard";

export default function SchoolDetails() {
  const { schoolId } = useParams();
  const id = Number(schoolId);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      return;
    }
    dispatch(getSchool(id));
  }, [dispatch, schoolId]);

  const school = useSelector((state) => state.schools[id]);
  const user = useSelector((state) => state.session.user);

  const isOwner = school?.ownerId == user?.id;

  if (!schoolId) {
    return <h1>Loading...</h1>;
  }
  if (!school) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="flex w-full gap-2">
      {isOwner && <OwnerSidebar schoolId={id} />}
      <div className="flex flex-col items-center self-center w-full p-2">
        <button className="self-start" onClick={() => navigate(-1)}>
          Back
        </button>
        <div className="flex flex-col w-full p-2">
          <div className="flex gap-2 items-center">
            {!isOwner && <LeaveSchoolButton schoolId={id} />}
            <h1 className="text-[3em]">{school.name}</h1>
          </div>
          {isOwner && <h2 className="text-lg">Join Code: {school.joinCode}</h2>}
        </div>
        <div className="flex gap-2 border border-accent bg-secondaryForeground p-2 w-full justify-evenly">
          {school.classes && !!school.classes.length && (
            <div className="min-w-64 flex flex-col">
              <h1 className="text-lg text-center bg-secondary w-min self-center p-1 rounded">
                Classes
              </h1>
              <ul className="border rounded bg-class overflow-scroll max-h-[40em]">
                {school.classes &&
                  school.classes.map((cls) => (
                    <ClassCard key={cls.id} cls={cls} isOwner={isOwner} />
                  ))}
              </ul>
            </div>
          )}
          {school.teachers && !!school.teachers.length && (
            <div className="min-w-64 flex flex-col">
              <h1 className="text-lg text-center bg-secondary w-min self-center p-1 rounded">
                Teachers
              </h1>
              <ul className="border rounded overflow-scroll max-h-[40em]">
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
            <div className="min-w-64 flex flex-col">
              <h1 className="text-lg text-center bg-secondary w-min self-center p-1 rounded">
                Students
              </h1>
              <ul className="border rounded overflow-scroll max-h-[40em]">
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
    </div>
  );
}
