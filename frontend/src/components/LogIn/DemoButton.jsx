import { useModal } from "../../context/Modal";
import Demo from "./Demo";

export default function DemoButton() {
  const { setModalContent } = useModal();
  return <button onClick={() => setModalContent(<Demo />)}>Demo</button>;
}