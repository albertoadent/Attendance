import { useDispatch } from "react-redux";
import DeleteButton from "../../Confirmations/DeleteButton";
import { deleteClassTime } from "../../../redux/classes";
import { FaTrash } from "react-icons/fa";

export default function DeleteClassTimeButton({ classTimeId }) {
  const dispatch = useDispatch();
  async function onDelete() {
    try {
      await dispatch(deleteClassTime(classTimeId));
    } catch (error) {
      const { message } = await error.json();
      alert(message);
    }
  }
  return (
    <DeleteButton
      confirmationMessage="Are you sure you want to delete this class time?"
      onDelete={onDelete}
      small={true}
    >
      <FaTrash className="text-red-500" />
    </DeleteButton>
  );
}
