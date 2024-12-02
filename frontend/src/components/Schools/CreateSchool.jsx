import { useState } from "react";
import { useDispatch } from "react-redux";
import { createSchool } from "../../redux/schools";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/Modal";

export default function CreateSchool() {
  const [name, setName] = useState(null);
  const [joinCode, setJoinCode] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [usePhoneNumber, setUsePhoneNumber] = useState(false);
  const [email, setEmail] = useState(null);
  const [useEmail, setUseEmail] = useState(false);
  const [error, setError] = useState(null);

  const { closeModal } = useModal();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleNameChange(e) {
    setName(e.target.value);
  }
  function handleJoinCodeChange(e) {
    setJoinCode(e.target.value);
  }
  function handlePhoneNumberChange(e) {
    const val = `${e.target.value}`;
    if (val.length > 10) {
      return;
    }
    setPhoneNumber(e.target.value);
  }
  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handleUsePhoneNumberChange() {
    setUsePhoneNumber((prev) => !prev);
  }
  function handleUseEmailChange() {
    setUseEmail((prev) => !prev);
  }

  async function handleSubmit() {
    const schoolData = { name, joinCode: joinCode.toUpperCase() };

    if (!useEmail) {
      schoolData.email = email;
    }
    if (!usePhoneNumber) {
      schoolData.phoneNumber = `${phoneNumber}`;
    }

    try {
      const newSchool = await dispatch(createSchool(schoolData));
      navigate("/schools/" + newSchool.id);
      closeModal();
    } catch (error) {
      const { message } = await error.json();
      setError(message);
    }
  }

  const sufficientData =
    name &&
    joinCode &&
    ((phoneNumber && `${phoneNumber}`.length === 10) || usePhoneNumber) &&
    (email || useEmail);

  return (
    <div className="bg-background border border-primary rounded flex flex-col items-center">
      <h3>Name:</h3>
      <input type="text" value={name} onChange={handleNameChange} />
      <h3>Join Code:</h3>
      <input
        type="text"
        className="uppercase"
        value={joinCode}
        onChange={handleJoinCodeChange}
      />

      <h3>Phone Number:</h3>
      <div className="flex gap-2">
        <h4 className="text-sm">Use My Phone Number</h4>
        <input
          type="checkbox"
          checked={usePhoneNumber}
          onChange={handleUsePhoneNumberChange}
        />
      </div>
      <input
        type="text"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        disabled={usePhoneNumber}
      />
      <h3>Email:</h3>
      <div className="flex gap-2">
        <h3>Use My Email</h3>
        <input
          type="checkbox"
          checked={useEmail}
          onChange={handleUseEmailChange}
        />
      </div>
      <input
        type="text"
        disabled={useEmail}
        value={email}
        onChange={handleEmailChange}
      />
      {error && <p className="text-red-500">{error}</p>}
      <button onClick={handleSubmit} disabled={!sufficientData}>
        Create School
      </button>
    </div>
  );
}
