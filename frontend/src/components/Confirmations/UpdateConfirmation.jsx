import { useModal } from "../../context/Modal";

export default function UpdateConfirmation({
  message = "Are you sure you want to update this?",
  onUpdate = () => {
    alert("Updated!");
  },
}) {
  const { closeModal } = useModal();

  function handleUpdate() {
    onUpdate();
    closeModal();
  }
  function handleCancel() {
    closeModal();
  }

  return (
    <div className="flex gap-2 bg-[rgb(1,1,1,0.5)] rounded border p-2">
      <h1>{message}</h1>
      <div className="flex gap-1">
        <button onClick={handleUpdate}>Yes</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
}
