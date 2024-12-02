import { useState } from "react";
import { useDispatch } from "react-redux";
import { signup } from "../../redux/session";
import { useModal } from "../../context/Modal";

export default function SignUp() {
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [error, setError] = useState();

  const goodData =
    firstName &&
    lastName &&
    username &&
    email &&
    email.includes("@") &&
    email.includes(".") &&
    phoneNumber &&
    `${phoneNumber}`.length == 10 &&
    password &&
    confirmPassword &&
    password === confirmPassword;

  const dispatch = useDispatch();
  const { closeModal } = useModal();

  function handleInputChange(setter) {
    return function handler(e) {
      setter(e.target.value);
    };
  }

  function handlePhoneNumberChange(e) {
    const val = `${e.target.value}`;
    if (val.length > 10) {
      return;
    }
    setPhoneNumber(e.target.value);
  }

  async function handleSignUp() {
    if (password != confirmPassword) {
      setError("Password and Confirm Password must match");
      return;
    }
    try {
      await dispatch(
        signup({ firstName, lastName, username, email, password, phoneNumber })
      );
      closeModal();
    } catch (error) {
      const { message } = await error.json();
      setError(message);
    }
  }

  return (
    <div className="flex flex-col gap-2 p-2 bg-background items-center rounded border-2 border-accent">
      <h1 className="text-[1.5em]">Sign Up</h1>
      <input
        type="text"
        value={firstName}
        onChange={handleInputChange(setFirstName)}
        placeholder="First Name"
      />
      <input
        type="text"
        value={lastName}
        onChange={handleInputChange(setLastName)}
        placeholder="Last Name"
      />
      <input
        type="text"
        value={username}
        onChange={handleInputChange(setUsername)}
        placeholder="Username"
      />
      <input
        type="text"
        value={email}
        onChange={handleInputChange(setEmail)}
        placeholder="Email"
      />
      <input
        type="number"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        placeholder="Phone Number"
      />
      <p className="text-sm">Make sure your passwords match</p>
      <input
        type="password"
        value={password}
        onChange={handleInputChange(setPassword)}
        placeholder="Password"
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={handleInputChange(setConfirmPassword)}
        placeholder="Confirm Password"
      />
      {error && <p>{error}</p>}
      <button disabled={!goodData} onClick={handleSignUp}>
        Sign Up
      </button>
    </div>
  );
}
