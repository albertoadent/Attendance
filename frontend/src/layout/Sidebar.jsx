import { useEffect, useRef, useState } from "react";
import { FaBars } from "react-icons/fa";
import CreateSchoolButton from "../components/Schools/CreateSchoolButton";
import JoinSchool from "../components/Schools/JoinSchool";
import { useSelector } from "react-redux";
import SchoolCard from "../components/Schools/SchoolCard";
import { LoginButton } from "../components/LogIn/LogIn";
import SignUpButton from "../components/LogIn/SignUpButton";
import DemoButton from "../components/LogIn/DemoButton";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const sidebarRef = useRef();
  const schools = useSelector((state) => state.schools);
  const user = useSelector((state) => state.session.user);

  function openSidebar() {
    setOpen(true);
  }
  function closeSidebar() {
    setOpen(false);
  }

  function onDocumentClick(e) {
    if (sidebarRef.current.contains(e.target)) {
      if (!open) openSidebar();
    } else {
      if (open) closeSidebar();
    }
  }

  function addDocumentEventListener() {
    document.addEventListener("click", onDocumentClick);
  }

  function cleanupDocumentListener() {
    document.removeEventListener("click", onDocumentClick);
  }

  useEffect(() => {
    addDocumentEventListener();

    return cleanupDocumentListener;
  }, [open, addDocumentEventListener, cleanupDocumentListener]);

  return (
    <div
      className={
        open
          ? "absolute right-0 py-10 px-2 bg-secondary border border-accent h-full"
          : "absolute right-5 top-20 bg-secondary"
      }
      ref={sidebarRef}
    >
      {open ? (
        <div className="h-full w-36 flex flex-col items-center text-center gap-2">
          {user && (
            <div className="bg-background w-full rounded border p-2 hover:border-green-500 cursor-pointer">
              <h1 className="text-primary text-sm w-full">
                {user.firstName} {user.lastName}
                <h1 className="text-xs overflow-hidden">{user.email}</h1>
              </h1>
              <h1 className="text-sm text-accent overflow-hidden">
                {user.username}
              </h1>
            </div>
          )}

          {user && (
            <div className="border bg-background w-full rounded p-2">
              <h1 className="text-sm">Create My Own School</h1>
              <CreateSchoolButton nav={true} />
            </div>
          )}

          {user && (
            <div className="border bg-background w-full rounded p-2">
              <h1>Join School</h1>
              <JoinSchool nav={true} />
            </div>
          )}

          {user && <h1>Schools</h1>}

          {user &&
            Object.values(schools).map((school) => (
              <SchoolCard key={school.id} school={school} nav={true} />
            ))}

          {!user && <LoginButton />}
          {!user && <SignUpButton />}
          {!user && <DemoButton />}
        </div>
      ) : (
        <FaBars className="h-8 w-8 border rounded text-accent hover:w-9 hover:h-9 hover:bg-secondary" />
      )}
    </div>
  );
}
