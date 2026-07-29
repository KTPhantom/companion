# Research Foundation

Evidence base for Companion OS, distilled from a verified deep-research report
(citations checked against the published literature in July 2026). Each row maps
a finding to the feature it justifies, the roadmap phase it belongs to, and its
current implementation status.

Verification note: all key citations below are real, peer-reviewed publications.
One correction to the original report: Wendsche & Lohmann-Haislah's break
meta-analysis covers 11 studies (n=705) with modest effects (g = 0.23 quality,
g = 0.12 quantity), not "dozens of studies" — directionally valid, magnitude
was overstated.

## Mapping: finding → feature → phase → status

| # | Finding (source, confidence) | What the science says | Feature it justifies | Phase | Status |
|---|---|---|---|---|---|
| 1 | Habits take ~2 months (median 59–66 days) of consistent repetition; wide individual variation ([Singh et al. 2024](https://www.mdpi.com/2227-9032/12/23/2488), moderate; [Lally et al. 2010](https://onlinelibrary.wiley.com/doi/abs/10.1002/ejsp.674), moderate) | Consistency in a stable context — **consecutive days** — is the mechanism that builds automaticity | Consecutive-day streak tracking; consistency coaching in companion replies | Productivity Engine / Behavioral Intelligence | ✅ Streak now counts consecutive days |
| 2 | Early repetitions give the largest automaticity gains; returns diminish after ~2 months (Lally et al. 2010) | Support should be heaviest in weeks 1–6, then taper | Intervention decay: cooldowns widen and thresholds loosen as the streak grows | Presence & Intervention | ✅ `supportLevelForStreak` in `interventionEngine.ts` |
| 3 | Self-chosen goals and morning-anchored habits form stronger (Singh et al. 2024) | Users pick their own session goals; companion suggests anchoring to their peak hour | User-set daily goal; peak-hour anchoring suggestions (peak hour already computed in `analytics.py`) | Behavioral Intelligence | 🟡 Peak hour computed; daily goal now real data (target still fixed at 6) |
| 4 | Habit-specific interventions outperform generic ones (SMD ≈ 0.31, habit-intervention meta-analyses, high) | Habit-focused coaching beats a generic to-do app | Streak reinforcement, context cues, plan-making prompts in companion system prompt | Companion Intelligence | ✅ Encoded in system prompt (discipline/identity framing) |
| 5 | Active recall (self-testing, flashcards) consistently correlates with higher achievement ([Xu et al. 2024](https://www.sciencedirect.com/science/article/abs/pii/S0165032724004245), high) | Retrieval practice > passive review | Study-technique coaching; eventually flashcards/quizzing | Learning Engine (V3) | ⛔ Deliberately deferred — different product surface |
| 6 | Spaced repetition beats massed practice (d ≈ 0.6–0.7 in med-ed meta-analyses, high) | Scheduled review intervals | Spaced-review scheduler | Learning Engine (V3) | ⛔ Deferred with #5 |
| 7 | Body doubling: strong self-reported benefit for task initiation and sustained focus; controlled trials inconclusive ([Eagle et al. 2023](https://dl.acm.org/doi/fullHtml/10.1145/3597638.3614486); [Eagle et al. 2024 TACCESS](https://leyabreanna.com/papers/body_double_taccess.pdf), moderate) | Passive social presence helps many people start and stay on task — but efficacy is unproven, varies by person, and judgmental presence backfires | Ambient presence bar with live attention state; **efficacy measured** via `intervention_shown`/`intervention_followed` follow rate; tone tested to be non-judgmental | Presence & Intervention | ✅ Built and instrumented; follow rate needs real usage to interpret |
| 8 | Mere-presence social facilitation improves simple task performance (classic replications, high) | Visible awareness cues ("the companion knows about this session") create mild accountability | Session visibility, live stats, presence indicators | Presence & Intervention | ✅ Live presence state + stats |
| 9 | Short frequent breaks improve performance quality (g = 0.23) without wellbeing cost ([Wendsche & Lohmann-Haislah](https://www.semanticscholar.org/paper/a8e290c3f4ca9ceac3cfdc5669d2e77df3f0c4aa), high but modest) | Structured focus/break cycles beat unbroken grinding | 25/5 focus-break cycle in the timer | Productivity Engine | ✅ Break cycle implemented |
| 10 | Mental fatigue biases people toward easier tasks/quitting (lab studies, moderate) | Detect fatigue signals and respond with shorter tasks / encouragement, not pressure | Interruption tracking feeds focus score; the `fatigue_break` intervention offers rest rather than pressure | Instrumentation → Emotional Intelligence | 🟡 Behavioral trigger built; emotional inference still unevidenced (see gap 1) |
| 11 | AI-personalized feedback: moderate learning gains (g ≈ 0.58), large motivation gains (g ≈ 0.82) ([Wang et al., N≈5,849](https://journals.sagepub.com/doi/10.1177/07356331251410020), high) | Personalization is the single best-evidenced bet in the product | Behavioral profile + long-term memory injected into every companion reply | Companion Intelligence | ✅ Context builder feeds full profile + memories to LLM |
| 12 | Just-in-time adaptive interventions (JITAIs) boost engagement when triggered by real-time context (Nature Portfolio 2025 summary, moderate) | Nudges timed to actual behavior beat static schedules — **requires rich signal capture first** | Interruptions, idle and tab-visibility events, session lifecycle, all persisted to `presence_events` | Instrumentation (prerequisite for everything) | ✅ Capture complete; multi-window awareness still out of reach in-browser |
| 13 | Gurukul/mentorship tradition: personalized, relationship-based guidance builds discipline (philosophical, not empirical) | The companion as mentor-presence, not tool | Product philosophy; tone rules in system prompt | Vision | ✅ Reflected in system prompt |

## Evidence gaps the roadmap must respect

1. **No evidence supports inferring emotions from passive behavioral signals.**
   The report contains nothing validating burnout/frustration/cognitive-load
   detection. Emotional Intelligence should start with self-reported check-ins
   ("how did that session feel?") — cheap, reliable, and it builds the labeled
   dataset that inference would need later.
2. **Body doubling efficacy is unproven in controlled settings.** Presence
   features must ship with measurement (A/B the presence modes, watch
   completion rates) rather than being assumed to work.
3. **Long-term outcomes are unknown.** Most habit/learning evidence is
   short-to-medium term. Retention analytics should be designed in from the
   start so the product can answer "does this still help at month 6?"
4. **Judgmental presence backfires.** Every intervention and companion reply
   must stay on the supportive side of accountability. Already encoded as
   hard rules in the LLM system prompt; applies equally to notification copy.

## Design rules derived from the evidence

- Weeks 1–6 are the make-or-break window: heaviest support early, taper later (#2).
- Never break the chain matters more than session length: protect the streak metric's integrity (#1).
- Suggest, don't assign: goals the user chooses form stronger habits (#3).
- Enforce breaks; don't celebrate marathon sessions (#9, #10).
- Personalize everything the companion says; generic advice is the failure mode (#11).
- Measure presence features instead of trusting them (#7).
