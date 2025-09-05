// Sortable Task Component
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

export default function SortableTask({ task, onTaskClick }) {

  console.log(task);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ task_id: task.task_id || task.tasks?.task_id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 ease-in-out cursor-move"
      onClick={() => onTaskClick(task)}
    >
      <p className="text-slate-800 font-medium">{task.title || task.tasks?.title || undefined}</p>
    </div>
  );
}