import { useDispatch } from "react-redux";
import DeleteButton from "../Confirmations/DeleteButton";
import { deleteClass } from "../../redux/classes";
import { getSchool } from "../../redux/schools";
import { FaTrash, FaArrowDown } from "react-icons/fa";

export default function DeleteClassButton({ classId, schoolId, isActive, small }) {
  const dispatch = useDispatch();

  async function onDelete() {
    try {
      await dispatch(deleteClass(classId, !isActive));
      await dispatch(getSchool(schoolId));
    } catch (error) {
      const { message } = await error.json();
      alert(message);
    }
  }
  const message = isActive
    ? "Are you sure you want to deactivate this class?"
    : "Are you sure you want to delete this class? (All related attendance data will be lost)";

  return (
    <DeleteButton onDelete={onDelete} confirmationMessage={message} small={small}>
      {isActive ? (
        <FaArrowDown className="text-red-500 h-full w-full" />
      ) : (
        <FaTrash className="text-red-500 h-full w-full" />
      )}
    </DeleteButton>
  );
}
