# AgriCoPilot - Quick Start Guide

## 🚀 Fast Setup (5 minutes)

### Step 1: Clone & Install Frontend
```bash
git clone https://github.com/alexfdz1301/type-1.git
cd type-1/frontend
npm install
npm start
```
The app will open at http://localhost:3000

### Step 2: (Optional) Setup Firebase Backend
```bash
cd ../firebase/functions
npm install
cd ..
firebase emulators:start
```

## 📋 Demo Flow

1. **Select crop**: Choose "Rice" from dropdown
2. **Select district**: Choose "North District"
3. **Select soil type**: Choose "Loamy"
4. **Select growth stage**: Click "Vegetative" radio button
5. **Enter temperature**: Type "28"
6. **Enter humidity**: Type "65"
7. **Click "Run Advisory Pipeline"**
8. Watch the 6 AI agents execute sequentially!
9. View the advisory output with yield, price, risk score
10. Click "Why this decision?" to see the explanation

## ✨ Key Features to Show Judges

- **Clean Modern UI**: Professional three-column layout
- **Real-time Updates**: Agent status changes live (Pending → Running → Completed)
- **6 AI Agents**: All OnDemand agents displayed with roles
- **Custom Tools**: Three agriculture-specific tools built-in
- **Explainable AI**: Full transparency with detailed reasoning
- **Risk Visualization**: Color-coded risk score with progress bar

## 🎯 What Makes This Special

1. **Multi-Agent Coordination**: 6 specialized agents working together
2. **Custom Agricultural Tools**: Built specifically for farming decisions
3. **Firebase Integration**: Serverless backend ready to scale
4. **Production-Ready UI**: Not just a prototype, looks professional
5. **Explainable Decisions**: Every recommendation has clear reasoning

## 🔧 Tech Stack

- **Frontend**: React + Tailwind CSS
- **Backend**: Firebase (Functions, Firestore, Storage)
- **AI**: OnDemand Agents
- **Custom Tools**: JavaScript (Node.js)

## 📦 What's Included

```
type-1/
├── frontend/          # React app
├── firebase/          # Backend functions & config
│   └── functions/     # Custom tools & agent logic
└── README.md          # Full documentation
```

## 🎓 For Judges

This is a **hackathon demonstration** of:
- Multi-agent AI systems in agriculture
- Decision intelligence with explainability
- Modern web architecture with Firebase
- Farmer-friendly UI design

**Not included** (by design):
- Payments, marketplace, real IoT hardware, production scaling

## 💡 Next Steps After Demo

1. Connect real OnDemand API endpoints
2. Add user authentication
3. Deploy to Firebase Hosting
4. Connect real weather APIs
5. Add more crops and regions

---

**Built with ❤️ for smarter farming decisions**
