# Research Foundation

Evidence base for Companion OS. Each row maps a finding to the feature it
justifies, the roadmap phase it belongs to, and its current implementation
status.

Two bodies of evidence, gathered separately:

- **Part 1** — habits, learning, presence and personalization, from a
  deep-research report whose citations were checked against the published
  literature in July 2026.
- **Part 2** — video-lecture attention, researched August 2026, because
  lecture-watching is a core study mode and the mid-lecture drift problem is
  the one Companion OS exists to solve.

Verification notes: all key citations are real, peer-reviewed publications.
Two corrections made during checking:

1. Wendsche & Lohmann-Haislah's break meta-analysis covers 11 studies (n=705)
   with modest effects (g = 0.23 quality, g = 0.12 quantity), not "dozens of
   studies" — directionally valid, magnitude was overstated.
2. The widely repeated "human attention span is 8 seconds, shorter than a
   goldfish" claim is **fabricated** and must never appear in product copy or
   reasoning. See finding #15.

## Part 1: Habits, learning, presence, personalization

| # | Finding (source, confidence) | What the science says | Feature it justifies | Phase | Status |
|---|---|---|---|---|---|
| 1 | Habits take ~2 months (median 59–66 days) of consistent repetition; wide individual variation ([Singh et al. 2024](https://www.mdpi.com/2227-9032/12/23/2488), moderate; [Lally et al. 2010](https://onlinelibrary.wiley.com/doi/abs/10.1002/ejsp.674), moderate) | Consistency in a stable context — **consecutive days** — is the mechanism that builds automaticity | Consecutive-day streak tracking; consistency coaching in companion replies | Productivity Engine / Behavioral Intelligence | ✅ Streak now counts consecutive days |
| 2 | Early repetitions give the largest automaticity gains; returns diminish after ~2 months (Lally et al. 2010) | Support should be heaviest in weeks 1–6, then taper | Intervention decay: cooldowns widen and thresholds loosen as the streak grows | Presence & Intervention | ✅ `supportLevelForStreak` in `interventionEngine.ts` |
| 3 | Self-chosen goals and morning-anchored habits form stronger (Singh et al. 2024) | Users pick their own session goals; companion suggests anchoring to their peak hour | User-set daily goal; peak-hour anchoring suggestions (peak hour already computed in `analytics.py`) | Behavioral Intelligence | ✅ Daily goal is user-chosen and persisted (`User.daily_goal`); peak-hour anchoring suggestions still to build |
| 4 | Habit-specific interventions outperform generic ones (SMD ≈ 0.31, habit-intervention meta-analyses, high) | Habit-focused coaching beats a generic to-do app | Streak reinforcement, context cues, plan-making prompts in companion system prompt | Companion Intelligence | ✅ Encoded in system prompt (discipline/identity framing) |
| 5 | Active recall (self-testing, flashcards) consistently correlates with higher achievement ([Xu et al. 2024](https://www.sciencedirect.com/science/article/abs/pii/S0165032724004245), high) | Retrieval practice > passive review | Study-technique coaching; flashcards/quizzing | Learning Engine (V3) | 🔄 **Reclassified** — finding #19 shows in-lecture retrieval is a *focus* intervention, not only a learning one. No longer purely a V3 concern |
| 6 | Spaced repetition beats massed practice (d ≈ 0.6–0.7 in med-ed meta-analyses, high) | Scheduled review intervals | Spaced-review scheduler | Learning Engine (V3) | ⛔ Deferred with #5 |
| 7 | Body doubling: strong self-reported benefit for task initiation and sustained focus; controlled trials inconclusive ([Eagle et al. 2023](https://dl.acm.org/doi/fullHtml/10.1145/3597638.3614486); [Eagle et al. 2024 TACCESS](https://leyabreanna.com/papers/body_double_taccess.pdf), moderate) | Passive social presence helps many people start and stay on task — but efficacy is unproven, varies by person, and judgmental presence backfires | Ambient presence bar with live attention state; **efficacy measured** via `intervention_shown`/`intervention_followed` follow rate; tone tested to be non-judgmental | Presence & Intervention | ✅ Built and instrumented; follow rate needs real usage to interpret |
| 8 | Mere-presence social facilitation improves simple task performance (classic replications, high) | Visible awareness cues ("the companion knows about this session") create mild accountability | Session visibility, live stats, presence indicators | Presence & Intervention | ✅ Live presence state + stats |
| 9 | Short frequent breaks improve performance quality (g = 0.23) without wellbeing cost ([Wendsche & Lohmann-Haislah](https://www.semanticscholar.org/paper/a8e290c3f4ca9ceac3cfdc5669d2e77df3f0c4aa), high but modest) | Structured focus/break cycles beat unbroken grinding | 25/5 focus-break cycle in the timer | Productivity Engine | ✅ Break cycle implemented |
| 10 | Mental fatigue biases people toward easier tasks/quitting (lab studies, moderate) | Detect fatigue signals and respond with shorter tasks / encouragement, not pressure | Interruption tracking feeds focus score; the `fatigue_break` intervention offers rest rather than pressure | Instrumentation → Emotional Intelligence | 🟡 Behavioral trigger built; emotional inference still unevidenced (see gap 1) |
| 11 | AI-personalized feedback: moderate learning gains (g ≈ 0.58), large motivation gains (g ≈ 0.82) ([Wang et al., N≈5,849](https://journals.sagepub.com/doi/10.1177/07356331251410020), high) | Personalization is the single best-evidenced bet in the product | Behavioral profile + long-term memory injected into every companion reply | Companion Intelligence | ✅ Context builder feeds full profile + memories to LLM |
| 12 | Just-in-time adaptive interventions (JITAIs) boost engagement when triggered by real-time context (Nature Portfolio 2025 summary, moderate) | Nudges timed to actual behavior beat static schedules — **requires rich signal capture first** | Interruptions, idle and tab-visibility events, session lifecycle, all persisted to `presence_events` | Instrumentation (prerequisite for everything) | ✅ Capture complete; multi-window awareness still out of reach in-browser |
| 13 | Gurukul/mentorship tradition: personalized, relationship-based guidance builds discipline (philosophical, not empirical) | The companion as mentor-presence, not tool | Product philosophy; tone rules in system prompt | Vision | ✅ Reflected in system prompt |

## Part 2: Video-lecture attention

Why this matters: watching recorded lectures is where a large share of study
time now goes, and it is the single worst case for sustained attention —
passive, long-form, unaccountable, and consumed in a browser tab one keystroke
away from everything else. This is precisely the drift Companion OS targets.

| # | Finding (source, confidence) | What the science says | Feature it justifies | Phase | Status |
|---|---|---|---|---|---|
| 14 | Mind-wandering during video lectures runs **30–50%**, and rises within a single lecture — 30% in the first half to 49% in the second ([Harvard, mind wandering & education](https://dash.harvard.edu/bitstreams/7312037c-f9e4-6bd4-e053-0100007fdf3b/download); [Springer 2026](https://link.springer.com/article/10.1007/s11409-026-09458-0), moderate — probe-based self-report) | Drift is not a constant background rate; it **compounds as a session runs**. Learning scores fall as mind-wandering rises | Escalating presence support later in a block; shorter segments for passive content | Presence & Intervention | 🟡 Presence state exists but does not yet escalate with elapsed time |
| 15 | Attention **capacity** has not declined — Vogel has measured college students for 20 years, "remarkably stable across decades". What changed is **switching**: average time on a screen fell 2.5 min (2004) → 75 s (2012) → **47 s** ([Gloria Mark, UC Irvine](https://www.apa.org/news/podcasts/speaking-of-psychology/attention-spans); [CNN summary](https://www.cnn.com/2023/01/11/health/short-attention-span-wellness), high). The "8-second goldfish" statistic is [fabricated](https://thewell.northwell.edu/brain-nerve-health/attention-span-goldfish-myth) | The problem is **environmental and habitual, not a personal deficiency**. Attention is pickier and more easily redirected, not smaller | Hard copy rule: the companion never tells a user they have a short attention span, and never frames drift as a personal failing | Companion Intelligence / Presence | ✅ Explicit "On distraction" rules in the system prompt forbid the framing and the fabricated statistic |
| 16 | Engagement drops sharply once a video passes **~6 minutes**, regardless of total length ([Guo, Kim & Rubin](https://www.semanticscholar.org/paper/409090a8fa7edfededc03c396a16f6f57144270c) — 6.9M sessions, high — behavioural log data) | Passive video degrades far faster than active work. A 25-minute Pomodoro is the wrong unit for lecture-watching | A "lecture mode": ~6-minute segments with a checkpoint between them, distinct from the 25/5 deep-work cycle | Productivity Engine | ⏳ Not built — current timer assumes active work |
| 17 | Students spend roughly **a third of lecture time off-task** (mostly social media); ~92% text during lectures; multitasking is **significantly higher online than face-to-face** ([Kent State](https://www.kent.edu/kent/news/kent-state-study-finds-student-multitasking-increases-online-courses); [IJETHE](https://link.springer.com/article/10.1186/s41239-022-00321-1), high) | The pull is instant emotional gratification, not weak character. Online formats make it worse | Tab-visibility tracking already measures exactly this switching behaviour | Instrumentation | ✅ `presence_events` captures tab-hidden/idle — this literature is what those events measure |
| 18 | Boredom from **monotonous, teacher-centred, non-interactive** delivery is a primary self-reported cause of disengagement; lack of live personal interaction is repeatedly named ([SAGE 2024](https://journals.sagepub.com/doi/10.1177/21582440241292901), moderate — qualitative) | Passivity is the mechanism. Nobody is watching, nothing expects anything of the viewer | This is the presence-effect gap the whole product is premised on — an ambient companion supplies the missing accountability | Presence & Intervention | ✅ Core product thesis; presence bar is the first answer to it |
| 19 | **Interpolated testing** — brief quizzes between lecture segments — **halved** mind-wandering, tripled note-taking, and improved retention ([Szpunar, Khan & Schacter, PNAS 2013](https://www.pnas.org/doi/10.1073/pnas.1221764110), high; replicated in [Communications Psychology 2025](https://www.nature.com/articles/s44271-025-00234-5)) | **The strongest single intervention in this entire literature.** Retrieval between segments is what holds attention | Segment-and-quiz flow for lecture material; pairs with active recall (#5) | Learning Engine ↔ Presence | ⏳ Not built — **highest-value unbuilt feature** |
| 20 | **83–90% of students watch lectures above 1× speed**; a 2025 meta-analysis finds faster playback **can impair test performance**, especially at 2× and with complex material ([Educ Psych Review 2025](https://link.springer.com/article/10.1007/s10648-025-10003-9); [UCLA](https://newsroom.ucla.edu/releases/learning-while-speed-watching-class-videos), high) | The most common self-remedy is partly counterproductive — and it is a detectable behavioural signal | Speed-awareness coaching: flag 2× on difficult material without forbidding it | Behavioral Intelligence | ⏳ Not built; needs playback signal the browser cannot see for third-party video |

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
5. **The 25-minute block is unvalidated for passive video.** Finding #16 shows
   engagement collapsing at ~6 minutes for lecture-watching, while the break
   research (#9) that justifies 25/5 comes from *active* work. Applying one
   unit to both modes is an assumption, not a finding.
6. **We cannot see inside third-party video players.** Playback speed, pauses
   and scrubbing (#20) are invisible to a web app watching its own tab. Any
   lecture-mode feature has to rely on user-declared context or the desktop
   companion, and should not pretend to more precision than it has.

## Design rules derived from the evidence

- Weeks 1–6 are the make-or-break window: heaviest support early, taper later (#2).
- Never break the chain matters more than session length: protect the streak metric's integrity (#1).
- Suggest, don't assign: goals the user chooses form stronger habits (#3).
- Enforce breaks; don't celebrate marathon sessions (#9, #10).
- Personalize everything the companion says; generic advice is the failure mode (#11).
- Measure presence features instead of trusting them (#7).
- Match the block length to the mode: ~25 min for active work, ~6 min segments
  for passive video (#9, #16).
- Never attribute drift to the person. Attention capacity is stable; the
  environment changed (#15). "You have a short attention span" is both
  unsupported and the exact judgmental framing #7 warns against.
- Interrupt passive consumption with retrieval, not with encouragement —
  a quiz between segments beats a motivational line (#19).
- Expect drift to worsen later in a session, and weight support accordingly
  (#14).
