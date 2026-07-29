import {
  LayoutGrid,
  Clock,
  Calendar,
  CheckSquare,
  BarChart2,
  Sparkles,
  MessageSquare,
  Settings,
  Search,
  Bell,
  Play,
  CheckCircle2,
  CalendarDays,
  Target,
  Flame,
  ArrowRight,
  Plus,
  BookOpen,
  Code,
  SquareSigma,
  ChevronDown,
  Edit3
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import FocusTimer from "../../focus/components/FocusTimer";
import { PresenceBar } from "../../presence/components/PresenceBar";
import {
  useDashboardData
} from "../hooks/useDashboardData";

const DAILY_GOAL = 6;

function timeGreeting() {
  const hour = new Date().getHours();
  if (hour < 5) return "Burning the midnight oil";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const {
    sessions,
    user,
    loading,
    totalMinutes,
    totalSessions,
    todaySessions,
    streak,
    focusScore,
    topSubject,
    companionInsight,
    productiveHour,
    consistencyLevel
  } = useDashboardData();

  const displayName = user?.username ?? "there";
  const goalDone = Math.min(todaySessions.length, DAILY_GOAL);
  const goalRingOffset = 226 - (226 * goalDone) / DAILY_GOAL;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070712] text-white flex items-center justify-center">
        Loading dashboard...
      </div>
    );
  }
  return (
    <div className="flex h-screen bg-[#070712] text-white font-sans overflow-hidden">
      
      {/* ─── SIDEBAR ─── */}
      <aside className="w-[260px] bg-[#0c0d1a] border-r border-white/5 flex flex-col hidden lg:flex shrink-0">
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Sparkles size={16} />
            </div>
            <span className="font-bold text-lg tracking-tight">Companion</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <NavItem icon={<LayoutGrid size={18} />} label="Dashboard" active />
          <NavItem icon={<Clock size={18} />} label="Focus" />
          <NavItem icon={<Calendar size={18} />} label="Sessions" />
          <NavItem icon={<CheckSquare size={18} />} label="Tasks" />
          <div className="my-4 border-t border-white/5 mx-2" />
          <NavItem icon={<BarChart2 size={18} />} label="Analytics" />
          <NavItem icon={<Sparkles size={18} />} label="Insights" />
          <Link to="/companion" className="flex items-center justify-between px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition">
            <div className="flex items-center gap-3">
              <MessageSquare size={18} />
              <span className="text-[13px] font-medium">Companion</span>
            </div>
            <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded-md">AI</span>
          </Link>
          <NavItem icon={<Settings size={18} />} label="Settings" />
        </nav>

        {/* 7 Day Streak Mini Card */}
        <div className="px-4 mb-4">
          <div className="bg-[#121427] rounded-2xl p-4 border border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-xl">🔥</div>
              <div>
                <p className="text-[13px] font-semibold text-white">{streak} Day Streak</p>
                <p className="text-[11px] text-gray-400">Keep it up! 🔥</p>
              </div>
            </div>
            <div className="flex justify-between items-center px-1">
              {['M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                  <span className="text-[9px] text-gray-500 font-medium">{d}</span>
                </div>
              ))}
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded-full border border-gray-600" />
                <span className="text-[9px] text-gray-500 font-medium">S</span>
              </div>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-2 py-1 cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-gray-700 overflow-hidden shrink-0">
              <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-white leading-tight">{displayName}</p>
              <p className="text-[11px] text-indigo-400">{user?.email ?? ""}</p>
            </div>
            <ChevronDown size={14} className="text-gray-500" />
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#070712]">
        
        {/* HEADER */}
        <header className="px-8 py-7 flex justify-between items-end shrink-0">
          <div>
            <h1 className="text-[28px] font-bold text-white mb-1.5 tracking-tight flex items-center gap-2">
              {timeGreeting()}, {displayName} <span className="text-2xl">👋</span>
            </h1>
            <p className="text-[14px] text-gray-400">
              Stay consistent. Stay focused. Your future self is grateful.
            </p>
          </div>
          <div className="flex items-center gap-5">
            <button className="text-gray-400 hover:text-white transition"><Search size={18} /></button>
            <button className="text-gray-400 hover:text-white transition relative">
              <Bell size={18} />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-indigo-500 rounded-full border-2 border-[#070712] flex items-center justify-center text-[8px] font-bold">3</div>
            </button>
            <div className="w-9 h-9 rounded-full bg-gray-700 overflow-hidden cursor-pointer ml-1">
              <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center gap-2 bg-[#121427] border border-white/5 rounded-xl px-3 py-2 cursor-pointer text-[13px] font-medium ml-2">
              <CalendarDays size={14} className="text-gray-400" />
              <span>Today</span>
              <ChevronDown size={14} className="text-gray-500 ml-1" />
            </div>
          </div>
        </header>

        {/* DASHBOARD GRID */}
        <div className="px-8 pb-8 flex-1 flex flex-col gap-6 w-full max-w-[1600px] mx-auto">
          
          {/* TOP ROW: Focus Card + Overview */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Focus Card (Span 2) */}
            <div className="xl:col-span-2 relative rounded-[24px] overflow-hidden bg-[#101026] border border-white/5 flex">
              <div className="absolute inset-0 bg-cover bg-right" style={{ backgroundImage: "url('/focus-bg.png')" }} />
              <div className="absolute inset-0 bg-gradient-to-r from-[#11112b] via-[#11112b]/90 to-transparent" />
              
              <div className="relative z-10 p-8 flex flex-col justify-between w-full">
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                    <span className="text-[11px] font-bold tracking-widest text-indigo-400 uppercase">Focus Session</span>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-gray-300 text-[14px]">Deep Work Time</span>
                    <button className="bg-white/5 hover:bg-white/10 p-1.5 rounded-full transition text-gray-400"><Edit3 size={12} /></button>
                  </div>
                  
                  <FocusTimer />
                </div>

                <div className="flex justify-between items-end">
                  {/* The buttons were moved into FocusTimer, so we just need a spacer or we can place the session ring correctly */}
                  <div></div>

                  <div className="flex flex-col items-center mr-16">
                    <p className="text-[12px] text-gray-400 mb-3">Today's Goal</p>
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="40" cy="40" r="36" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                        <circle cx="40" cy="40" r="36" fill="transparent" stroke="#6366f1" strokeWidth="6" strokeDasharray="226" strokeDashoffset={goalRingOffset} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-bold text-white">{goalDone}<span className="text-gray-500">/{DAILY_GOAL}</span></span>
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-3">Sessions Completed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Overview Card (Span 1) */}
            <div className="xl:col-span-1 bg-[#0c0d1a] border border-white/5 rounded-[24px] p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-white text-[15px]">Overview</h3>
                <div className="flex items-center gap-1 text-indigo-400 text-[12px] cursor-pointer font-medium hover:text-indigo-300 transition">
                  This Week <ChevronDown size={14} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-px bg-white/5 flex-1 rounded-2xl overflow-hidden border border-white/5">
                <StatCell icon={<Clock size={16} className="text-indigo-400" />} label="Study Time" value={`${totalMinutes}m`} trend="↑ 12%" />
                <StatCell icon={<Target size={16} className="text-orange-400" />} label="Focus Score" value={`${focusScore}%`} trend="↑ 8%" />
                <StatCell icon={<CalendarDays size={16} className="text-blue-400" />} label="Sessions" value={totalSessions} trend="↑ 3" />
                <StatCell icon={<Flame size={16} className="text-rose-400" />} label="Streak" value={`${streak} days`} sub="Keep going! 🔥" />
              </div>
            </div>
          </div>

          {/* MIDDLE ROW: Today's Sessions + AI Companion */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Today's Sessions (Span 2) */}
            <div className="xl:col-span-2 bg-[#0c0d1a] border border-white/5 rounded-[24px] p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-white text-[15px]">Today's Sessions</h3>
                <button className="text-[12px] font-medium text-indigo-400 hover:text-indigo-300">View all</button>
              </div>

              <div className="space-y-2">
                {todaySessions.length === 0 && (
                  <p className="text-[13px] text-gray-500 px-2 py-4">
                    No sessions yet today. Your streak is waiting.
                  </p>
                )}
                {todaySessions.map((session: any) => (
                  <SessionRow
                    key={session.id}
                    icon={<BookOpen size={16} className="text-indigo-400" />}
                    iconBg="bg-indigo-500/10"
                    title={session.subject}
                    type="Deep Focus"
                    time={new Date(session.started_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    duration={`${session.duration} min`}
                    completed={session.completed}
                  />
                ))}
                
                {/* Add New Session Button */}
                <div className="mt-4 flex items-center justify-between p-4 rounded-2xl border border-dashed border-white/10 hover:border-indigo-500/50 hover:bg-white/[0.02] transition cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl border border-dashed border-white/20 flex items-center justify-center text-gray-400 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition">
                      <Plus size={18} />
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-white group-hover:text-indigo-100 transition">Add New Session</p>
                      <p className="text-[12px] text-gray-500">Plan your next focus block</p>
                    </div>
                  </div>
                  <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg text-[13px] font-semibold transition">
                    Start
                  </button>
                </div>
              </div>
            </div>

            {/* AI Companion (Span 1) */}
            <div className="xl:col-span-1 bg-gradient-to-br from-[#1b2232] to-[#111827] border border-white/10 shadow-2xl shadow-blue-500/10 rounded-[24px] p-6 relative overflow-hidden flex flex-col">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-cover bg-center pointer-events-none opacity-90" style={{ backgroundImage: "url('/ai-robot.png')" }} />
              
              <div className="flex justify-between items-center mb-6 relative z-10">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-indigo-400" />
                  <h3 className="font-semibold text-white text-[15px]">AI Companion</h3>
                </div>
                <span className="bg-indigo-500/20 text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded-md">BETA</span>
              </div>

              <div className="bg-[#121427]/90 backdrop-blur-sm border border-white/5 rounded-2xl p-5 mb-8 relative z-10 w-[85%] shadow-xl shadow-black/20">
                <div className="absolute top-1/2 -right-2 w-4 h-4 bg-[#121427] border-t border-r border-white/5 transform rotate-45 -translate-y-1/2" />
                <p className="text-[13px] text-gray-300 leading-relaxed whitespace-pre-line">
                  {companionInsight}
                </p>
              </div>

              <div className="mt-auto relative z-10">
                <Link to="/companion" className="inline-flex items-center gap-2 text-indigo-400 text-[13px] font-medium hover:text-indigo-300 transition bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-500/20">
                  Chat with Companion <ArrowRight size={14} />
                </Link>
              </div>
            </div>
            <PresenceBar streak={streak} />
          </div>

          {/* ADAPTIVE INTELLIGENCE ROW */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0c0d1a] border border-white/5 rounded-[24px] p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
              <p className="text-gray-400 mb-2 text-[13px] font-medium flex items-center gap-2">
                <Sparkles size={14} className="text-indigo-400"/> Peak Focus Hour
              </p>
              <h2 className="text-4xl font-bold text-white tracking-tight">
                {productiveHour !== null ? `${productiveHour}:00` : "--"}
              </h2>
            </div>

            <div className="bg-[#0c0d1a] border border-white/5 rounded-[24px] p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
              <p className="text-gray-400 mb-2 text-[13px] font-medium flex items-center gap-2">
                <Target size={14} className="text-blue-400"/> Consistency Profile
              </p>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                {consistencyLevel}
              </h2>
            </div>
          </div>

          {/* BOTTOM ROW: Quote */}
          <div className="relative bg-[#0c0d1a] border border-white/5 rounded-[24px] overflow-hidden flex items-center p-6 min-h-[100px]">
             <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen" style={{ backgroundImage: "url('/quote-bg.png')" }} />
             <div className="absolute inset-0 bg-gradient-to-r from-[#0c0d1a] via-[#0c0d1a]/80 to-transparent" />
             
             <div className="relative z-10 flex gap-5 items-start">
                <div className="text-4xl text-indigo-400/50 font-serif leading-none pt-1">"</div>
                <div>
                  <p className="text-[14px] text-gray-200 mb-2 font-medium max-w-[500px] leading-relaxed">
                    Discipline is choosing between what you want now and what you want most.
                  </p>
                  <p className="text-[12px] text-indigo-400 font-medium">— Abraham Lincoln</p>
                </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// ─── HELPER COMPONENTS ───

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition ${active ? 'bg-indigo-600/10 text-indigo-400 font-medium' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
      {icon}
      <span className="text-[13px]">{label}</span>
    </div>
  );
}

function StatCell({ icon, label, value, trend, sub }: any) {
  return (
    <div className="bg-[#0c0d1a] p-5 flex flex-col justify-center relative">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
          {icon}
        </div>
        <p className="text-[12px] text-gray-400 font-medium">{label}</p>
      </div>
      <p className="text-[22px] font-bold text-white mb-1 tracking-tight">{value}</p>
      {trend && <p className="text-[11px] text-green-400 font-medium">{trend} <span className="text-gray-500 font-normal">from last week</span></p>}
      {sub && <p className="text-[11px] text-gray-400">{sub}</p>}
    </div>
  );
}

function SessionRow({ icon, iconBg, title, type, time, duration, completed }: any) {
  return (
    <div className="flex items-center justify-between p-3.5 rounded-xl hover:bg-white/[0.02] border border-transparent hover:border-white/5 transition group cursor-pointer">
      <div className="flex items-center gap-4">
        <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <p className="text-[14px] font-medium text-white mb-0.5">{title}</p>
          <p className="text-[12px] text-gray-500">{type}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-12">
        <p className="text-[12px] text-gray-400 w-32 text-center">{time}</p>
        <div className="bg-white/5 border border-white/5 px-3 py-1 rounded-md">
          <span className="text-[12px] text-gray-300 font-medium">{duration}</span>
        </div>
        <div className="w-8 flex justify-end">
          {completed && <CheckCircle2 size={18} className="text-green-500" />}
        </div>
      </div>
    </div>
  );
}