type CompanionInput = {
  streak: number;
  focusScore: number;
  totalSessions: number;
  topSubject: string;
  productiveHour?: number | null;
  consistencyLevel?: string;
  focusIntensity?: string;
};

export const generateInsight = (data: CompanionInput) => {
  const {
    streak,
    focusScore,
    totalSessions,
    topSubject,
    productiveHour,
    consistencyLevel,
    focusIntensity
  } = data;

  // NEW USER — build the habit before anything else
  if (totalSessions <= 2) {
    return `You're building momentum.
Consistency matters more than intensity right now.`;
  }

  // STRONG STREAK — reinforce identity
  if (streak >= 7) {
    return `Your ${streak}-day streak is becoming a habit.
Your discipline is stabilizing.`;
  }

  // HIGH FOCUS SCORE
  if (focusScore >= 80) {
    return `Your focus quality is excellent lately.
Especially in ${topSubject}.`;
  }

  // LOW FOCUS SCORE — gentle intervention
  if (focusScore < 40) {
    return `Your sessions show frequent interruptions.
Try reducing distractions before starting.`;
  }

  // KNOWN RHYTHM — surface the learned pattern
  if (productiveHour !== null && productiveHour !== undefined) {
    return `Your focus tends to peak around ${productiveHour}:00.
Your current rhythm shows ${consistencyLevel ?? "steady progress"} with ${focusIntensity ?? "focused"} sessions.`;
  }

  // DEFAULT
  return `You're progressing steadily.
Your strongest area currently is ${topSubject}.`;
};
