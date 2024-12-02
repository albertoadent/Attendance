import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { login } from "../../redux/session";

export default function Demo() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  function logInStudent() {
    dispatch(login({ credential: "student1", password: "password" }));
    closeModal();
  }
  function logInTeacher() {
    dispatch(login({ credential: "teacher1", password: "password" }));
    closeModal();
  }
  function logInOwner() {
    dispatch(login({ credential: "johnsmith", password: "password" }));
    closeModal();
  }

  return (
    <div className="border-2 p-1 rounded bg-background">
      <h1 className="text-center">Demo Our Site</h1>
      <button onClick={logInStudent}>Demo Student</button>
      <button onClick={logInTeacher}>Demo Teacher</button>
      <button onClick={logInOwner}>Demo Owner</button>
    </div>
  );
}
