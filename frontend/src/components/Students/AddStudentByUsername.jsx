import { useDispatch } from "react-redux";
import { addToSchool } from "../../redux/schools";
import { useState } from "react";

export default function AddStudentByUsername({ schoolId }) {
  const dispatch = useDispatch();
  const [username, setUsername] = useState();
  const [error, setError] = useState();
  async function addStudent() {
    try {
      await dispatch(addToSchool(schoolId, username));
      setError(null);
      setUsername(null)
    } catch (error) {
      const { message } = await error.json();
      setError(message);
    }
  }

  return (
    <div className="border rounded border-2 p-2 justify-center flex flex-col items-center">
      <h1>Add User By Username</h1>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <p className={error ? "text-red-500" : "text-accent"}>
        {error ? error : "Type in user's username"}
      </p>
      <button onClick={addStudent}>Add User</button>
    </div>
  );
}
