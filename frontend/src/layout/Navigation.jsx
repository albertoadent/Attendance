import { useSelector } from "react-redux";
import LogOut from "../components/LogIn/LogOut";
import { useModal } from "../context/Modal";
import { useNavigate } from "react-router-dom";
import Demo from "../components/LogIn/Demo";
import SignUpButton from "../components/LogIn/SignUpButton";
import JoinSchool from "../components/Schools/JoinSchool";

export default function Navigation() {
  const user = useSelector((state) => state.session.user);
  const { setModalContent } = useModal();
  const navigate = useNavigate();

  return (
    <div className="h-50 p-3 border flex justify-between bg-secondary">
      <h1 className="w-64 text-lg cursor-pointer" onClick={() => navigate("/")}>
        Attendance Tracker
      </h1>
      <div className="text-center text-accent w-full text-lg">
        {user ? `Welcome! ${user.username}` : <SignUpButton />}
      </div>
      <div className="flex w-64 justify-center">
        {user && <LogOut />}
        {!user && (
          <button onClick={() => setModalContent(<Demo />)}>Demo</button>
        )}
        {!!user && <JoinSchool nav={true} />}
      </div>
    </div>
  );
}
