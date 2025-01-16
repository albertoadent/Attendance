import DeleteClassTimeButton from "./DeleteClassTimeButton";

export default function ClassTimeCard({ classTime, isOwner }) {
  function militaryToAMPM(militaryTime) {
    const [hours, minutes] = militaryTime.split(":");
    const AMPM = (Number(hours) % 12) - Number(hours) ? "PM" : "AM";
    return `${Number(hours) % 12 || 12}:${minutes} ${AMPM}`;
  }

  return (
    <div className="flex w-full flex-col items-center border p-1 bg-background">
      <p>
        {militaryToAMPM(classTime.time)} -{" "}
        {militaryToAMPM(classTime.endTime || classTime.time)}
      </p>
      {/* <div className="flex flex-col items-center">
        <h1>Days</h1>
        <div className="flex">
          {classTime.sun && <h3>SUN</h3>}
          {classTime.mon && <h3>MON</h3>}
          {classTime.tue && <h3>TUE</h3>}
          {classTime.wed && <h3>WED</h3>}
          {classTime.thu && <h3>THUR</h3>}
          {classTime.fri && <h3>FRI</h3>}
          {classTime.sat && <h3>SAT</h3>}
        </div>
      </div> */}
      {isOwner && <DeleteClassTimeButton classTimeId={classTime.id} />}
    </div>
  );
}
