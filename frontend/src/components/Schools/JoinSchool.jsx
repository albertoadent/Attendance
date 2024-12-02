import { useState } from "react";
import { useDispatch } from "react-redux";
import { joinSchool } from "../../redux/schools";
import { useNavigate } from "react-router-dom";

export default function JoinSchool({ nav }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState(null);
  const [error, setError] = useState(null);

  function handleJoinCodeChange(e) {
    setJoinCode(e.target.value);
  }
  function handleEnterKey(e) {
    if (e.key == "Enter") {
      join();
    }
  }

  async function join() {
    try {
      const school = await dispatch(joinSchool(joinCode.toUpperCase()));
      setJoinCode(null);
      setError(null);
      navigate("/schools/" + school.schoolId);
    } catch (err) {
      console.log(err);
      const { message } = await err.json();
      if (nav) {
        alert(message);
      } else {
        setError(message);
      }
    }
  }

  return (
    <div
      className={
        nav
          ? "w-full text-center"
          : "w-full text-center border p-2 rounded border-2"
      }
    >
      {!nav && <h1 className="text-accent">Join School</h1>}
      <input
        className={
          nav
            ? "bg-background uppercase w-28 px-2"
            : "bg-background uppercase w-36 px-2"
        }
        type="text"
        placeholder="Join Code"
        value={joinCode}
        onChange={handleJoinCodeChange}
        onKeyDown={handleEnterKey}
      />
      <button className={nav ? "hidden" : "min-w-12"} onClick={join}>
        {nav ? "GO" : "Join"}
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
