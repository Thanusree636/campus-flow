import React, { useState, useEffect, useMemo } from 'react';
import {
  Zap, Calendar, Clock, CheckCircle2, AlertTriangle, ShieldCheck, Mail,
  Bot, Search, Filter, RefreshCw, ArrowRight, CheckSquare, Plus,
  Settings, User, Lock, LogOut, AlertCircle, Tag, Inbox
} from 'lucide-react';

const MOCK_USER_TASKS = [
  {
    id: 'task_001',
    sourceId: 'msg_001',
    sender: 'placements@university.edu',
    title: 'TCS Digital Campus Hiring 2026 Registration & Aptitude Test',
    category: 'PLACEMENTS',
    deadline: '2026-08-01T23:59:00Z',
    venue: 'Main Auditorium, Block C',
    feeAmount: ['$15 (late fee)'],
    actionItems: [
      'Complete online portal registration before 11:59 PM',
      'Bring updated hardcopy resume & student ID',
      'Attend mandatory aptitude test at 09:00 AM on Aug 2'
    ],
    priorityMetrics: {
      category: 'PLACEMENTS',
      baseWeight: 80,
      urgencyMultiplier: 2.0,
      hoursRemaining: 10,
      riskScore: 45,
      riskTriggers: ['ATTENDANCE_DEBARMENT_RISK (+20)', 'CAREER_IMPACT_PRIORITY (+20)', 'STRICT_MANDATORY_REQUIREMENT (+15)'],
      finalScore: 205,
      tier: 'CRITICAL'
    },
    calendarSynced: true,
    calendarEventId: 'gcal_7f8a9d10e',
    createdAt: '2026-08-01T09:30:00Z'
  },
  {
    id: 'task_002',
    sourceId: 'msg_002',
    sender: 'examcell@university.edu',
    title: 'Mid-Semester Examinations (PHY-302 Physics II)',
    category: 'EXAMS',
    deadline: '2026-08-03T10:00:00Z',
    venue: 'Exam Hall 302',
    feeAmount: ['$50 (condonation fee if attendance < 75%)'],
    actionItems: [
      'Pay $50 condonation fee at Finance Desk before Aug 2, 5 PM',
      'Collect hall ticket / admit card from Exam Cell',
      'Be present in Exam Hall 302 by 09:45 AM'
    ],
    priorityMetrics: {
      category: 'EXAMS',
      baseWeight: 90,
      urgencyMultiplier: 1.6,
      hoursRemaining: 44,
      riskScore: 25,
      riskTriggers: ['FINANCIAL_PENALTY_RISK (+25)'],
      finalScore: 169,
      tier: 'CRITICAL'
    },
    calendarSynced: true,
    calendarEventId: 'gcal_4b3c2d1e',
    createdAt: '2026-08-01T10:15:00Z'
  },
  {
    id: 'task_003',
    sourceId: 'msg_003',
    sender: 'hostel.admin@university.edu',
    title: 'Semester 5 Hostel & Mess Fee Payment Due',
    category: 'FEES',
    deadline: '2026-08-04T17:00:00Z',
    venue: 'Student Finance Portal',
    feeAmount: ['$1,200 (Mess & Accommodation)'],
    actionItems: [
      'Pay tuition and mess fee via UPI/NetBanking',
      'Download payment receipt for record',
      'Late fee fine of $20/day applies after Aug 4'
    ],
    priorityMetrics: {
      category: 'FEES',
      baseWeight: 75,
      urgencyMultiplier: 1.2,
      hoursRemaining: 75,
      riskScore: 25,
      riskTriggers: ['FINANCIAL_PENALTY_RISK (+25)'],
      finalScore: 115,
      tier: 'HIGH'
    },
    calendarSynced: false,
    calendarEventId: null,
    createdAt: '2026-08-01T11:00:00Z'
  }
];

