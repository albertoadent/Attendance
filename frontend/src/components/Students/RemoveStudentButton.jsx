import { useDispatch } from "react-redux";
import { del } from "../../redux/csrf";
import { getStudents } from "../../redux/schools";
import { useModal } from "../../context/Modal";
import DeleteConfirmation from "../Confirmations/DeleteConfirmation";

export default function RemoveStudentButton({ student }) {
  const dispatch = useDispatch();
  async function removeStudent() {
    try {
      const { schoolId, userId } = student;
      await del(`/api/schools/${schoolId}/join/${userId}`);
      await dispatch(getStudents(schoolId));
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
        message={`Are you sure you want to remove ${student.User.firstName} ${student.User.lastName} from your school?`}
      />
    );
  }
  return (
    <button className="min-w-6 text-center" onClick={onClick}>
      R
    </button>
  );
}
