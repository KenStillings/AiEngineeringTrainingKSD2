/**
 * Validates task data for creation or update operations.
 * 
 * @param {Object} taskData - The task data to validate
 * @param {string} taskData.name - Task name
 * @param {string} [taskData.description] - Task description
 * @param {string} [taskData.due_date] - Due date in ISO format
 * @param {boolean} [taskData.completed] - Completion status
 * @param {boolean} isUpdate - Whether this is an update operation
 * @returns {Object} Validation result with isValid and errors
 */
function validateTask(taskData, isUpdate = false) {
  const errors = [];

  // Name validation
  if (!isUpdate && (!taskData.name || typeof taskData.name !== 'string')) {
    errors.push('Task name is required and must be a string');
  } else if (taskData.name !== undefined) {
    if (typeof taskData.name !== 'string') {
      errors.push('Task name must be a string');
    } else if (taskData.name.trim() === '') {
      errors.push('Task name cannot be empty');
    } else if (taskData.name.length > 200) {
      errors.push('Task name must be 200 characters or less');
    }
  }

  // Description validation
  if (taskData.description !== undefined && taskData.description !== null) {
    if (typeof taskData.description !== 'string') {
      errors.push('Task description must be a string');
    } else if (taskData.description.length > 1000) {
      errors.push('Task description must be 1000 characters or less');
    }
  }

  // Due date validation
  if (taskData.due_date !== undefined && taskData.due_date !== null && taskData.due_date !== '') {
    if (typeof taskData.due_date !== 'string') {
      errors.push('Due date must be a string in ISO format');
    } else {
      const date = new Date(taskData.due_date);
      if (isNaN(date.getTime())) {
        errors.push('Due date must be a valid date');
      }
    }
  }

  // Completed validation
  if (taskData.completed !== undefined) {
    if (typeof taskData.completed !== 'number' && typeof taskData.completed !== 'boolean') {
      errors.push('Completed status must be a boolean or number');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates a task ID.
 * 
 * @param {*} id - The ID to validate
 * @returns {Object} Validation result with isValid and error
 */
function validateTaskId(id) {
  const numId = parseInt(id, 10);
  
  if (isNaN(numId) || numId <= 0) {
    return {
      isValid: false,
      error: 'Valid task ID is required'
    };
  }

  return {
    isValid: true,
    id: numId
  };
}

/**
 * Sanitizes task data by trimming strings and normalizing values.
 * 
 * @param {Object} taskData - Task data to sanitize
 * @returns {Object} Sanitized task data
 */
function sanitizeTaskData(taskData) {
  const sanitized = {};

  if (taskData.name !== undefined) {
    sanitized.name = typeof taskData.name === 'string' ? taskData.name.trim() : taskData.name;
  }

  if (taskData.description !== undefined) {
    sanitized.description = taskData.description === null || taskData.description === '' 
      ? null 
      : taskData.description.trim();
  }

  if (taskData.due_date !== undefined) {
    sanitized.due_date = taskData.due_date === null || taskData.due_date === '' 
      ? null 
      : taskData.due_date;
  }

  if (taskData.completed !== undefined) {
    sanitized.completed = taskData.completed ? 1 : 0;
  }

  return sanitized;
}

module.exports = {
  sanitizeTaskData,
  validateTask,
  validateTaskId
};
