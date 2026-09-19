# HokieAssist

## A data-driven AI agent for an accessible smart campus

HokieAssist is a mobile smart-campus assistant designed to help Virginia Tech students navigate campus, understand what's happening around them, and participate in campus life in ways that work for their individual needs.

Instead of asking students to identify a disability or medical condition, HokieAssist lets students choose the types of support they need in the moment.

Examples include:

- Minimize walking
- Avoid stairs
- Minimize standing
- Frequent seating
- Avoid heat
- Prefer indoor routes
- Avoid crowded or noisy areas
- Restrooms nearby
- Water nearby
- Elevator required
- Low-stimulation environment

HokieAssist combines these preferences with campus events, buildings, routes, accessibility information, and changing campus conditions to create a personalized campus experience.

---

## The Problem

Navigating a university campus can be difficult when students have different access needs that are not reflected in standard campus maps or event information.

A student may need to:

- Find an accessible route to an event
- Avoid stairs or long walking distances
- Find seating before or during an event
- Find a nearby restroom or water station
- Understand an unexpected room or schedule change
- Keep track of important event announcements
- Take a break without missing important information
- Find quieter or lower-stimulation areas

Traditional campus navigation tools usually focus on the shortest or fastest route. Event platforms provide information about events, but they do not necessarily adapt that information to an individual student's needs.

HokieAssist connects these pieces of information into one personalized experience.

---

## Our Solution

HokieAssist acts as an intelligent campus agent that connects:

### Student Needs + Campus Data + Events + Routes + AI

The agent can use this information to create personalized recommendations and adapt them when campus conditions change.

For example, a student could say:

> "I'm at Newman Library and I need to get to the career fair in 30 minutes. I don't want stairs and I need somewhere to sit."

HokieAssist can create a personalized plan:

```text
Newman Library
       ↓
Accessible Route
       ↓
Squires Student Center
       ↓
Seating / Rest Break
       ↓
Career Fair
```

Instead of simply finding the shortest route, HokieAssist considers what makes the route usable for that student.

---

## Three Core Experiences

### 1. UNDERSTAND

HokieAssist helps students understand information around them.

**Caption Mode** — Provides accessible versions of spoken information such as:

- Live captions
- Event announcements
- Speaker identification
- Written announcements

**Describe Mode** — Helps students understand visual information such as:

- Signs
- Posters
- Flyers
- Slides
- Charts
- Event information

**Calm Mode** — Makes changing or overwhelming situations easier to understand by:

- Explaining what is happening
- Breaking instructions into steps
- Warning about transitions
- Explaining unexpected changes
- Providing relevant environmental information

**Focus Mode** — Extracts the most important information from complicated announcements or event information:

- Key points
- Deadlines
- Action items
- Important changes

---

### 2. GET THERE

#### Personalized Accessible Navigation

HokieAssist provides routes based on what the student needs rather than simply choosing the shortest route.

A route can consider:

- Walking distance
- Walking time
- Stairs
- Elevators
- Steep hills
- Indoor vs. outdoor routes
- Seating
- Restrooms
- Water
- Crowds
- Noise
- Other available campus conditions

For example:

#### Standard route

```text
Squires → Torgersen

7 minutes
0.4 miles
```

#### HokieAssist route

```text
Squires → Torgersen

11 minutes
0.5 miles

✓ No stairs
✓ Elevator available
✓ Seating along route
✓ Indoor section
✓ Restroom nearby
```

The second route may take longer, but it may better match the student's selected needs.

---

### 3. PARTICIPATE

HokieAssist helps students participate in campus activities, not just get to them.

A student can create a personalized plan for an event such as a career fair, club meeting, lecture, or workshop.

Example:

```text
CAREER FAIR — ACCESS PLAN

12:35
Leave Newman Library

12:35–12:47
Accessible route to Squires

12:47–12:55
Seated rest break

12:55
Enter career fair

1:00–1:10
Deloitte

1:10–1:20
Seated break

1:20–1:30
Capital One

1:30–1:40
Quiet recovery

1:40
Continue to next activity
```

The plan can change if the student's needs or campus conditions change.

---

## Key Features

### Personalized Access Preferences

Students can select what would make campus easier for them that day.

Examples:

```text
☐ Minimize walking
☐ Avoid stairs
☐ Minimize standing
☐ Frequent seating
☐ Avoid heat
☐ Prefer indoor routes
☐ Quiet environment
☐ Avoid crowds
☐ Restrooms nearby
☐ Water nearby
☐ Elevator required
```

