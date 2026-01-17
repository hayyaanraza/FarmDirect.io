import React, { useState, useEffect } from 'react';
import {
  Sprout,
  MapPin,
  CloudSun,
  Settings,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Loader2,
  Upload,
  BarChart3,
  HelpCircle
} from 'lucide-react';
import { db, storage, functions } from './firebase';
import { doc, onSnapshot, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { httpsCallable } from 'firebase/functions';

const AGENTS = [
  { name: 'Farmer Interaction Agent', role: 'Chat API input handling' },
  { name: 'Crop Prediction Agent', role: 'ML inference for suitability & risk' },
  { name: 'Weather Intelligence Agent', role: 'Weather API processing' },
  { name: 'Field Operations & IoT Agent', role: 'Irrigation & harvest logic' },
  { name: 'Decision Orchestrator Agent', role: 'Combines agent outputs' },
  { name: 'Explanation & Compliance Agent', role: 'Explains reasoning & confidence' }
];

function App() {
  const [formData, setFormData] = useState({
    crop: 'Tomato',
    district: 'Nashik',
    soilType: 'Loamy',
    growthStage: 'Vegetative',
    temp: 28,
    humidity: 65
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentAgentName, setCurrentAgentName] = useState('');
  const [completedAgents, setCompletedAgents] = useState([]);
  const [results, setResults] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [pipelineId, setPipelineId] = useState(null);

  useEffect(() => {
    if (!pipelineId) return;
    const unsub = onSnapshot(doc(db, "advisoryPipelines", pipelineId), (doc) => {
      const data = doc.data();
      if (!data) return;
      if (data.currentAgent) setCurrentAgentName(data.currentAgent);
      if (data.status === 'Completed') {
        setResults({
          yield: data.advisory.yieldExpectation,
          priceTrend: data.advisory.priceTrend,
          riskScore: data.advisory.riskScore,
          recommendation: data.advisory.finalAdvice,
          why: data.advisory.reasoning
        });
        setIsRunning(false);
        setCompletedAgents(AGENTS.map(a => a.name));
        setCurrentAgentName('');
      }
    });
    return () => unsub();
  }, [pipelineId]);

  useEffect(() => {
    if (!pipelineId) return;
    const unsub = onSnapshot(collection(db, "advisoryPipelines", pipelineId, "agentLogs"), (snapshot) => {
      const completed = snapshot.docs.map(doc => doc.data().agent);
      setCompletedAgents(completed);
    });
    return () => unsub();
  }, [pipelineId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const runPipeline = async () => {
    setIsRunning(true);
    setResults(null);
    setCompletedAgents([]);
    const id = `pipeline_${Date.now()}`;
    setPipelineId(id);
    setCurrentAgentName(AGENTS[0].name);

    try {
      let imageUrl = null;
      if (image) {
        const storageRef = ref(storage, `crops/${Date.now()}_${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }
      const runAdvisoryPipeline = httpsCallable(functions, 'runAdvisoryPipeline');
      await runAdvisoryPipeline({ ...formData, imageUrl, pipelineId: id });
    } catch (error) {
      console.error("Error:", error);
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2 rounded-lg shadow-lg shadow-emerald-100">
            <Sprout className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">AgriCoPilot</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Decision Intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg border border-slate-200">
            PROTOTYPE-v1.1
          </span>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT PANEL */}
        <div className="lg:col-span-3">
          <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Settings className="w-3.5 h-3.5" /> Farmer Input
            </h2>
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Crop Name</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none" value={formData.crop} onChange={(e)=>setFormData({...formData, crop: e.target.value})}>
                  <option>Tomato</option><option>Wheat</option><option>Cotton</option><option>Rice</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">District</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none" value={formData.district} onChange={(e)=>setFormData({...formData, district: e.target.value})}>
                  <option>Nashik</option><option>Pune</option><option>Nagpur</option><option>Satara</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Soil Type</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none" value={formData.soilType} onChange={(e)=>setFormData({...formData, soilType: e.target.value})}>
                  <option>Loamy</option><option>Clayey</option><option>Sandy</option><option>Black Soil</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-2">Growth Stage</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Seedling', 'Vegetative', 'Flowering', 'Fruiting'].map(stage => (
                    <button key={stage} onClick={() => setFormData({...formData, growthStage: stage})} className={`px-3 py-2 text-[10px] font-bold rounded-xl border transition-all ${formData.growthStage === stage ? 'bg-slate-800 border-slate-800 text-white shadow-sm' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'}`}>{stage}</button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Temp (°C)</label>
                  <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold" value={formData.temp} onChange={(e)=>setFormData({...formData, temp: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Humidity (%)</label>
                  <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold" value={formData.humidity} onChange={(e)=>setFormData({...formData, humidity: e.target.value})} />
                </div>
              </div>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center cursor-pointer bg-slate-50/50 hover:border-emerald-400 transition-colors" onClick={() => document.getElementById('imageUpload').click()}>
                {imagePreview ? <img src={imagePreview} className="w-full h-32 object-cover rounded-xl shadow-sm" /> : <div className="py-4"><Upload className="w-5 h-5 text-slate-400 mx-auto mb-2" /><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upload Crop Photo</p></div>}
                <input id="imageUpload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </div>
              <button onClick={runPipeline} disabled={isRunning} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-3 disabled:opacity-50">
                {isRunning ? <><Loader2 className="w-5 h-5 animate-spin" /><span>Analyzing...</span></> : <><TrendingUp className="w-5 h-5" /><span>Run Advisory Pipeline</span></>}
              </button>
            </div>
          </section>
        </div>

        {/* CENTER PANEL */}
        <div className="lg:col-span-4">
          <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 h-full">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-10 flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5" /> Agent Orchestration
            </h2>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-100"></div>
              <div className="space-y-6">
                {AGENTS.map((agent, index) => {
                  const isCompleted = completedAgents.includes(agent.name);
                  const isCurrent = currentAgentName === agent.name;
                  const status = isCompleted ? 'completed' : isCurrent ? 'running' : 'pending';
                  return (
                    <div key={agent.name} className="relative pl-14 group">
                      <div className={`absolute left-3 -translate-x-1/2 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center z-10 transition-all duration-500 ${status === 'completed' ? 'bg-emerald-500 shadow-md' : status === 'running' ? 'bg-blue-600 shadow-lg scale-110' : 'bg-slate-100'}`}>
                        {status === 'completed' && <CheckCircle2 className="w-4 h-4 text-white" />}
                        {status === 'running' && <Loader2 className="w-4 h-4 text-white animate-spin" />}
                        {status === 'pending' && <Clock className="w-3 h-3 text-slate-300" />}
                      </div>
                      <div className={`p-4 rounded-2xl border transition-all ${status === 'running' ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-50'} ${status === 'pending' ? 'opacity-40 grayscale' : 'opacity-100'}`}>
                        <h3 className="text-sm font-bold text-slate-800">{agent.name}</h3>
                        <p className="text-[10px] text-slate-400 uppercase font-bold mt-1 tracking-wider">{agent.role}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-5 space-y-6">
          {!results && !isRunning && (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-slate-200 border-dashed">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mb-6"><HelpCircle className="w-10 h-10 text-slate-200" /></div>
              <h3 className="text-slate-800 font-bold text-lg">Awaiting Intelligence</h3>
              <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto leading-relaxed">Configure farm parameters and trigger the multi-agent pipeline.</p>
            </div>
          )}
          {isRunning && !results && (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-slate-200 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-50"><div className="h-full bg-emerald-500 animate-[loading_2s_ease-in-out_infinite]"></div></div>
              <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-6"></div>
              <h3 className="text-slate-800 font-bold text-xl">Synthesizing...</h3>
              <p className="text-slate-400 text-sm mt-2 italic font-medium animate-pulse">Agent "{currentAgentName}" is processing.</p>
            </div>
          )}
          {results && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-700">
              <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden">
                <Sprout className="absolute -right-8 -top-8 w-32 h-32 opacity-10" />
                <div className="relative z-10">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-4">Validated Recommendation</span>
                  <h3 className="text-2xl font-bold mb-6 italic leading-snug">"{results.recommendation}"</h3>
                  <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-800">
                    <div><p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Yield Projection</p><p className="text-xl font-bold">{results.yield}</p></div>
                    <div><p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Market Trend</p><p className="text-xl font-bold text-emerald-400">{results.priceTrend}</p></div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-4 flex items-center gap-2"><AlertTriangle className="w-3.5 h-3.5" /> Risk Score</span>
                  <div className="w-full bg-slate-100 h-2 rounded-full mb-3"><div className={`h-full rounded-full transition-all duration-1000 ${results.riskScore < 30 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{width: `${results.riskScore}%`}}></div></div>
                  <p className="text-sm font-black text-slate-800">{results.riskScore}/100</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm cursor-pointer hover:border-emerald-200 transition-all flex items-center justify-between group" onClick={()=>setShowExplanation(!showExplanation)}>
                  <div><span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Reasoning</span><p className="text-sm font-bold text-slate-800">View Logic</p></div>
                  <div className={`p-2 rounded-xl bg-slate-50 group-hover:bg-emerald-50 transition-colors ${showExplanation ? 'rotate-180' : ''}`}><ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" /></div>
                </div>
              </div>
              {showExplanation && (
                <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100 animate-in slide-in-from-top-4 duration-500">
                  <h4 className="text-[10px] font-bold text-emerald-800 uppercase mb-2 tracking-widest">Orchestration Analysis</h4>
                  <p className="text-sm font-medium text-emerald-900 leading-relaxed italic">{results.why}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <style>{`
        @keyframes loading {
          0% { width: 0%; left: 0%; }
          50% { width: 100%; left: 0%; }
          100% { width: 0%; left: 100%; }
        }
      `}</style>
    </div>
  );
}

export default App;
