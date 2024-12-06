import { useDispatch } from "react-redux";
import { addClassToSchool } from "../../redux/schools";
import { useState } from "react";

export default function CreateClass({ schoolId }) {
  const dispatch = useDispatch();

  const [name, setName] = useState();
  const [level, setLevel] = useState();
  const [error, setError] = useState();

  async function createClass() {
    try {
      await dispatch(addClassToSchool({ name, schoolId, level }));
      setName(null);
      setLevel(null);
    } catch (e) {
      const { message } = await e.json();
      setError(message);
    }
  }

  return (
    <div className="flex flex-col items-center p-2 border border-2 rounded">
      <h1>Name of Class:</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <h1>Class Level:</h1>
      <input
        type="text"
        value={level}
        onChange={(e) => setLevel(e.target.value)}
      />
      <p>{error ? error : "Fill out info for your new class"}</p>
      <button onClick={createClass}>Create Class</button>
    </div>
  );
}