HokieAssist focuses on access needs rather than requiring students to disclose a diagnosis.

---

### AI Campus Agent

Students can interact with HokieAssist using natural language.

Example requests:

> "How do I get to Squires without stairs?"
> "What's happening near me?"
> "Where can I sit near my next class?"
> "What did I miss?"
> "The elevator is closed. What's another route?"

The agent interprets the request, retrieves relevant campus information, and generates a response based on the student's selected needs.

---

## What Did I Miss?

One of HokieAssist's core features is the ability to summarize important information a student missed while taking a break or stepping away from an event.

Example:

```text
WHAT DID I MISS?

While you were away:

• Networking started
• Deloitte announced an application deadline
• The résumé workshop moved to Room 215
• Capital One is currently at Booth 18

NEXT

Résumé Workshop
Room 215
18 minutes
```

The goal is to give the student the information they actually need without requiring them to reconstruct everything they missed.

---

## Dynamic Replanning

Campus conditions can change.

For example, an elevator could become unavailable, a building entrance could close, or an event could move to another room.

Instead of simply displaying the disruption, HokieAssist can update the student's plan.

Example:

```text
⚠️ ROUTE UPDATED

The elevator on your current route
is unavailable.

New route: 14 minutes

✓ No stairs
✓ Seating available
✓ Restroom nearby
✓ Still arrive before your event

[USE NEW ROUTE]
```

This dynamic replanning is a key part of the AI-agent experience.

---

## Example Use Case

### Career Fair

A student has a career fair coming up and wants to minimize walking and standing.

They tell HokieAssist:

> "I want to go to the career fair, but I need to minimize walking and standing."

HokieAssist:

1. Finds the career fair
2. Finds the event location
3. Determines the student's starting location
4. Retrieves available routes
5. Applies the student's access preferences
6. Finds seating and relevant building features
7. Creates a personalized schedule
8. Updates the plan if something changes

The student receives:

```text
YOUR CAREER FAIR PLAN

12:35
Leave Newman Library

12:47
Arrive at Squires

12:47–12:55
Rest near entrance

1:00
Deloitte

1:10
Seated break

1:20
Capital One

1:30
Quiet recovery

1:40
Continue if you are ready
```

---

## Data & AI Architecture

HokieAssist is designed around a data-driven campus intelligence layer.

```text
                    HOKIEASSIST
                         │
                         ↓
                 Student Request
                         │
                         ↓
                    AI AGENT
                         │
              ┌──────────┴──────────┐
              ↓                     ↓
       Student Preferences      Campus Data
                                    │
                   ┌────────────────┼────────────────┐
                   ↓                ↓                ↓
               Buildings          Routes           Events
                   │                │                │
                   └────────────────┼────────────────┘
                                    ↓
                               DATABRICKS
                                    │
                                    ↓
                           Campus Intelligence
                                    │
                                    ↓
                           Personalized Plan
                                    │
                                    ↓
                            Mobile Application
```

---

## Data Sources

The campus data layer can contain information such as:

### Buildings

```text
Building
Entrances
Elevators
Stairs
Restrooms
Seating
Quiet spaces
Water
Accessibility features
```

### Routes

```text
Origin
Destination
Distance
Walking time
Stairs
Elevators
Slope
Indoor percentage
Seating
```

### Events

```text
Event ID
Name
Building
Room
Start time
End time
Event type
Expected crowd
Noise level
Accessibility information
```

### Campus Conditions

```text
Location
Timestamp
Crowd level
Noise level
Temperature
Construction
Blocked routes
```

### Event Updates

```text
Event
Timestamp
Update type
New location
Announcement
```

---

## Databricks

Databricks provides the data-driven foundation for HokieAssist.

Rather than treating campus information as isolated datasets, HokieAssist is designed to combine information from different parts of the campus environment.

For example:

```text
Student Request
       ↓
"I need somewhere quiet where I can sit
before my next class."
       ↓
Databricks
       ↓
Relevant campus information
       ↓
AI Agent
       ↓
Personalized recommendation
```

The goal is for the AI agent to reason across campus data rather than simply return a static database result.

---

## HokieAI

HokieAI is intended to provide the student-facing AI experience.

Example interaction:

