
# FarmDirect – Predictive Agriculture Marketplace

FarmDirect is an AI-powered hackathon project that uses **OnDemand’s agent platform** to match farmers and consumers **before crops are planted**.  
Instead of selling after harvest, we predict demand in advance, enabling stable prices, zero oversupply, and fair income for farmers.

---

## Problem

- Farmers lose **30–40% of income** to middlemen  
- Consumers pay inflated prices  
- Core issue: **no demand visibility before planting**  
- Result: overproduction, food waste, and price crashes  

---

## Solution

FarmDirect uses **OnDemand AI agents** to:
1. Forecast demand for crops months in advance  
2. Aggregate consumer pre-orders by location  
3. Provide farmers with planting and pricing guidance via **WhatsApp/SMS**

This shifts agriculture from guesswork to **data-driven planning**.

---

## Architecture (High Level)

- **OnDemand AI Platform (Core)**
  - Agent Marketplace
  - RAG Knowledge Base
  - Agent Flow Builder
  - Automation (SMS/WhatsApp)
- **Farmer Interface:** WhatsApp / SMS  
- **Consumer Interface:** Web app (Streamlit)  
- **Data:** OnDemand Vector Database  
- **APIs:** Weather + government mandi prices  

---

## AI Agents

### 1. Farmer WhatsApp Agent
- Multilingual (Hindi/English)
- RAG-powered advice on crop choice, pricing, and demand
- Works on feature phones (no smartphone required)

### 2. Demand Aggregation Agent
- Collects consumer pre-orders months in advance
- Aggregates demand by crop and location
- Feeds actionable demand signals to farmers

### 3. Market Intelligence Agent
- Integrates weather and mandi price APIs
- Predicts price trends
- Sends automated SMS recommendations

---

## Demo Flow

1. Farmer messages WhatsApp agent: *“I want to plant tomatoes”*  
2. Agent replies with demand forecast and price range  
3. Consumer places pre-order on web app  
4. Agent matches demand with supply  
5. SMS confirmation sent automatically  

---

## Why OnDemand

FarmDirect is **not possible without OnDemand**:

- **Agent Marketplace:** Rapid setup of conversational agents  
- **RAG:** Accurate, contextual responses from agricultural data  
- **Flow Builder:** No-code orchestration of multi-agent workflows  
- **Automation:** Real-time SMS/WhatsApp alerts  

**Opinion:** OnDemand’s workflow-first AI is the only practical way to build multi-agent systems within a 48-hour hackathon.

---

## Impact

**For Farmers**
- ~30% higher income  
- Zero oversupply risk  
- AI-driven planting decisions  

**For Consumers**
- ~25% lower prices  
- Farm-fresh produce  
- Transparent sourcing  

**Systemic**
- Reduced food waste  
- Predictable agricultural supply  

---

## Tech Stack

- **AI Platform:** OnDemand  
- **Frontend:** Streamlit (consumer portal)  
- **Messaging:** WhatsApp/SMS via OnDemand  
- **Data:** OnDemand Vector DB  
- **APIs:** Weather + Agmarknet (or mock fallback)  

---

## Setup (Hackathon)

1. Create agents in OnDemand:
   - Farmer Chat Agent (RAG enabled)
   - Demand Aggregation Agent
   - Market Intelligence Agent
2. Upload knowledge base (crop data, prices, advisories)
3. Build workflows in Agent Flow Builder
4. Run consumer UI:
   ```bash
   streamlit run app.py
