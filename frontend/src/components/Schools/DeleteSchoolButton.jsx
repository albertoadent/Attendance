import { useDispatch } from "react-redux";
import { deleteSchool } from "../../redux/schools";
import DeleteButton from "../Confirmations/DeleteButton";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

export default function DeleteSchoolButton({ id }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  function onDelete() {
    if (!id) {
      alert("No school id provided");
      return;
    }
    dispatch(deleteSchool(id));
    navigate("/");
  }

  return (
    <DeleteButton
      onDelete={onDelete}
      confirmationMessage="Are you sure you want to delete your school?"
    >
      <FaTrash className="h-full w-full" />
    </DeleteButton>
  );
}
