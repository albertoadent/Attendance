import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editSchool } from "../../redux/schools";
import { useNavigate, useParams } from "react-router-dom";
import DeleteSchoolButton from "./DeleteSchoolButton";

export default function EditSchool() {
  const { schoolId } = useParams();
  const school = useSelector((state) => state.schools[schoolId]);

  const [name, setName] = useState(school.name);
  const nameChanged = name != school.name;
  const [joinCode, setJoinCode] = useState(school.joinCode);
  const joinCodeChanged = joinCode != school.joinCode;
  const [phoneNumber, setPhoneNumber] = useState(Number(school.phoneNumber));
  const phoneNumberChanged = phoneNumber != school.phoneNumber;
  const [email, setEmail] = useState(school.email);
  const emailChanged = email != school.email;
  const [error, setError] = useState(null);
  const changesMade =
    nameChanged || joinCodeChanged || phoneNumberChanged || emailChanged;
  const sufficientData =
    name && joinCode && phoneNumber && `${phoneNumber}`.length === 10 && email;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!schoolId) {
    return <h1>Loading...</h1>;
  }

  if (!school) {
    return <h1>School Does Not Exist</h1>;
  }

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

  async function handleSubmit() {
    const schoolData = { id: school.id };

    if (nameChanged) {
      schoolData.name = name;
    }

    if (emailChanged) {
      schoolData.email = email;
    }

    if (joinCodeChanged) {
      schoolData.joinCode = joinCode.toUpperCase();
    }

    if (phoneNumberChanged) {
      schoolData.phoneNumber = phoneNumber;
    }

    if (!Object.values(schoolData).length) {
      setError("No Changes Made");
      return;
    }

    try {
      const newSchool = await dispatch(editSchool(schoolData));
      navigate("/schools/" + newSchool.id);
    } catch (error) {
      console.log(error);
      const { message } = await error.json();
      setError(message);
    }
  }

  return (
    <div className="bg-background border border-primary rounded flex flex-col items-center">
      <DeleteSchoolButton id={school.id} />
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
      <input
        type="number"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
      />
      <h3>Email:</h3>
      <input type="text" value={email} onChange={handleEmailChange} />
      {error && <p className="text-red-500">{error}</p>}
      <button onClick={handleSubmit} disabled={!changesMade || !sufficientData}>
        Save Changes
      </button>
    </div>
  );
}
