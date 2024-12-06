import { useDispatch } from "react-redux";
import { activateClass } from "../../redux/classes";
import { FaArrowUp } from "react-icons/fa";
import UpdateConfirmation from "../Confirmations/UpdateConfirmation";
import { useModal } from "../../context/Modal";

export default function ActivateClassButton({ classId, small }) {
  const dispatch = useDispatch();
  const { setModalContent } = useModal();

  async function onActivate() {
    try {
      await dispatch(activateClass(classId));
    } catch (error) {
      const { message } = await error.json();
      alert(message);
    }
  }
  const message = "Are you sure you want to activate this class?";

  function onClick() {
    setModalContent(
      <UpdateConfirmation message={message} onUpdate={onActivate} />
    );
  }

  return (
    <button
      onClick={onClick}
      className={small ? "h-6 min-w-6 p-1" : "h-10 min-w-10 p-1"}
    >
      <FaArrowUp className="h-full w-full text-green-500" />
    </button>
  );
}
