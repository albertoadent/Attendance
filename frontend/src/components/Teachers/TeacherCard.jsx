import { useModal } from "../../context/Modal";
import { put } from "../../redux/csrf";
import UpdateConfirmation from "../Confirmations/UpdateConfirmation";
import { useDispatch, useSelector } from "react-redux";
import { getClasses, getStudents, getTeachers } from "../../redux/schools";
import RemoveTeacherButton from "./RemoveTeacherButton";
import { FaBars } from "react-icons/fa";

export default function TeacherCard({ teacher, isOwner, disable }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.session?.user);
  async function handleSubmit() {
    try {
      await put(`/api/teachers/${teacher.id}`);
      await dispatch(getTeachers(teacher.schoolId));
      await dispatch(getStudents(teacher.schoolId));
      await dispatch(getClasses(teacher.schoolId));
    } catch (error) {
      const { message } = await error.json();
      alert(message);
    }
  }
  const { setModalContent } = useModal();
  function onClick() {
    setModalContent(
      <UpdateConfirmation
        onUpdate={handleSubmit}
        message={`Are you sure you want to make ${teacher.User.firstName} ${teacher.User.lastName} a student?`}
      />
    );
  }
  return (
    <li
      draggable={!disable && isOwner}
      onDragStart={(e) => {
        const data = JSON.stringify(teacher);
        e.dataTransfer.setData("text/plain", data);
      }}
      className="p-2 border flex gap-2 justify-between bg-teacher items-center"
    >
      {isOwner && !disable && <FaBars className="self-center" />}
      <h1
        className={`${
          teacher.User.id == user.id ? "text-green-500" : "text-secondary"
        } text-center`}
      >
        {teacher.User.id == user.id ?"You":`${teacher?.User?.firstName || "Loading..."} ${
          teacher?.User?.lastName || ""
        }`}
      </h1>
      <div className="w-1/4 h-full flex justify-end gap-1">
        {isOwner && (
          <button
            className="min-w-6 text-center bg-student text-secondary"
            onClick={onClick}
          >
            S
          </button>
        )}
        {isOwner && <RemoveTeacherButton teacher={teacher} />}
      </div>
    </li>
  );
}
