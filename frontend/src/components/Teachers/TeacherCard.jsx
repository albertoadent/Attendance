import { useModal } from "../../context/Modal";
import { put } from "../../redux/csrf";
import UpdateConfirmation from "../Confirmations/UpdateConfirmation";
import { useDispatch } from "react-redux";
import { getStudents, getTeachers } from "../../redux/schools";
import RemoveTeacherButton from "./RemoveTeacherButton";

export default function TeacherCard({ teacher, isOwner }) {
  const dispatch = useDispatch();
  async function handleSubmit() {
    try {
      await put(`/api/teachers/${teacher.id}`);
      await dispatch(getTeachers(teacher.schoolId));
      await dispatch(getStudents(teacher.schoolId));
    } catch (error) {
      const { message } = await error.json();
      alert(message);
    }
  }
  const { setModalContent } = useModal();
  function onClick() {
    setModalContent(
      <UpdateConfirmation
        onUpdate={handleSubmit}
        message={`Are you sure you want to make ${teacher.User.firstName} ${teacher.User.lastName} a student?`}
      />
    );
  }
  return (
    <li className="p-2 border flex gap-2 justify-between">
      <h1>
        {`${teacher?.User?.firstName || "Loading..."} ${
          teacher?.User?.lastName || ""
        }`}
      </h1>
      <div>
        {isOwner && (
          <button className="min-w-6 text-center" onClick={onClick}>
            S
          </button>
        )}
        {isOwner && <RemoveTeacherButton teacher={teacher} />}
      </div>
    </li>
  );
}
