type CompanionInput = {

  streak: number;

  focusScore: number;

  totalSessions: number;

  topSubject: string;
};

export const generateInsight = (

  data: CompanionInput

) => {

  const {

    streak,

    focusScore,

    totalSessions,

    topSubject

  } = data;

  // NEW USER

  if (totalSessions <= 2) {

    return `
    You're building momentum.
    Consistency matters more than intensity right now.
    `;
  }

  // STRONG STREAK

  if (streak >= 7) {

    return `
    Your ${streak}-day streak is becoming a habit.
    Your discipline is stabilizing.
    `;
  }

  // HIGH FOCUS SCORE

  if (focusScore >= 80) {

    return `
    Your focus quality is excellent lately.
    Especially in ${topSubject}.
    `;
  }

  // LOW FOCUS SCORE

  if (focusScore < 40) {

    return `
    Your sessions show frequent interruptions.
    Try reducing distractions before starting.
    `;
  }

  // DEFAULT

  return `
  You're progressing steadily.
  Your strongest area currently is ${topSubject}.
  `;
};