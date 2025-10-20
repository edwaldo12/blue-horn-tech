import { useState } from 'react';
import { useCreateTask } from '@/hooks/useSchedules';

interface AddTaskFormProps {
  scheduleId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export const AddTaskForm: React.FC<AddTaskFormProps> = ({
  scheduleId,
  onCancel,
  onSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const createTaskMutation = useCreateTask(scheduleId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }

    try {
      await createTaskMutation.mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
      });
      onSuccess();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  return (
    <div className="rounded-lg bg-white p-4 border-2 border-dashed border-gray-300">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg text-sm font-medium"
            placeholder="Task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
        </div>
        
        <div>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg text-sm"
            placeholder="Task description (optional)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-[#0D5D59] text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
            disabled={!title.trim() || createTaskMutation.isPending}
          >
            {createTaskMutation.isPending ? 'Saving...' : 'Save Task'}
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200"
            onClick={onCancel}
            disabled={createTaskMutation.isPending}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};