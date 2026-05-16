import { useEffect, useState } from "react";

import {
  fetchSessions
} from "../services/dashboardService";

import {
  calculateStreak,
  calculateFocusScore,
  getTopSubject
} from "../utils/analytics";

import {

  generateInsight

} from "@/modules/companion/engine/companionEngine";

export const useDashboardData = () => {

  const [sessions, setSessions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const loadData = async () => {

      try {

        const token =
          localStorage.getItem("token");

        if (!token) return;

        const data =
          await fetchSessions(token);

        setSessions(data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }
    };

    loadData();

  }, []);

  const totalMinutes =
    sessions.reduce(
      (acc: number, session: any) =>
        acc + session.duration,
      0
    );

  const totalSessions =
    sessions.length;
  const streak =
  calculateStreak(sessions);

const focusScore =
  calculateFocusScore(sessions);

const topSubject =
  getTopSubject(sessions);
const companionInsight =
  generateInsight({

    streak,

    focusScore,

    totalSessions,

    topSubject
  });
  return {

  sessions,

  loading,

  totalMinutes,

  totalSessions,

  streak,

  focusScore,

  topSubject,

  companionInsight
};
};