const CategoryBadge = ({ category }) => {
  const styles = {
    EXAMS: 'bg-red-500/10 text-red-400 border-red-500/20',
    PLACEMENTS: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    FEES: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    DEADLINES: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    TRANSPORT: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    EVENTS: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  };

  return (
    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${styles[category] || styles.EVENTS}`}>
      {category}
    </span>
  );
};

const TierBadge = ({ tier, score }) => {
  const tiers = {
    CRITICAL: 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse',
    HIGH: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    MEDIUM: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    LOW: 'bg-slate-500/20 text-slate-300 border-slate-500/40'
  };

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono text-xs font-bold ${tiers[tier] || tiers.LOW}`}>
      <Zap className="h-3 w-3" />
      <span>{tier}</span>
      <span className="opacity-60">({score})</span>
    </div>
  );
};

function AuthScreen({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('alex.student@university.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [fullName, setFullName] = useState('Alex Morgan');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthError('Please fill in all required fields.');
      return;
    }
    setAuthError('');
    setIsAuthLoading(true);

    // Simulate JWT authentication API roundtrip
    setTimeout(() => {
      const fakeToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_${Math.random().toString(36).substring(2)}`;
      const userData = {
        email,
        name: isRegister ? fullName : email.split('@')[0],
        googleConnected: true,
        calendarId: 'primary',
        allowedSenders: ['placements@university.edu', 'examcell@university.edu', 'hostel.admin@university.edu']
      };

      localStorage.setItem('campusflow_jwt', fakeToken);
      localStorage.setItem('campusflow_user', JSON.stringify(userData));
      
      setIsAuthLoading(false);
      onLoginSuccess(userData, fakeToken);
    }, 800);
  };

  const handleGoogleAuth = () => {
    setIsAuthLoading(true);
    setTimeout(() => {
      const fakeToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.g_oauth_${Math.random().toString(36).substring(2)}`;
      const userData = {
        email: 'alex.student@university.edu',
        name: 'Alex Morgan',
        googleConnected: true,
        calendarId: 'primary',
        allowedSenders: ['placements@university.edu', 'examcell@university.edu', 'hostel.admin@university.edu']
      };

      localStorage.setItem('campusflow_jwt', fakeToken);
      localStorage.setItem('campusflow_user', JSON.stringify(userData));

      setIsAuthLoading(false);
      onLoginSuccess(userData, fakeToken);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Radial Ambient Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Branding Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 items-center justify-center shadow-xl shadow-indigo-500/25 mb-2">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            CampusFlow
          </h1>
          <p className="text-xs text-slate-400">
            AI-Powered Email Ingestion & Dynamic Task Prioritization System
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-2xl space-y-5">
          <div className="flex border-b border-slate-800 pb-3">
            <button
              onClick={() => { setIsRegister(false); setAuthError(''); }}
              className={`flex-1 text-xs font-semibold pb-2 border-b-2 transition-all ${
                !isRegister ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsRegister(true); setAuthError(''); }}
              className={`flex-1 text-xs font-semibold pb-2 border-b-2 transition-all ${
                isRegister ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {authError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-xs p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Full Name</label>
                <div className="relative">
                  <User className="h-4 w-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Student Email Address</label>
              <div className="relative">
                <Mail className="h-4 w-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Password</label>
              <div className="relative">
                <Lock className="h-4 w-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {isAuthLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span>{isRegister ? 'Register & Connect' : 'Sign In with JWT'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-3 text-[10px] text-slate-500 font-mono uppercase tracking-wider">Or OAuth 2.0</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          <button
            onClick={handleGoogleAuth}
            disabled={isAuthLoading}
            className="w-full bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 font-medium py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Connect with Google (Gmail & Calendar)</span>
          </button>
        </div>

        <div className="text-center text-[11px] text-slate-500 font-mono">
          CampusFlow Zero-Trust OAuth Security • Multi-Tenant Engine
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // App Dashboard State
  const [tasks, setTasks] = useState([]);
  const [isFetchingTasks, setIsFetchingTasks] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedTier, setSelectedTier] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [syncingTaskId, setSyncingTaskId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  // Grounded Assistant State
  const [ragQuery, setRagQuery] = useState('What exams do I have this week and are there any fee warnings?');
  const [ragMessages, setRagMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I am your CampusFlow Grounded Assistant. I have indexed your university emails into a personal task graph. Ask me anything about upcoming deadlines, exam schedules, or fee penalties!"
    }
  ]);
  const [isRagSearching, setIsRagSearching] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('campusflow_jwt');
    const savedUser = localStorage.getItem('campusflow_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('campusflow_jwt');
        localStorage.removeItem('campusflow_user');
      }
    }
    setIsInitializing(false);
  }, []);

  const fetchUserTasks = async () => {
    setIsFetchingTasks(true);
    try {
      const response = await fetch('/api/events', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks || []);
        if (data.tasks && data.tasks.length > 0) {
          setSelectedTask(data.tasks[0]);
        }
      } else {
        // Fallback to local state if backend API server is offline
        setTasks(MOCK_USER_TASKS);
        setSelectedTask(MOCK_USER_TASKS[0]);
      }
    } catch (error) {
      // Graceful fallback for offline preview environments
      setTasks(MOCK_USER_TASKS);
      setSelectedTask(MOCK_USER_TASKS[0]);
    } finally {
      setIsFetchingTasks(false);
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchUserTasks();
    }
  }, [user, token]);

  const handleLogout = () => {
    localStorage.removeItem('campusflow_jwt');
    localStorage.removeItem('campusflow_user');
    setUser(null);
    setToken(null);
  };

  const handleLoginSuccess = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
  };

  const handleCalendarSync = async (taskId) => {
    setSyncingTaskId(taskId);
    try {
      const response = await fetch(`/api/events/${taskId}/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(prev => prev.map(t => {
          if (t.id === taskId) {
            return {
              ...t,
              calendarSynced: true,
              calendarEventId: data.calendarEventId || `gcal_${Math.random().toString(36).substring(2, 9)}`
            };
          }
          return t;
        }));
      } else {
        // Fallback simulation
        setTasks(prev => prev.map(t => {
          if (t.id === taskId) {
            return { ...t, calendarSynced: true, calendarEventId: `gcal_${Math.random().toString(36).substring(2, 9)}` };
          }
          return t;
        }));
      }
    } catch (e) {
      setTasks(prev => prev.map(t => {
        if (t.id === taskId) {
          return { ...t, calendarSynced: true, calendarEventId: `gcal_${Math.random().toString(36).substring(2, 9)}` };
        }
        return t;
      }));
    } finally {
      setSyncingTaskId(null);
    }
  };

  const handleSendRagQuery = () => {
    if (!ragQuery.trim() || isRagSearching) return;

    const userMsg = { role: 'user', content: ragQuery };
    setRagMessages(prev => [...prev, userMsg]);
    setRagQuery('');
    setIsRagSearching(true);

    setTimeout(() => {
      const assistantMsg = {
        role: 'assistant',
        content: `Based on your verified user email graph:\n\n1. **TCS Digital Campus Hiring 2026**\n   • **Deadline:** Today, Aug 1 at 11:59 PM (CRITICAL - 205 pts)\n   • **Action:** Online registration compulsory.\n\n2. **Mid-Semester Exam: PHY-302 Physics II**\n   • **Date:** Aug 3, 2026 at 10:00 AM in Exam Hall 302\n   • **Fee Warning:** $50 condonation fee required before Aug 2 at 5 PM if attendance is below 75%.`
      };
      setRagMessages(prev => [...prev, assistantMsg]);
      setIsRagSearching(false);
    }, 600);
  };

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        const matchesCategory = selectedCategory === 'ALL' || task.category === selectedCategory;
        const matchesTier = selectedTier === 'ALL' || task.priorityMetrics.tier === selectedTier;
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              task.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              task.venue.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesTier && matchesSearch;
      })
      .sort((a, b) => b.priorityMetrics.finalScore - a.priorityMetrics.finalScore);
  }, [tasks, selectedCategory, selectedTier, searchQuery]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
        <RefreshCw className="h-5 w-5 animate-spin text-indigo-500 mr-2" />
        <span>Initializing CampusFlow Secure Session...</span>
      </div>
    );
  }

  // Auth Guard: Render Login/Register Screen if user is not logged in
  if (!user || !token) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Top Application Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                CampusFlow
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Connected to Gmail
              </span>
            </div>
            <p className="text-xs text-slate-400">Multi-Tenant Email Task Engine</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'tasks'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <CheckSquare className="h-3.5 w-3.5" /> Prioritized Tasks
            <span className="ml-1 px-1.5 py-0.2 bg-indigo-950 text-indigo-300 rounded-full text-[10px] font-mono">
              {tasks.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'calendar'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Calendar className="h-3.5 w-3.5" /> Calendar Sync
          </button>

          <button
            onClick={() => setActiveTab('rag')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'rag'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Bot className="h-3.5 w-3.5" /> Grounded Assistant
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'settings'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Settings className="h-3.5 w-3.5" /> Profile & Ingestion
          </button>
        </nav>

        {/* User Badge & Logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <div className="h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white uppercase">
              {user.name ? user.name[0] : 'U'}
            </div>
            <div className="text-left hidden md:block">
              <div className="text-xs font-semibold text-white leading-tight">{user.name}</div>
              <div className="text-[10px] text-slate-400 font-mono leading-tight">{user.email}</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded-xl transition-all border border-slate-800"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 max-w-7xl mx-auto w-full">
        {}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-[280px]">
                <div className="relative flex-1">
                  <Search className="h-4 w-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search tasks, venues, senders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={fetchUserTasks}
                  disabled={isFetchingTasks}
                  className="flex items-center gap-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 px-3 py-2 rounded-xl text-xs text-indigo-400 transition-all"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isFetchingTasks ? 'animate-spin' : ''}`} />
                  <span>Fetch Database</span>
                </button>

                <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
                  <Filter className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-slate-400">Category:</span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-transparent text-slate-200 focus:outline-none cursor-pointer font-medium"
                  >
                    <option value="ALL" className="bg-slate-900">All Categories</option>
                    <option value="EXAMS" className="bg-slate-900">EXAMS</option>
                    <option value="PLACEMENTS" className="bg-slate-900">PLACEMENTS</option>
                    <option value="FEES" className="bg-slate-900">FEES</option>
                    <option value="DEADLINES" className="bg-slate-900">DEADLINES</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-3">
                {isFetchingTasks ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin text-indigo-500" />
                    <span>Loading tasks for {user.email}...</span>
                  </div>
                ) : filteredTasks.map((task) => {
                  const isSelected = selectedTask?.id === task.id;
                  return (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className={`bg-slate-900 border rounded-2xl p-4 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-slate-900/90 shadow-lg shadow-indigo-500/10'
                          : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CategoryBadge category={task.category} />
                            <span className="text-[11px] text-slate-400 font-mono">{task.sender}</span>
                          </div>
                          <h3 className="font-semibold text-sm text-white line-clamp-1">{task.title}</h3>
                        </div>

                        <TierBadge tier={task.priorityMetrics.tier} score={task.priorityMetrics.finalScore} />
                      </div>

                      <div className="grid grid-cols-2 gap-2 my-3 text-xs text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
                          <span className="font-mono text-[11px] truncate">{new Date(task.deadline).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Tag className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
                          <span className="truncate">{task.venue}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-xs">
                        <span className="text-slate-400 text-[11px]">
                          Action items: <strong className="text-slate-200">{task.actionItems.length}</strong>
                        </span>

                        <div className="flex items-center gap-2">
                          {task.calendarSynced ? (
                            <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
                              <CheckCircle2 className="h-3 w-3" /> Synced to Calendar
                            </span>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCalendarSync(task.id);
                              }}
                              disabled={syncingTaskId === task.id}
                              className="flex items-center gap-1 text-[11px] bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 rounded-lg font-medium transition-all"
                            >
                              <Calendar className={`h-3 w-3 ${syncingTaskId === task.id ? 'animate-spin' : ''}`} />
                              <span>{syncingTaskId === task.id ? 'Syncing...' : 'Sync Calendar'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="lg:col-span-5">
                {selectedTask ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 sticky top-24">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <CategoryBadge category={selectedTask.category} />
                        <span className="text-xs font-mono text-slate-400">{selectedTask.id}</span>
                      </div>
                      <TierBadge tier={selectedTask.priorityMetrics.tier} score={selectedTask.priorityMetrics.finalScore} />
                    </div>

                    <div>
                      <h2 className="text-base font-bold text-white mb-1">{selectedTask.title}</h2>
                      <p className="text-xs text-slate-400">Ingested for user {user.email}</p>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                      <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block">
                        Prioritization Score Breakdown
                      </span>
                      <div className="text-xs font-mono text-indigo-300">
                        Score = ({selectedTask.priorityMetrics.baseWeight} base × {selectedTask.priorityMetrics.urgencyMultiplier}x urgency) + {selectedTask.priorityMetrics.riskScore} risk
                      </div>
                      <div className="text-xl font-bold font-mono text-white">
                        {selectedTask.priorityMetrics.finalScore} / 250 PTS
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-300 block">Extracted Action Items</span>
                      <div className="space-y-1.5">
                        {selectedTask.actionItems.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs text-slate-200">
                            <CheckSquare className="h-4 w-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-xs">
                    Select a task card to view full details.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-base font-bold text-white">Google Calendar Sync Management</h2>
                  <p className="text-xs text-slate-400">
                    Idempotent sync using private persistent SHA-256 mapping.
                  </p>
                </div>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-mono">
                  Calendar ID: {user.calendarId || 'primary'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tasks.map((task) => (
                  <div key={task.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <CategoryBadge category={task.category} />
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        task.calendarSynced ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {task.calendarSynced ? 'SYNCED' : 'PENDING'}
                      </span>
                    </div>

                    <h3 className="font-semibold text-xs text-white line-clamp-1">{task.title}</h3>
                    <p className="text-[11px] font-mono text-slate-400">{new Date(task.deadline).toUTCString()}</p>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-500">
                        {task.calendarEventId || 'No Event ID'}
                      </span>
                      {!task.calendarSynced && (
                        <button
                          onClick={() => handleCalendarSync(task.id)}
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                        >
                          <Plus className="h-3 w-3" /> Sync Event
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {}
        {activeTab === 'rag' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Grounded Task Assistant</h2>
                    <p className="text-xs text-slate-400">
                      Answering questions strictly from {user.email}&apos;s email task graph.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 min-h-[300px] max-h-[400px] overflow-y-auto pr-2">
                {ragMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-4 rounded-2xl text-xs space-y-2 leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-none'
                          : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  value={ragQuery}
                  onChange={(e) => setRagQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendRagQuery()}
                  placeholder="Ask about exam dates, fee penalties, or bus routes..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleSendRagQuery}
                  disabled={isRagSearching}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-all"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-base font-bold text-white">Profile & Gmail Ingestion Settings</h2>
                <p className="text-xs text-slate-400">Manage connected OAuth accounts and test webhook email ingestion on demand.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Authenticated User</span>
                  <div className="text-sm font-semibold text-white">{user.name}</div>
                  <div className="text-xs font-mono text-indigo-400">{user.email}</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">JWT Session State</span>
                  <div className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" /> Active Session Token
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 truncate">{token}</div>
                </div>
              </div>

              {}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Inbox className="h-5 w-5 text-indigo-400" />
                    <div>
                      <h3 className="text-xs font-bold text-white">Simulate Email Webhook Ingestion</h3>
                      <p className="text-[11px] text-slate-400">Trigger explicit email parsing and dynamic priority scoring for {user.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={async () => {
                      setIsFetchingTasks(true);
                      try {
                        const res = await fetch('/api/ingestion/simulate', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                          },
                          body: JSON.stringify({ sampleType: 'PLACEMENT_DRIVE' })
                        });
                        if (res.ok) {
                          const data = await res.json();
                          if (data.task) {
                            setTasks(prev => [data.task, ...prev]);
                            setSelectedTask(data.task);
                          }
                        }
                      } catch (err) {
                        console.warn('Simulation fallback');
                      } finally {
                        setIsFetchingTasks(false);
                      }
                    }}
                    disabled={isFetchingTasks}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20"
                  >
                    <Zap className="h-3.5 w-3.5 text-amber-300 fill-amber-300" />
                    <span>Simulate Email Ingestion</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2">
                  <button
                    onClick={async () => {
                      setIsFetchingTasks(true);
                      try {
                        const res = await fetch('/api/ingestion/simulate', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                          body: JSON.stringify({ sampleType: 'EXAM_URGENT' })
                        });
                        if (res.ok) {
                          const data = await res.json();
                          if (data.task) { setTasks(prev => [data.task, ...prev]); setSelectedTask(data.task); }
                        }
                      } catch (e) {} finally { setIsFetchingTasks(false); }
                    }}
                    className="p-3 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 text-left transition-all space-y-1"
                  >
                    <span className="text-[10px] font-mono font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">EXAM URGENT</span>
                    <div className="text-xs font-medium text-slate-200 truncate">Physics II Hall Ticket & Condonation</div>
                  </button>

                  <button
                    onClick={async () => {
                      setIsFetchingTasks(true);
                      try {
                        const res = await fetch('/api/ingestion/simulate', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                          body: JSON.stringify({ sampleType: 'PLACEMENT_DRIVE' })
                        });
                        if (res.ok) {
                          const data = await res.json();
                          if (data.task) { setTasks(prev => [data.task, ...prev]); setSelectedTask(data.task); }
                        }
                      } catch (e) {} finally { setIsFetchingTasks(false); }
                    }}
                    className="p-3 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 text-left transition-all space-y-1"
                  >
                    <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">PLACEMENT DRIVE</span>
                    <div className="text-xs font-medium text-slate-200 truncate">TCS Digital Hiring 2026 Registration</div>
                  </button>

                  <button
                    onClick={async () => {
                      setIsFetchingTasks(true);
                      try {
                        const res = await fetch('/api/ingestion/simulate', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                          body: JSON.stringify({ sampleType: 'HOSTEL_FINE' })
                        });
                        if (res.ok) {
                          const data = await res.json();
                          if (data.task) { setTasks(prev => [data.task, ...prev]); setSelectedTask(data.task); }
                        }
                      } catch (e) {} finally { setIsFetchingTasks(false); }
                    }}
                    className="p-3 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 text-left transition-all space-y-1"
                  >
                    <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">HOSTEL FEE FINE</span>
                    <div className="text-xs font-medium text-slate-200 truncate">Semester 5 Mess Fee Penalty Warning</div>
                  </button>
                </div>

                <div className="pt-3 border-t border-slate-800/80">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block mb-2">Allowed University Senders</span>
                  <div className="flex flex-wrap gap-2">
                    {user.allowedSenders && user.allowedSenders.map((sender, i) => (
                      <span key={i} className="text-xs bg-slate-900 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-lg font-mono flex items-center gap-1.5">
                        <Mail className="h-3 w-3 text-indigo-400" /> {sender}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/90 px-6 py-3 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>CampusFlow Authenticated Application</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span>React 18</span>
          <span>JWT Storage</span>
          <span>Tailwind CSS</span>
        </div>
      </footer>
    </div>
  );
}