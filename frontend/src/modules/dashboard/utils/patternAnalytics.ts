export const getMostProductiveHour = (

  sessions: any[]

) => {

  if (!sessions.length)
    return null;

  const hourCounts: any = {};

  sessions.forEach((session) => {

    const hour =
      new Date(
        session.started_at
      ).getHours();

    hourCounts[hour] =
      (hourCounts[hour] || 0) + 1;
  });

  let bestHour = 0;
  let maxSessions = 0;

  for (const hour in hourCounts) {

    if (hourCounts[hour] > maxSessions) {

      maxSessions =
        hourCounts[hour];

      bestHour =
        Number(hour);
    }
  }

  return bestHour;
};

export const getConsistencyLevel = (

  streak: number

) => {

  if (streak >= 30)
    return "Highly Consistent";

  if (streak >= 14)
    return "Strong Momentum";

  if (streak >= 7)
    return "Building Stability";

  if (streak >= 3)
    return "Early Consistency";

  return "Forming Routine";
};

export const getFocusIntensity = (

  totalMinutes: number,

  totalSessions: number

) => {

  if (!totalSessions)
    return "No Data";

  const average =
    totalMinutes / totalSessions;

  if (average >= 90)
    return "Deep Work";

  if (average >= 50)
    return "Strong Focus";

  if (average >= 25)
    return "Moderate Focus";

  return "Light Sessions";
};

