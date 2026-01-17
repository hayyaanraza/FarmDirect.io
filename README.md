# AgriCoPilot 🌾

**A Modern, AI-Powered Multi-Agent Decision Intelligence Platform for Farmers**

AgriCoPilot is a hackathon prototype that demonstrates a sophisticated multi-agent AI system using OnDemand website agents to assist farmers with crop advisory, field operations, and post-harvest support.

---

## 🎯 Overview

AgriCoPilot provides farmers with intelligent decision-making support through:

- **Crop Advisory**: ML-based crop prediction and risk assessment
- **Field Operations**: Irrigation and harvesting recommendations
- **Post-Harvest Support**: Storage and spoilage prevention guidance
- **Real-time Analysis**: Sequential AI agent execution with live status updates

---

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React + Tailwind CSS (modern, responsive UI)
- **Backend**: Firebase (Spark plan)
  - Firebase Functions (Node.js)
  - Firebase Firestore (database)
  - Firebase Storage (image uploads)
- **AI**: OnDemand website agents (6 specialized agents)
- **APIs**: Chat API, Media API, Weather API

### AI Agents

The system employs 6 OnDemand agents executed sequentially:

1. **Farmer Interaction Agent** - Chat API input handling
2. **Crop Prediction Agent** - ML inference for crop suitability & risk
3. **Weather Intelligence Agent** - Weather API processing
4. **Field Operations & IoT Agent** - Irrigation, harvest & post-harvest logic
5. **Decision Orchestrator Agent** - Combines agent outputs
6. **Explanation & Compliance Agent** - Explains reasoning & confidence

### Custom Tools

Three custom tools built into the Firebase backend:

1. **`crop_risk_tool(weather_score, soil_type, price_volatility)`**
   - Returns numeric risk score (0-100)
   - Considers weather conditions, soil compatibility, and market volatility

2. **`shelf_life_tool(temperature, humidity, hours_since_harvest)`**
   - Returns spoilage probability
   - Provides storage recommendations and estimated shelf life

3. **`advisory_formatter_tool(raw_outputs)`**
   - Converts raw agent outputs into farmer-friendly advice
   - Formats recommendations, yield expectations, and action items

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Firebase CLI (`npm install -g firebase-tools`)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/alexfdz1301/type-1.git
   cd type-1
   ```

2. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```
   
   The app will open at `http://localhost:3000`

3. **Setup Firebase Backend**
   ```bash
   cd ../firebase/functions
   npm install
   ```

4. **Run Firebase Emulators (Optional)**
   ```bash
   cd ..
   firebase emulators:start
   ```
   
   Access the Firebase Emulator UI at `http://localhost:4000`

---

## 🎨 UI Features

### Single-Page Dashboard Layout

**LEFT PANEL - Farmer Input**
- Crop selection (dropdown)
- District selection (dropdown)
- Soil type selection (dropdown)
- Growth stage (radio buttons)
- Temperature & humidity inputs
- Image upload for crop photos
- "Run Advisory Pipeline" button

**CENTER PANEL - AI Agent Execution**
- Vertical timeline showing 6 agents
- Real-time status updates (Pending → Running → Completed)
- Agent name, role, and execution status
- Visual progress indicators

**RIGHT PANEL - Advisory Output**
- Yield expectation (tons/hectare)
- Price trend (₹/quintal)
- Risk score visualization (0-100 scale)
- Final recommendations
- Expandable "Why this decision?" explanation section

---

## 💡 Demo Flow

1. User fills in farm details (crop, location, soil, conditions)
2. User uploads crop photo (optional)
3. User clicks "Run Advisory Pipeline"
4. System executes 6 AI agents sequentially
5. UI updates agent status in real-time
6. Final advisory with explanation is displayed
7. User can expand "Why this decision?" for detailed reasoning

---

## 🔧 Firebase Backend Structure

### Firestore Collections

- **`userInputs`**: Stores farmer input data
- **`agentOutputs`**: Stores individual agent execution results
- **`advisories`**: Stores final formatted advisories

### Cloud Functions

