
import React, { useState } from 'react';
import { Meeting } from '../types';
import { generateMeetingMinutes } from '../services/geminiService';
import SparklesIcon from './icons/SparklesIcon';

interface MeetingFormProps {
  onAddMeeting: (meeting: Meeting) => void;
  apiKey: string;
  openConfig: () => void;
}

const exampleSummary = `We had a meeting today with the marketing and operations teams to discuss the Q1 campaign results and upcoming product launch plans.
The marketing team mentioned that our ad engagement increased by 25%, but website conversions are still low compared to last quarter. They suggested revamping the landing page and adding a chatbot for visitor assistance.
Operations reported a slight delay in shipment schedules due to supplier shortages. They expect the situation to stabilize in two weeks. Meanwhile, they requested better visibility into order tracking updates.
The product launch for the new logistics dashboard is scheduled for February 10th. The tech team still needs to finalize the user analytics module by the end of this month.
John will coordinate with the UI/UX designer to prepare new visuals for the landing page. Peter will connect with the supplier next week to confirm delivery timelines.
Follow-up meeting planned for next Friday at 3 PM to review progress on these action items.`;

const MeetingForm: React.FC<MeetingFormProps> = ({ onAddMeeting, apiKey, openConfig }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [summary, setSummary] = useState(exampleSummary);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!apiKey) {
      setError('Please configure your API key in settings to enable AI features.');
      openConfig();
      return;
    }
    if (!summary.trim()) {
      setError('Meeting summary cannot be empty.');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const generatedData = await generateMeetingMinutes(summary, apiKey);
      const newMeeting: Meeting = {
        id: new Date().toISOString(),
        date: new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        ...generatedData,
      };
      onAddMeeting(newMeeting);
      setSummary(''); // Clear summary after successful addition
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6 md:p-8 w-full">
      <h2 className="text-2xl font-bold text-white mb-6">Add New Meeting</h2>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-slate-300 mb-2">
            Meeting Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-slate-300 mb-2">
            Meeting Summary
          </label>
          <textarea
            id="summary"
            rows={12}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Paste or write your meeting summary here..."
            className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-y"
          />
        </div>

        {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-2 rounded-md text-sm">
                {error}
            </div>
        )}

        <div>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 disabled:bg-indigo-900 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Generating...</span>
              </>
            ) : (
             <>
              <SparklesIcon className="w-5 h-5"/>
              <span>Generate & Save Minutes</span>
             </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MeetingForm;
