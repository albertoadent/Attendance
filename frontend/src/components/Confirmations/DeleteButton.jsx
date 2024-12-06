import { useModal } from "../../context/Modal";
import DeleteConfirmation from "./DeleteConfirmation";

export default function DeleteButton({
  onDelete = () => {
    alert("Deleted!");
  },
  confirmationMessage = "Are you sure you want to delete that?",
  children = "Delete",
  small,
}) {
  const { setModalContent } = useModal();
  function handleClick() {
    setModalContent(
      <DeleteConfirmation onDelete={onDelete} message={confirmationMessage} />
    );
  }
  return (
    <button
      className={
        small
          ? "h-6 min-w-6 p-1 text-red-500 hover:bg-secondary hover:border-red-500"
          : "h-10 min-w-10 p-1 text-red-500 hover:bg-secondary hover:border-red-500"
      }
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
