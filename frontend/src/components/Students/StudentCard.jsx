import { useModal } from "../../context/Modal";
import { put } from "../../redux/csrf";
import UpdateConfirmation from "../Confirmations/UpdateConfirmation";
import { useDispatch } from "react-redux";
import { getStudents, getTeachers } from "../../redux/schools";
import RemoveStudentButton from "./RemoveStudentButton";

export default function StudentCard({ student, isOwner }) {
  const dispatch = useDispatch();
  async function handleSubmit() {
    try {
      await put(`/api/students/${student.id}`);
      await dispatch(getStudents(student.schoolId));
      await dispatch(getTeachers(student.schoolId));
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
    <li className="p-2 border flex gap-2 justify-between">
      <h1>
        {`${student?.User?.firstName || "Loading..."} ${
          student?.User?.lastName || ""
        }`}
      </h1>
      <div>
        {isOwner && (
          <button className="min-w-6 text-center" onClick={onClick}>
            T
          </button>
        )}
        <RemoveStudentButton student={student} />
      </div>
    </li>
  );
}
