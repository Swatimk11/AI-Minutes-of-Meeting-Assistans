
import React, { useState, useEffect, useCallback } from 'react';
import { Meeting } from './types';
import MeetingForm from './components/MeetingForm';
import SavedMeetingsList from './components/SavedMeetingsList';
import ApiConfigModal from './components/ApiConfigModal';
import CogIcon from './components/icons/CogIcon';

const INITIAL_MEETING: Meeting = {
    id: "initial-meeting-1",
    date: "November 11, 2025",
    title: "Q1 Campaign Results & Product Planning",
    attendees: ["Marketing Team", "Operations Team", "John", "Peter"],
    summary: "Discussed Q1 campaign results and upcoming product launch plans. Marketing noted a 25% increase in ad engagement but low website conversions, suggesting a landing page revamp and chatbot addition. Operations reported slight shipment delays due to supplier shortages, expecting stabilization in two weeks and requesting better order tracking visibility. The new logistics dashboard launch is set for February 10th, pending finalization of the user analytics module by the tech team.",
    actionItems: [
        { owner: "John", task: "Coordinate with the UI/UX designer for new landing page visuals.", dueDate: undefined },
        { owner: "Peter", task: "Connect with the supplier next week to confirm delivery timelines.", dueDate: "Next week" },
        { owner: "Tech Team", task: "Finalize the user analytics module.", dueDate: "End of this month" }
    ]
};


const App: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    try {
      const savedMeetings = localStorage.getItem('meetings');
      return savedMeetings ? JSON.parse(savedMeetings) : [INITIAL_MEETING];
    } catch (error) {
      console.error("Failed to parse meetings from localStorage", error);
      return [INITIAL_MEETING];
    }
  });

  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('geminiApiKey') || '');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('meetings', JSON.stringify(meetings));
  }, [meetings]);

  const handleAddMeeting = useCallback((newMeeting: Meeting) => {
    setMeetings((prevMeetings) => [newMeeting, ...prevMeetings]);
  }, []);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('geminiApiKey', key);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white font-sans">
      <header className="py-6 px-4 md:px-8 text-center relative">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">Meeting Assistant</h1>
        <p className="mt-3 max-w-md mx-auto text-base text-indigo-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Track and manage your meeting minutes with AI-powered summaries.
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Open API Settings"
        >
          <CogIcon className="w-6 h-6 text-slate-300" />
        </button>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <MeetingForm onAddMeeting={handleAddMeeting} apiKey={apiKey} openConfig={() => setIsModalOpen(true)} />
          <SavedMeetingsList meetings={meetings} />
        </div>
      </main>

      <footer className="text-center p-6 text-sm text-slate-500">
        <p>Powered by Gemini</p>
      </footer>

      <ApiConfigModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveApiKey}
        currentApiKey={apiKey}
      />
    </div>
  );
};

export default App;
