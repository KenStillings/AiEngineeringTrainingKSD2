/**
 * Sorts tasks by due date first, then by creation date.
 * Tasks with due dates appear first (earliest first),
 * followed by tasks without due dates (sorted by creation date).
 * 
 * @param {Array} tasks - Array of task objects
 * @returns {Array} Sorted array of tasks
 */
function sortTasks(tasks) {
  return tasks.sort((a, b) => {
    const aHasDueDate = a.due_date !== null && a.due_date !== undefined;
    const bHasDueDate = b.due_date !== null && b.due_date !== undefined;

    // Both have due dates - sort by due date (earliest first)
    if (aHasDueDate && bHasDueDate) {
      const dateA = new Date(a.due_date);
      const dateB = new Date(b.due_date);
      return dateA - dateB;
    }

    // Only a has due date - a comes first
    if (aHasDueDate && !bHasDueDate) {
      return -1;
    }

    // Only b has due date - b comes first
    if (!aHasDueDate && bHasDueDate) {
      return 1;
    }

    // Neither has due date - sort by created_at (most recent first)
    const createdA = new Date(a.created_at);
    const createdB = new Date(b.created_at);
    return createdB - createdA;
  });
}

/**
 * Gets the SQL ORDER BY clause for task sorting.
 * 
 * @returns {string} SQL ORDER BY clause
 */
function getTaskSortSQL() {
  return `
    ORDER BY 
      CASE WHEN due_date IS NULL THEN 1 ELSE 0 END,
      due_date ASC,
      created_at DESC
  `;
}

module.exports = {
  getTaskSortSQL,
  sortTasks
};
