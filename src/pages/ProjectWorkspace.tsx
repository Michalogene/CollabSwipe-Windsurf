import React, { useMemo, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
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
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import TaskDetailModal from '../components/projects/TaskDetailModal';
import AddTaskModal from '../components/projects/AddTaskModal';
import { Task as FrontendTask } from '../types/task';
import { getProjectById, Project, checkProjectMembership, addProjectMember } from '../services/projects';
import { getProjectTasks, createTask, updateTaskStatus } from '../services/tasks';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Helper pour générer des avatars
const avatar = (id: number) => `https://i.pravatar.cc/120?img=${id}`;

// Task Card Component Definitions
interface TaskCardProps {
  task: FrontendTask;
  projectId: string;
  onClick: () => void;
  onStatusChange?: (taskId: string, newStatus: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, projectId, onClick }) => {
  const navigate = useNavigate();

  const handleOpenCanvas = () => {
    navigate(`/canvas/${projectId}`);
  };

  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 p-4 mb-4 transition-all duration-200 ${task.isDragging
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

const ProjectWorkspace: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const location = useLocation();
  const { profile, user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [selectedTask, setSelectedTask] = useState<FrontendTask | null>(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [loading, setLoading] = useState(true);
  const [permissionError, setPermissionError] = useState(false);
  const [isRepairing, setIsRepairing] = useState(false);

  // Initial state structure for Kanban board
  const [tasks, setTasks] = useState<Record<string, FrontendTask[]>>({
    todo: [],
    inProgress: [],
    done: []
  });

  // Load Project and Tasks
  useEffect(() => {
    if (projectId) {
      loadData(projectId);
    }
  }, [projectId]);

  const loadData = async (id: string) => {
    setLoading(true);
    setPermissionError(false);
    try {
      // 1. Fetch Project
      const { data: projectData, error: projectError } = await getProjectById(id);
      if (projectError) throw projectError;
      setProject(projectData);

      // 1.5 Self-Repair Check
      if (user && projectData && user.id === projectData.creator_id) {
        const isMember = await checkProjectMembership(id, user.id);
        if (!isMember) {
          console.log('🔄 Auto-fixing: Adding creator to project members...');
          const { error } = await addProjectMember(id, user.id, 'owner');
          if (error) {
            console.error("Auto-fix failed:", error);
            setPermissionError(true);
          }
        }
      }

      // 2. Fetch Tasks
      const tasksData = await getProjectTasks(id);

      // 3. Map Tasks to Board Columns
      const boardTasks = mapTasksToBoard(tasksData);
      setTasks(boardTasks);

    } catch (error) {
      console.error("Error loading workspace data:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleRepairPermissions = async () => {
    if (!project || !user) return;
    setIsRepairing(true);
    try {
      const { error } = await addProjectMember(project.id, user.id, 'owner');
      if (error) throw error;
      setPermissionError(false);
      alert("Permissions repaired successfully. You can now create tasks.");
    } catch (err) {
      console.error("Manual repair failed:", err);
      alert("Failed to repair permissions automatically. Please contact support or run the SQL fix script.");
    } finally {
      setIsRepairing(false);
    }
  };


  // Convert Backend Tasks to Frontend Task Type & Group by Status
  const mapTasksToBoard = (backendTasks: any[]): Record<string, FrontendTask[]> => {
    const newBoard: Record<string, FrontendTask[]> = {
      todo: [],
      inProgress: [], // CamelCase for frontend
      done: []
    };

    backendTasks.forEach(t => {
      // Map Backend Status to Frontend Column Key
      let columnKey = 'todo';
      if (t.status === 'in_progress') columnKey = 'inProgress';
      else if (t.status === 'done') columnKey = 'done';

      const frontendTask: FrontendTask = {
        id: t.id,
        title: t.title,
        tag: t.priority || 'Medium',
        priority: t.priority,
        dueLabel: t.due_date ? new Date(t.due_date).toLocaleDateString() : undefined,
        description: t.description,
        assignee: {
          name: t.assignee ? `${t.assignee.first_name} ${t.assignee.last_name}` : 'Unassigned',
          avatar: t.assignee?.avatar_url || avatar(Math.floor(Math.random() * 50))
        },
        subtasks: [],
        attachments: [],
        comments: []
      };

      if (newBoard[columnKey]) {
        newBoard[columnKey].push(frontendTask);
      } else {
        newBoard.todo.push(frontendTask); // Fallback
      }
    });

    return newBoard;
  };

  const members = useMemo(
    () => [
      // Mock members for now, ideally fetch project members
      { id: '1', avatar: avatar(45), name: 'Maria Rodriguez' },
      { id: '2', avatar: avatar(12), name: 'Alex Chen' },
    ],
    [],
  );

  const handleCreateTask = async (newTaskData: Omit<FrontendTask, 'id' | 'tag'>) => {
    if (!project || !user) return;

    try {
      console.log('Creating task for project:', project.id);
      const { error } = await createTask({
        project_id: project.id,
        title: newTaskData.title,
        description: newTaskData.description,
        status: 'todo',
        priority: 'Medium', // Must be 'High', 'Medium', or 'Low'
      });

      if (error) {
        console.error("Task creation error:", error);
        setPermissionError(true);
        throw error;
      }

      // Reload tasks to refresh board
      const tasksData = await getProjectTasks(project.id);
      setTasks(mapTasksToBoard(tasksData));
      setShowAddTask(false);

    } catch (error) {
      console.error("Failed to create task:", error);
      alert('Failed to create task. You might be missing permissions. Check the banner above.');
    }
  };

  // Future implementation for drag and drop could go here
  const handleTaskStatusChange = async (taskId: string, newStatus: string) => {
    await updateTaskStatus(taskId, newStatus);
    if (projectId) {
      const tasksData = await getProjectTasks(projectId);
      setTasks(mapTasksToBoard(tasksData));
    }
  };

  const isActive = (path: string) => location.pathname === path;

  if (loading) {
    return (
      <div className="flex bg-slate-50 h-screen items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!project) {
    return <div className="p-8 text-center text-gray-500">Project not found.</div>;
  }

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
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${isActive('/discover')
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
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${isActive('/projects') || isActive(`/projects/${projectId}/workspace`)
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
              src={profile?.avatar_url || avatar(64)}
              alt="Profile"
              className="h-9 w-9 rounded-full ring-2 ring-gray-100"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {profile?.first_name && profile?.last_name
                  ? `${profile.first_name} ${profile.last_name}`
                  : 'User'}
              </div>
              <div className="text-xs text-gray-500 truncate">{profile?.activity || 'Member'}</div>
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

          {/* Permission Error Banner */}
          {permissionError && (
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <div>
                  <h3 className="text-sm font-medium text-amber-800">Permissions Issue Detected</h3>
                  <p className="text-sm text-amber-700 mt-1">
                    You seem to be the creator but are missing necessary permissions to manage tasks.
                  </p>
                </div>
              </div>
              <button
                onClick={handleRepairPermissions}
                disabled={isRepairing}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {isRepairing ? 'Repairing...' : 'Repair Permissions'}
              </button>
            </div>
          )}

          {/* Breadcrumb & Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              <Link to="/projects" className="text-gray-500 hover:text-gray-700">My Projects</Link>{' '}
              <span className="text-gray-700">/ Workspace</span>
            </h1>
          </div>

          {/* Project Status Panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex items-center justify-between">
              {/* Left Side */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">{project.title}</h2>
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-4">{project.description}</p>
                {/* Progress mock for now */}
                <div className="w-full max-w-md">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `35%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">35% Complete</p>
                </div>
              </div>

              {/* Right Side */}
              <div className="flex items-center gap-4">
                {/* Team Avatars */}
                <div className="flex -space-x-3">
                  {/* Mock Members Display */}
                  {members.map((member) => (
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
                    onStatusChange={handleTaskStatusChange}
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
                    onStatusChange={handleTaskStatusChange}
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
                    onStatusChange={handleTaskStatusChange}
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
          members={members as any[]} // TODO fix types
        />
      )}
    </div>
  );
};

export default ProjectWorkspace;
