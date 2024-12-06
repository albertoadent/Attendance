import { useNavigate } from "react-router-dom";

export default function CreateSchoolButton({ nav }) {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate("/create-school")}>
      {nav ? "Create" : "Create School"}
    </button>
  );
}
