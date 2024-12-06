import { useModal } from "../../context/Modal";
import { put } from "../../redux/csrf";
import UpdateConfirmation from "../Confirmations/UpdateConfirmation";
import { useDispatch } from "react-redux";
import { getClasses, getStudents, getTeachers } from "../../redux/schools";
import RemoveStudentButton from "./RemoveStudentButton";
import { FaBars } from "react-icons/fa";

export default function StudentCard({ student, isOwner }) {
  const dispatch = useDispatch();
  async function handleSubmit() {
    try {
      await put(`/api/students/${student.id}`);
      await dispatch(getStudents(student.schoolId));
      await dispatch(getTeachers(student.schoolId));
      await dispatch(getClasses(student.schoolId));
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
        message={`Are you sure you want to make ${student.User.firstName} ${student.User.lastName} a teacher?`}
      />
    );
  }
  return (
    <li
      draggable
      onDragStart={(e) => {
        const data = JSON.stringify(student);
        e.dataTransfer.setData("text/plain", data);
      }}
      className="p-2 border flex gap-2 justify-between bg-student items-center"
    >
      {isOwner && <FaBars className="self-center" />}
      <h1 className="text-secondary overflow-hidden">
        {`${student?.User?.firstName || "Loading..."} ${
          student?.User?.lastName || ""
        }`}
      </h1>
      <div className="w-1/4 h-full flex justify-end gap-1">
        {isOwner && (
          <button
            className="min-w-6 text-center text-secondary bg-teacher"
            onClick={onClick}
          >
            T
          </button>
        )}
        <RemoveStudentButton student={student} />
      </div>
    </li>
  );
}
