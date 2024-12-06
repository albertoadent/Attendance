import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function SchoolCard({ school, nav }) {
  const user = useSelector((state) => state.session.user);
  const navigate = useNavigate();
  const isOwner = user.id == school.ownerId;
  if (isOwner && !nav) {
    return (
      <div className="w-full p-2 py-6 border-2 border-primary rounded text-center">
        <h1>{school.name}</h1>
        {isOwner && (
          <button
            className="text-green"
            onClick={() => navigate("/schools/" + school.id + "/edit")}
          >
            Edit
          </button>
        )}
        {isOwner && (
          <button
            className="text-green"
            onClick={() => navigate("/schools/" + school.id)}
          >
            View
          </button>
        )}
      </div>
    );
  }
  return (
    <button
      className="w-full py-6"
      onClick={() => navigate("/schools/" + school.id)}
    >
      <h1>{school.name}</h1>
    </button>
  );
}
