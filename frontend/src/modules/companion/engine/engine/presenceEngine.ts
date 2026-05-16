type PresenceInput = {

  isRunning: boolean;

  timeLeft: number;

  totalTime: number;
};

export const generatePresenceMessage = (

  data: PresenceInput

) => {

  const {

    isRunning,

    timeLeft,

    totalTime

  } = data;

  if (!isRunning) {

    return "Ready when you are.";
  }

  const progress =
    1 - (timeLeft / totalTime);

  // SESSION START

  if (progress < 0.1) {

    return "Locked in.";
  }

  // MID SESSION

  if (progress >= 0.5 &&
      progress < 0.6) {

    return "Halfway there.";
  }

  // FINAL STAGE

  if (progress >= 0.9) {

    return "Finish strong.";
  }

  return "Stay with the task.";
};