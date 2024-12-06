import { useSelector } from "react-redux";
import LogOut from "../components/LogIn/LogOut";
import { useNavigate } from "react-router-dom";
import SignUpButton from "../components/LogIn/SignUpButton";
import JoinSchool from "../components/Schools/JoinSchool";
import DemoButton from "../components/LogIn/DemoButton";

export default function Navigation() {
  const user = useSelector((state) => state.session.user);
  const navigate = useNavigate();

  return (
    <div className="h-50 p-3 border-b-2 flex justify-between bg-secondary w-full">
      <h1 className="w-64 text-lg cursor-pointer" onClick={() => navigate("/")}>
        Attendance Tracker
      </h1>
      <div className="text-center text-accent w-full text-lg">
        {user ? `Welcome! ${user.username}` : <SignUpButton />}
      </div>
      <div className="flex w-64 justify-center">
        {user && <LogOut />}
        {!user && <DemoButton />}
        {!!user && <JoinSchool nav={true} />}
      </div>
    </div>
  );
}
