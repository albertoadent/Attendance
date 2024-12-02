import { useModal } from "../../context/Modal";
import DeleteConfirmation from "./DeleteConfirmation";

export default function DeleteButton({
  onDelete = () => {
    alert("Deleted!");
  },
  confirmationMessage = "Are you sure you want to delete that?",
  children = "Delete",
}) {
  const { setModalContent } = useModal();
  function handleClick() {
    setModalContent(
      <DeleteConfirmation onDelete={onDelete} message={confirmationMessage} />
    );
  }
  return <button onClick={handleClick}>{children}</button>;
}
