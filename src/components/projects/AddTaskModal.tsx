import React, { useMemo, useState } from 'react';
import { Check, ChevronDown, Globe2, Plus, X } from 'lucide-react';
import { Task } from '../../types/task';

type Priority = 'Low' | 'Medium' | 'High';
type DueOption = 'Today' | 'Tomorrow' | 'Next Week' | 'Custom';

type Member = {
  id: number;
  name: string;
  avatar: string;
};

type AddTaskModalProps = {
  onClose: () => void;
  onCreate: (task: Omit<Task, 'id' | 'tag'>) => void;
  members: Member[];
};

const priorities: Priority[] = ['Low', 'Medium', 'High'];
const dueOptions: DueOption[] = ['Today', 'Tomorrow', 'Next Week', 'Custom'];

const AddTaskModal: React.FC<AddTaskModalProps> = ({ onClose, onCreate, members }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Low');
  const [due, setDue] = useState<DueOption>('Today');
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>(members[0] ? [members[0].id] : []);
  const [linkInput, setLinkInput] = useState('');
  const [links, setLinks] = useState<string[]>([]);
  const [isPublic] = useState(true);

  const selectedAssignee = useMemo(() => {
    const first = selectedMemberIds[0];
    return members.find((m) => m.id === first) || members[0];
  }, [members, selectedMemberIds]);

  const toggleMember = (id: number) => {
    setSelectedMemberIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  const addLink = () => {
    if (!linkInput.trim()) return;
    setLinks((prev) => [...prev, linkInput.trim()]);
    setLinkInput('');
  };

  const removeLink = (link: string) => {
    setLinks((prev) => prev.filter((l) => l !== link));
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    onCreate({
      title: title.trim(),
      description,
      priority,
      dueLabel: due,
      assignee: selectedAssignee || members[0],
      attachments: links.map((link, idx) => ({
        id: `link-${idx}`,
        type: 'file',
        name: link,
        url: link,
      })),
      subtasks: [],
      comments: [],
      tag: 'New',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl bg-white rounded-[28px] shadow-2xl border border-gray-100 relative overflow-hidden">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-500"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-7 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-gray-900">Create New Task</h2>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                <Globe2 className="w-4 h-4" />
                Public Task
              </span>
            </div>
          </div>

          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-500/60"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <div className="text-sm font-medium text-gray-800">Description</div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details..."
                rows={4}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 resize-none min-h-[140px]"
              />
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-800">Priority</div>
                <div className="relative">
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 appearance-none pr-10"
                  >
                    {priorities.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-800">Due for</div>
                <div className="relative">
                  <select
                    value={due}
                    onChange={(e) => setDue(e.target.value as DueOption)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 appearance-none pr-10"
                  >
                    {dueOptions.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-800">Assign to</div>
            <div className="flex items-center gap-3">
              {members.map((member) => {
                const selected = selectedMemberIds.includes(member.id);
                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => toggleMember(member.id)}
                    className={`relative rounded-full ring-2 ${
                      selected ? 'ring-blue-500' : 'ring-transparent'
                    } transition`}
                  >
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="h-10 w-10 rounded-full border border-white shadow-sm"
                    />
                    {selected && (
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] shadow">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </button>
                );
              })}
              <button
                type="button"
                className="w-10 h-10 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:bg-gray-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-800">Attachments & Links</div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                placeholder="Paste URL..."
                className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
              />
              <button
                type="button"
                onClick={addLink}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {links.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {links.map((link) => (
                  <span
                    key={link}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium"
                  >
                    {link}
                    <button
                      type="button"
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => removeLink(link)}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-semibold text-gray-500 hover:text-gray-700 px-3 py-2"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!title.trim()}
              onClick={handleSubmit}
              className={`px-5 py-2.5 rounded-full text-white text-sm font-semibold shadow-md bg-blue-600 hover:bg-blue-700 transition ${
                !title.trim() ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              Create Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;

