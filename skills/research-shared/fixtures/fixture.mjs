// A complete minimal idea folder that keeps the contract, and one break per failure type.

const NOTES = '## Run notes\n- Searched: fixture only.\n';

export const CLEAN = {
  'sources.md': `# Sources: Test idea

| ID | Where | Title | Publisher | Published | Fetched | Kind | Status |
|---|---|---|---|---|---|---|---|
| S1 | https://example.org/a | Annual report | Example Stats | 2026-01-01 | 2026-11-01 | original | verified |
| S2 | https://example.org/b | Market note | Example News | 2026-02-01 | 2026-11-01 | secondary | verified |
| S3 | https://example.org/c | Vendor blog | Example Co | 2026-03-01 | 2026-11-01 | vendor | unverified |
| S4 | evidence/S4-interviews.md | Five interviews | Test team | 2026-10-01 | 2026-11-01 | first-party | verified |
| S5 | https://example.org/e | Thread | Example Forum | 2026-04-01 | 2026-11-01 | forum | verified |
`,
  'beliefs.md': `# Beliefs: Test idea

| ID | Belief | Basis | Certainty | Would drop it if | Origin | Recorded |
|---|---|---|---|---|---|---|
| B1 | Clinics run bookings on paper | saw | sure | Most use software | create-jtbd | 2026-11-01 |
| B2 | Owners would pay monthly | reasoned | guessing | Nobody pays | create-persona | 2026-11-01 |
| B3 | Patients never reschedule | heard | fairly sure | Reschedules are common | create-journey-map | 2026-11-01 |
`,
  'primary.md': `# Primary research: Test idea

## Studies
| Study | Hash | Who ran it | When | People | How recruited | What was asked | Known bias |
|---|---|---|---|---|---|---|---|
| S4 | abc123 | Test team | 2026-10 | 5 | Referrals | Booking habits | Referrals only |

## Participants
| Code | Role | Segment | Org | Study |
|---|---|---|---|---|
| P1 | Clinic owner | Solo | O1 | S4 |
| P2 | Clinic owner | Solo | O2 | S4 |
| P3 | Practice manager | Group | O3 | S4 |
| P4 | Physiotherapist | Group | O4 | S4 |
| P5 | Clinic owner | Group | O5 | S4 |

## Excerpts
| Verbatim | Code | Theme | Grade | Prompted | Beliefs | Evidence |
|---|---|---|---|---|---|---|
| "I still write it in the diary" | workaround | Paper | reported | no | B1 | [S4 P1] |
| "The book lives on the desk" | workaround | Paper | reported | no | B1 | [S4 P2] |
| "We print the week out" | workaround | Paper | reported | no | B1 | [S4 P3] |
| "I pencil them in" | workaround | Paper | reported | no | B1 | [S4 P4] |
| "Still the paper diary" | workaround | Paper | reported | no | B1 | [S4 P5] |
`,
  'industry.md': `# Industry: Test idea

## Market definition
- Independent clinics with one to five practitioners. [S1, S2]
Confidence: high

## Market size
| Measure | Kind | Value | Unit | Working | Year | Geography | Producer | Evidence |
|---|---|---|---|---|---|---|---|---|
| Bottom-up | bottom-up | 120 | USD millions | 20000 clinics times 6000 USD | 2026 | UK | This research | [inference S1, S2] |
| Published | published | 300 | USD millions | Stated in report | 2025 | UK | Example Stats | [S1] |
Confidence: low

## Value chain
| Step | Who | Takes | Power | Evidence |
|---|---|---|---|---|
| Referral | GP | Nothing | regulation | [S1, S2] |
Confidence: high

## Buyers and budgets
- The owner decides and pays. [S4 P1-P5]
Confidence: high

## Forces
| Force | Type | What is happening | Date | Evidence |
|---|---|---|---|---|
| Waiting lists | economics | Lengthening | 2026 | [S1] |
Confidence: medium

## Trends
| Trend | Direction | Since | Why now | Backed by | Reaches buyers | Evidence |
|---|---|---|---|---|---|---|
| Online booking | rising | 2023 | Patients expect it | behaviour | now | [S2] |
Confidence: low

## What this means for the idea
- Small clinics are reachable through referral networks. [inference S1, S2]
Confidence: low

${NOTES}`,
  'competitors.md': `# Competitors: Test idea

## Rings
| Alternative | Ring | Yearly cost | One line | Evidence |
|---|---|---|---|---|
| Paper diary | workaround | 40 GBP | Free and familiar | [S4 P1-P3] |
Confidence: high

## Profiles
### Example Book
- **Price:** 30 USD a month, seen 2026-11. [S2]
- **Positioning:** "Booking made easy" [S2]
- **Target:** Small clinics. [S2]
- **Praise:** Quick to set up. [S5]
- **Complaints:** Reminders fail. [S5]
- **Switching:** Exporting patients takes a week. [S5]
Confidence: low

## Graveyard
| Attempt | What happened | Year | Why | Evidence |
|---|---|---|---|---|
| None found | No failed attempts surfaced | 2026 | Unknown | [gap] |
Confidence: low

## Comparison
| Job | Alternative | Rating | Evidence |
|---|---|---|---|
| Reduce no-shows | Paper diary | Absent | [S4 P1-P2] |
Confidence: high

## White space
- **Unclaimed:** Reminders that actually arrive. [inference S5]
Confidence: low

${NOTES}`,
  'voice.md': `# Voice: Test idea

## Your participants
| Verbatim | Who | Theme | Evidence |
|---|---|---|---|
| "I still write it in the diary" | Clinic owner | Paper | [S4 P1] |
Confidence: medium

## Public voices
| Voice | Who | Theme | Grade | Source type | Date | Evidence |
|---|---|---|---|---|---|---|
| No-shows wreck the working week | Physiotherapist | No-shows | reported | forum | 2026-04 | [S5] |
Confidence: low

## Themes
| Theme | Cluster | Frequency | Intensity | Score | Spread | What people say | Against | Evidence |
|---|---|---|---|---|---|---|---|---|
| No-shows | pains | 1 | 3 | 3 | 1 forum, 1 role | Lost income | none found | [S5] |
Confidence: low

## The words people use
- "the diary" [S4 P1]
Confidence: medium

## What this means for the idea
- Reminders are the wedge. [inference S5]
Confidence: low

${NOTES}`,
  'jobs.md': `# Jobs: Test idea

Proto: 1 of 1 beliefs validated. Treat everything else as an assumption.

## The core job
> When my day fills up, I want to keep every slot paid, so I can stay open. [B1: confirmed S4 P1-P5]
Confidence: high

## The three dimensions
| Dimension | What they want | Evidence |
|---|---|---|
| Functional | Full diary | [S4 P1-P5] |
Confidence: high

## The job map
| Stage | What they do | Where it hurts | Evidence |
|---|---|---|---|
| Plan | Plan the week | Double bookings | [S4 P1-P3] |
| Fill | Finds the diary | Left at home | [S4 P1-P3] |
| Remind | Texts patients | Slow | [S4 P1-P3] |
| Treat | Sees patients | Interrupted | [S4 P1-P3] |
| Close | Takes payment | Chasing | [S4 P1-P3] |
Confidence: high

## What gets hired today
| Solution | Hired for | Fired because | Why they stay | Evidence |
|---|---|---|---|---|
| Paper diary | Speed | Lost pages | Habit | [S4 P1-P2] |
Confidence: high

## Top underserved outcomes
| Outcome | Importance | Satisfaction | Evidence |
|---|---|---|---|
| Fewer no-shows | 5 | 2 | [S5] |
Confidence: low

## Job statements by segment
| Segment | Job statement | Evidence |
|---|---|---|
| Solo | Keep my week full | [S4 P1-P2] |
Confidence: high

## Design implications
- Lead with reminders. [inference S4, S5]
Confidence: low

${NOTES}`,
  'personas.md': `# Personas: Test idea

Proto: 1 of 2 beliefs validated. Treat everything else as an assumption.

## Segmentation
- **Variable:** How much admin they do themselves. [inference S4, S1]
- **Low end:** Has a manager. [S4 P3]
- **High end:** Does it all. [S4 P1]
- **Primary:** Sam, because the owner decides. [S4 P1-P2]

| Persona | Position | Why here | Evidence |
|---|---|---|---|
| Sam | 90 | Works alone | [S4 P1] |
Confidence: medium

## Persona: Sam
> "I still write it in the diary" [S4 P1]

### Day in the life
- Answers the phone between patients. [S4 P1-P2]

### Goals
- Keep every slot paid. [B1: confirmed S4 P1-P5]

### Needs
- Fewer calls. [S4 P1-P2]

### Motivations
- Independence. [S4 P1-P2]

### Frustrations
- No-shows. [S5]

### Previous experience
- Tried one booking app. [S4 P1-P2]

### Technology
- Phone first. [S4 P1-P2]

### Design implications
- Works one-handed. [inference S4, S1]

### Least evidenced claim
- Would pay monthly. [B2: supported S2]

### How we would know this is wrong
- Owners refuse a monthly price in test. [gap]

Confidence: low

${NOTES}`,
  'journeys.md': `# Journeys: Test idea

Proto: 0 of 1 beliefs validated. Treat everything else as an assumption.

## Journey: Sam, a week of bookings

### Scenario
- A solo owner fills next week. [S4 P1-P2]

### Boundaries
- Starts on Sunday night, ends Friday. [S4 P1-P2]

### Stages
| Phase | Goal | Doing | Touchpoints | Thinking | Emotion | Pain points | Opportunities | Evidence |
|---|---|---|---|---|---|---|---|---|
| Plan | Fill the week | Reads the diary | Diary | Am I full? | 3 | Gaps | Waitlist | [inference S4, S1] |
| Reschedule | Move a patient | Phones them | Phone | Not again | 1 | Patients reschedule often | Self-service | [B3: contradicted S5] |

### Moments that matter
- **Reschedule:** Where the day falls apart. [S4 P1-P2]

Confidence: low

## Future journey: Sam, a week of bookings

### Stages
| Phase | Today's pain | What changes | Doing | Thinking | Emotion | Risk | Evidence |
|---|---|---|---|---|---|---|---|
| Reschedule | Phone tag | Patients move themselves | Nothing | Good | 4 | Patients may not bother | [proposed S4, S5] |

### What has to be true
- **Riskiest:** Patients will use a link. [proposed]

${NOTES}`,
  'empathy.md': `# Empathy: Test idea

Proto: 1 of 1 beliefs validated. Treat everything else as an assumption.

## Map: Sam, a cancellation lands

### Says
- "I still write it in the diary" [S4 P1]

### Does
- Phones the next patient on the list. [S4 P1-P2]

### Thinks
- The week is slipping away. [inference S4, S1]

### Feels
- Rushed. [inference S4, S1]

### Say-do gaps
- Says the diary works, yet keeps a backup list. [B1: confirmed S4 P1-P5]

Confidence: medium

${NOTES}`,
  'affinity.md': `# Affinity: Test idea

## Themes
| Theme | Clusters | People | Orgs | What it tells us | Evidence |
|---|---|---|---|---|---|
| Paper persists | 1 | 5 | 5 | Habit outlasts software | [S4 P1-P5] |
Confidence: high

## Cluster: Owners keep paper because it is always to hand
| Note | Who | Evidence |
|---|---|---|
| Keeps the book on the desk | Clinic owner | [S4 P2] |
| Prints the week | Practice manager | [S4 P3] |
Confidence: medium

## Outliers
| Note | Who | Why it stands apart | Evidence |
|---|---|---|---|
| None | nobody | Every note clustered | [gap] |
Confidence: low

## What surprised us
- Nobody raised price first. [inference S4]
Confidence: medium

${NOTES}`,
  'cardsort.md': `# Card sort: Test idea

## Study
- **Type:** open [S4 P1-P5]
- **Participants:** 5 [S4 P1-P5]
- **Cards:** 12 [S4 P1-P5]
- **Run:** Online, October 2026. [S4 P1-P5]
Confidence: high

## Groups
| Group | Cards | Agreement | Suggested label | Evidence |
|---|---|---|---|---|
| 1 | Book, Cancel | 0.8 | Appointments | [S4 P1-P5] |
Confidence: high

## Cards without a clear home
| Card | Closest to | Share | What to do | Evidence |
|---|---|---|---|---|
| Invoices | Reports | 0.3 | Second route | [S4 P1-P5] |
Confidence: high

## Pairs people keep together
| Card | Card | Together | Evidence |
|---|---|---|---|
| Book | Cancel | 1 | [S4 P1-P5] |
Confidence: high

## Labels people used
| Label | People | Cards it held | Evidence |
|---|---|---|---|
| Appointments | 4 | Book, Cancel | [S4 P1-P4] |
Confidence: high

## What this means for the structure
- Put booking and cancelling under Appointments. [inference S4]
Confidence: medium

${NOTES}`,
  'summary.md': `# Summary: Test idea

## The short version
- Clinics stay on paper out of habit. [S4 P1-P5]
Confidence: high

## What we found
| Finding | Strength | People | Orgs | Against | Evidence |
|---|---|---|---|---|---|
| Paper persists | strong | 5 | 5 | none found | [S4 P1-P5] |
Confidence: high

## Where people disagreed
- No disagreement surfaced. [gap]
Confidence: low

## What this changes
- Lead with reminders. [inference S4, S1]
Confidence: medium

## What we still do not know
- Whether owners would pay monthly. [gap]
Confidence: low

${NOTES}`,
  'interview-script.md': `# Interview script: Test idea

## What this has to settle
- Do clinics pay?

## Who to talk to
- Owners who changed systems this year.

## Screener
| Question | Keep if | Screen out if |
|---|---|---|
| Last change? | This year | Never |

## Before you start
- Ask to record.

## Warm-up
- Tell me about your clinic.

## The story
| Prompt | Listen for | Tests |
|---|---|---|
| Tell me about the last time | The trigger | B2 |

## Probes
- What happened next?

## Close
- Anything I missed?

## Coverage
| Belief or question | Reached by |
|---|---|
| B2 | The story |

## Note sheet
- Codes as in the intake.

${NOTES}`,
  'usability-plan.md': `# Usability plan: Test idea

## What this has to settle
- Can patients rebook?

## What is being tested
- A prototype.

## Who to test with
- 5 patients.

## Tasks
### Task 1: Move a visit
- **Situation:** Your Tuesday no longer works.
- **Starts at:** The reminder text.
- **Success:** Moved without help.
- **Partial:** Moved with a hint.
- **Failure:** Not moved.
- **Stop after:** 3 minutes.

## Pass lines
| Measure | How it is taken | Pass line | If we miss it |
|---|---|---|---|
| Completion | Observed | 4 of 5 | Redesign |

## Session plan
| Minutes | What happens | Moderator says |
|---|---|---|
| 5 | Welcome | Thanks |

## Severity scale
| Level | Meaning |
|---|---|
| 1 | Stops people |

## After the sessions
- Notes go to the inbox.

${NOTES}`,
  'diary-study.md': `# Diary study: Test idea

## What this has to settle
- How often do slots go empty?

## Why a diary
- People misremember.

## Who takes part
- 8 owners.

## The shape
- **Length:** Two weeks.
- **Entry trigger:** Each cancellation.
- **Time per entry:** One minute.
- **Tool:** WhatsApp.

## Prompts
| Prompt | Format | When | Why we ask |
|---|---|---|---|
| What just happened? | Voice | On the event | The moment |

## Schedule
| Day | Participants | Researcher |
|---|---|---|
| 1 | Welcome call | Reply |

## Keeping people in
- Pay in stages.

## What participants receive
- A welcome note.

## Consent and privacy
- Delete on request.

## Analysis
- Closing interview.

${NOTES}`,
  'survey.md': `# Survey: Test idea

## What this has to settle
- How many clinics use software?

## Who and how many
- 278 of 1000.

## Analysis plan
| Decision | Number to look at | Cut by | Result that changes the decision |
|---|---|---|---|
| Build | Share on paper | Size | Under 15 percent |

## Questions
| Number | Question | Type | Options | Skip logic | Feeds |
|---|---|---|---|---|---|
| 1 | What did you use last week? | Single | Paper, software, none | None | Build |

## Bias check
| Question | Risk | What we changed |
|---|---|---|
| 1 | None | Nothing |

## Before it goes out
- Pilot with 5.

${NOTES}`,
  'repository.md': `# Research repository: Test

## How this works
- One row per study.

## Studies
| Study | Idea | When | Method | People | Orgs | Where | Review by |
|---|---|---|---|---|---|---|---|
| Five interviews | Test idea | 2026-10 | Interview | 5 | 5 | evidence | 2028-04 |

## Insights
| Insight | Idea | Strength | People | Orgs | Tags | Source | Last checked |
|---|---|---|---|---|---|---|---|
| Paper persists | Test idea | strong | 5 | 5 | habits | summary.md | 2026-11 |

## Tags
| Tag | Means |
|---|---|
| habits | What people keep doing |

## Open questions
| Question | Idea | Impact | Source |
|---|---|---|---|
| Would owners pay? | Test idea | high | validation.md |

## Consent and retention
| Study | Participants agreed to | Raw files kept until | Status |
|---|---|---|---|
| Five interviews | Internal use | 2027-11 | In date |

${NOTES}`,
  'validation.md': `# Validation: Test idea

## Assumptions
| Rank | Assumption | Impact | Why it matters | Evidence now | Status | Evidence |
|---|---|---|---|---|---|---|
| 1 | Owners would pay monthly | high | Sets the model | One market note | open | [B2: supported S2] |
| 2 | Clinics run on paper | medium | Sets onboarding | Five interviews | confirmed | [B1: confirmed S4 P1-P5] |

## Test plan
### 1. Owners would pay monthly
- **Test:** Fake door pricing page.
- **Confirmed if:** 5 percent click.
- **Killed if:** Under 1 percent click.
- **Who to recruit:** Solo clinic owners.
- **Questions:**
  - What did you last pay for software?

${NOTES}`,
};

