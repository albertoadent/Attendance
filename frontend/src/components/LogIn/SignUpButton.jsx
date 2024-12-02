import { useModal } from "../../context/Modal";
import SignUp from "./SignUp";

export default function SignUpButton() {
  const { setModalContent } = useModal();

  function handleClick() {
    setModalContent(<SignUp />);
  }

  return <button onClick={handleClick}>Sign Up</button>;
}
