const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();
const db = admin.firestore();

// OnDemand API Configuration (Placeholder for Hackathon)
const ONDEMAND_API_URL = "https://api.ondemand.ai/v1/agents";
const ONDEMAND_API_KEY = "YOUR_ONDEMAND_API_KEY";

// --- CUSTOM TOOLS ---

function crop_risk_tool(weather_score, soil_type, price_volatility) {
  let baseRisk = 40;
  if (soil_type === "Loamy") baseRisk -= 15;
  if (soil_type === "Sandy") baseRisk += 15;
  if (soil_type === "Clayey") baseRisk += 5;

  const risk = baseRisk + (price_volatility * 0.4) - (weather_score * 0.2);
  return Math.round(Math.max(0, Math.min(100, risk)));
}

function shelf_life_tool(temperature, humidity, hours_since_harvest) {
  const prob = (temperature * 0.6 + humidity * 0.2 + hours_since_harvest * 1.5) / 100;
  return Math.min(1, prob);
}

function advisory_formatter_tool(raw_outputs) {
  const { crop, risk, shelfLife, weather } = raw_outputs;

  if (risk < 30) {
    return `Optimal conditions detected for ${crop}. The current weather (${weather}) and soil profile suggest a high-yield season. Post-harvest stability is high.`;
  } else if (risk < 60) {
    return `Moderate risk environment for ${crop}. While ${weather} is acceptable, we suggest increasing irrigation frequency by 20% to mitigate soil moisture loss.`;
  } else {
    return `Elevated risk levels for ${crop} in this region. High temperature and market volatility suggest delaying harvest by 5-7 days for better price indexing.`;
  }
}

// --- ONDEMAND AGENT INTEGRATION ---

async function callOnDemandAgent(agentName, inputData) {
  console.log(`Invoking OnDemand Agent: ${agentName}`);

  // In a real production scenario, you would use the following block:
  /*
  try {
    const response = await axios.post(`${ONDEMAND_API_URL}/invoke`, {
      agentName: agentName,
      input: inputData
    }, {
      headers: { 'Authorization': `Bearer ${ONDEMAND_API_KEY}` }
    });
    return response.data;
  } catch (error) {
    console.error(`Error calling ${agentName}:`, error);
    throw error;
  }
  */

  // For Hackathon Demo: Sequential Simulation with realistic payloads
  const delays = {
    "Farmer Interaction Agent": 800,
    "Crop Prediction Agent": 1200,
    "Weather Intelligence Agent": 1000,
    "Field Operations & IoT Agent": 1500,
    "Decision Orchestrator Agent": 1200,
    "Explanation & Compliance Agent": 1000
  };

  await new Promise(resolve => setTimeout(resolve, delays[agentName] || 1000));

  switch (agentName) {
    case "Farmer Interaction Agent":
      return { status: "Success", message: "Farmer input successfully parsed." };
    case "Crop Prediction Agent":
      return { status: "Success", suitability: 0.91, confidence: 0.88 };
    case "Weather Intelligence Agent":
      return { status: "Success", weatherScore: 82, forecast: "Partly Cloudy" };
    case "Field Operations & IoT Agent":
      return { status: "Success", irrigationStatus: "Optimal" };
    case "Decision Orchestrator Agent":
      return { status: "Success", optimizedYield: "4.8 Tons/Acre", priceTrend: "Rising (+12%)" };
    case "Explanation & Compliance Agent":
      return { status: "Success", reasoning: "Recommendation driven by high soil nitrogen and stable weather window. Confidence indexed at 92%.", confidence: 0.92 };
    default:
      return { status: "Unknown Agent" };
  }
}

exports.runAdvisoryPipeline = functions.https.onCall(async (data, context) => {
  const { crop, district, soilType, growthStage, temp, humidity, imageUrl, pipelineId } = data;

  const id = pipelineId || `pipeline_${Date.now()}`;
  const logsRef = db.collection("advisoryPipelines").doc(id);

  try {
    const agents = [
      "Farmer Interaction Agent",
      "Crop Prediction Agent",
      "Weather Intelligence Agent",
      "Field Operations & IoT Agent",
      "Decision Orchestrator Agent",
      "Explanation & Compliance Agent"
    ];

    const results = {};

    await logsRef.set({
      status: "Running",
      currentAgent: agents[0],
      startTime: admin.firestore.FieldValue.serverTimestamp(),
      userInput: { crop, district, soilType, growthStage, temp, humidity, imageUrl }
    }, { merge: true });

    for (const agent of agents) {
      await logsRef.update({ currentAgent: agent });
      const agentOutput = await callOnDemandAgent(agent, { crop, soilType, temp, district });
      results[agent] = agentOutput;

      await logsRef.collection("agentLogs").doc(agent).set({
        agent,
        output: agentOutput,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    // Invoke Custom Tools
    const weatherScore = results["Weather Intelligence Agent"].weatherScore;
    const riskScore = crop_risk_tool(weatherScore, soilType, 15);
    const shelfLife = shelf_life_tool(temp, humidity, 0);

    const finalAdvice = advisory_formatter_tool({
      crop, risk: riskScore, shelfLife, weather: results["Weather Intelligence Agent"].forecast
    });

    const advisoryResult = {
      yieldExpectation: results["Decision Orchestrator Agent"].optimizedYield,
      priceTrend: results["Decision Orchestrator Agent"].priceTrend,
      riskScore,
      finalAdvice,
      reasoning: results["Explanation & Compliance Agent"].reasoning,
      confidence: results["Explanation & Compliance Agent"].confidence
    };

    await logsRef.update({
      status: "Completed",
      advisory: advisoryResult,
      endTime: admin.firestore.FieldValue.serverTimestamp()
    });

    return advisoryResult;

  } catch (error) {
    console.error("Pipeline Error:", error);
    await logsRef.update({ status: "Failed", error: error.message });
    throw new functions.https.HttpsError("internal", error.message);
  }
});
