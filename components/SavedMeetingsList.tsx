
import React from 'react';
import { Meeting } from '../types';
import MeetingCard from './MeetingCard';

interface SavedMeetingsListProps {
  meetings: Meeting[];
}

const SavedMeetingsList: React.FC<SavedMeetingsListProps> = ({ meetings }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6 md:p-8 w-full">
      <h2 className="text-2xl font-bold text-white mb-6">Saved Meetings</h2>
      {meetings.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-slate-600 rounded-lg">
          <p className="text-slate-400">No meetings saved yet.</p>
          <p className="text-sm text-slate-500 mt-2">Add a new meeting to get started.</p>
        </div>
      ) : (
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {meetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedMeetingsList;
