import CreateTaskForm from "./components/CreateTaskForm";
import { StatusColumn } from "./components/StatusColumn";
import { TasksProvider } from "./contexts/TasksContext";

function TaskBoard() {
  return (
    <div className="w-full flex flex-col gap-6 p-6">
      {/* Columns */}
      <div className="flex gap-5 bg-white rounded-xl p-6 items-stretch shadow-sm">
        <StatusColumn status="Todo" />
        <StatusColumn status="In Progress" />
        <StatusColumn status="Done" />
      </div>
      {/* Input */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <CreateTaskForm />
      </div>
    </div>
  );
}

export function ChallengeComponent() {
  return (
    <TasksProvider>
      <TaskBoard />
    </TasksProvider>
  );
}
