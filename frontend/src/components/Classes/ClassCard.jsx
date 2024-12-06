import { useEffect, useState } from "react";
import DeleteClassButton from "./DeleteClassButton";
import ActivateClassButton from "./ActivateClassButton";
import { useDispatch, useSelector } from "react-redux";
import { addUserToClass, getClass } from "../../redux/classes";

export default function ClassCard({ cls, isOwner }) {
  const [prepareDrop, setPrepareDrop] = useState(false);
  const dispatch = useDispatch();

  const classDetails = useSelector((state) => state.classes[cls.id]);

  useEffect(() => {
    dispatch(getClass(cls.id));
  }, [dispatch]);

  async function onDrop(e) {
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    try {
      await dispatch(addUserToClass(cls.schoolId, cls.id, data.User.id));
    } catch (error) {
      const { message } = await error.json();
      alert(message);
    }
    setPrepareDrop(false);
  }
  function onDragOver(e) {
    e.preventDefault();
    setPrepareDrop(true);
  }
  function onDragLeave(e) {
    e.preventDefault();
    setPrepareDrop(false);
  }

  if (!isOwner && !cls.isActive) {
    return <div>Coming Soon</div>;
  }

  if (!classDetails) {
    return <h1>Loading...</h1>;
  }

  return (
    <li
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      key={cls.id}
      className={
        prepareDrop
          ? "p-2 border-2 border-green-500 h-32 text-center text-green-500 text-lg flex flex-col items-center justify-center"
          : "p-2 border border-primary h-32 text-center text-lg flex flex-col items-center justify-center"
      }
    >
      <div className="flex items-center justify-center gap-2">
        <h1>{`${cls.name || "Loading..."} ${
          cls.level ? "- " + cls.level : ""
        }`}</h1>
        {isOwner && (
          <p className="text-xs">{cls.isActive ? "(ACTIVE)" : "(INACTIVE)"}</p>
        )}
        {isOwner && !cls.isActive && (
          <ActivateClassButton classId={cls.id} small={true} />
        )}
        {isOwner && cls.isActive && (
          <DeleteClassButton
            classId={cls.id}
            schoolId={cls.schoolId}
            isActive={cls.isActive}
            small={true}
          />
        )}
      </div>
      <div className="flex gap-2">
        {classDetails?.students && (
          <p className="text-xs">Students: {classDetails.students.length}</p>
        )}
        {classDetails?.teachers && (
          <p className="text-xs">Teachers: {classDetails.teachers.length}</p>
        )}
      </div>
      <div>
        {isOwner && !cls.isActive && (
          <DeleteClassButton
            classId={cls.id}
            schoolId={cls.schoolId}
            isActive={cls.isActive}
            small={true}
          />
        )}
      </div>
    </li>
  );
}
