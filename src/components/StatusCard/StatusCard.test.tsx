import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Task, TaskStatus } from "../../types";
import { StatusCard } from "./index";

// Mock the useTasks hook
const mockMoveTask = vi.fn();

vi.mock("../../contexts/TasksContext", () => ({
	useTasks: vi.fn(() => ({
		moveTask: mockMoveTask,
	})),
}));

// Mock heroicons
vi.mock("@heroicons/react/24/outline", () => ({
	ArrowLeftIcon: ({ className }: { className?: string }) => (
		<svg data-testid="arrow-left-icon" className={className} />
	),
	ArrowRightIcon: ({ className }: { className?: string }) => (
		<svg data-testid="arrow-right-icon" className={className} />
	),
}));

import { useTasks } from "../../contexts/TasksContext";

describe("StatusCard", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	const createMockTask = (
		id: string,
		title: string,
		status: TaskStatus,
	): Task => ({
		id,
		title,
		status,
	});

	describe("Rendering", () => {
		it("renders task title", () => {
			const task = createMockTask("1", "Test Task", "Todo");
			render(<StatusCard task={task} />);

			expect(screen.getByText("Test Task")).toBeInTheDocument();
		});

		it("renders task title as heading", () => {
			const task = createMockTask("1", "My Task", "In Progress");
			render(<StatusCard task={task} />);

			const heading = screen.getByRole("heading", { level: 3 });
			expect(heading).toHaveTextContent("My Task");
		});

		it("renders both arrow buttons", () => {
			const task = createMockTask("1", "Test Task", "In Progress");
			render(<StatusCard task={task} />);

			expect(screen.getByTestId("arrow-left-icon")).toBeInTheDocument();
			expect(screen.getByTestId("arrow-right-icon")).toBeInTheDocument();
		});

		it("renders buttons with correct aria labels", () => {
			const task = createMockTask("1", "Test Task", "In Progress");
			render(<StatusCard task={task} />);

			expect(
				screen.getByRole("button", { name: 'Move "Test Task" left' }),
			).toBeInTheDocument();
			expect(
				screen.getByRole("button", { name: 'Move "Test Task" right' }),
			).toBeInTheDocument();
		});
	});

	describe("Button disabled states", () => {
		it("disables left button when task status is Todo", () => {
			const task = createMockTask("1", "Test Task", "Todo");
			render(<StatusCard task={task} />);

			const leftButton = screen.getByRole("button", {
				name: 'Move "Test Task" left',
			});
			expect(leftButton).toBeDisabled();
		});

		it("enables left button when task status is In Progress", () => {
			const task = createMockTask("1", "Test Task", "In Progress");
			render(<StatusCard task={task} />);

			const leftButton = screen.getByRole("button", {
				name: 'Move "Test Task" left',
			});
			expect(leftButton).not.toBeDisabled();
		});

		it("enables left button when task status is Done", () => {
			const task = createMockTask("1", "Test Task", "Done");
			render(<StatusCard task={task} />);

			const leftButton = screen.getByRole("button", {
				name: 'Move "Test Task" left',
			});
			expect(leftButton).not.toBeDisabled();
		});

		it("disables right button when task status is Done", () => {
			const task = createMockTask("1", "Test Task", "Done");
			render(<StatusCard task={task} />);

			const rightButton = screen.getByRole("button", {
				name: 'Move "Test Task" right',
			});
			expect(rightButton).toBeDisabled();
		});

		it("enables right button when task status is Todo", () => {
			const task = createMockTask("1", "Test Task", "Todo");
			render(<StatusCard task={task} />);

			const rightButton = screen.getByRole("button", {
				name: 'Move "Test Task" right',
			});
			expect(rightButton).not.toBeDisabled();
		});

		it("enables right button when task status is In Progress", () => {
			const task = createMockTask("1", "Test Task", "In Progress");
			render(<StatusCard task={task} />);

			const rightButton = screen.getByRole("button", {
				name: 'Move "Test Task" right',
			});
			expect(rightButton).not.toBeDisabled();
		});

		it("enables both buttons when task status is In Progress", () => {
			const task = createMockTask("1", "Test Task", "In Progress");
			render(<StatusCard task={task} />);

			const leftButton = screen.getByRole("button", {
				name: 'Move "Test Task" left',
			});
			const rightButton = screen.getByRole("button", {
				name: 'Move "Test Task" right',
			});

			expect(leftButton).not.toBeDisabled();
			expect(rightButton).not.toBeDisabled();
		});
	});

	describe("Button interactions", () => {
		it("calls moveTask with correct parameters when left button is clicked", async () => {
			const user = userEvent.setup();
			const task = createMockTask("123", "Test Task", "In Progress");
			render(<StatusCard task={task} />);

			const leftButton = screen.getByRole("button", {
				name: 'Move "Test Task" left',
			});
			await user.click(leftButton);

			expect(mockMoveTask).toHaveBeenCalledTimes(1);
			expect(mockMoveTask).toHaveBeenCalledWith("123", "left");
		});

		it("calls moveTask with correct parameters when right button is clicked", async () => {
			const user = userEvent.setup();
			const task = createMockTask("456", "Test Task", "Todo");
			render(<StatusCard task={task} />);

			const rightButton = screen.getByRole("button", {
				name: 'Move "Test Task" right',
			});
			await user.click(rightButton);

			expect(mockMoveTask).toHaveBeenCalledTimes(1);
			expect(mockMoveTask).toHaveBeenCalledWith("456", "right");
		});

		it("does not call moveTask when disabled left button is clicked", async () => {
			const user = userEvent.setup();
			const task = createMockTask("1", "Test Task", "Todo");
			render(<StatusCard task={task} />);

			const leftButton = screen.getByRole("button", {
				name: 'Move "Test Task" left',
			});
			await user.click(leftButton);

			expect(mockMoveTask).not.toHaveBeenCalled();
		});

		it("does not call moveTask when disabled right button is clicked", async () => {
			const user = userEvent.setup();
			const task = createMockTask("1", "Test Task", "Done");
			render(<StatusCard task={task} />);

			const rightButton = screen.getByRole("button", {
				name: 'Move "Test Task" right',
			});
			await user.click(rightButton);

			expect(mockMoveTask).not.toHaveBeenCalled();
		});
	});

	describe("Context integration", () => {
		it("uses useTasks hook to get moveTask function", () => {
			const task = createMockTask("1", "Test Task", "In Progress");
			render(<StatusCard task={task} />);

			expect(useTasks).toHaveBeenCalled();
		});

		it("handles different task IDs correctly", async () => {
			const user = userEvent.setup();
			const task1 = createMockTask("task-1", "Task 1", "In Progress");
			const task2 = createMockTask("task-2", "Task 2", "In Progress");

			const { rerender } = render(<StatusCard task={task1} />);
			const leftButton = screen.getByRole("button", {
				name: 'Move "Task 1" left',
			});
			await user.click(leftButton);

			expect(mockMoveTask).toHaveBeenCalledWith("task-1", "left");

			mockMoveTask.mockClear();
			rerender(<StatusCard task={task2} />);
			const newLeftButton = screen.getByRole("button", {
				name: 'Move "Task 2" left',
			});
			await user.click(newLeftButton);

			expect(mockMoveTask).toHaveBeenCalledWith("task-2", "left");
		});
	});

	describe("Accessibility", () => {
		it("has proper button roles", () => {
			const task = createMockTask("1", "Test Task", "In Progress");
			render(<StatusCard task={task} />);

			const buttons = screen.getAllByRole("button");
			expect(buttons).toHaveLength(2);
		});

		it("has descriptive aria-labels for buttons", () => {
			const task = createMockTask("1", "Test Task", "In Progress");
			render(<StatusCard task={task} />);

			expect(
				screen.getByRole("button", { name: 'Move "Test Task" left' }),
			).toHaveAttribute("aria-label", 'Move "Test Task" left');
			expect(
				screen.getByRole("button", { name: 'Move "Test Task" right' }),
			).toHaveAttribute("aria-label", 'Move "Test Task" right');
		});

		it("maintains semantic structure with heading", () => {
			const task = createMockTask("1", "Test Task", "In Progress");
			const { container } = render(<StatusCard task={task} />);

			const heading = container.querySelector("h3");
			expect(heading).toBeInTheDocument();
			expect(heading).toHaveTextContent("Test Task");
		});
	});

	describe("Edge cases", () => {
		it("handles long task titles", () => {
			const longTitle = "A".repeat(100);
			const task = createMockTask("1", longTitle, "In Progress");
			render(<StatusCard task={task} />);

			expect(screen.getByText(longTitle)).toBeInTheDocument();
		});

		it("handles empty task title", () => {
			const task = createMockTask("1", "", "In Progress");
			render(<StatusCard task={task} />);

			const heading = screen.getByRole("heading", { level: 3 });
			expect(heading).toHaveTextContent("");
		});

		it("handles special characters in task title", () => {
			const task = createMockTask("1", "Task <>&\"'", "In Progress");
			render(<StatusCard task={task} />);

			expect(screen.getByText("Task <>&\"'")).toBeInTheDocument();
		});
	});
});
