import KanbanBoard from '@/components/task/kanban/KanbanBoard';
import TaskHeader from '@/components/task/TaskHeader';

export default function KanbanPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <TaskHeader />
        <KanbanBoard />
      </div>
    </div>
  );
}

