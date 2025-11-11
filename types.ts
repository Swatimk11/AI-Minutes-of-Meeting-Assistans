
export interface ActionItem {
  owner: string;
  task: string;
  dueDate?: string;
}

export interface Meeting {
  id: string;
  date: string;
  title: string;
  attendees: string[];
  summary: string;
  actionItems: ActionItem[];
}
