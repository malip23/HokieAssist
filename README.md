# HokieAssist

## A data-driven AI agent for an accessible smart campus

HokieAssist is a mobile smart-campus assistant designed to help Virginia Tech students navigate campus and participate in campus life in ways that work for their individual access needs.

Instead of asking students to identify a disability or medical condition, HokieAssist asks:

> **What would make it easier for you to participate today?**

Students can express needs such as:

- Avoid stairs
- Minimize walking
- Minimize standing
- Find frequent seating
- Prefer indoor routes
- Avoid crowded or noisy areas
- Stay near restrooms or water
- Require an elevator
- Prefer a low-stimulation environment

HokieAssist combines those needs with campus route data, building information, events, and changing conditions to create a personalized access plan.

> **Prototype note:** The current campus accessibility and condition data is curated for hackathon demonstration purposes and should not be treated as official Virginia Tech accessibility or emergency guidance.

---

## The Problem

Traditional campus navigation tools usually optimize for the shortest or fastest route. That does not always make a route usable for every student.

A student may need to:

- Avoid stairs or steep routes
- Reduce walking or standing
- Find seating before or during an event
- Stay close to restrooms or water
- Avoid high-stimulation or crowded spaces
- Find an alternate route when an elevator becomes unavailable
- Take a break without losing track of what is happening

HokieAssist brings navigation, accessibility preferences, campus data, and AI together in one experience.

---

## Our Solution

HokieAssist acts as an accessibility-aware campus agent.

A student can say:

> "I'm exhausted and running late. I'm at Newman Library and need to get to Squires Student Center. I don't want stairs and I need somewhere to sit."

HokieAssist can:

1. Use Gemini to interpret the student's natural-language request.
2. Query campus route data from Databricks.
3. Convert Databricks data into the application's route format.
4. Score available routes using accessibility needs, energy level, and urgency.
5. Build a personalized access plan.
6. Present the plan through the mobile interface.
7. Use Focus Mode to simplify the plan.
8. Use ElevenLabs for voice guidance.

The system is designed to choose the route that best matches the student's needs, not simply the shortest route.

---

## Core Experiences

### 1. UNDERSTAND

HokieAssist helps students understand information around them.

### Focus Mode

Focus Mode:

- Reduces a plan to the most important steps
- Highlights actions and warnings
- Makes complicated information easier to follow

Future extensions can include:

- Live captions
- Visual descriptions
- Simplified announcements
- "What Did I Miss?" summaries

---

### 2. GET THERE

HokieAssist provides personalized route recommendations using factors such as:

- Walking time
- Distance
- Stairs
- Elevators
- Slope
- Indoor percentage
- Seating
- Restrooms
- Water
- Crowding
- Energy level
- Urgency

The route-planning flow is:

```text
Student Request
      ↓
Gemini
      ↓
Structured StudentRequest
      ↓
Databricks Campus Routes
      ↓
Accessibility-Aware Route Scoring
      ↓
Best Route
      ↓
Access Plan
```

---

### 3. PARTICIPATE

HokieAssist is designed to help students participate in campus activities, not only reach them.

The access plan can include:

- When to leave
- Which route to take
- Where seating is available
- Rest or recovery breaks
- Relevant warnings
- Step-by-step guidance

---

## Dynamic Replanning

Campus conditions can change.

For example:

- An elevator becomes unavailable
- A route becomes blocked
- Construction affects a path
- A destination becomes crowded
- An event location changes

HokieAssist includes Databricks campus-condition data so the agent can eventually update recommendations when conditions change.

Example demo flow:

```text
Original Route
Newman Library → Squires Student Center
12 minutes
0 stairs
Uses elevator

        ↓

Elevator becomes unavailable

        ↓

Alternative Route
Newman Library → Squires Student Center
14 minutes
0 stairs
No elevator required
Seating available
```

---

## AI + Data Architecture

```text
                         HOKIEASSIST
                              │
                              ▼
                       Student Request
                              │
                              ▼
                           Gemini
                    Natural-Language Parser
                              │
                              ▼
                       StudentRequest
                              │
                              ▼
                         Databricks
                  Campus Route + Condition Data
                              │
                              ▼
                        Route Scoring
                 Accessibility + Energy + Urgency
                              │
                              ▼
                         Access Plan
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
                Focus Mode          Mobile UI
                    │
                    ▼
                ElevenLabs
               Voice Guidance
```

