import { useNavigate } from "react-router-dom";

export default function UnderConstruction() {
  const navigate = useNavigate();

  return (
    <div className="w-full p-10 flex flex-col items-center gap-5">
      <h1 className="text-lg">This Page is Under Construction</h1>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}
