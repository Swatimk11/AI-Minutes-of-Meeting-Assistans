
import React from 'react';
import { Meeting } from '../types';

interface MeetingCardProps {
  meeting: Meeting;
}

const MeetingCard: React.FC<MeetingCardProps> = ({ meeting }) => {
  return (
    <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 shadow-lg text-slate-300 transition-all duration-300 hover:bg-white/10 hover:border-white/20">
      <div className="mb-4">
        <p className="text-sm text-indigo-400 font-semibold">{meeting.date}</p>
        <h3 className="text-xl font-bold text-white mt-1">{meeting.title}</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-slate-100 mb-1">Attendees:</h4>
          <p className="text-sm">{meeting.attendees.join(', ')}</p>
        </div>
        
        <div>
          <h4 className="font-semibold text-slate-100 mb-2">Summary:</h4>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{meeting.summary}</p>
        </div>
        
        {meeting.actionItems && meeting.actionItems.length > 0 && (
          <div>
            <h4 className="font-semibold text-slate-100 mb-2">Action Items:</h4>
            <ul className="list-disc list-inside space-y-2 text-sm">
              {meeting.actionItems.map((item, index) => (
                <li key={index}>
                  <strong>{item.owner}:</strong> {item.task} 
                  {item.dueDate && <span className="text-xs text-indigo-400 ml-2">({item.dueDate})</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingCard;