### Responsibility of Each Layer

**Gemini**  
Understands the student's natural-language request.

**Databricks**  
Provides structured campus route and condition data.

**Route Scorer**  
Evaluates routes using accessibility needs, energy level, urgency, and route characteristics.

**Access Plan**  
Converts the selected route into student-facing guidance.

**Focus Mode**  
Simplifies the plan into important steps.

**ElevenLabs**  
Provides optional voice guidance.

---

## Databricks Integration

Databricks provides the data layer for HokieAssist.

The prototype uses the `workspace.hokieassist` schema with tables including:

```text
workspace.hokieassist.buildings
workspace.hokieassist.routes
workspace.hokieassist.events
workspace.hokieassist.conditions
```

The TypeScript Databricks service is located at:

```text
server/services/databricks.ts
```

It provides functions including:

```typescript
runQuery();
findRoutes(origin, destination);
getCurrentConditions(location);
```

The Databricks route data is then used by:

```text
services/routes.ts
```

The route service converts Databricks rows into the application's `Route` format and applies HokieAssist's accessibility-aware route-scoring logic.

### Databricks Field Mapping

```text
route_id          → id
distance_miles    → distance
walking_time      → walkingTime
seating           → seatingAvailable
indoor_percentage → indoorPercentage
restroom_nearby   → restroomNearby
water_nearby      → waterNearby
```

---

## Route Scoring

The route scorer considers both accessibility needs and the student's current situation.

Examples include:

- `no_stairs`
- `seating`
- `elevator`
- `restroom`
- `water`
- `indoor_route`
- `low_stimulation`
- Low or moderate energy
- High or low urgency

Lower-scoring routes are preferred.

Some needs can act as hard requirements. For example, when `no_stairs` is selected, HokieAssist first tries to remove routes containing stairs before comparing the remaining options.

This allows HokieAssist to recommend the route that best fits the individual student rather than automatically choosing the fastest route.

---

## Example Demo

### Student Request

> "I'm exhausted and running late. I'm at Newman Library and need to get to Squires Student Center. I don't want stairs and I need somewhere to sit."

### Expected Flow

```text
Gemini
  ↓
origin = Newman Library
destination = Squires Student Center
accessNeeds = ["no_stairs", "seating"]
energyLevel = "low"
urgency = "high"
  ↓
Databricks
  ↓
Available Campus Routes
  ↓
Route Scoring
  ↓
Best Accessible Route
  ↓
Personalized Access Plan
  ↓
Focus Mode / Voice Guidance
```

This demonstrates that HokieAssist makes a recommendation based on the student's needs rather than automatically choosing the shortest path.

---

## Technology Stack

### Mobile Application

- React Native
- Expo
- TypeScript

### AI

- Gemini
- Accessibility-aware agent logic
- Focus Mode
- ElevenLabs voice guidance

### Data

- Databricks
- Databricks SQL
- Unity Catalog
- TypeScript Databricks SQL client

### Development

- Git
- GitHub
- VS Code
- Expo Go

---

## Current Project Structure

```text
HokieAssist/
│
├── assets/
│
├── data/
│   ├── buildings.json
│   ├── conditions.json
│   ├── events.json
│   └── routes.json
│
├── server/
│   └── services/
│       ├── databricks.ts
│       └── elevenlabs.ts
│
├── services/
│   ├── accessPlan.ts
│   ├── agent.ts
│   ├── aiParser.ts
│   ├── focusMode.ts
│   ├── requestParser.ts
│   ├── routes.ts
│   ├── testAgent.ts
│   └── types.ts
│
├── src/
│
├── app.json
├── package.json
└── README.md
```

The JSON files inside `data/` are useful for development and demo preparation. The integrated agent route flow retrieves route data from Databricks.

---

## Getting Started

### Requirements

- Node.js
- npm
- Git
- VS Code
- Expo Go
- Access to the team's Databricks workspace for Databricks-connected features

### Clone the Repository

```bash
git clone https://github.com/malip23/HokieAssist.git
cd HokieAssist
```

### Install Application Dependencies

```bash
npm install
```

### Install Server Dependencies

```bash
cd server
npm install
cd ..
```

### Environment Configuration

The project uses local environment variables for external services.

