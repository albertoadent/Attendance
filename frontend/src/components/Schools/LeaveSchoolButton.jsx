import { useDispatch } from "react-redux";
import { leaveSchool } from "../../redux/schools";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/Modal";
import DeleteConfirmation from "../Confirmations/DeleteConfirmation";
import { FiLogOut } from "react-icons/fi";

export default function LeaveSchoolButton({ schoolId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleLeave() {
    try {
      await dispatch(leaveSchool(schoolId));
      navigate("/");
    } catch (error) {
      const { message } = await error.json();
      alert(message);
    }
  }

  const { setModalContent } = useModal();

  function handleClick() {
    setModalContent(
      <DeleteConfirmation
        message="Are you sure you want to unenroll from this school?"
        onDelete={handleLeave}
      />
    );
  }
  return (
    <button
      disabled={!schoolId}
      onClick={handleClick}
      className="hover:text-red-500 hover:bg-secondary border-red-500 h-12 min-w-12 p-1"
    >
      <FiLogOut className="h-full w-full" />
    </button>
  );
}
