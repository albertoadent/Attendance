import ClassTimeCard from "./ClassTimeCard";

export default function ClassTimeCalendar({ classTimes, isOwner }) {
  const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const starterDaysObj = DAYS.reduce((obj, day) => {
    obj[day] = [];
    return obj;
  }, {});
  const header = "border p-1 text-md h-8";
  const days =
    classTimes?.reduce((daysObj, classTime) => {
      for (const day of DAYS) {
        if (classTime[day.toLowerCase()]) {
          daysObj[day].push(classTime);
        }
      }
      return daysObj;
    }, starterDaysObj) || starterDaysObj;
  return (
    <div className="h-full">
      <div className="border grid grid-cols-7 grid-rows-none">
        <div className={header}>Sunday</div>
        <div className={header}>Monday</div>
        <div className={header}>Tuesday</div>
        <div className={header}>Wednesday</div>
        <div className={header}>Thursday</div>
        <div className={header}>Friday</div>
        <div className={header}>Saturday</div>
        {DAYS.map((d, key) => (
          <div key={key} className={`flex flex-col border ${days[d].length?"bg-gray-500":"bg-gray-500"} min-h-20 min-w-40 gap-2`}>
            {days[d]
              .sort((a, b) => {
                const [timeA, timeB] = [a.time, b.time];
                const [hoursA, minA] = timeA.split(":");
                const [hoursB, minB] = timeB.split(":");
                return hoursA - hoursB || minA - minB;
              })
              .map((classTime, i) => (
                <ClassTimeCard classTime={classTime} isOwner={isOwner} key={i} />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
