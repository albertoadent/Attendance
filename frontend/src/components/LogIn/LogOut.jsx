import { useDispatch } from "react-redux";
import { logout } from "../../redux/session";
import { useNavigate } from "react-router-dom";

export default function LogOut() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function logOut() {
    await dispatch(logout());
    navigate("/");
  }

  return <button onClick={logOut}>Log Out</button>;
}