- **`runAdvisoryPipeline`**: Main function that orchestrates agent execution
- **`uploadImage`**: Handles crop image uploads to Firebase Storage
- **`getWeatherData`**: Fetches weather information (mock for demo)

### Custom Tools Implementation

All three custom tools are implemented in `firebase/functions/index.js`:
- `cropRiskTool()` - Lines 8-26
- `shelfLifeTool()` - Lines 28-48
- `advisoryFormatterTool()` - Lines 50-105

---

## 📊 API Integration

### OnDemand Agent APIs
- Each agent is invoked via the `invokeOnDemandAgent()` function
- Agents process data sequentially and return structured outputs
- Agent results are stored in Firestore for traceability

### External APIs
- **Chat API**: Farmer Interaction Agent input validation
- **Media API**: Image upload and storage
- **Weather API**: Real-time weather data (mock implementation for demo)

---

## 🎯 Non-Goals

This is a **demonstration prototype**, NOT production software:

- ❌ No payment processing
- ❌ No marketplace features
- ❌ No real IoT hardware integration
- ❌ No production-level scaling
- ❌ No user authentication (demo only)

---

## 📦 Project Structure

```
type-1/
├── frontend/                 # React application
│   ├── src/
│   │   ├── AgriCoPilot.js   # Main dashboard component
│   │   ├── App.js           # App entry point
│   │   ├── index.js         # React DOM render
│   │   └── index.css        # Tailwind CSS imports
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
│
├── firebase/                # Firebase backend
│   ├── functions/
│   │   ├── index.js        # Cloud Functions & Custom Tools
│   │   └── package.json    # Backend dependencies
│   ├── firestore.rules     # Firestore security rules
│   ├── storage.rules       # Storage security rules
│   ├── firebase.json       # Firebase configuration
│   └── .firebaserc         # Firebase project config
│
└── README.md               # This file
```

---

## 🎓 Key Features for Judges

### 1. **Demonstrable Intelligence**
- 6 specialized AI agents working in coordination
- Clear visualization of agent execution flow
- Multi-factor decision making with explainability

### 2. **Custom Tools Integration**
- Three purpose-built tools for agriculture-specific calculations
- Tools are clearly visible in code and actively used
- Risk assessment, shelf life prediction, and advisory formatting

### 3. **Modern, Clean UI**
- Professional three-column dashboard layout
- Real-time status updates with visual feedback
- Responsive design with Tailwind CSS
- Intuitive farmer-friendly interface

### 4. **Firebase Backend Architecture**
- Serverless functions for scalability
- Structured data storage in Firestore
- Image upload capability with Firebase Storage
- Ready for Firebase Spark (free) plan

### 5. **Explainable AI**
- Every recommendation includes detailed reasoning
- Confidence scores and risk assessments
- Transparent decision-making process

---

## 🚀 Deployment

### Firebase Deployment

1. **Login to Firebase**
   ```bash
   firebase login
   ```

2. **Initialize Project**
   ```bash
   cd firebase
   firebase init
   ```
   
3. **Deploy Functions**
   ```bash
   firebase deploy --only functions
   ```

4. **Deploy Firestore Rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

5. **Deploy Storage Rules**
   ```bash
   firebase deploy --only storage
   ```

### Frontend Deployment

1. **Build Production App**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Firebase Hosting** (Optional)
   ```bash
   firebase deploy --only hosting
   ```

---

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm test
```

### Backend Testing
```bash
cd firebase/functions
npm test
```

---

## 🤝 Contributing

This is a hackathon prototype. For demonstration purposes only.

---

## 📄 License

MIT License - feel free to use for educational purposes.

---

## 👥 Team

Built for hackathon demonstration of multi-agent AI systems in agriculture.

---

## 🙏 Acknowledgments

- OnDemand AI Platform for agent infrastructure
- Firebase for backend services
- React & Tailwind CSS communities

---

## 📞 Support

For questions about the demo, please refer to the code comments and this README.

---

**AgriCoPilot** - *Empowering Farmers with AI Decision Intelligence*