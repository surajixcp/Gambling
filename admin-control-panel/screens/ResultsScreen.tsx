import React, { useState, useEffect, useRef } from 'react';
import {
  Send, History, AlertCircle, CheckCircle,
  Trash2, RefreshCw, Trophy, ShieldAlert
} from 'lucide-react';
import { DeclaredResult } from '../types';

const ResultsScreen: React.FC<{ history: DeclaredResult[], setHistory: React.Dispatch<React.SetStateAction<DeclaredResult[]>> }> = ({ history, setHistory }) => {
  const [selectedGame, setSelectedGame] = useState('Kalyan Starline');
  const [session, setSession] = useState<'Open' | 'Close'>('Open');
  const [panna, setPanna] = useState(['', '', '']);
  const [single, setSingle] = useState('');
  const [isDeclaring, setIsDeclaring] = useState(false);
  const [declareSuccess, setDeclareSuccess] = useState(false);

  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  useEffect(() => {
    if (panna.every(d => d !== '')) {
      const sum = panna.reduce((acc, curr) => acc + parseInt(curr || '0'), 0);
      setSingle((sum % 10).toString());
    } else {
      setSingle('');
    }
  }, [panna]);

  const handlePannaChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    if (value !== '' && !/^\d$/.test(value)) return;
    const newPanna = [...panna];
    newPanna[index] = value;
    setPanna(newPanna);
    if (value !== '' && index < 2) inputRefs[index + 1].current?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && panna[index] === '' && index > 0) inputRefs[index - 1].current?.focus();
  };

  const handleDeclare = (e: React.FormEvent) => {
    e.preventDefault();
    if (panna.some(d => d === '')) return;
    setIsDeclaring(true);
    setTimeout(() => {
      const newResult: DeclaredResult = {
        id: Math.random().toString(36).substr(2, 9),
        game: selectedGame,
        session: session,
        panna: panna.join(''),
        single: single,
        declaredBy: 'Super Admin',
        timestamp: 'Just Now'
      };
      setHistory([newResult, ...history]);
      setIsDeclaring(false);
      setDeclareSuccess(true);
      setTimeout(() => {
        setDeclareSuccess(false);
        setPanna(['', '', '']);
        setSingle('');
        inputRefs[0].current?.focus();
      }, 2000);
    }, 1200);
  };

  const handleRevoke = (id: string) => {
    if (confirm("CRITICAL: Revoking a result triggers balance reversals. Continue?")) {
      setHistory(prev => prev.filter(h => h.id !== id));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-600/10 text-indigo-600 rounded-xl flex items-center justify-center"><Trophy size={20} /></div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Declare Result</h3>
              <p className="text-xs text-slate-500 font-medium">Broadcast results to all users</p>
            </div>
          </div>
          <form onSubmit={handleDeclare} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Select Market</label>
              <select value={selectedGame} onChange={(e) => setSelectedGame(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-indigo-500/20 transition-all">
                <option>Kalyan Starline</option><option>Milan Day</option><option>Rajdhani Night</option><option>Supreme Morning</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Session</label>
              <div className="grid grid-cols-2 gap-3">
                {(['Open', 'Close'] as const).map(s => (
                  <button key={s} type="button" onClick={() => setSession(s)} className={`py-2 rounded-xl text-xs font-bold transition-all ${session === s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>{s}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2">Winning Combination</label>
              <div className="flex items-center gap-3">
                <div className="flex gap-2 flex-1">
                  {panna.map((digit, i) => (
                    <input key={i} ref={inputRefs[i]} type="text" inputMode="numeric" value={digit} onChange={(e) => handlePannaChange(i, e.target.value)} onKeyDown={(e) => handleKeyDown(i, e)} className="w-full aspect-square bg-slate-50 border border-slate-200 rounded-xl text-center font-bold text-xl text-slate-900 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-300" placeholder="0" />
                  ))}
                </div>
                <div className="text-xl font-bold text-slate-300">-</div>
                <div className="w-14 aspect-square bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center font-black text-2xl text-indigo-600 shadow-inner">{single || '-'}</div>
              </div>
            </div>
            <button type="submit" disabled={panna.some(d => d === '') || isDeclaring || declareSuccess} className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wide transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg disabled:opacity-70 disabled:active:scale-100 ${declareSuccess ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-indigo-600 text-white shadow-indigo-600/20 hover:bg-indigo-500'}`}>
              {isDeclaring ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : declareSuccess ? <CheckCircle size={16} /> : <Send size={16} />}
              <span>{isDeclaring ? 'Processing...' : declareSuccess ? 'Result Declared' : 'Publish Result'}</span>
            </button>
          </form>
        </div>
      </div>
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-slate-100 text-slate-500 rounded-lg"><History size={16} /></div>
              <h3 className="text-sm font-bold text-slate-900">Result History</h3>
            </div>
            <button onClick={() => window.location.reload()} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><RefreshCw size={16} /></button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-semibold border-b border-slate-100">
                  <th className="px-6 py-3">Market Details</th>
                  <th className="px-6 py-3">Result</th>
                  <th className="px-6 py-3">Time</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 group transition-colors">
                    <td className="px-6 py-3.5">
                      <p className="font-bold text-slate-800">{item.game}</p>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mt-0.5">{item.session}</p>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2 font-mono">
                        <span className="font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-xs">{item.panna}</span>
                        <span className="text-slate-300">-</span>
                        <span className="font-black text-indigo-600 text-lg">{item.single}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <p className="text-xs font-medium text-slate-400">{item.timestamp}</p>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button onClick={() => handleRevoke(item.id)} className="p-2 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;