export const MUTATIONS = [
  { expect: 'UNKNOWN_SOURCE', file: 'industry.md', find: '| [S1] |', replace: '| [S99] |' },
  { expect: 'UNKNOWN_BELIEF', file: 'personas.md', find: '[B2: supported S2]', replace: '[B9: supported S2]' },
  { expect: 'UNKNOWN_PARTICIPANT', file: 'competitors.md', find: '[S4 P1-P3]', replace: '[S4 P1-P9]' },
  { expect: 'NO_TAG', file: 'industry.md', find: 'one to five practitioners. [S1, S2]', replace: 'one to five practitioners.' },
  { expect: 'LOOSE_PARAGRAPH', file: 'industry.md', find: '## Buyers and budgets\n', replace: '## Buyers and budgets\nA paragraph with no evidence.\n' },
  { expect: 'NO_CONFIDENCE', file: 'competitors.md', find: '- **Unclaimed:** Reminders that actually arrive. [inference S5]\nConfidence: low', replace: '- **Unclaimed:** Reminders that actually arrive. [inference S5]' },
  { expect: 'BAD_CONFIDENCE', file: 'voice.md', find: '- "the diary" [S4 P1]\nConfidence: medium', replace: '- "the diary" [S4 P1]\nConfidence: certain' },
  { expect: 'CONFIDENCE_NOT_EARNED', file: 'industry.md', find: '| [S2] |\nConfidence: low', replace: '| [S2] |\nConfidence: high' },
  { expect: 'CONFIDENCE_NOT_EARNED', file: 'competitors.md', find: '| [gap] |\nConfidence: low', replace: '| [gap] |\nConfidence: high' },
  { expect: 'MISSING_SECTION', file: 'competitors.md', find: '## White space', replace: '## Whitespace' },
  { expect: 'EXTRA_SECTION', file: 'voice.md', find: '## Run notes', replace: '## Surprise\n- A section nobody asked for. [S5]\nConfidence: low\n\n## Run notes' },
  { expect: 'MISSING_SUBSECTION', file: 'personas.md', find: '### Goals', replace: '### Aims' },
  { expect: 'NO_BANNER', file: 'personas.md', find: 'Proto: 1 of 2 beliefs validated. Treat everything else as an assumption.', replace: '' },
  { expect: 'BANNER_COUNT', file: 'personas.md', find: 'Proto: 1 of 2 beliefs', replace: 'Proto: 2 of 2 beliefs' },
  { expect: 'BAD_VERDICT', file: 'personas.md', find: '[B2: supported S2]', replace: '[B2: probably S2]' },
  { expect: 'UNDER_BAR', file: 'jobs.md', find: '[B1: confirmed S4 P1-P5]', replace: '[B1: confirmed S4 P1-P2]' },
  { expect: 'VALIDATED_TOO_SOON', file: 'personas.md', find: 'Proto: 1 of 2 beliefs validated. Treat everything else as an assumption.', replace: 'Validated: 1 of 2 beliefs confirmed, 2026-11-09.' },
  { expect: 'BAD_SCORE', file: 'voice.md', find: '| 1 | 3 | 3 |', replace: '| 1 | 3 | 9 |' },
  { expect: 'CONFIDENCE_NOT_EARNED', file: 'industry.md', find: '- The owner decides and pays. [S4 P1-P5]\nConfidence: high', replace: '- The owner decides and pays. [gap]\nConfidence: medium' },
  { expect: 'UNDER_BAR', file: 'primary.md', find: '| "Still the paper diary" | workaround | Paper | reported |', replace: '| "Still the paper diary" | workaround | Paper | opinion |' },
  { expect: 'UNDER_BAR', file: 'primary.md', find: '| P5 | Clinic owner | Group | O5 | S4 |', replace: '| P5 | Clinic owner | Group | O1 | S4 |' },
  { expect: 'BAD_VALUE', file: 'journeys.md', find: '| Am I full? | 3 |', replace: '| Am I full? | 9 |' },
  { expect: 'BAD_VALUE', file: 'journeys.md', find: '- **Reschedule:**', replace: '- **Nowhere:**' },
  { expect: 'BAD_VALUE', file: 'personas.md', find: '| Sam | 90 |', replace: '| Sam | 140 |' },
  { expect: 'BAD_VALUE', file: 'personas.md', find: '- **Primary:** Sam, because the owner decides. [S4 P1-P2]\n', replace: '' },
  { expect: 'BAD_VALUE', file: 'jobs.md', find: '| Plan | Plan the week | Double bookings | [S4 P1-P3] |\n| Fill | Finds the diary | Left at home | [S4 P1-P3] |\n| Remind | Texts patients | Slow | [S4 P1-P3] |\n', replace: '' },
  { expect: 'BAD_VALUE', file: 'competitors.md', find: '| Absent |', replace: '| Great |' },
  { expect: 'BAD_VALUE', file: 'industry.md', find: '| published | 300 |', replace: '| guess | 300 |' },
  { expect: 'BAD_VALUE', file: 'validation.md', find: '| high | Sets the model |', replace: '| huge | Sets the model |' },
  { expect: 'UNDER_BAR', file: 'primary.md', find: '| reported | no | B1 | [S4 P5] |', replace: '| reported | no | B2 | [S4 P5] |' },
  { expect: 'UNDER_BAR', file: 'primary.md', find: '| reported | no | B1 | [S4 P5] |', replace: '| reported | yes | B1 | [S4 P5] |' },
  { expect: 'UNDER_BAR', file: 'jobs.md', find: '[B1: confirmed S4 P1-P5]', replace: '[B1: confirmed S3 threshold]' },
  { expect: 'BAD_TAG', file: 'personas.md', find: '[B2: supported S2]', replace: '[B2 supported S2]' },
  { expect: 'BAD_TAG', file: 'industry.md', find: '| [S1] |', replace: '| [S1x] |' },
  { expect: 'BAD_TAG', file: 'competitors.md', find: '[inference S5]', replace: '[inference]' },
  { expect: 'BAD_TAG', file: 'journeys.md', find: '[B3: contradicted S5]', replace: '[B3: contradicted]' },
  { expect: 'STATUS_MISMATCH', file: 'validation.md', find: '| open | [B2: supported S2] |', replace: '| confirmed | [B2: supported S2] |' },
  { expect: 'CONFLICTING_VERDICT', file: 'personas.md', find: '[B2: supported S2]', replace: '[B2: contradicted S2]'  },
  { expect: 'EMPTY_SECTION', file: 'industry.md', find: '- The owner decides and pays. [S4 P1-P5]\nConfidence: high', replace: 'Confidence: high' },
  { expect: 'CONFIDENCE_NOT_EARNED', file: 'industry.md', find: '- The owner decides and pays. [S4 P1-P5]\nConfidence: high', replace: '- The owner decides and pays. [inference S1, S2]\nConfidence: medium' },
  { expect: 'BAD_TAG', file: 'journeys.md', find: '[proposed S4, S5]', replace: '[proposed soon]' },
  { expect: 'BAD_VALUE', file: 'journeys.md', find: '| Patients may not bother |', replace: '| Patients may not bother |', also: [['| 4 | Patients', '| 8 | Patients']] },
  { expect: 'BAD_VALUE', file: 'summary.md', find: '| strong | 5 | 5 |', replace: '| huge | 5 | 5 |' },
  { expect: 'BAD_VALUE', file: 'cardsort.md', find: '- **Type:** open', replace: '- **Type:** freestyle' },
  { expect: 'MISSING_SECTION', file: 'survey.md', find: '## Bias check', replace: '## Checks' },
  { expect: 'REAL_HAS_BELIEF', file: 'empathy.md', find: 'Proto: 1 of 1 beliefs validated. Treat everything else as an assumption.', replace: 'From research: 5 people, 5 organisations. Every finding traces to what they did or said.' },
  { expect: 'BANNER_COUNT', file: 'empathy.md', find: 'Proto: 1 of 1 beliefs validated. Treat everything else as an assumption.', replace: 'From research: 9 people, 9 organisations. Every finding traces to what they did or said.', also: [['[B1: confirmed S4 P1-P5]', '[S4 P1-P5]']] },
  { expect: 'REAL_HAS_DESK', file: 'empathy.md', find: 'Proto: 1 of 1 beliefs validated. Treat everything else as an assumption.', replace: 'From research: 5 people, 5 organisations. Every finding traces to what they did or said.', also: [['[B1: confirmed S4 P1-P5]', '[S4 P1-P5]'], ['- The week is slipping away. [inference S4, S1]', '- The week is slipping away. [S1]']] },
  { expect: 'CLEAN', name: 'a real-mode map', file: 'empathy.md', find: 'Proto: 1 of 1 beliefs validated. Treat everything else as an assumption.', replace: 'From research: 5 people, 5 organisations. Every finding traces to what they did or said.', also: [['[B1: confirmed S4 P1-P5]', '[S4 P1-P5]'], ['- The week is slipping away. [inference S4, S1]', '- The week is slipping away. [inference S4]'], ['- Rushed. [inference S4, S1]', '- Rushed. [inference S4]']] },
  { expect: 'BAD_VALUE', file: 'cardsort.md', find: '| Book | Cancel | 1 |', replace: '| Book | Cancel | 16 of 16 |' },
  { expect: 'UNDER_BAR', file: 'primary.md', find: '| P5 | Clinic owner | Group | O5 | S4 |', replace: '| P5 | Clinic owner | Group | not recorded | S4 |' },
  { expect: 'NOT_PROPOSED', file: 'journeys.md', find: '[proposed S4, S5]', replace: '[S4 P1-P3]' },
  { expect: 'PROPOSED_OUT_OF_PLACE', file: 'industry.md', find: '| [S1] |', replace: '| [proposed S1] |' },
  { expect: 'UNDER_BAR', file: 'empathy.md', find: 'Proto: 1 of 1 beliefs validated. Treat everything else as an assumption.', replace: 'From research: 0 people, 0 organisations. Every finding traces to what they did or said.', also: [['[B1: confirmed S4 P1-P5]', '[gap]'], ['[S4 P1]', '[gap]'], ['[S4 P1-P2]', '[gap]'], ['- The week is slipping away. [inference S4, S1]', '- The week is slipping away. [gap]'], ['- Rushed. [inference S4, S1]', '- Rushed. [gap]']] },
  { expect: 'UNDER_BAR', file: 'journeys.md', find: '[B3: contradicted S5]', replace: '[B3: confirmed S4 threshold]' },
  { expect: 'BAD_LEDGER', file: 'sources.md', find: '| https://example.org/e |', replace: '| inbox/raw.txt |' },
  { expect: 'REAL_HAS_DESK', file: 'affinity.md', find: '[S4 P2]', replace: '[S2]' },
  { expect: 'BAD_VALUE', file: 'summary.md', find: '| none found | [S4 P1-P5] |', replace: '| none found | [S4 P1-P2] |' },
  { expect: 'BAD_VALUE', file: 'primary.md', find: '| P5 | Clinic owner | Group | O5 | S4 |', replace: '| P5 | Clinic owner | Group | Acme Ltd | S4 |' },
  { expect: 'BAD_VALUE', file: 'repository.md', find: '| evidence | 2028-04 |', replace: '| inbox/raw.txt | 2028-04 |' },
  { expect: 'BAD_LEDGER', file: 'sources.md', find: '| evidence/S4-interviews.md |', replace: '| inbox/raw.txt |' },
  { expect: 'BANNER_COUNT', file: 'journeys.md', find: '[B3: contradicted S5]', replace: '[B3: refuted S4 P1-P5]' },
  { expect: 'BAD_LEDGER', file: 'sources.md', find: '| original | verified |', replace: '| blog | verified |' },
];
