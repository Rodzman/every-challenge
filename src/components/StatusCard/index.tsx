import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { useTasks } from "../../contexts/TasksContext";
import type { StatusCardProps } from "./types";

export const StatusCard = ({ task }: StatusCardProps) => {
  const { moveTask } = useTasks();

  const handleMoveLeft = () => {
    moveTask(task.id, "left");
  };

  const handleMoveRight = () => {
    moveTask(task.id, "right");
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-lg hover:border-gray-300 transition-all duration-200 cursor-move">
      <div className="flex gap-3 items-center justify-between">
        <button
          type="button"
          onClick={handleMoveLeft}
          className="bg-orange-100 text-orange-700 rounded-lg p-2 hover:bg-orange-200 active:bg-orange-300 transition-colors flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-orange-100"
          aria-label="Move task left"
          disabled={task.status === "Todo"}
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h3 className="text-base font-normal text-gray-800 text-center flex-1 px-3 line-clamp-2">
          {task.title}
        </h3>
        <button
          type="button"
          onClick={handleMoveRight}
          className="bg-emerald-100 text-emerald-700 rounded-lg p-2 hover:bg-emerald-200 active:bg-emerald-300 transition-colors flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-emerald-100"
          aria-label="Move task right"
          disabled={task.status === "Done"}
        >
          <ArrowRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
