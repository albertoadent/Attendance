import { useDispatch, useSelector } from "react-redux";
import JoinSchool from "../Schools/JoinSchool";
import DisplaySchools from "./DisplaySchools";
import Login from "../LogIn/LogIn";
import CreateSchoolButton from "../Schools/CreateSchoolButton";
import { useEffect, useState } from "react";
import { getSchools } from "../../redux/schools";

export default function Home() {
  const user = useSelector((state) => state.session.user);
  const [haveSchools, setHaveSchools] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSchools()).then((schools) => {
      console.log(schools);
      setHaveSchools(!!schools.length);
    });
  }, [dispatch, user]);

  if (!user) {
    return (
      <div className="text-center flex justify-center p-10 flex-col items-center gap-2">
        {/* <Demo /> */}
        <h1 className="text-[3em] p-5">Attendance Tracker</h1>
        <Login />
      </div>
    );
  }

  return (
    <div>
      {!haveSchools ? (
        <div className="flex flex-col items-center gap-2 m-2">
          <div className="flex flex-col items-center">
            <h1 className="text-center">Students and Teachers:</h1>
            <JoinSchool />
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-center">School Owners:</h1>
            <CreateSchoolButton />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 text-center">
          <DisplaySchools />
          <div className="w-full bg-background flex flex-col items-center p-5 gap-2">
            <JoinSchool />
            <CreateSchoolButton />
          </div>
        </div>
      )}
    </div>
  );
}