```text
Student:
"I have class in 20 minutes and I'm already
tired. I need to get from Newman Library
to McBryde without stairs."

HokieAssist:
"I found a 12-minute route that avoids
stairs and minimizes walking. An elevator
is available and there is seating along
the route."
```

The exact integration will depend on the available HokieAI tools and APIs.

---

## Technology Stack

### Mobile Application

- React Native
- Expo
- TypeScript
- Expo Router

### Data & AI

- Databricks
- HokieAI
- AI/agent technologies

### Development

- Git
- GitHub
- VS Code
- Expo Go

---

## Project Structure

```text
HokieAssist/
│
├── app/
│   ├── index.tsx
│   ├── map.tsx
│   ├── events.tsx
│   ├── access-plan.tsx
│   ├── what-did-i-miss.tsx
│   └── settings.tsx
│
├── components/
│   ├── EventCard.tsx
│   ├── RouteCard.tsx
│   ├── AccessNeed.tsx
│   ├── MapView.tsx
│   └── AIChat.tsx
│
├── services/
│   ├── agent.ts
│   ├── hokieai.ts
│   ├── databricks.ts
│   ├── routes.ts
│   └── events.ts
│
├── data/
│   ├── buildings.json
│   ├── routes.json
│   ├── events.json
│   └── conditions.json
│
├── assets/
│
├── package.json
└── README.md
```

---

## Development Team

### Mali — AI Agent

Branch: `mali/ai-agent`

Responsibilities:

- AI agent logic
- Natural-language requests
- Personalized access plans
- Route reasoning
- Dynamic route replanning
- "What Did I Miss?"
- HokieAI integration

### Jada — Campus Data

Branch: `jada/campus-data`

Responsibilities:

- Campus datasets
- Buildings
- Routes
- Events
- Campus conditions
- Accessibility information
- Databricks integration

### Cinthia — Frontend

Branch: `cinthia/frontend`

Responsibilities:

- React Native application
- Expo
- Navigation
- Maps
- Event screens
- Access preference screens
- Personalized plan interface
- AI interaction interface
- UI/UX

---

## Git Workflow

The `main` branch contains the stable version of the project.

Each team member works on their own branch:

```text
main
│
├── mali/ai-agent
├── jada/campus-data
└── cinthia/frontend
```

Team members should not directly push changes to `main`.

### Workflow

1. Pull the latest `main`
2. Work on your assigned branch
3. Commit your changes
4. Push your branch
5. Create a Pull Request
6. Review the changes
7. Merge into `main`

Before starting work:

```bash
git checkout main
git pull
git checkout your-branch
git merge main
```

After making changes:

```bash
git status
git add .
git commit -m "Describe your changes"
git push
```

---

## Getting Started

### Requirements

- Node.js 24.21.0
- npm 11.19.0
- Git
- VS Code
- Expo Go

### Clone the Repository

```bash
git clone https://github.com/malip23/HokieAssist.git
```

Enter the project:

```bash
cd HokieAssist
```

Install dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npx expo start
```

Scan the QR code using Expo Go on a mobile device.

If the normal connection does not work:

```bash
npx expo start --tunnel
```

---

## Development Strategy

We are building the project incrementally.

### Phase 1 — Prototype

```text
Mock Campus Data
       ↓
Working Mobile UI
       ↓
Basic AI Agent Logic
```

### Phase 2 — Integration

```text
Frontend
   ↓
AI Agent
   ↓
Campus Data
```

### Phase 3 — Data Intelligence

```text
Campus Data
   ↓
Databricks
   ↓
AI Agent
```

### Phase 4 — AI Integration

```text
HokieAI
   ↓
AI Agent
   ↓
Databricks
   ↓
Personalized Campus Experience
```

### Phase 5 — Dynamic Demo

```text
Student receives route
        ↓
Campus condition changes
        ↓
Agent detects change
        ↓
Route is recalculated
        ↓
Student receives updated plan
```

---

## Hackathon Track

### Deloitte × Databricks

## AI Agent for the Virginia Tech Student Experience

HokieAssist is designed around the idea of a data-driven AI agent that understands campus events, buildings, routes, and changing campus conditions and uses that information to create a personalized experience for Virginia Tech students.

---

## Project Vision

> **HokieAssist doesn't just tell students where to go. It understands what they need, understands what's happening around them, and helps them participate in campus life.**

Our goal is to make Virginia Tech a smarter and more accessible campus by connecting information that students already need into one personalized experience.

---

## Status

🚧 **Currently in development for the Virginia Tech hackathon.**
