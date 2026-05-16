export const calculateStreak = (
  sessions: any[]
) => {

  if (!sessions.length) return 0;

  const uniqueDays =
    new Set(

      sessions.map((session) =>

        new Date(
          session.started_at
        ).toDateString()
      )
    );

  return uniqueDays.size;
};

export const calculateFocusScore = (
  sessions: any[]
) => {

  if (!sessions.length) return 0;

  const completed =
    sessions.filter(
      (s) => s.completed
    ).length;

  return Math.round(

    (completed / sessions.length) * 100
  );
};

export const getTopSubject = (
  sessions: any[]
) => {

  if (!sessions.length)
    return "No Data";

  const counts: any = {};

  sessions.forEach((session) => {

    counts[session.subject] =
      (counts[session.subject] || 0) + 1;
  });

  let topSubject = "";
  let max = 0;

  for (const subject in counts) {

    if (counts[subject] > max) {

      max = counts[subject];

      topSubject = subject;
    }
  }

  return topSubject;
};