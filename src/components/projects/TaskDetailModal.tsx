import React, { useMemo } from 'react';
import {
  AtSign,
  CheckSquare,
  Clock,
  Paperclip,
  Send,
  X,
} from 'lucide-react';
import { Task, TaskAttachment, TaskComment, TaskSubtask } from '../../types/task';

type TaskDetailModalProps = {
  task: Task;
  onClose: () => void;
};

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose }) => {
  const mockSubtasks: TaskSubtask[] =
    task.subtasks || [
      { label: 'Wireframes', done: false },
      { label: 'Copywriting', done: false },
      { label: 'Visual polish', done: false },
    ];

  const mockAttachments: TaskAttachment[] =
    task.attachments || [
      { id: 'figma', type: 'figma', name: 'figma.fig' },
      { id: 'pdf', type: 'pdf', name: 'brief.pdf' },
    ];

  const mockComments: TaskComment[] =
    task.comments || [
      {
        id: '1',
        author: { name: 'Sarah Lee', avatar: task.assignee.avatar },
        message: 'Hey, are you design Landing Page hero',
        time: '2h ago',
      },
      {
        id: '2',
        author: { name: 'Alex Chen', avatar: task.assignee.avatar },
        message: 'File dnoimentars',
        time: '1h ago',
      },
    ];

  const progressLabel = useMemo(() => {
    const done = mockSubtasks.filter((s) => s.done).length;
    return `${done}/${mockSubtasks.length} done`;
  }, [mockSubtasks]);

  const renderAttachment = (attachment: TaskAttachment) => {
    const base =
      attachment.type === 'figma'
        ? 'bg-black text-white'
        : attachment.type === 'pdf'
        ? 'bg-red-50 text-red-500'
        : 'bg-gray-100 text-gray-700';

    return (
      <div
        key={attachment.id}
        className={`w-14 h-14 rounded-xl flex items-center justify-center text-sm font-semibold ${base}`}
      >
        {attachment.type === 'figma' ? 'F' : attachment.type === 'pdf' ? 'PDF' : 'FILE'}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center px-4 py-10">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-500"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">{task.title}</h2>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-4 py-2 rounded-full bg-red-50 text-red-500 text-sm font-semibold shadow-sm">
                Priority: {task.priority || 'High'}
              </span>
              <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold">
                Due: {task.dueLabel || 'Tomorrow'}
              </span>
              <img
                src={task.assignee.avatar}
                alt={task.assignee.name}
                className="h-9 w-9 rounded-full ring-2 ring-white shadow-sm"
              />
            </div>
          </div>

          {/* Body */}
          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed">
              {task.description ||
                'Design Landing Page Hero is a connennet design and corporative design, web developments and context to cuts in it.'}
            </p>

            {/* Checklist */}
            <div className="flex items-center gap-3 text-gray-700 text-sm">
              <CheckSquare className="w-5 h-5 text-gray-500" />
              <span>{progressLabel}</span>
            </div>

            {/* Attachments */}
            <div className="space-y-3">
              <div className="text-sm font-semibold text-gray-800">Attachments</div>
              <div className="flex items-center gap-3">
                {mockAttachments.map((att) => renderAttachment(att))}
              </div>
            </div>

            {/* Activity */}
            <div className="space-y-3">
              <div className="text-sm font-semibold text-gray-800">Activity</div>
              <div className="space-y-3">
                {mockComments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-3">
                    <img
                      src={comment.author.avatar}
                      alt={comment.author.name}
                      className="h-9 w-9 rounded-full ring-2 ring-white shadow"
                    />
                    <div className="bg-gray-50 rounded-2xl px-4 py-3 shadow-sm">
                      <div className="text-sm text-gray-900 font-medium">{comment.message}</div>
                      {comment.time && (
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {comment.time}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <div className="px-6 pb-6">
          <div className="relative bg-white border border-gray-200 rounded-full shadow-sm flex items-center pr-2 pl-4 py-2">
            <input
              type="text"
              placeholder="Write a comment..."
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-sm"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md hover:bg-blue-700"
              >
                <AtSign className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;

