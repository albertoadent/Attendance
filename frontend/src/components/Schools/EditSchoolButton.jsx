import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function EditButton({ schoolId }) {
  const navigate = useNavigate();

  function editSchool() {
    navigate(`/schools/${schoolId}/edit`);
  }
  return (
    <button className="min-w-10 h-10 p-1 self-start hover:bg-background" onClick={editSchool}>
      <FaEdit className="h-full w-full" />
    </button>
  );
}
