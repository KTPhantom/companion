import { useEffect, useMemo, useState } from "react";

import { fetchSessions } from "../services/dashboardService";
import { saveMemory } from "../../companion/services/memoryService";
import { fetchMe } from "../../auth/services/authService";

import {
  calculateStreak,
  calculateFocusScore,
  getTopSubject
} from "../utils/analytics";

import { generateInsight } from "../../companion/engine/companionEngine";

import {
  getMostProductiveHour,
  getConsistencyLevel,
  getFocusIntensity
} from "../utils/patternAnalytics";

export const useDashboardData = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [sessionData, me] = await Promise.all([
          fetchSessions(),
          fetchMe()
        ]);
        setSessions(sessionData);
        setUser(me);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const derived = useMemo(() => {
    const totalMinutes = sessions.reduce(
      (acc: number, session: any) => acc + session.duration,
      0
    );
    const totalSessions = sessions.length;
    const today = new Date().toDateString();
    const todaySessions = sessions.filter(
      (s: any) =>
        s.started_at && new Date(s.started_at).toDateString() === today
    );
    const streak = calculateStreak(sessions);
    const focusScore = calculateFocusScore(sessions);
    const topSubject = getTopSubject(sessions);
    const productiveHour = getMostProductiveHour(sessions);
    const consistencyLevel = getConsistencyLevel(streak);
    const focusIntensity = getFocusIntensity(totalMinutes, totalSessions);

    return {
      totalMinutes,
      totalSessions,
      todaySessions,
      streak,
      focusScore,
      topSubject,
      productiveHour,
      consistencyLevel,
      focusIntensity,
      companionInsight: generateInsight({
        streak,
        focusScore,
        totalSessions,
        topSubject,
        productiveHour,
        consistencyLevel,
        focusIntensity
      })
    };
  }, [sessions]);

  // Persist behavioral patterns as long-term memories so the companion can
  // reference them in conversation — this is how it "learns" the user.
  useEffect(() => {
    if (loading || sessions.length === 0) return;

    const memories: Record<string, string> = {
      consistency_level: derived.consistencyLevel,
      focus_intensity: derived.focusIntensity
    };
    if (derived.productiveHour !== null) {
      memories.productive_hour = String(derived.productiveHour);
    }
    if (derived.topSubject && derived.topSubject !== "No Data") {
      memories.top_subject = derived.topSubject;
    }

    Promise.all(
      Object.entries(memories).map(([key, value]) => saveMemory(key, value))
    ).catch((error) => console.error("Failed to sync memories", error));
  }, [loading, sessions.length, derived]);

  return {
    sessions,
    user,
    loading,
    ...derived
  };
};
