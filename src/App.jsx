import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import OverviewTab from './components/dashboard/OverviewTab';
import GeneratePostWizard from './components/generator/GeneratePostWizard';
import CanvasStudio from './components/editor/CanvasStudio';
import HistoryTab from './components/history/HistoryTab';
import TemplatesTab from './components/templates/TemplatesTab';
import BrandKitTab from './components/brand/BrandKitTab';
import AIStudioTab from './components/ai-studio/AIStudioTab';
import RoadmapTab from './components/roadmap/RoadmapTab';
import { AuthModal, KeyModal } from './components/auth/AuthModal';

function MainLayout() {
  const { activeTab } = useApp();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isKeyOpen, setIsKeyOpen] = useState(false);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <OverviewTab />;
      case 'generate':
        return <GeneratePostWizard />;
      case 'studio':
        return <CanvasStudio />;
      case 'history':
        return <HistoryTab />;
      case 'templates':
        return <TemplatesTab />;
      case 'brandkit':
        return <BrandKitTab />;
      case 'aistudio':
        return <AIStudioTab />;
      case 'roadmap':
        return <RoadmapTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#07090e] text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-black">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenKeyModal={() => setIsKeyOpen(true)}
        />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {renderActiveTab()}
        </main>
      </div>

      {/* Modals */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <KeyModal isOpen={isKeyOpen} onClose={() => setIsKeyOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
