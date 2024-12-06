import { useDispatch } from "react-redux";
import { logout } from "../../redux/session";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { clearSchools } from "../../redux/schools";

export default function LogOut() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch(clearSchools());
  }

  useEffect(() => {
    document.addEventListener("logout", handleLogout);
    return () => document.removeEventListener("logout", handleLogout);
  }, [dispatch,handleLogout]);

  async function logOut() {
    await dispatch(logout());
    navigate("/");
  }

  return <button onClick={logOut}>Log Out</button>;
}
