import React from "react";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import HotelIcon from "@mui/icons-material/Hotel";

const DayBox = ({ day, dayName, onClick, note }) => {
  const getLabelColor = () => {
    if (note && note.workoutType) {
      switch (note.workoutType) {
        case "weights":
          return "#FF6B6B"; // Culoare rosu pentru greutati
        case "cardio":
          return "#FFD93D"; // Culoare verde pentru cardio
        case "other":
          return "#6BCB77"; // Culoare galbena pentru celelalte activitati
        case "rest":
          return "#4D96FF"; // Culoare albastra pentru zi de odihna
        default:
          return "#f3f3e0"; // Default
      }
    }
    return "#f3f3e0"; // Culoare default pentru zile "goale"
  };

  const getWorkoutIcon = () => {
    switch (note.workoutType) {
      case "weights":
        return <FitnessCenterIcon />;
      case "cardio":
        return <DirectionsRunIcon />;
      case "other":
        return <AccessibilityNewIcon />;
      case "rest":
        return <HotelIcon />;
      default:
        return null;
    }
  };

  return (
    <div
      className={day ? "day-box" : "empty-box"}
      onClick={() => day && onClick(day)}
      style={{ position: "relative" }} // Setarea fundalului intr-unul transparent
    >
      {/* Banda verticala laterala atasata fiecarei zi dupa alegerea tipului de antrenament */}
      {note && note.workoutType && (
        <div
          className="bandage-label"
          style={{
            position: "absolute",
            left: "0",
            top: "0",
            bottom: "0",
            width: "10px",
            backgroundColor: getLabelColor(),
            borderTopLeftRadius: "5px",
            borderBottomLeftRadius: "5px",
          }}
        />
      )}

      {day ? (
        <>
          <div className="date-text">
            <span className="day-name">{dayName}</span>
            <span className="day-number">{day}</span>
          </div>
          {note && note.workoutType && (
            <div className="note-preview">
              <span className="note-icon">{getWorkoutIcon()}</span>
              {note.muscleGroup && (
                <div className="muscle-group-label">
                  {note.muscleGroup.toUpperCase()}
                  {note.secondMuscleGroup &&
                    ` & ${note.secondMuscleGroup.toUpperCase()}`}
                </div>
              )}
              {note.otherActivity && (
                <div className="muscle-group-label">
                  {note.otherActivity.toUpperCase()}
                </div>
              )}
              {note.workoutType === "rest" && (
                <div className="muscle-group-label">
                  {note.workoutType.toUpperCase()}
                </div>
              )}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
};

export default DayBox;
