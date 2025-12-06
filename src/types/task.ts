export type TaskSubtask = {
  label: string;
  done: boolean;
};

export type TaskAttachment = {
  id: string;
  type: 'figma' | 'pdf' | 'image' | 'file';
  name: string;
  url?: string;
};

export type TaskComment = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  message: string;
  time?: string;
};

export type Task = {
  id: string;
  title: string;
  tag: string;
  priority?: 'High' | 'Medium' | 'Low';
  dueLabel?: string;
  description?: string;
  assignee: {
    avatar: string;
    name: string;
  };
  subtasks?: TaskSubtask[];
  attachments?: TaskAttachment[];
  comments?: TaskComment[];
  isDragging?: boolean;
};

