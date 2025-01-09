import React, { useState, useEffect } from "react";
import DayBox from "./DayBox";
import NoteModal from "./NoteModal";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

function Calendar({ handleBack }) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [notes, setNotes] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [workoutType, setWorkoutType] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [secondMuscleGroup, setSecondMuscleGroup] = useState("");
  const [otherActivity, setOtherActivity] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add");

  const numOfDays = (month, year) => new Date(year, month, 0).getDate();

  const daysArray = [];
  const firstDayIndex = new Date(currentYear, currentMonth - 1, 1).getDay();

  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push({ day: 0, dayName: "" });
  }

  for (let i = 1; i <= numOfDays(currentMonth, currentYear); i++) {
    const currentDate = new Date(currentYear, currentMonth - 1, i);
    const dayName = currentDate.toLocaleDateString("en-US", {
      weekday: "short",
    });
    daysArray.push({ day: i, dayName });
  }

  const handleBoxClick = (day, action) => {
    console.log(`Day: ${day}, Action: ${action}`);
    const dayKey = `${currentYear}-${currentMonth}-${day}`;
    setSelectedDay(day);

    if (notes[dayKey]) {
      setModalType(action === "edit" ? "edit" : "view");
      // Umplere campuri cu date existente
      setWorkoutType(notes[dayKey].workoutType || "");
      setMuscleGroup(notes[dayKey].muscleGroup || "");
      setSecondMuscleGroup(notes[dayKey].secondMuscleGroup || "");
      setOtherActivity(notes[dayKey].otherActivity || "");
    } else {
      setModalType("add");
      setWorkoutType("");
      setMuscleGroup("");
      setSecondMuscleGroup("");
      setOtherActivity("");
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dayKey = `${currentYear}-${currentMonth}-${selectedDay}`;
    setNotes((prevNotes) => ({
      ...prevNotes,
      [dayKey]: {
        workoutType,
        muscleGroup,
        secondMuscleGroup,
        otherActivity,
      },
    }));
    setSelectedDay(null);
    setWorkoutType("");
    setMuscleGroup("");
    setSecondMuscleGroup("");
    setOtherActivity("");
  };

  const handleDelete = () => {
    const dayKey = `${currentYear}-${currentMonth}-${selectedDay}`;
    setNotes((prevNotes) => {
      const newNotes = { ...prevNotes };
      delete newNotes[dayKey];
      return newNotes;
    });
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((prevYear) => prevYear + 1);
    } else {
      setCurrentMonth((prevMonth) => prevMonth + 1);
    }
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((prevYear) => prevYear - 1);
    } else {
      setCurrentMonth((prevMonth) => prevMonth - 1);
    }
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    console.log("Current modal type:", modalType);
  }, [modalType]);

  function handleBackButtonClick() {
    handleBack();
    window.history.pushState({}, "");
  }

  useEffect(() => {
    function handlePopState() {
      handleBack();
    }

    // Adaugare event listener pentru butonul de back al browser-ului
    window.addEventListener("popstate", handlePopState);

    // Stergerea eventului dupa ce se indeplineste
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [handleBack]);

  useEffect(() => {
    window.history.pushState({}, "");
  }, []);

  return (
    <div>
      <button className="back-button" onClick={handleBackButtonClick}>
        BACK
      </button>
      <div className="calendar-header">
        <span className="arrow" onClick={handlePreviousMonth}>
          <KeyboardArrowLeftIcon />
        </span>
        <h2>
          {`${monthNames[currentMonth - 1]} `}
          <span className="year-header">{currentYear}</span>
        </h2>
        <span className="arrow" onClick={handleNextMonth}>
          <KeyboardArrowRightIcon />
        </span>
      </div>

      <div className="grid-container">
        {daysArray.map(({ day, dayName }, index) => (
          <DayBox
            key={index}
            day={day}
            dayName={dayName}
            onClick={() => day && handleBoxClick(day)}
            note={notes[`${currentYear}-${currentMonth}-${day}`]}
            workoutType={
              notes[`${currentYear}-${currentMonth}-${day}`]?.workoutType
            }
          />
        ))}
      </div>

      {selectedDay !== null && (
        <>
          <div
            className="modal-backdrop"
            onClick={() => {
              setSelectedDay(null);
              setModalType(null);
            }}
          ></div>

          {/* Modal Type Check */}

          <NoteModal
            day={selectedDay}
            workoutType={workoutType}
            setWorkoutType={setWorkoutType}
            muscleGroup={muscleGroup}
            setMuscleGroup={setMuscleGroup}
            secondMuscleGroup={secondMuscleGroup}
            setSecondMuscleGroup={setSecondMuscleGroup}
            otherActivity={otherActivity}
            setOtherActivity={setOtherActivity}
            mode={modalType}
            setModalType={setModalType}
            onSubmit={handleSubmit}
            onClose={() => setSelectedDay(null)}
            onDelete={handleDelete}
            handleBoxClick={handleBoxClick}
          />
        </>
      )}
    </div>
  );
}

export default Calendar;
