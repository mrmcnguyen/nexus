// Sortable Task Component
import { CSS } from '@dnd-kit/utilities';
import  { useSortable } from '@dnd-kit/sortable';

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
        className="p-4 bg-[#292929] border border-[#454545] rounded shadow hover:bg-[#414141] transition duration-200 ease-in-out cursor-move"
        onClick={() => onTaskClick(task)}
      >
        <p className="text-gray-200">{task.title || task.tasks?.title || undefined}</p>
      </div>
    );
  }