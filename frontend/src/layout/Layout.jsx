import { Outlet, useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { restoreUser } from "../redux/session";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function Layout() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      dispatch(restoreUser()).then((data) => {
        if (!data.user) navigate("/");
      });
    }
  }, [user]);

  useEffect(() => {
    dispatch(restoreUser());
  }, [dispatch]);

  return (
    <div className="min-h-[100vh] h-full flex flex-col w-full">
      <Navigation />
      <Sidebar />
      <Outlet />
      {/* <Footer /> */}
    </div>
  );
}