Do **not** commit `.env` files or API credentials.

For Databricks, the local server environment uses:

```text
DATABRICKS_SERVER_HOSTNAME=your-databricks-hostname
DATABRICKS_HTTP_PATH=your-sql-warehouse-http-path
```

Each developer should authenticate to Databricks using their own authorized account.

### Check TypeScript

```bash
npx tsc --noEmit
```

### Start the Expo Application

```bash
npx expo start
```

If the standard connection does not work:

```bash
npx expo start --tunnel
```

---

## Development Team

### Mali — AI Agent

Responsibilities include:

- Natural-language parsing
- Gemini integration
- Personalized access plans
- Route reasoning
- Energy and urgency context
- Focus Mode
- AI-agent behavior

### Jada — Campus Data

Responsibilities include:

- Campus datasets
- Buildings
- Routes
- Events
- Campus conditions
- Accessibility information
- Databricks integration

### Cinthia — Frontend

Responsibilities include:

- React Native application
- Expo
- Navigation
- Maps
- Access-preference interfaces
- Personalized-plan interface
- UI/UX

---

## Git Workflow

The `main` branch contains the shared integrated version of the project.

Each team member develops on their own branch:

```text
main
│
├── mali/ai-agent
├── jada/campus-data
└── cinthia/frontend
```

Typical workflow:

```bash
git checkout main
git pull origin main

git checkout your-branch
git merge main
```

After making changes:

```bash
git status
git add <files-you-changed>
git commit -m "Describe your changes"
git push origin your-branch
```

Then create a Pull Request into `main`.

Team members should avoid committing:

- `.env`
- API credentials
- `node_modules`
- Generated local development-tool files

---

## Accomplishments That We're Proud Of

We are proud that we were able to build HokieAssist as more than just a static accessibility tool.

HokieAssist combines campus data, AI, and accessibility-aware route scoring to create personalized recommendations based on what a student needs in the moment.

Instead of requiring students to identify a disability, HokieAssist focuses on needs such as avoiding stairs, minimizing walking, finding seating, reducing sensory overload, or staying near water and restrooms.

We also connected our campus route data to Databricks and integrated it with our existing route-planning system.

Other accomplishments include:

- Building an accessibility-first campus agent
- Connecting HokieAssist route planning to Databricks
- Integrating natural-language understanding with Gemini
- Preserving accessibility-aware route scoring while moving route data into Databricks
- Adding energy and urgency as route-planning context
- Building Focus Mode for simplified guidance
- Adding ElevenLabs voice guidance
- Using GitHub branches and pull requests to combine work from multiple team members

---

## What We Learned

Building HokieAssist required us to connect several different technologies into one working pipeline instead of treating them as separate features.

We learned how to:

- Structure campus data for AI-assisted decision making
- Query Databricks from TypeScript
- Convert database rows into application models
- Combine AI parsing with accessibility rules
- Handle asynchronous data inside an existing TypeScript agent
- Use GitHub branches and pull requests for team development
- Resolve merge conflicts while preserving multiple teammates' work
- Design accessibility features around changing needs rather than diagnoses

Most importantly, we learned that accessibility is not one-size-fits-all.

The route that is fastest for one student may not be the route that is most usable for another.

---

## What's Next for HokieAssist

Future development could include:

- Official Virginia Tech accessibility and building data
- Live elevator and entrance outage information
- Construction and blocked-route feeds
- Real-time crowd and noise information
- Weather-aware route planning
- Campus transportation integration
- Expanded "What Did I Miss?" functionality
- Live captioning
- Visual descriptions
- More robust dynamic replanning
- Additional accessibility preference controls
- Production authentication and deployment

The long-term goal is to make navigating and participating in campus life easier for students with a wide range of visible, invisible, temporary, and fluctuating access needs.

---

## Hackathon Track

### Deloitte × Databricks

### AI Agent for the Virginia Tech Student Experience

HokieAssist demonstrates a data-driven AI agent that understands student needs, retrieves campus information, evaluates accessible options, and creates a personalized campus experience.

---

## Project Vision

> **HokieAssist doesn't just tell students where to go. It understands what they need, understands what's happening around them, and helps them participate in campus life.**

Our goal is to make Virginia Tech a smarter and more accessible campus by connecting information students already need into one personalized experience.
