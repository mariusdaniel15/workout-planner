import React, { useState, useEffect } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import mapMuscleGroup from "./MuscleMappings";

const NoteModal = ({
  day,
  workoutType,
  setWorkoutType,
  muscleGroup,
  setMuscleGroup,
  secondMuscleGroup,
  setSecondMuscleGroup,
  otherActivity,
  setOtherActivity,
  mode,
  setModalType,
  onSubmit,
  onClose,
  onDelete,
  onEdit,
}) => {
  const [exercises, setExercises] = useState([]);
  const [secondExercises, setSecondExercises] = useState([]);
  const [addSecondMuscle, setAddSecondMuscle] = useState(
    secondMuscleGroup ? true : false
  );
  const [expandedExercise, setExpandedExercise] = useState(null);
  const otherExercises = ["Walking", "Yoga", "Stretching"];

  const isEditable = mode === "add" || mode === "edit";

  const fetchExercises = async (muscleGroup, target, setter) => {
    let mappedMuscleGroup;

    if (workoutType === "cardio") {
      switch (muscleGroup) {
        case "full-body":
          mappedMuscleGroup = "cardio";
          break;
        case "legs":
          mappedMuscleGroup = "legs";
          break;
        case "upper-body":
          mappedMuscleGroup = "upper body";
          break;
        default:
          mappedMuscleGroup = mapMuscleGroup(muscleGroup);
      }
    } else {
      mappedMuscleGroup = mapMuscleGroup(muscleGroup);
    }

    if (mappedMuscleGroup) {
      try {
        const response = await fetch(
          `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${mappedMuscleGroup}`,
          {
            method: "GET",
            headers: {
              "X-RapidAPI-Key":
                "af5a2bc776mshf939052c44fe317p1281d1jsnd83a2edb81f8",
              "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
            },
          }
        );
        const data = await response.json();

        const filteredExercises = data.filter(
          (exercise) =>
            !target || exercise.target.toLowerCase() === target.toLowerCase()
        );
        setter(filteredExercises.slice(0, 4));
      } catch (error) {
        console.error("Error fetching exercises:", error);
        setter([]);
      }
    }
  };

  useEffect(() => {
    const target = muscleGroup === "biceps" ? "biceps" : null;
    fetchExercises(muscleGroup, target, setExercises);
  }, [muscleGroup]);

  useEffect(() => {
    if (addSecondMuscle) {
      const target = secondMuscleGroup === "biceps" ? "biceps" : null;
      fetchExercises(secondMuscleGroup, target, setSecondExercises);
    }
  }, [secondMuscleGroup, addSecondMuscle]);

  const combinedExercises = [...exercises, ...secondExercises];

  return (
    <div className="note-modal">
      <button className="close-button" onClick={onClose}>
        <CloseIcon />
      </button>

      <h3>
        {mode === "add"
          ? "Choose Your Activity"
          : mode === "view"
          ? "View Your Activity"
          : "Edit Your Activity"}
      </h3>

      <div className="workout-type">
        {isEditable ? (
          <select
            value={workoutType}
            onChange={(e) => setWorkoutType(e.target.value)}
          >
            <option value="" disabled>
              Select Activity
            </option>
            <option value="weights">Weights</option>
            <option value="cardio">Cardio</option>
            <option value="other">Other</option>
            <option value="rest">Rest</option>
          </select>
        ) : (
          <p> Workout Type: {workoutType}</p>
        )}
      </div>

      {workoutType === "weights" && (
        <>
          <div className="muscle-group">
            {isEditable ? (
              <select
                value={muscleGroup}
                onChange={(e) => setMuscleGroup(e.target.value)}
              >
                <option value="" disabled>
                  Select Muscle Group
                </option>
                <option value="chest">Chest</option>
                <option value="biceps">Biceps</option>
                <option value="triceps">Triceps</option>
                <option value="shoulders">Shoulders</option>
                <option value="waist">Abs</option>
                <option value="upper legs">Upper Legs</option>
              </select>
            ) : (
              <p>Primary Muscle Group: {muscleGroup}</p>
            )}
          </div>

          {isEditable ? (
            <div>
              <input
                type="checkbox"
                checked={addSecondMuscle}
                onChange={() => setAddSecondMuscle(!addSecondMuscle)}
              />
              <label>Add a second muscle group</label>
            </div>
          ) : (
            addSecondMuscle && <p>Seconday Muscle Group: {secondMuscleGroup}</p>
          )}

          {addSecondMuscle && isEditable && (
            <div className="muscle-group">
              <select
                value={secondMuscleGroup}
                onChange={(e) => setSecondMuscleGroup(e.target.value)}
              >
                <option value="" disabled>
                  Select Second Muscle Group
                </option>
                <option value="chest">Chest</option>
                <option value="biceps">Biceps</option>
                <option value="triceps">Triceps</option>
                <option value="shoulders">Shoulders</option>
                <option value="waist">Abs</option>
                <option value="upper legs">Upper Legs</option>
              </select>
            </div>
          )}
        </>
      )}

      {workoutType === "cardio" && (
        <div className="muscle-group">
          {isEditable ? (
            <select
              value={muscleGroup}
              onChange={(e) => setMuscleGroup(e.target.value)}
            >
              <option value="" disabled>
                Select Cardio Focus Area
              </option>
              <option value="full-body">Full Body</option>
              <option value="legs">Legs</option>
              <option value="upper-body">Upper Body</option>
            </select>
          ) : (
            <p> Cardio Focus Area: {muscleGroup} </p>
          )}
        </div>
      )}

      {workoutType === "other" && (
        <div className="muscle-group">
          {isEditable ? (
            <select
              value={otherActivity}
              onChange={(e) => setOtherActivity(e.target.value)}
            >
              <option value="" disabled>
                Select an activity
              </option>
              {otherExercises.map((exercise, index) => (
                <option key={index} value={exercise}>
                  {exercise}
                </option>
              ))}
            </select>
          ) : (
            <p>Other Activity: {otherActivity}</p>
          )}
        </div>
      )}

      <div className="exercise-list">
        {combinedExercises.map((exercise) => (
          <div key={exercise.id} className="exercise-item">
            <div
              className="exercise-header"
              onClick={() =>
                setExpandedExercise(
                  expandedExercise === exercise.id ? null : exercise.id
                )
              }
            >
              <span>{exercise.name}</span>
              <ExpandMoreIcon />
            </div>
            {expandedExercise === exercise.id && (
              <div className="exercise-details">
                <img src={exercise.gifUrl} alt={exercise.name} />
              </div>
            )}
            <div className="sets-reps">
              <span>3 sets x 6-12 reps</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal buttons at the bottom */}
      <form onSubmit={onSubmit}>
        <div className="modal-buttons">
          <button type="submit">
            <SaveIcon />
          </button>
          <button type="button" onClick={onDelete}>
            <DeleteIcon />
          </button>
          {mode === "view" && (
            <button
              onClick={() => {
                setModalType("edit");
                console.log("edit pressed");
              }}
            >
              <EditIcon />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default NoteModal;
