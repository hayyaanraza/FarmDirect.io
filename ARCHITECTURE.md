# AgriCoPilot Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                           │
│                    (React + Tailwind CSS)                        │
└────────────┬────────────────────────────────────┬────────────────┘
             │                                    │
             │                                    │
    ┌────────▼────────┐                  ┌───────▼────────┐
    │  Farmer Input   │                  │ Advisory Output │
    │   Component     │                  │   Component     │
    └────────┬────────┘                  └───────▲────────┘
             │                                    │
             │  Form Data                         │  Results
             │                                    │
    ┌────────▼────────────────────────────────────┴────────┐
    │            AI Agent Execution Component              │
    │         (6 Sequential OnDemand Agents)               │
    └────────┬─────────────────────────────────────────────┘
             │
             │  Agent Invocations
             │
    ┌────────▼────────────────────────────────────────────┐
    │              FIREBASE BACKEND                       │
    │          (Cloud Functions + Firestore)              │
    └─────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Input Phase
```
User Form → React State → Firebase Function (runAdvisoryPipeline)
```

### 2. Agent Execution Phase
```
Firebase Function
    ↓
Farmer Interaction Agent (Chat API)
    ↓
Crop Prediction Agent (ML Inference)
    ↓
Weather Intelligence Agent (Weather API)
    ↓
Field Operations & IoT Agent (Operations Logic)
    ↓
Decision Orchestrator Agent (Combines Outputs)
    ↓
Explanation & Compliance Agent (Reasoning)
```

### 3. Custom Tools Processing
```
Agent Outputs
    ↓
crop_risk_tool(weather, soil, price) → Risk Score
    ↓
shelf_life_tool(temp, humidity, time) → Spoilage Info
    ↓
advisory_formatter_tool(raw_data) → Farmer-Friendly Advice
```

### 4. Output Phase
```
Formatted Advisory → Firestore Storage → React UI Update
```

## Component Architecture

### Frontend Components
```
App.js
  └── AgriCoPilot.js (Main Dashboard)
      ├── LEFT PANEL: Farmer Input Form
      │   ├── Crop Dropdown
      │   ├── District Dropdown
      │   ├── Soil Type Dropdown
      │   ├── Growth Stage Radio Group
      │   ├── Temperature Input
      │   ├── Humidity Input
      │   ├── Image Upload
      │   └── Submit Button
      │
      ├── CENTER PANEL: AI Agent Timeline
      │   ├── Agent 1: Farmer Interaction
      │   ├── Agent 2: Crop Prediction
      │   ├── Agent 3: Weather Intelligence
      │   ├── Agent 4: Field Operations
      │   ├── Agent 5: Decision Orchestrator
      │   └── Agent 6: Explanation & Compliance
      │
      └── RIGHT PANEL: Advisory Output
          ├── Yield Expectation Card
          ├── Price Trend Card
          ├── Risk Score Visualization
          ├── Final Recommendation Card
          └── Expandable Explanation Section
```

### Backend Functions
```
firebase/functions/index.js
  ├── runAdvisoryPipeline (Main Function)
  │   ├── Stores user input in Firestore
  │   ├── Invokes 6 agents sequentially
  │   ├── Calls custom tools
  │   └── Returns formatted advisory
  │
  ├── uploadImage (Image Handler)
  │   └── Stores images in Firebase Storage
  │
  └── getWeatherData (Weather API)
      └── Fetches weather information
```

### Custom Tools
```
Custom Tools Module
  ├── crop_risk_tool()
  │   ├── Inputs: weather_score, soil_type, price_volatility
  │   ├── Logic: Weighted risk calculation
  │   └── Output: Risk score (0-100)
  │
  ├── shelf_life_tool()
  │   ├── Inputs: temperature, humidity, hours_since_harvest
  │   ├── Logic: Spoilage probability calculation
  │   └── Output: Spoilage info + recommendations
  │
  └── advisory_formatter_tool()
      ├── Inputs: All agent outputs
      ├── Logic: Format conversion + recommendation generation
      └── Output: Farmer-friendly advisory text
```

## Database Schema

### Firestore Collections

#### userInputs
```javascript
{
  crop: String,
  district: String,
  soilType: String,
  growthStage: String,
  temperature: Number,
  humidity: Number,
  imageUrl: String,
  timestamp: Timestamp
}
```

#### agentOutputs
```javascript
{
  inputId: String (Reference),
  agent: String (Agent name),
  status: String (completed/error),
  output: Object (Agent-specific data),
  timestamp: Timestamp
}
```

#### advisories
```javascript
{
  inputId: String (Reference),
  advisory: {
    yieldExpectation: String,
    priceTrend: String,
    riskScore: Number,
    recommendation: String,
    explanation: String
  },
  shelfLife: Object,
  riskScore: Number,
  timestamp: Timestamp
}
```

## API Integration Points

### 1. OnDemand Agent APIs
- **Endpoint**: Simulated in demo (production would use real API)
- **Method**: POST
- **Payload**: Agent-specific input data
- **Response**: Agent execution results

### 2. Chat API (Farmer Interaction Agent)
- **Purpose**: Process and validate farmer inputs
- **Integration**: Called by Farmer Interaction Agent

### 3. Media API (Image Upload)
- **Purpose**: Store and retrieve crop images
- **Integration**: Firebase Storage + Media API

### 4. Weather API (Weather Intelligence Agent)
- **Purpose**: Fetch real-time weather data
- **Integration**: Called by Weather Intelligence Agent

## Technology Stack Details

### Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS 3
- **Build Tool**: Create React App / webpack
- **State Management**: React Hooks (useState)

### Backend
- **Platform**: Firebase (Google Cloud)
- **Runtime**: Node.js 18
- **Functions**: Firebase Cloud Functions
- **Database**: Firestore (NoSQL)
- **Storage**: Firebase Storage

### AI & Tools
- **AI Platform**: OnDemand (6 agents)
- **Custom Tools**: JavaScript/Node.js
- **APIs**: REST/HTTP

## Security Considerations

### Development/Demo Mode
- Open Firestore rules for demo
- No authentication required
- Public read/write access

### Production Recommendations
- Add Firebase Authentication
- Implement row-level security rules
- Add API rate limiting
- Encrypt sensitive data
- Add input validation and sanitization

## Scalability

### Current Setup (Spark Plan)
- Suitable for hackathon demo
- Limited to Firebase free tier
- No authentication overhead

### Production Scaling Path
1. Upgrade to Blaze plan (pay-as-you-go)
2. Add Cloud Run for heavy computations
3. Implement caching with Firebase Cache
4. Add CDN for static assets
5. Use Cloud Scheduler for batch processing

## Deployment Pipeline

```
Development
    ↓
Git Commit
    ↓
GitHub Repository
    ↓
Firebase Deploy
    ↓
Production
```

### Deployment Commands
```bash
# Frontend
npm run build
firebase deploy --only hosting

# Backend
firebase deploy --only functions

# Database Rules
firebase deploy --only firestore:rules
firebase deploy --only storage
```

## Monitoring & Debugging

### Available Tools
1. Firebase Console (Functions logs, Firestore data)
2. Firebase Emulator UI (Local testing)
3. React DevTools (Frontend debugging)
4. Chrome DevTools (Performance profiling)

### Key Metrics to Monitor
- Function execution time
- Firestore read/write counts
- Storage usage
- API call success rates
- User engagement metrics

---

**This architecture demonstrates a production-ready, scalable multi-agent AI system for agricultural decision intelligence.**
