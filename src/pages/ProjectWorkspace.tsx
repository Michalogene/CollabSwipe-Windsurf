import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Settings,
  ChevronDown,
  Compass,
  MessageSquare,
  Briefcase,
  Star,
  Plus,
  MessageCircle,
  Paperclip,
  Layout,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import TaskDetailModal from '../components/projects/TaskDetailModal';
import AddTaskModal from '../components/projects/AddTaskModal';
import { Task } from '../types/task';

// Helper pour générer des avatars
const avatar = (id: number) => `https://i.pravatar.cc/120?img=${id}`;

const ProjectWorkspace: React.FC = () => {
  const location = useLocation();
  const { profile } = useAuth();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showAddTask, setShowAddTask] = useState(false);

  // Données de démo
  const project = {
    id: 'solaris-ai', // ID du projet pour la navigation
    name: 'Solaris AI',
    progress: 35,
  };

  const teamMembers = [
    { id: 1, avatar: avatar(12), name: 'Alex Chen' },
    { id: 2, avatar: avatar(45), name: 'Maria Rodriguez' },
    { id: 3, avatar: avatar(33), name: 'James Kim' },
    { id: 4, avatar: avatar(23), name: 'Emily Davis' },
  ];

  const initialTasks: Record<string, Task[]> = {
    todo: [
      {
        id: '1',
        title: 'Design Homepage',
        tag: 'Design',
        priority: 'High',
        dueLabel: 'Tomorrow',
        description:
          'Design Landing Page Hero is a connennet design and corporative design, web developments and context to cuts in it.',
        subtasks: [
          { label: 'Wireframes', done: false },
          { label: 'Copywriting', done: false },
          { label: 'Visual polish', done: false },
        ],
        attachments: [
          { id: 'figma', type: 'figma', name: 'figma.fig' },
          { id: 'pdf', type: 'pdf', name: 'brief.pdf' },
        ],
        comments: [
          {
            id: 'c1',
            author: { name: 'Sarah Lee', avatar: avatar(64) },
            message: 'Hey, are you design Landing Page hero',
            time: '2h ago',
          },
          {
            id: 'c2',
            author: { name: 'Alex Chen', avatar: avatar(12) },
            message: 'File dnoimentars',
            time: '1h ago',
          },
        ],
        assignee: {
          avatar: avatar(45),
          name: 'Maria Rodriguez',
        },
      },
    ],
    inProgress: [
      {
        id: '2',
        title: 'Develop API Endpoints',
        tag: 'Dev',
        priority: 'Medium',
        dueLabel: 'In 2 days',
        description: 'Develop API endpoints for user and project entities.',
        assignee: {
          avatar: avatar(12),
          name: 'Alex Chen',
        },
      },
      {
        id: '3',
        title: 'Refine UX Flow',
        tag: 'Design',
        priority: 'High',
        dueLabel: 'Today',
        description: 'Refine the UX flow to reduce friction for onboarding.',
        assignee: {
          avatar: avatar(45),
          name: 'Maria Rodriguez',
        },
        isDragging: true, // Cette carte simule le drag & drop
      },
    ],
    done: [
      {
        id: '4',
        title: 'Setup Database',
        tag: 'Dev',
        priority: 'Low',
        dueLabel: 'Next week',
        description: 'Finish DB indexes and backup strategy.',
        assignee: {
          avatar: avatar(33),
          name: 'James Kim',
        },
      },
    ],
  };

  const [tasks, setTasks] = useState<Record<string, Task[]>>(initialTasks);

  const members = useMemo(
    () => [
      { id: 1, avatar: avatar(45), name: 'Maria Rodriguez' },
      { id: 2, avatar: avatar(12), name: 'Alex Chen' },
      { id: 3, avatar: avatar(33), name: 'James Kim' },
      { id: 4, avatar: avatar(23), name: 'Emily Davis' },
      { id: 5, avatar: avatar(18), name: 'Chris Wong' },
    ],
    [],
  );

  const handleCreateTask = (newTaskData: Omit<Task, 'id' | 'tag'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `${Date.now()}`,
      tag: 'New',
    };
    setTasks((prev) => ({
      ...prev,
      todo: [newTask, ...prev.todo],
    }));
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Sidebar Fixe */}
      <aside className="fixed left-0 top-0 w-64 h-screen bg-white border-r border-gray-100 flex flex-col z-10">
        {/* Logo */}
        <div className="px-5 py-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">CS</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">CollabSwipe</span>
          </div>
        </div>

        {/* Dropdown Talent Mode */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">
            Mode
          </div>
          <div className="relative">
            <button className="w-full rounded-lg border border-gray-200 py-2.5 px-3 text-sm flex items-center justify-between hover:bg-gray-50 transition-colors">
              <span className="font-medium text-gray-900">Talent Mode</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Navigation Principale */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          <Link
            to="/discover"
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
              isActive('/discover')
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>Explore</span>
          </Link>

          <Link
            to="/messages"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-all relative"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Messages</span>
          </Link>

          <Link
            to="/projects"
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
              isActive('/projects')
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>My Projects</span>
          </Link>

          <Link
            to="/favorites"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-all"
          >
            <Star className="h-4 w-4" />
            <span>Favorites</span>
          </Link>

        </nav>

        {/* User Profile Footer */}
        <div className="border-t border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <img
              src={avatar(64)}
              alt="Profile"
              className="h-9 w-9 rounded-full ring-2 ring-gray-100"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {profile?.first_name && profile?.last_name
                  ? `${profile.first_name} ${profile.last_name}`
                  : 'Sarah Lee'}
              </div>
              <div className="text-xs text-gray-500 truncate">Product Lead</div>
            </div>
            <Link
              to="/profile"
              className="p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Settings className="h-5 w-5 text-gray-500" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 ml-64 overflow-y-auto bg-slate-50">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Breadcrumb & Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              <span className="text-gray-500">My Projects</span>{' '}
              <span className="text-gray-700">/ Workspace</span>
            </h1>
          </div>

          {/* Project Status Panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex items-center justify-between">
              {/* Left Side */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">{project.name}</h2>
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
                <div className="w-full max-w-md">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">{project.progress}% Complete</p>
                </div>
              </div>

              {/* Right Side */}
              <div className="flex items-center gap-4">
                {/* Team Avatars */}
                <div className="flex -space-x-3">
                  {teamMembers.map((member) => (
                    <img
                      key={member.id}
                      src={member.avatar}
                      alt={member.name}
                      className="h-10 w-10 rounded-full ring-2 ring-white border-2 border-white shadow-sm hover:scale-110 transition-transform"
                    />
                  ))}
                </div>
                {/* Invite Button */}
                <button className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
                  Invite
                </button>
              </div>
            </div>
          </div>

          {/* Kanban Board */}
          <div className="grid grid-cols-3 gap-6">
            {/* To Do Column */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">To Do</h3>
                <button
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setShowAddTask(true)}
                >
                  <Plus className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                {tasks.todo.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    projectId={project.id}
                    onClick={() => setSelectedTask(task)}
                  />
                ))}
              </div>
            </div>

            {/* In Progress Column */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">In Progress</h3>
                <button
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setShowAddTask(true)}
                >
                  <Plus className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                {tasks.inProgress.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    projectId={project.id}
                    onClick={() => setSelectedTask(task)}
                  />
                ))}
              </div>
            </div>

            {/* Done Column */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Done</h3>
                <button
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setShowAddTask(true)}
                >
                  <Plus className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                {tasks.done.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    projectId={project.id}
                    onClick={() => setSelectedTask(task)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {selectedTask && (
        <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
      {showAddTask && (
        <AddTaskModal
          onClose={() => setShowAddTask(false)}
          onCreate={handleCreateTask}
          members={members}
        />
      )}
    </div>
  );
};

// Task Card Component
interface TaskCardProps {
  task: Task;
  projectId: string;
  onClick: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, projectId, onClick }) => {
  const navigate = useNavigate();

  const handleOpenCanvas = () => {
    navigate(`/canvas/${projectId}`);
  };

  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 p-4 mb-4 transition-all duration-200 ${
        task.isDragging
          ? 'shadow-2xl z-50 relative'
          : 'shadow-sm hover:shadow-md'
      }`}
      style={
        task.isDragging
          ? {
              transform: 'rotate(3deg) scale(1.05)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }
          : {}
      }
      role="button"
      onClick={onClick}
    >
      {/* Title */}
      <h4 className="font-medium text-gray-900 mb-3">{task.title}</h4>

      {/* Tag */}
      <div className="mb-4">
        <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
          {task.tag}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <MessageCircle className="h-4 w-4 text-gray-500" />
          </button>
          <button
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Paperclip className="h-4 w-4 text-gray-500" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenCanvas();
            }}
            className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 hover:text-blue-600 transition-colors"
          >
            <Layout className="h-3 w-3" />
            Canvas
          </button>
        </div>
        <img
          src={task.assignee.avatar}
          alt={task.assignee.name}
          className="h-6 w-6 rounded-full ring-2 ring-white"
        />
      </div>
    </div>
  );
};

export default ProjectWorkspace;

