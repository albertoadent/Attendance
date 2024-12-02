import { useDispatch } from "react-redux";
import { del } from "../../redux/csrf";
import { getTeachers } from "../../redux/schools";
import { useModal } from "../../context/Modal";
import DeleteConfirmation from "../Confirmations/DeleteConfirmation";

export default function RemoveTeacherButton({ teacher }) {
  const dispatch = useDispatch();
  async function removeTeacher() {
    try {
      const { schoolId, userId } = teacher;
      await del(`/api/schools/${schoolId}/join/${userId}`);
      await dispatch(getTeachers(schoolId));
    } catch (error) {
      const { message } = await error.json();
      alert(message);
    }
  }
  const { setModalContent } = useModal();
  function onClick() {
    setModalContent(
      <DeleteConfirmation
        onDelete={removeTeacher}
        message={`Are you sure you want to remove ${teacher.User.firstName} ${teacher.User.lastName} from your school?`}
      />
    );
  }
  return (
    <button className="min-w-6 text-center" onClick={onClick}>
      R
    </button>
  );
}
