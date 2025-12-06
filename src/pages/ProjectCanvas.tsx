import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Share2,
  MousePointer,
  Hand,
  Image as ImageIcon,
  Type,
  Pen,
  StickyNote,
  MessageCircle,
  Send,
  Minus,
  Plus,
  X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Helper pour générer des avatars
const avatar = (id: number) => `https://i.pravatar.cc/120?img=${id}`;

type Tool = 'select' | 'hand' | 'image' | 'text' | 'pen' | 'note';

interface CanvasNode {
  id: string;
  type: 'wireframe' | 'image' | 'chart' | 'annotation';
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected?: boolean;
  comments?: number;
  content?: string;
}

interface ViewState {
  x: number;
  y: number;
  scale: number;
}

interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  nodeId: string | null;
  isResizing: boolean;
  resizeHandle: 'nw' | 'ne' | 'sw' | 'se' | null;
}

const ProjectCanvas: React.FC = () => {
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [title, setTitle] = useState('Project Canvas');
  const [view, setView] = useState<ViewState>({ x: 0, y: 0, scale: 1 });
  const [nodes, setNodes] = useState<CanvasNode[]>([
    {
      id: '1',
      type: 'wireframe',
      x: 100,
      y: 150,
      width: 400,
      height: 300,
      isSelected: false,
      comments: 2,
    },
    {
      id: '2',
      type: 'image',
      x: 550,
      y: 150,
      width: 350,
      height: 250,
      isSelected: false,
      comments: 1,
    },
    {
      id: '3',
      type: 'annotation',
      x: 100,
      y: 500,
      width: 400,
      height: 300,
      content: 'SVG',
    },
    {
      id: '4',
      type: 'chart',
      x: 550,
      y: 500,
      width: 350,
      height: 300,
      comments: 1,
    },
  ]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    nodeId: null,
    isResizing: false,
    resizeHandle: null,
  });
  const [isPanning, setIsPanning] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  useAuth(); // Keep context active

  const teamMembers = [
    { id: 1, avatar: avatar(12), name: 'Alex' },
    { id: 2, avatar: avatar(45), name: 'Sarah' },
    { id: 3, avatar: avatar(33), name: 'James' },
  ];

  const comments = [
    { author: 'Alex', text: 'Great ideas here!', time: '10:30 AM' },
    { author: 'Sarah', text: "Let's add the flow chart.", time: '10:35 AM' },
    { author: 'Alex', text: "Let's add the stome!", time: '10:35 AM' },
    { author: 'Alex', text: 'Heli.', time: '9:25 AM' },
  ];

  // Gestion du zoom
  const handleZoomIn = () => {
    setView((prev) => ({ ...prev, scale: Math.min(prev.scale + 0.1, 2) }));
  };

  const handleZoomOut = () => {
    setView((prev) => ({ ...prev, scale: Math.max(prev.scale - 0.1, 0.5) }));
  };

  // Gestion de la sélection des nœuds
  const handleNodeClick = useCallback(
    (e: React.MouseEvent, nodeId: string) => {
      e.stopPropagation();
      if (activeTool === 'select') {
        setNodes((prev) =>
          prev.map((node) => ({
            ...node,
            isSelected: node.id === nodeId,
          }))
        );
      }
    },
    [activeTool]
  );

  // Gestion du double-clic pour panning en mode Select
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      const isNode = target.closest('.canvas-node');
      const isChatCard = target.closest('.chat-card');

      // Ne pas panning si on double-clique sur un nœud ou le chat
      if (isNode || isChatCard) {
        return;
      }

      if (activeTool === 'select') {
        setIsPanning(true);
        setDragState({
          isDragging: true,
          startX: e.clientX - view.x,
          startY: e.clientY - view.y,
          nodeId: null,
          isResizing: false,
          resizeHandle: null,
        });
      }
    },
    [activeTool, view.x, view.y]
  );

  // Gestion du début de drag (panning ou node)
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      const isResizeHandle = target.classList.contains('resize-handle');
      const isNode = target.closest('.canvas-node');
      const isChatButton = target.closest('.chat-button');
      const isChatCard = target.closest('.chat-card');

      // Ignorer si on clique sur le chat
      if (isChatButton || isChatCard) {
        return;
      }

      // Gestion du resize
      if (isResizeHandle && activeTool === 'select') {
        const nodeElement = target.closest('.canvas-node') as HTMLElement;
        if (nodeElement) {
          const nodeId = nodeElement.dataset.nodeId;
          const handle = target.dataset.handle as 'nw' | 'ne' | 'sw' | 'se';
          // getBoundingClientRect available if needed for future calculations
          setDragState({
            isDragging: true,
            startX: e.clientX,
            startY: e.clientY,
            nodeId: nodeId || null,
            isResizing: true,
            resizeHandle: handle,
          });
          e.stopPropagation();
          return;
        }
      }

      // Gestion du drag de nœud
      if (isNode && activeTool === 'select') {
        const nodeElement = isNode as HTMLElement;
        const nodeId = nodeElement.dataset.nodeId;
        if (nodeId) {
          const node = nodes.find((n) => n.id === nodeId);
          if (node) {
            setDragState({
              isDragging: true,
              startX: e.clientX - view.x - node.x * view.scale,
              startY: e.clientY - view.y - node.y * view.scale,
              nodeId: nodeId,
              isResizing: false,
              resizeHandle: null,
            });
            // Sélectionner le nœud si pas déjà sélectionné
            if (!node.isSelected) {
              setNodes((prev) =>
                prev.map((n) => ({
                  ...n,
                  isSelected: n.id === nodeId,
                }))
              );
            }
          }
        }
        e.stopPropagation();
        return;
      }

      // Gestion du panning
      if (activeTool === 'hand' || (activeTool === 'select' && isPanning)) {
        setIsPanning(true);
        setDragState({
          isDragging: true,
          startX: e.clientX - view.x,
          startY: e.clientY - view.y,
          nodeId: null,
          isResizing: false,
          resizeHandle: null,
        });
      }
    },
    [activeTool, nodes, view, isPanning]
  );

  // Gestion du mouvement de la souris
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState.isDragging) return;

      if (dragState.isResizing && dragState.nodeId && dragState.resizeHandle) {
        // Resize du nœud
        const node = nodes.find((n) => n.id === dragState.nodeId);
        if (node) {
          const deltaX = (e.clientX - dragState.startX) / view.scale;
          const deltaY = (e.clientY - dragState.startY) / view.scale;

          let newWidth = node.width;
          let newHeight = node.height;
          let newX = node.x;
          let newY = node.y;

          switch (dragState.resizeHandle) {
            case 'se':
              newWidth = Math.max(50, node.width + deltaX);
              newHeight = Math.max(50, node.height + deltaY);
              break;
            case 'sw':
              newWidth = Math.max(50, node.width - deltaX);
              newHeight = Math.max(50, node.height + deltaY);
              newX = node.x + (node.width - newWidth);
              break;
            case 'ne':
              newWidth = Math.max(50, node.width + deltaX);
              newHeight = Math.max(50, node.height - deltaY);
              newY = node.y + (node.height - newHeight);
              break;
            case 'nw':
              newWidth = Math.max(50, node.width - deltaX);
              newHeight = Math.max(50, node.height - deltaY);
              newX = node.x + (node.width - newWidth);
              newY = node.y + (node.height - newHeight);
              break;
          }

          setNodes((prev) =>
            prev.map((n) =>
              n.id === dragState.nodeId
                ? { ...n, width: newWidth, height: newHeight, x: newX, y: newY }
                : n
            )
          );
          setDragState((prev) => ({
            ...prev,
            startX: e.clientX,
            startY: e.clientY,
          }));
        }
      } else if (dragState.nodeId) {
        // Déplacement du nœud
        const newX = (e.clientX - dragState.startX - view.x) / view.scale;
        const newY = (e.clientY - dragState.startY - view.y) / view.scale;

        setNodes((prev) =>
          prev.map((node) =>
            node.id === dragState.nodeId
              ? { ...node, x: newX, y: newY }
              : node
          )
        );
      } else {
        // Panning du canvas
        setView({
          ...view,
          x: e.clientX - dragState.startX,
          y: e.clientY - dragState.startY,
        });
      }
    },
    [dragState, nodes, view]
  );

  // Gestion de la fin du drag
  const handleMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      startX: 0,
      startY: 0,
      nodeId: null,
      isResizing: false,
      resizeHandle: null,
    });
    setIsPanning(false);
  }, []);

  // Ajout des event listeners globaux
  useEffect(() => {
    if (dragState.isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState.isDragging, handleMouseMove, handleMouseUp]);

  // Gestion de l'ouverture/fermeture du chat
  const handleChatClick = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setActiveChatId(activeChatId === nodeId ? null : nodeId);
  }, [activeChatId]);

  const handleCloseChat = useCallback(() => {
    setActiveChatId(null);
  }, []);

  // Curseur dynamique
  const getCanvasCursor = () => {
    if (activeTool === 'hand' || isPanning) {
      return dragState.isDragging ? 'grabbing' : 'grab';
    }
    if (activeTool === 'select') {
      return 'default';
    }
    return 'default';
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-gray-100">
      {/* Dotted Grid Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Header - Floating Top Bar */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-xl shadow-2xl border border-gray-100 px-6 py-3 flex items-center justify-between min-w-[800px]">
        <button
          onClick={() => navigate('/projects')}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 mx-4 text-xl font-semibold text-gray-900 bg-transparent border-none outline-none focus:ring-0"
        />
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {teamMembers.map((member) => (
              <img
                key={member.id}
                src={member.avatar}
                alt={member.name}
                className="h-8 w-8 rounded-full ring-2 ring-white border-2 border-white"
              />
            ))}
          </div>
          <button className="px-4 py-2 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>
      </div>

      {/* Toolbar - Floating Left Panel */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 bg-white rounded-xl shadow-xl border border-gray-100 p-2 flex flex-col gap-2">
        <ToolButton
          icon={MousePointer}
          label="Select"
          active={activeTool === 'select'}
          onClick={() => setActiveTool('select')}
        />
        <ToolButton
          icon={Hand}
          label="Hand (Pan)"
          active={activeTool === 'hand'}
          onClick={() => setActiveTool('hand')}
        />
        <ToolButton
          icon={ImageIcon}
          label="Upload Image"
          active={activeTool === 'image'}
          onClick={() => setActiveTool('image')}
        />
        <ToolButton
          icon={Type}
          label="Text"
          active={activeTool === 'text'}
          onClick={() => setActiveTool('text')}
        />
        <ToolButton
          icon={Pen}
          label="Pen (Annotation)"
          active={activeTool === 'pen'}
          onClick={() => setActiveTool('pen')}
        />
        <ToolButton
          icon={StickyNote}
          label="Sticky Note"
          active={activeTool === 'note'}
          onClick={() => setActiveTool('note')}
        />
      </div>

      {/* Canvas Area - World Container */}
      <div
        ref={canvasRef}
        className="absolute inset-0 overflow-hidden"
        style={{
          cursor: getCanvasCursor(),
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      >
        <div
          className="relative origin-top-left"
          style={{
            transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
            width: '2000px',
            height: '2000px',
          }}
        >
          {nodes.map((node) => (
            <CanvasNode
              key={node.id}
              node={node}
              activeTool={activeTool}
              activeChatId={activeChatId}
              onNodeClick={handleNodeClick}
              onChatClick={handleChatClick}
              onCloseChat={handleCloseChat}
              comments={comments}
            />
          ))}
        </div>
      </div>

      {/* Zoom Controls - Bottom Right */}
      <div className="fixed bottom-4 right-4 z-50 bg-white rounded-full shadow-xl border border-gray-100 px-4 py-2 flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">
          {Math.round(view.scale * 100)}%
        </span>
        <button
          onClick={handleZoomOut}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Minus className="h-4 w-4 text-gray-600" />
        </button>
        <button
          onClick={handleZoomIn}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Plus className="h-4 w-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

// Tool Button Component
interface ToolButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  highlight?: boolean;
  onClick: () => void;
}

const ToolButton: React.FC<ToolButtonProps> = ({
  icon: Icon,
  label,
  active,
  highlight,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full p-3 rounded-lg transition-all flex flex-col items-center gap-1 ${active || highlight
          ? 'bg-gray-100 text-gray-900'
          : 'text-gray-600 hover:bg-gray-50'
        } ${highlight ? 'bg-yellow-100' : ''}`}
    >
      <Icon className="h-5 w-5" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};

// Canvas Node Component
interface CanvasNodeProps {
  node: CanvasNode;
  activeTool: Tool;
  activeChatId: string | null;
  onNodeClick: (e: React.MouseEvent, nodeId: string) => void;
  onChatClick: (e: React.MouseEvent, nodeId: string) => void;
  onCloseChat: () => void;
  comments: Array<{ author: string; text: string; time: string }>;
}

const CanvasNode: React.FC<CanvasNodeProps> = ({
  node,
  activeTool,
  activeChatId,
  onNodeClick,
  onChatClick,
  onCloseChat,
  comments,
}) => {
  const isSelected = node.isSelected;
  const isChatOpen = activeChatId === node.id;

  return (
    <div
      className="canvas-node absolute"
      data-node-id={node.id}
      style={{
        left: `${node.x}px`,
        top: `${node.y}px`,
        width: `${node.width}px`,
        height: `${node.height}px`,
      }}
      onClick={(e) => onNodeClick(e, node.id)}
    >
      <div
        className={`relative w-full h-full bg-white rounded-lg shadow-lg overflow-visible ${isSelected && activeTool === 'select'
            ? 'ring-2 ring-blue-500 cursor-move'
            : 'cursor-pointer'
          }`}
      >
        {/* Resize Handles */}
        {isSelected && activeTool === 'select' && (
          <>
            <div
              className="resize-handle absolute -top-1 -left-1 w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-nwse-resize z-20"
              data-handle="nw"
            ></div>
            <div
              className="resize-handle absolute -top-1 -right-1 w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-nesw-resize z-20"
              data-handle="ne"
            ></div>
            <div
              className="resize-handle absolute -bottom-1 -left-1 w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-nesw-resize z-20"
              data-handle="sw"
            ></div>
            <div
              className="resize-handle absolute -bottom-1 -right-1 w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-nwse-resize z-20"
              data-handle="se"
            ></div>
          </>
        )}

        {/* Chat Button */}
        <button
          className="chat-button absolute top-2 right-2 z-30 p-1.5 rounded-lg bg-white/90 hover:bg-white shadow-md transition-colors"
          onClick={(e) => onChatClick(e, node.id)}
        >
          <div className="relative">
            <MessageCircle className="h-5 w-5 text-gray-600" />
            {node.comments && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                {node.comments}
              </span>
            )}
          </div>
        </button>

        {/* Chat Card - Contextuel */}
        {isChatOpen && (
          <ChatCard
            nodeId={node.id}
            comments={comments}
            onClose={onCloseChat}
          />
        )}

        {/* Node Content */}
        {node.type === 'wireframe' && (
          <div className="w-full h-full bg-white p-3">
            <div className="w-full h-full border-2 border-gray-400 rounded overflow-hidden">
              {/* Browser Header */}
              <div className="h-10 bg-gray-200 border-b-2 border-gray-300 flex items-center gap-2 px-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 h-6 bg-white rounded border border-gray-300 mx-4"></div>
              </div>
              {/* Content */}
              <div className="p-4 space-y-3 bg-white">
                {/* Navigation Bar */}
                <div className="h-8 bg-gray-200 rounded flex items-center px-3 gap-4">
                  <div className="h-3 w-16 bg-gray-300 rounded"></div>
                  <div className="h-3 w-16 bg-gray-300 rounded"></div>
                  <div className="h-3 w-16 bg-gray-300 rounded"></div>
                </div>
                {/* Content Blocks */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="h-24 bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <X className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="h-24 bg-gray-200 rounded"></div>
                  <div className="h-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {node.type === 'image' && (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <div className="text-center">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <div className="text-gray-500 text-sm">Meeting Photo</div>
            </div>
          </div>
        )}

        {node.type === 'annotation' && (
          <div className="w-full h-full relative">
            <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <div className="text-gray-500 text-sm">Landscape Photo</div>
              </div>
            </div>
            {/* SVG Text Annotation */}
            <div className="absolute top-4 left-4">
              <div className="text-xs font-bold text-gray-900 bg-white/90 px-2 py-1 rounded shadow-sm">
                {node.content}
              </div>
            </div>
            {/* Blue Circle Annotation - Hand-drawn style */}
            <svg
              className="absolute top-1/3 left-1/3"
              width="80"
              height="80"
              viewBox="0 0 80 80"
            >
              <circle
                cx="40"
                cy="40"
                r="30"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  strokeDasharray: '2,2',
                  filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))',
                }}
              />
            </svg>
          </div>
        )}

        {node.type === 'chart' && (
          <div className="w-full h-full bg-white p-4">
            <div className="text-sm font-semibold text-gray-900 mb-4">Data Chart</div>
            <div className="space-y-4">
              {/* Bar Chart */}
              <div className="flex items-end gap-2 h-20">
                <div className="flex-1 bg-blue-500 rounded-t" style={{ height: '60%' }}></div>
                <div className="flex-1 bg-green-500 rounded-t" style={{ height: '80%' }}></div>
                <div className="flex-1 bg-yellow-500 rounded-t" style={{ height: '40%' }}></div>
                <div className="flex-1 bg-purple-500 rounded-t" style={{ height: '70%' }}></div>
                <div className="flex-1 bg-pink-500 rounded-t" style={{ height: '50%' }}></div>
              </div>
              {/* Line Chart */}
              <div className="relative h-16 border-l-2 border-b-2 border-gray-300">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 60">
                  <polyline
                    points="10,50 30,40 50,35 70,25 90,20 110,30 130,15 150,10 170,5 190,8"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Chat Card Component
interface ChatCardProps {
  nodeId: string;
  comments: Array<{ author: string; text: string; time: string }>;
  onClose: () => void;
}

const ChatCard: React.FC<ChatCardProps> = ({ comments, onClose }) => {
  const [commentText, setCommentText] = useState('');

  const handleSendComment = () => {
    if (commentText.trim()) {
      // Handle comment submission
      setCommentText('');
    }
  };

  return (
    <div className="chat-card absolute top-12 right-0 z-40 bg-white rounded-xl shadow-2xl border border-gray-100 w-80">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900">Comments</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>
      </div>
      <div className="p-4 max-h-96 overflow-y-auto">
        <div className="space-y-4">
          {comments.map((comment, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">{comment.author}</span>
                <span className="text-xs text-gray-500">{comment.time}</span>
              </div>
              <p className="text-sm text-gray-700">{comment.text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <button
            onClick={handleSendComment}
            className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCanvas;
