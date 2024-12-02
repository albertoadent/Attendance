import { useNavigate } from "react-router-dom";

export default function CreateSchoolButton() {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate("/create-school")}>Create School</button>
  );
}
