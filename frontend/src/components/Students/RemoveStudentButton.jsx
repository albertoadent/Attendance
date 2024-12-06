import { useDispatch } from "react-redux";
import { del } from "../../redux/csrf";
import { getClasses, getStudents } from "../../redux/schools";
import { useModal } from "../../context/Modal";
import DeleteConfirmation from "../Confirmations/DeleteConfirmation";
import { FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";

export default function RemoveStudentButton({ student }) {
  const { classId } = useParams();
  const dispatch = useDispatch();
  async function removeStudent() {
    try {
      const { schoolId, userId } = student;
      if (classId) {
        await del(`/api/classes/${classId}/join/${userId}`);
      } else {
        await del(`/api/schools/${schoolId}/join/${userId}`);
        await dispatch(getStudents(schoolId));
      }
      await dispatch(getClasses(schoolId));
    } catch (error) {
      const { message } = await error.json();
      alert(message);
    }
  }
  const { setModalContent } = useModal();
  function onClick() {
    setModalContent(
      <DeleteConfirmation
        onDelete={removeStudent}
        message={`Are you sure you want to remove ${student.User.firstName} ${
          student.User.lastName
        } from your ${classId ? "class" : "school"}?`}
      />
    );
  }
  return (
    <button className="min-w-6 text-center bg-red-500 p-1" onClick={onClick}>
      <FaTrash className="h-full w-full" />
    </button>
  );
}
