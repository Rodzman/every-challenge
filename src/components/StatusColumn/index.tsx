import { StatusCard } from "../StatusCard";
import type { StatusColumnProps } from "./types";
import { useTasksByStatus } from "../../contexts/TasksContext";
import { getColumnStyles } from "./utils";

export const StatusColumn = ({ status }: StatusColumnProps) => {
  const tasks = useTasksByStatus(status);
  const headingId = `${status.replace(/\s+/g, "-").toLowerCase()}-heading`;

  return (
    <section aria-labelledby={headingId} className={getColumnStyles(status)}>
      <h2 id={headingId} className="text-xl font-semibold text-center mb-5 text-gray-800 pb-3 border-b border-gray-200">
        {status}
      </h2>
      <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto">
        {tasks.length > 0 ? (
          tasks.map((task) => <StatusCard key={task.id} task={task} />)
        ) : (
          <div className="text-gray-400 text-center py-12 text-sm italic">
            No tasks yet
          </div>
        )}
      </div>
    </section>
  );
};
