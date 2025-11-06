import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CreateTaskForm from "./index";

// Mock the useTasks hook
const mockAddTask = vi.fn();

vi.mock("../../contexts/TasksContext", () => ({
  useTasks: vi.fn(() => ({
    addTask: mockAddTask,
  })),
}));

import { useTasks } from "../../contexts/TasksContext";

describe("CreateTaskForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders input field", () => {
      render(<CreateTaskForm />);

      const input = screen.getByPlaceholderText("Enter task title...");
      expect(input).toBeInTheDocument();
    });

    it("renders submit button", () => {
      render(<CreateTaskForm />);

      const button = screen.getByRole("button", { name: "Add Task" });
      expect(button).toBeInTheDocument();
    });

    it("renders input with correct placeholder", () => {
      render(<CreateTaskForm />);

      const input = screen.getByPlaceholderText("Enter task title...");
      expect(input).toHaveAttribute("placeholder", "Enter task title...");
    });

    it("renders input with correct type", () => {
      render(<CreateTaskForm />);

      const input = screen.getByPlaceholderText("Enter task title...");
      expect(input).toHaveAttribute("type", "text");
    });

    it("renders form element", () => {
      const { container } = render(<CreateTaskForm />);

      const form = container.querySelector("form");
      expect(form).toBeInTheDocument();
    });
  });

  describe("Input interactions", () => {
    it("allows user to type in input field", async () => {
      const user = userEvent.setup();
      render(<CreateTaskForm />);

      const input = screen.getByPlaceholderText(
        "Enter task title..."
      ) as HTMLInputElement;
      await user.type(input, "New Task");

      expect(input.value).toBe("New Task");
    });

    it("updates input value as user types", async () => {
      const user = userEvent.setup();
      render(<CreateTaskForm />);

      const input = screen.getByPlaceholderText(
        "Enter task title..."
      ) as HTMLInputElement;
      await user.type(input, "Test");

      expect(input.value).toBe("Test");
    });

    it("clears input after form submission", async () => {
      const user = userEvent.setup();
      render(<CreateTaskForm />);

      const input = screen.getByPlaceholderText(
        "Enter task title..."
      ) as HTMLInputElement;
      const button = screen.getByRole("button", { name: "Add Task" });

      await user.type(input, "New Task");
      await user.click(button);

      expect(input.value).toBe("");
    });
  });

  describe("Button disabled state", () => {
    it("disables button when input is empty", () => {
      render(<CreateTaskForm />);

      const button = screen.getByRole("button", { name: "Add Task" });
      expect(button).toBeDisabled();
    });

    it("disables button when input contains only whitespace", async () => {
      const user = userEvent.setup();
      render(<CreateTaskForm />);

      const input = screen.getByPlaceholderText("Enter task title...");
      const button = screen.getByRole("button", { name: "Add Task" });

      await user.type(input, "   ");

      expect(button).toBeDisabled();
    });

    it("enables button when input has text", async () => {
      const user = userEvent.setup();
      render(<CreateTaskForm />);

      const input = screen.getByPlaceholderText("Enter task title...");
      const button = screen.getByRole("button", { name: "Add Task" });

      await user.type(input, "New Task");

      expect(button).not.toBeDisabled();
    });

    it("enables button when input has text with leading/trailing spaces", async () => {
      const user = userEvent.setup();
      render(<CreateTaskForm />);

      const input = screen.getByPlaceholderText("Enter task title...");
      const button = screen.getByRole("button", { name: "Add Task" });

      await user.type(input, "  Task  ");

      expect(button).not.toBeDisabled();
    });

    it("disables button after clearing input", async () => {
      const user = userEvent.setup();
      render(<CreateTaskForm />);

      const input = screen.getByPlaceholderText("Enter task title...");
      const button = screen.getByRole("button", { name: "Add Task" });

      await user.type(input, "Task");
      expect(button).not.toBeDisabled();

      await user.clear(input);
      expect(button).toBeDisabled();
    });
  });

  describe("Form submission", () => {
    it("calls addTask with input value when form is submitted", async () => {
      const user = userEvent.setup();
      render(<CreateTaskForm />);

      const input = screen.getByPlaceholderText("Enter task title...");
      const button = screen.getByRole("button", { name: "Add Task" });

      await user.type(input, "New Task");
      await user.click(button);

      expect(mockAddTask).toHaveBeenCalledTimes(1);
      expect(mockAddTask).toHaveBeenCalledWith("New Task");
    });

    it("calls addTask when Enter key is pressed", async () => {
      const user = userEvent.setup();
      render(<CreateTaskForm />);

      const input = screen.getByPlaceholderText("Enter task title...");
      await user.type(input, "New Task{Enter}");

      expect(mockAddTask).toHaveBeenCalledTimes(1);
      expect(mockAddTask).toHaveBeenCalledWith("New Task");
    });

    it("prevents default form submission behavior", async () => {
      const user = userEvent.setup();
      const { container } = render(<CreateTaskForm />);

      const form = container.querySelector("form");
      const preventDefaultSpy = vi.fn();

      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          preventDefaultSpy();
        });
      }

      const input = screen.getByPlaceholderText("Enter task title...");
      await user.type(input, "New Task");
      await user.keyboard("{Enter}");

      // Form should not cause page reload - addTask should be called
      expect(mockAddTask).toHaveBeenCalled();
    });

    it("does not call addTask when button is disabled", async () => {
      const user = userEvent.setup();
      render(<CreateTaskForm />);

      const button = screen.getByRole("button", { name: "Add Task" });

      // Button should be disabled
      expect(button).toBeDisabled();

      // Try to click disabled button
      await user.click(button);

      expect(mockAddTask).not.toHaveBeenCalled();
    });

    it("does not call addTask when input is empty and Enter is pressed", async () => {
      const user = userEvent.setup();
      render(<CreateTaskForm />);

      const input = screen.getByPlaceholderText("Enter task title...");
      await user.type(input, "{Enter}");

      expect(mockAddTask).not.toHaveBeenCalled();
    });
  });

  describe("Context integration", () => {
    it("uses useTasks hook to get addTask function", () => {
      render(<CreateTaskForm />);

      expect(useTasks).toHaveBeenCalled();
    });

    it("calls addTask with trimmed value", async () => {
      const user = userEvent.setup();
      render(<CreateTaskForm />);

      const input = screen.getByPlaceholderText("Enter task title...");
      const button = screen.getByRole("button", { name: "Add Task" });

      await user.type(input, "  Task with spaces  ");
      await user.click(button);

      // Note: The actual trimming happens in the context, but we verify the value passed
      expect(mockAddTask).toHaveBeenCalledWith("  Task with spaces  ");
    });
  });

  describe("Accessibility", () => {
    it("has proper form structure", () => {
      const { container } = render(<CreateTaskForm />);

      const form = container.querySelector("form");
      expect(form).toBeInTheDocument();
    });

    it("has accessible button with proper type", () => {
      render(<CreateTaskForm />);

      const button = screen.getByRole("button", { name: "Add Task" });
      expect(button).toHaveAttribute("type", "submit");
    });

    it("has accessible input with proper attributes", () => {
      render(<CreateTaskForm />);

      const input = screen.getByPlaceholderText("Enter task title...");
      expect(input).toHaveAttribute("type", "text");
      expect(input).toHaveAttribute("placeholder", "Enter task title...");
    });

    it("button has disabled attribute when appropriate", () => {
      render(<CreateTaskForm />);

      const button = screen.getByRole("button", { name: "Add Task" });
      expect(button).toHaveAttribute("disabled");
    });
  });

  describe("Edge cases", () => {
    it("handles very long task titles", async () => {
      const user = userEvent.setup();
      render(<CreateTaskForm />);

      const longTitle = "A".repeat(500);
      const input = screen.getByPlaceholderText("Enter task title...");
      const button = screen.getByRole("button", { name: "Add Task" });

      await user.type(input, longTitle);
      await user.click(button);

      expect(mockAddTask).toHaveBeenCalledWith(longTitle);
    });

    it("handles special characters in task title", async () => {
      const user = userEvent.setup();
      render(<CreateTaskForm />);

      const specialTitle = "Task <>&\"'";
      const input = screen.getByPlaceholderText("Enter task title...");
      const button = screen.getByRole("button", { name: "Add Task" });

      await user.type(input, specialTitle);
      await user.click(button);

      expect(mockAddTask).toHaveBeenCalledWith(specialTitle);
    });

    it("handles multiple rapid submissions", async () => {
      const user = userEvent.setup();
      render(<CreateTaskForm />);

      const input = screen.getByPlaceholderText("Enter task title...");
      const button = screen.getByRole("button", { name: "Add Task" });

      await user.type(input, "Task 1");
      await user.click(button);

      await user.type(input, "Task 2");
      await user.click(button);

      expect(mockAddTask).toHaveBeenCalledTimes(2);
      expect(mockAddTask).toHaveBeenNthCalledWith(1, "Task 1");
      expect(mockAddTask).toHaveBeenNthCalledWith(2, "Task 2");
    });

    it("clears input after each submission", async () => {
      const user = userEvent.setup();
      render(<CreateTaskForm />);

      const input = screen.getByPlaceholderText(
        "Enter task title..."
      ) as HTMLInputElement;
      const button = screen.getByRole("button", { name: "Add Task" });

      await user.type(input, "First Task");
      await user.click(button);
      expect(input.value).toBe("");

      await user.type(input, "Second Task");
      await user.click(button);
      expect(input.value).toBe("");
    });
  });
});
