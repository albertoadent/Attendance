import { useEffect, useState } from "react";
import { login, restoreUser } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import Demo from "./Demo";

export default function Login({ demo }) {
  const [credential, setCredential] = useState(null);
  const [password, setPassword] = useState(null);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  useEffect(() => {
    dispatch(restoreUser()).then(console.log);
  }, [dispatch]);

  function handleCredentialChange(e) {
    setCredential(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  async function handleLogin() {
    try {
      await dispatch(login({ credential, password }));
      setCredential(null);
      setPassword(null);
      setError(null);
      closeModal();
    } catch (error) {
      const { message } = await error.json();
      setError(message);
    }
  }

  return (
    <div className="flex gap-2 flex-col items-center border-2 p-2 w-min border-primary rounded bg-background text-left">
      <h1 className="text-[1.5em] text-center">Log In</h1>
      <div>
        <h3 className="text-[.8em] text-center">
          Username, Email, or Phone Number
        </h3>
        <input
          type="text"
          value={credential}
          onChange={handleCredentialChange}
        />
      </div>
      <div>
        <h3 className="text-[.8em]">Password</h3>
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>
      <p className="text-accent">
        {error ? error : "Please Enter Credentials"}
      </p>
      <button onClick={handleLogin}>Log In</button>
      {demo && <Demo />}
    </div>
  );
}

export function LoginButton() {
  const { setModalContent } = useModal();

  return <button onClick={() => setModalContent(<Login />)}>Log In</button>;
}
