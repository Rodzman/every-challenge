/**
 * TaskStatus
 *
 * Represents the possible status values for a task in the task management system.
 * Tasks flow through these statuses in order: Todo → In Progress → Done
 *
 * @typedef {("Todo" | "In Progress" | "Done")} TaskStatus
 *
 * @example
 * ```ts
 * const status: TaskStatus = "Todo";
 * ```
 */
export type TaskStatus = "Todo" | "In Progress" | "Done";

/**
 * Task
 *
 * Represents a single task in the task management system.
 * Each task has a unique identifier, a title, and a status indicating
 * its current position in the workflow.
 *
 * @interface Task
 *
 * @property {string} id - Unique identifier for the task (typically generated using timestamp)
 * @property {string} title - Human-readable title/description of the task
 * @property {TaskStatus} status - Current status of the task in the workflow
 *
 * @example
 * ```ts
 * const task: Task = {
 *   id: "1234567890",
 *   title: "Complete project documentation",
 *   status: "In Progress"
 * };
 * ```
 */
export interface Task {
    id: string;
    title: string;
    status: TaskStatus;
}
