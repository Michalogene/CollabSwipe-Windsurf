import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  AtSign,
  CheckSquare,
  Clock,
  Send,
  X,
  Loader2,
} from 'lucide-react';
import { Task, TaskAttachment, TaskSubtask } from '../../types/task';
import { useAuth } from '../../contexts/AuthContext';
import { getTaskComments, addTaskComment, subscribeToTaskComments, TaskComment } from '../../services/taskComments';

type TaskDetailModalProps = {
  task: Task;
  onClose: () => void;
};

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose }) => {
  const { user, profile } = useAuth();
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  // Fetch comments on mount
  useEffect(() => {
    const loadComments = async () => {
      setIsLoading(true);
      const data = await getTaskComments(task.id);
      setComments(data);
      setIsLoading(false);
    };
    loadComments();
  }, [task.id]);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToTaskComments(task.id, (newCommentData) => {
      setComments((prev) => {
        // Avoid duplicates
        if (prev.some(c => c.id === newCommentData.id)) return prev;
        return [...prev, newCommentData];
      });
    });

    return () => {
      unsubscribe();
    };
  }, [task.id]);

  // Scroll to bottom when new comments arrive
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  const handleSendComment = async () => {
    if (!newComment.trim() || !user) return;

    setIsSending(true);
    const { data, error } = await addTaskComment(task.id, user.id, newComment.trim());

    if (!error && data) {
      // Optimistically add if real-time doesn't catch it fast enough
      setComments((prev) => {
        if (prev.some(c => c.id === data.id)) return prev;
        return [...prev, data];
      });
      setNewComment('');
    }
    setIsSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendComment();
    }
  };

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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center px-4 py-10">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-500 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 space-y-6 overflow-y-auto flex-1">
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
                'No description provided for this task.'}
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

            {/* Activity / Comments */}
            <div className="space-y-3">
              <div className="text-sm font-semibold text-gray-800">Activity</div>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                    <span className="ml-2 text-gray-500 text-sm">Loading comments...</span>
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-gray-400 text-sm text-center py-4">
                    No comments yet. Be the first to comment!
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-3">
                      <img
                        src={comment.author?.avatar_url || `https://i.pravatar.cc/120?u=${comment.author_id}`}
                        alt={comment.author?.first_name || 'User'}
                        className="h-9 w-9 rounded-full ring-2 ring-white shadow"
                      />
                      <div className="bg-gray-50 rounded-2xl px-4 py-3 shadow-sm flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-gray-700">
                            {comment.author?.first_name} {comment.author?.last_name}
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(comment.created_at)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-900">{comment.content}</div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={commentsEndRef} />
              </div>
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <div className="px-6 pb-6 pt-2 border-t border-gray-100 bg-white">
          <div className="relative bg-white border border-gray-200 rounded-full shadow-sm flex items-center pr-2 pl-4 py-2">
            <img
              src={profile?.avatar_url || `https://i.pravatar.cc/120?u=${user?.id}`}
              alt="You"
              className="h-8 w-8 rounded-full ring-2 ring-white shadow mr-3"
            />
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSending}
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
                onClick={handleSendComment}
                disabled={isSending || !newComment.trim()}
                className={`w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md hover:bg-blue-700 ${isSending || !newComment.trim() ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {isSending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
