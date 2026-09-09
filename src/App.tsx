import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Code2,
  FolderGit2,
  Target,
  Sparkles,
  Map,
} from 'lucide-react';
import { NavTab, ConsistencyStats, WorkSession } from './types';
import { api } from './services/api';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardScreen } from './screens/DashboardScreen';
import { DsaScreen } from './screens/DsaScreen';
import { ProjectsScreen } from './screens/ProjectsScreen';
import { InterviewScreen } from './screens/InterviewScreen';
import { GrowthScreen } from './screens/GrowthScreen';
import { RoadmapScreen } from './screens/RoadmapScreen';
import { SessionLoggerModal } from './components/SessionLoggerModal';
import { ParkingLotModal } from './components/ParkingLotModal';
import { DailyReviewModal } from './components/DailyReviewModal';
import { ExportDataModal } from './components/ExportDataModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('DASHBOARD');
  const [consistency, setConsistency] = useState<ConsistencyStats | undefined>(undefined);
  const [parkedCount, setParkedCount] = useState<number>(0);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Theme Management (Dark mode default or saved preference)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('focus_theme');
    if (saved) return saved === 'dark';
    return true; // Dark mode by default
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('focus_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('focus_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  // Global Modals State
  const [isLoggerOpen, setIsLoggerOpen] = useState(false);
  const [sessionToEdit, setSessionToEdit] = useState<WorkSession | null>(null);
  const [loggerInitialCategory, setLoggerInitialCategory] = useState<'DSA' | 'PROJECT' | 'INTERVIEW' | 'OTHER'>('DSA');
  const [loggerInitialTask, setLoggerInitialTask] = useState('');

  const [isParkingLotOpen, setIsParkingLotOpen] = useState(false);
  const [isDailyReviewOpen, setIsDailyReviewOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  useEffect(() => {
    loadGlobalHeaderData();
  }, [refreshTrigger]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+L or Cmd+L -> Log Session
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        setSessionToEdit(null);
        setLoggerInitialCategory('DSA');
        setLoggerInitialTask('');
        setIsLoggerOpen(true);
      }
      // Ctrl+P or Cmd+P -> Parking Lot
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setIsParkingLotOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const loadGlobalHeaderData = async () => {
    try {
      const summary = await api.getDashboardSummary();
      setConsistency(summary.consistency);
      setParkedCount(summary.parkedCount);
    } catch (err) {
      console.error('Error loading global data:', err);
    }
  };

  const handleOpenLogger = (category: 'DSA' | 'PROJECT' | 'INTERVIEW' | 'OTHER' = 'DSA', taskTitle: string = '') => {
    setSessionToEdit(null);
    setLoggerInitialCategory(category);
    setLoggerInitialTask(taskTitle);
    setIsLoggerOpen(true);
  };

  const handleEditSession = (session: WorkSession) => {
    setSessionToEdit(session);
    setIsLoggerOpen(true);
  };

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const mobileNavTabs: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'DASHBOARD', label: 'Dash', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'DSA', label: 'DSA', icon: <Code2 className="w-4 h-4" /> },
    { id: 'PROJECTS', label: 'Project', icon: <FolderGit2 className="w-4 h-4" /> },
    { id: 'INTERVIEW', label: 'Prep', icon: <Target className="w-4 h-4" /> },
    { id: 'GROWTH', label: 'Growth', icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      {/* 1. Sidebar Navigation (Responsive Drawer) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        consistency={consistency}
        parkedCount={parkedCount}
        onOpenParkingLot={() => setIsParkingLotOpen(true)}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* 2. Main Work Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Sticky Header */}
        <Header
          consistency={consistency}
          parkedCount={parkedCount}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
          onOpenLogger={handleOpenLogger}
          onOpenParkingLot={() => setIsParkingLotOpen(true)}
          onOpenDailyReview={() => setIsDailyReviewOpen(true)}
          onOpenExport={() => setIsExportOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Screen Router Container */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-8">
          {activeTab === 'DASHBOARD' && (
            <DashboardScreen
              onOpenLogger={handleOpenLogger}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenDailyReview={() => setIsDailyReviewOpen(true)}
              refreshTrigger={refreshTrigger}
            />
          )}

          {activeTab === 'DSA' && (
            <DsaScreen onOpenLogger={(cat, task) => handleOpenLogger(cat || 'DSA', task || '')} />
          )}

          {activeTab === 'PROJECTS' && (
            <ProjectsScreen onOpenLogger={(cat, task) => handleOpenLogger(cat || 'PROJECT', task || '')} />
          )}

          {activeTab === 'INTERVIEW' && (
            <InterviewScreen onOpenLogger={(cat, task) => handleOpenLogger(cat || 'INTERVIEW', task || '')} />
          )}

          {activeTab === 'GROWTH' && (
            <GrowthScreen
              consistency={consistency}
              onRefresh={handleRefresh}
              onEditSession={handleEditSession}
              onOpenLogger={() => handleOpenLogger('DSA')}
              refreshTrigger={refreshTrigger}
            />
          )}

          {activeTab === 'ROADMAP' && (
            <RoadmapScreen
              onOpenLogger={() => handleOpenLogger('DSA')}
              onOpenParkingLot={() => setIsParkingLotOpen(true)}
            />
          )}
        </main>

        {/* Mobile Bottom Navigation Bar (Fixed for 1-tap thumb navigation) */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-dark-900/95 backdrop-blur-md border-t border-slate-200 dark:border-dark-800 flex items-center justify-around py-2 px-1 md:hidden">
          {mobileNavTabs.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-mono transition-all ${
                  isActive
                    ? 'text-brand-600 dark:text-brand-400 font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <div className={`p-1 rounded-md ${isActive ? 'bg-brand-500/15 text-brand-600 dark:text-brand-400' : ''}`}>
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* 3. Global Modals */}
      <SessionLoggerModal
        isOpen={isLoggerOpen}
        onClose={() => {
          setIsLoggerOpen(false);
          setSessionToEdit(null);
        }}
        initialCategory={loggerInitialCategory}
        initialTask={loggerInitialTask}
        sessionToEdit={sessionToEdit}
        onSessionLogged={handleRefresh}
      />

      <ParkingLotModal
        isOpen={isParkingLotOpen}
        onClose={() => setIsParkingLotOpen(false)}
        onUpdated={handleRefresh}
      />

      <DailyReviewModal
        isOpen={isDailyReviewOpen}
        onClose={() => setIsDailyReviewOpen(false)}
        onReviewSubmitted={handleRefresh}
      />

      <ExportDataModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
};

export default App;
