import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { restoreUser } from "../redux/session";

export default function Layout() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(restoreUser());
  }, [dispatch]);

  return (
    <div>
      <Navigation />
      <Outlet />
    </div>
  );
}
