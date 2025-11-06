import type { TaskStatus } from "../../types";

export const getColumnStyles = (status: TaskStatus): string => {
    const baseStyles = "border rounded-lg p-5 flex-1 flex flex-col bg-gray-50";

    switch (status) {
        case "Todo":
            return `${baseStyles} border-blue-200 bg-blue-50/30`;
        case "In Progress":
            return `${baseStyles} border-yellow-200 bg-yellow-50/30`;
        case "Done":
            return `${baseStyles} border-green-200 bg-green-50/30`;
        default:
            return baseStyles;
    }
};
