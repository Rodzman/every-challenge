import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Task, TaskStatus } from "../../types";
import { StatusColumn } from "./index";

// Mock the useTasksByStatus hook
vi.mock("../../contexts/TasksContext", () => ({
	useTasksByStatus: vi.fn(),
}));

// Mock the StatusCard component
vi.mock("../StatusCard", () => ({
	StatusCard: ({ task }: { task: Task }) => (
		<div data-testid={`task-card-${task.id}`}>{task.title}</div>
	),
}));

// Mock the utils
vi.mock("./utils", () => ({
	getColumnStyles: (status: TaskStatus) => `column-styles-${status}`,
}));

import { useTasksByStatus } from "../../contexts/TasksContext";

describe("StatusColumn", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("Rendering", () => {
		it("renders the status as heading", () => {
			const mockTasks: Task[] = [];
			vi.mocked(useTasksByStatus).mockReturnValue(mockTasks);

			render(<StatusColumn status="Todo" />);

			const heading = screen.getByRole("heading", { name: "Todo" });
			expect(heading).toBeInTheDocument();
		});

		it("renders different statuses correctly", () => {
			const statuses: TaskStatus[] = ["Todo", "In Progress", "Done"];

			statuses.forEach((status) => {
				vi.mocked(useTasksByStatus).mockReturnValue([]);
				const { unmount } = render(<StatusColumn status={status} />);

				const heading = screen.getByRole("heading", { name: status });
				expect(heading).toBeInTheDocument();

				unmount();
			});
		});

		it("applies correct column styles based on status", () => {
			vi.mocked(useTasksByStatus).mockReturnValue([]);

			const { container } = render(<StatusColumn status="In Progress" />);

			const column = container.firstChild as HTMLElement;
			expect(column).toHaveClass("column-styles-In Progress");
		});
	});

	describe("Task rendering", () => {
		it("renders tasks when tasks exist", () => {
			const mockTasks: Task[] = [
				{ id: "1", title: "Task 1", status: "Todo" },
				{ id: "2", title: "Task 2", status: "Todo" },
			];

			vi.mocked(useTasksByStatus).mockReturnValue(mockTasks);

			render(<StatusColumn status="Todo" />);

			expect(screen.getByTestId("task-card-1")).toBeInTheDocument();
			expect(screen.getByTestId("task-card-2")).toBeInTheDocument();
			expect(screen.getByText("Task 1")).toBeInTheDocument();
			expect(screen.getByText("Task 2")).toBeInTheDocument();
		});

		it("renders correct number of tasks", () => {
			const mockTasks: Task[] = [
				{ id: "1", title: "Task 1", status: "Todo" },
				{ id: "2", title: "Task 2", status: "Todo" },
				{ id: "3", title: "Task 3", status: "Todo" },
			];

			vi.mocked(useTasksByStatus).mockReturnValue(mockTasks);

			render(<StatusColumn status="Todo" />);

			const taskCards = screen.getAllByTestId(/task-card-/);
			expect(taskCards).toHaveLength(3);
		});

		it("does not render tasks from other statuses", () => {
			const mockTasks: Task[] = [
				{ id: "1", title: "Todo Task", status: "Todo" },
			];

			vi.mocked(useTasksByStatus).mockReturnValue(mockTasks);

			render(<StatusColumn status="Todo" />);

			expect(screen.getByText("Todo Task")).toBeInTheDocument();
			expect(screen.queryByText("In Progress Task")).not.toBeInTheDocument();
		});
	});

	describe("Empty state", () => {
		it("renders empty state message when no tasks", () => {
			const mockTasks: Task[] = [];
			vi.mocked(useTasksByStatus).mockReturnValue(mockTasks);

			render(<StatusColumn status="Todo" />);

			const emptyMessage = screen.getByText("No tasks yet");
			expect(emptyMessage).toBeInTheDocument();
		});

		it("does not render empty state when tasks exist", () => {
			const mockTasks: Task[] = [{ id: "1", title: "Task 1", status: "Todo" }];

			vi.mocked(useTasksByStatus).mockReturnValue(mockTasks);

			render(<StatusColumn status="Todo" />);

			const emptyMessage = screen.queryByText("No tasks yet");
			expect(emptyMessage).not.toBeInTheDocument();
		});
	});

	describe("Context integration", () => {
		it("calls useTasksByStatus with correct status", () => {
			vi.mocked(useTasksByStatus).mockReturnValue([]);

			render(<StatusColumn status="In Progress" />);

			expect(useTasksByStatus).toHaveBeenCalledWith("In Progress");
		});

		it("updates when tasks change", () => {
			const initialTasks: Task[] = [];
			vi.mocked(useTasksByStatus).mockReturnValue(initialTasks);

			const { rerender } = render(<StatusColumn status="Todo" />);

			expect(screen.getByText("No tasks yet")).toBeInTheDocument();

			const updatedTasks: Task[] = [
				{ id: "1", title: "New Task", status: "Todo" },
			];
			vi.mocked(useTasksByStatus).mockReturnValue(updatedTasks);

			rerender(<StatusColumn status="Todo" />);

			expect(screen.getByText("New Task")).toBeInTheDocument();
			expect(screen.queryByText("No tasks yet")).not.toBeInTheDocument();
		});
	});

	describe("Accessibility", () => {
		it("has proper heading structure", () => {
			vi.mocked(useTasksByStatus).mockReturnValue([]);

			render(<StatusColumn status="Done" />);

			const heading = screen.getByRole("heading", { level: 2 });
			expect(heading).toHaveTextContent("Done");
		});

		it("maintains semantic HTML structure", () => {
			vi.mocked(useTasksByStatus).mockReturnValue([]);

			const { container } = render(<StatusColumn status="Todo" />);

			const heading = container.querySelector("h2");
			expect(heading).toBeInTheDocument();
			expect(heading).toHaveTextContent("Todo");
		});
	});
});
