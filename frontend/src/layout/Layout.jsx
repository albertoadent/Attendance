import { Outlet, useNavigate} from "react-router-dom";
import Navigation from "./Navigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { restoreUser } from "../redux/session";
import Sidebar from "./Sidebar";

export default function Layout() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  useEffect(() => {
    dispatch(restoreUser());
  }, [dispatch]);

  return (
    <div>
      <Navigation />
      <Sidebar />
      <Outlet />
    </div>
  );
}
