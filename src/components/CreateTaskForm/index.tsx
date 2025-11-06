import type { FormEvent } from "react";
import { useState } from "react";
import { useTasks } from "../../contexts/TasksContext";

const CreateTaskForm = () => {
	const [title, setTitle] = useState("");
	const { addTask } = useTasks();

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		addTask(title);
		setTitle("");
	};

	return (
		<form onSubmit={handleSubmit} className="flex gap-3 w-full">
			<input
				type="text"
				placeholder="Enter task title..."
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
			/>
			<button
				type="submit"
				disabled={!title.trim()}
				className="bg-blue-600 text-white rounded-lg px-6 py-2.5 font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
			>
				Add Task
			</button>
		</form>
	);
};

export default CreateTaskForm;
