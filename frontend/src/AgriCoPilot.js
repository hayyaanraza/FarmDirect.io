import React, { useState } from 'react';

const AgriCoPilot = () => {
  const [formData, setFormData] = useState({
    crop: '',
    district: '',
    soilType: '',
    growthStage: '',
    temperature: '',
    humidity: '',
    image: null
  });

  const [agents, setAgents] = useState([
    { id: 1, name: 'Farmer Interaction Agent', role: 'Chat API input handling', status: 'pending' },
    { id: 2, name: 'Crop Prediction Agent', role: 'ML inference for crop suitability & risk', status: 'pending' },
    { id: 3, name: 'Weather Intelligence Agent', role: 'Weather API processing', status: 'pending' },
    { id: 4, name: 'Field Operations & IoT Agent', role: 'Irrigation, harvest & post-harvest logic', status: 'pending' },
    { id: 5, name: 'Decision Orchestrator Agent', role: 'Combines agent outputs', status: 'pending' },
    { id: 6, name: 'Explanation & Compliance Agent', role: 'Explains reasoning & confidence', status: 'pending' }
  ]);

  const [advisory, setAdvisory] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const crops = ['Rice', 'Wheat', 'Corn', 'Cotton', 'Sugarcane', 'Soybean', 'Potato'];
  const districts = ['North District', 'South District', 'East District', 'West District', 'Central District'];
  const soilTypes = ['Clay', 'Sandy', 'Loamy', 'Silt', 'Peaty', 'Chalky'];
  const growthStages = ['Germination', 'Vegetative', 'Flowering', 'Fruiting', 'Ripening'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const runAdvisoryPipeline = async () => {
    setIsRunning(true);
    setAdvisory(null);
    setShowExplanation(false);

    // Simulate sequential agent execution
    for (let i = 0; i < agents.length; i++) {
      setAgents(prev => prev.map((agent, idx) => 
        idx === i ? { ...agent, status: 'running' } : agent
      ));

      // Simulate agent processing time
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

      setAgents(prev => prev.map((agent, idx) => 
        idx === i ? { ...agent, status: 'completed' } : agent
      ));
    }

    // Simulate advisory generation
    const mockAdvisory = {
      yieldExpectation: `${(Math.random() * 5 + 3).toFixed(1)} tons/hectare`,
      priceTrend: `₹${(Math.random() * 5000 + 15000).toFixed(0)}/quintal (${Math.random() > 0.5 ? 'Rising' : 'Stable'})`,
      riskScore: Math.floor(Math.random() * 40 + 20),
      recommendation: `Based on current conditions, ${formData.crop || 'your crop'} shows good potential. Monitor irrigation levels and watch for pest activity. Expected harvest in ${Math.floor(Math.random() * 30 + 60)} days.`,
      explanation: `This decision is based on multiple factors: Weather Intelligence Agent detected favorable conditions with ${formData.temperature || 25}°C temperature. Crop Prediction Agent analyzed soil type (${formData.soilType || 'Loamy'}) compatibility. Field Operations Agent recommends irrigation every 3-4 days. Decision Orchestrator combined these inputs with price trends to optimize yield vs. market conditions.`
    };

    setAdvisory(mockAdvisory);
    setIsRunning(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'running': return 'bg-blue-500 animate-pulse';
      case 'pending': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  const getRiskColor = (score) => {
    if (score < 30) return 'text-green-600';
    if (score < 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-green-700">🌾 AgriCoPilot</h1>
          <p className="text-gray-600 mt-2">AI-Powered Multi-Agent Decision Intelligence for Farmers</p>
        </div>
      </header>

      {/* Main Dashboard */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT PANEL - Farmer Input */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📝 Farmer Input</h2>
            
            <div className="space-y-4">
              {/* Crop Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Crop Name</label>
                <select
                  name="crop"
                  value={formData.crop}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select Crop</option>
                  {crops.map(crop => <option key={crop} value={crop}>{crop}</option>)}
                </select>
              </div>

              {/* District Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">District</label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select District</option>
                  {districts.map(district => <option key={district} value={district}>{district}</option>)}
                </select>
              </div>

              {/* Soil Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Soil Type</label>
                <select
                  name="soilType"
                  value={formData.soilType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select Soil Type</option>
                  {soilTypes.map(soil => <option key={soil} value={soil}>{soil}</option>)}
                </select>
              </div>

              {/* Growth Stage */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Growth Stage</label>
                <div className="space-y-2">
                  {growthStages.map(stage => (
                    <label key={stage} className="flex items-center">
                      <input
                        type="radio"
                        name="growthStage"
                        value={stage}
                        checked={formData.growthStage === stage}
                        onChange={handleInputChange}
                        className="mr-2 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">{stage}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Temperature */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Temperature (°C)</label>
                <input
                  type="number"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleInputChange}
                  placeholder="e.g., 25"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Humidity */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Humidity (%)</label>
                <input
                  type="number"
                  name="humidity"
                  value={formData.humidity}
                  onChange={handleInputChange}
                  placeholder="e.g., 65"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Crop Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                {formData.image && (
                  <p className="mt-2 text-xs text-green-600">✓ {formData.image.name}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={runAdvisoryPipeline}
                disabled={isRunning || !formData.crop}
                className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors mt-6"
              >
                {isRunning ? '🔄 Running Pipeline...' : '▶️ Run Advisory Pipeline'}
              </button>
            </div>
          </div>

          {/* CENTER PANEL - AI Agent Execution */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">🤖 AI Agent Execution</h2>
            
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              <div className="space-y-6">
                {agents.map((agent, idx) => (
                  <div key={agent.id} className="relative pl-12">
                    {/* Status Circle */}
                    <div className={`absolute left-0 top-1 w-8 h-8 rounded-full ${getStatusColor(agent.status)} flex items-center justify-center text-white font-bold text-sm border-4 border-white`}>
                      {agent.status === 'completed' ? '✓' : idx + 1}
                    </div>
                    
                    {/* Agent Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-bold text-gray-800 text-sm">{agent.name}</h3>
                      <p className="text-xs text-gray-600 mt-1">{agent.role}</p>
                      <div className="mt-2">
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                          agent.status === 'completed' ? 'bg-green-100 text-green-700' :
                          agent.status === 'running' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {agent.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL - Advisory Output */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Advisory Output</h2>
            
            {!advisory && !isRunning && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🌱</div>
                <p className="text-gray-500">Run the advisory pipeline to see results</p>
              </div>
            )}

            {isRunning && (
              <div className="text-center py-12">
                <div className="animate-spin text-6xl mb-4">⚙️</div>
                <p className="text-gray-600 font-semibold">Analyzing data...</p>
              </div>
            )}

            {advisory && (
              <div className="space-y-6">
                {/* Yield Expectation */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 text-sm mb-2">🌾 Yield Expectation</h3>
                  <p className="text-2xl font-bold text-green-900">{advisory.yieldExpectation}</p>
                </div>

                {/* Price Trend */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 text-sm mb-2">💰 Price Trend</h3>
                  <p className="text-lg font-bold text-blue-900">{advisory.priceTrend}</p>
                </div>

                {/* Risk Score */}
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 text-sm mb-2">⚠️ Risk Score</h3>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-4 mr-4">
                      <div 
                        className={`h-4 rounded-full ${advisory.riskScore < 30 ? 'bg-green-500' : advisory.riskScore < 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${advisory.riskScore}%` }}
                      ></div>
                    </div>
                    <span className={`text-2xl font-bold ${getRiskColor(advisory.riskScore)}`}>
                      {advisory.riskScore}
                    </span>
                  </div>
                </div>

                {/* Final Recommendation */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-800 text-sm mb-2">💡 Final Recommendation</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{advisory.recommendation}</p>
                </div>

                {/* Expandable Explanation */}
                <div className="border-t pt-4">
                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="w-full text-left flex items-center justify-between text-gray-700 font-semibold hover:text-green-600 transition-colors"
                  >
                    <span>🔍 Why this decision?</span>
                    <span className="text-2xl">{showExplanation ? '−' : '+'}</span>
                  </button>
                  
                  {showExplanation && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700 leading-relaxed">{advisory.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white shadow-md mt-12">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-gray-600 text-sm">
          <p>AgriCoPilot - Multi-Agent AI Decision Intelligence Platform | Powered by OnDemand Agents & Firebase</p>
        </div>
      </footer>
    </div>
  );
};

export default AgriCoPilot;
