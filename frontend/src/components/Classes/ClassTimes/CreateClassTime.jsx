import { useState } from "react";
import { useDispatch } from "react-redux";
import { FaPlus } from "react-icons/fa";
import { addClassTime } from "../../../redux/classes";

export default function CreateClassTime({ classId }) {
  const dispatch = useDispatch();
  const [days, setDays] = useState({
    sun: false,
    mon: false,
    tue: false,
    wed: false,
    thu: false,
    fri: false,
    sat: false,
  });
  const [time, setTime] = useState("01:00:00");
  const [isAM, setIsAM] = useState(true);
  const [endTime, setEndTime] = useState("01:00:00");
  const [endIsAM, setEndIsAM] = useState(true);
  const AMPMText = isAM ? "AM" : "PM";
  const endAMPMText = endIsAM ? "AM" : "PM";
  const dayArray = Object.keys(days);

  function DayButton({ day = "sun" }) {
    const isEnabled = days[day];
    function onClick() {
      setDays((prev) => ({ ...prev, [day]: !isEnabled }));
    }
    return (
      <button
        className={
          isEnabled ? "text-xs min-w-8 p-1" : "bg-gray-500 text-xs min-w-8 p-1"
        }
        onClick={onClick}
      >
        {day.toUpperCase().slice(0, 2)}
      </button>
    );
  }

  async function handleSubmit() {
    const data = { ...days, time, endTime };
    try {
      await dispatch(addClassTime(classId, data));
    } catch (error) {
      const { message } = await error.json();
      alert(message);
    }
  }

  function handleHourChange(e) {
    const hour = ((Number(e.target.value) % 12) + (isAM ? 0 : 12))
      .toString()
      .padStart(2, 0);
    setTime((prevTime) => {
      const minutes = prevTime.split(":")[1];
      return `${hour}:${minutes}:00`;
    });
  }
  function handleEndHourChange(e) {
    const hour = ((Number(e.target.value) % 12) + (endIsAM ? 0 : 12))
      .toString()
      .padStart(2, 0);
    setEndTime((prevTime) => {
      const minutes = prevTime.split(":")[1];
      return `${hour}:${minutes}:00`;
    });
  }

  function handleMinuteChange(e) {
    const min = Number(e.target.value).toString().padStart(2, 0);
    setTime((prevTime) => {
      const hours = prevTime.split(":")[0];
      return `${hours}:${min}:00`;
    });
  }
  function handleEndMinuteChange(e) {
    const min = Number(e.target.value).toString().padStart(2, 0);
    setEndTime((prevTime) => {
      const hours = prevTime.split(":")[0];
      return `${hours}:${min}:00`;
    });
  }

  function handleAM_PMButtonClick() {
    setIsAM((isAm) => {
      const [hours, minutes] = time.split(":");
      if (isAm) {
        setTime(
          `${((Number(hours) + 12) % 24)
            .toString()
            .padStart(2, 0)}:${minutes}:00`
        );
      } else {
        setTime(
          `${((Number(hours) - 12) % 24)
            .toString()
            .padStart(2, 0)}:${minutes}:00`
        );
      }
      return !isAm;
    });
  }
  function handleEndAM_PMButtonClick() {
    setEndIsAM((endIsAM) => {
      const [hours, minutes] = endTime.split(":");
      if (endIsAM) {
        setEndTime(
          `${((Number(hours) + 12) % 24)
            .toString()
            .padStart(2, 0)}:${minutes}:00`
        );
      } else {
        setEndTime(
          `${((Number(hours) - 12) % 24)
            .toString()
            .padStart(2, 0)}:${minutes}:00`
        );
      }
      return !endIsAM;
    });
  }

  return (
    <div className="w-64 flex-col flex p-1 h-48 gap-1 border justify-between">
      <h1 className="self-center">Add Class Time</h1>
      <div className="flex justify-center gap-2">
        <h2>Start:</h2>
        <select className="rounded-xl" name="hours" onChange={handleHourChange}>
          {new Array(12).fill(0).map((_, i) => {
            return (
              <option value={i + 1} key={i}>
                {i + 1}
              </option>
            );
          })}
        </select>
        <span>:</span>
        <select
          className="rounded-xl"
          name="minutes"
          onChange={handleMinuteChange}
        >
          {new Array(12).fill(0).map((_, i) => {
            const val = i * 5;
            return (
              <option value={val} key={i}>
                {val.toString().padStart(2,0)}
              </option>
            );
          })}
        </select>
        <button
          className="min-w-8 text-xs bg-class"
          onClick={handleAM_PMButtonClick}
        >
          {AMPMText}
        </button>
      </div>
      <div className="flex justify-center gap-2">
        <h2>End:</h2>
        <select
          className="rounded-xl"
          name="hours"
          onChange={handleEndHourChange}
        >
          {new Array(12).fill(0).map((_, i) => {
            return (
              <option value={i + 1} key={i}>
                {i + 1}
              </option>
            );
          })}
        </select>
        <span>:</span>
        <select
          className="rounded-xl"
          name="minutes"
          onChange={handleEndMinuteChange}
        >
          {new Array(12).fill(0).map((_, i) => {
            const val = i * 5;
            return (
              <option value={val} key={i}>
                {val.toString().padStart(2,0)}
              </option>
            );
          })}
        </select>
        <button
          className="min-w-8 text-xs bg-class"
          onClick={handleEndAM_PMButtonClick}
        >
          {endAMPMText}
        </button>
      </div>
      <div className="flex justify-between">
        {dayArray.map((day, i) => {
          return <DayButton day={day} key={i}/>;
        })}
      </div>
      <button
        className="min-w-8 h-8 justify-center self-center"
        onClick={handleSubmit}
      >
        <FaPlus className="text-green-500 w-full" />
      </button>
    </div>
  );
}
