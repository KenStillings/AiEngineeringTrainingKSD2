# Coding Guidelines

## Overview

This document outlines the coding standards and best practices for the task management application. Following these guidelines ensures code consistency, readability, and maintainability across the project.

## General Principles

### DRY (Don't Repeat Yourself)
- Avoid code duplication by extracting common logic into reusable functions or components
- Create utility functions for repeated operations
- Use abstraction to eliminate redundant code
- Refactor when you notice patterns repeating more than twice

### KISS (Keep It Simple, Stupid)
- Write simple, straightforward code that's easy to understand
- Avoid over-engineering solutions
- Prefer clarity over cleverness

### YAGNI (You Aren't Gonna Need It)
- Don't add functionality until it's needed
- Avoid premature optimization
- Focus on current requirements

## Import Organization

### Import Order and Formatting

Imports must be organized in the following order, with each section alphabetized:

1. **External dependencies** (from node_modules)
2. **Empty line**
3. **Local imports** (relative paths)

**Example:**
```javascript
// External imports (alphabetized)
import express from 'express';
import path from 'path';
import React, { useState, useEffect } from 'react';

// Local imports (alphabetized)
import { TaskService } from './services/TaskService';
import { validateTask } from './utils/validation';
import './App.css';
```

### Import Rules

- Alphabetize imports within each section (external and local)
- Use named imports when possible for better tree-shaking
- Avoid wildcard imports (`import * as`) unless necessary
- Keep import statements at the top of the file
- Remove unused imports

## Code Formatting

### Indentation

- **Use 2 spaces** for indentation (no tabs)
- Be consistent throughout the file
- Configure your editor to use spaces

**Example:**
```javascript
function processTask(task) {
  if (task.completed) {
    return {
      ...task,
      status: 'done'
    };
  }
  return task;
}
```

### Line Length

- Limit lines to **100 characters** maximum
- Break long lines logically at appropriate points
- Indent continuation lines for readability

### Function Formatting

**Function Declarations:**
```javascript
function calculateDueDate(task, days) {
  const currentDate = new Date();
  return new Date(currentDate.setDate(currentDate.getDate() + days));
}
```

**Arrow Functions:**
```javascript
// Single parameter, single expression (no braces)
const double = num => num * 2;

// Multiple parameters or statements (use braces)
const addTask = (task, list) => {
  const newList = [...list];
  newList.push(task);
  return newList;
};
```

**Async Functions:**
```javascript
async function fetchTasks() {
  try {
    const response = await fetch('/api/tasks');
    const tasks = await response.json();
    return tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
}
```

### Spacing and Brackets

- Add space after keywords: `if (condition)`, `for (let i = 0; ...)`
- Add space around operators: `x + y`, `a === b`
- Opening brace on same line: `function name() {`
- Use braces for all control structures, even single-line statements

**Example:**
```javascript
// Good
if (task.completed) {
  markAsDone(task);
}

// Avoid
if (task.completed) markAsDone(task);
```

## Linting

### ESLint Configuration

The project uses ESLint to enforce code quality and consistency.

**Required Rules:**
- No unused variables
- No console.log in production code (use proper logging)
- Consistent quote style (prefer single quotes)
- Semicolons required
- Proper spacing and indentation
- No trailing whitespace

### Running the Linter

```bash
# Lint all files
npm run lint

# Auto-fix fixable issues
npm run lint:fix
```

### Pre-Commit Hooks

- Linting is enforced via pre-commit hooks
- Code must pass linting before it can be committed
- Fix linting errors before submitting pull requests

## Naming Conventions

### Variables and Functions

- Use **camelCase** for variables and functions
- Use descriptive, meaningful names
- Avoid single-letter names except in loops or lambdas

```javascript
// Good
const taskList = [];
const completedTasks = filterCompletedTasks(tasks);

// Avoid
const tl = [];
const x = filterCompletedTasks(tasks);
```

### Constants

- Use **UPPER_SNAKE_CASE** for true constants

```javascript
const MAX_TASKS_PER_PAGE = 50;
const API_BASE_URL = 'https://api.example.com';
```

### Classes and Components

- Use **PascalCase** for classes and React components

```javascript
class TaskManager {
  constructor() {
    // ...
  }
}

function TaskList({ tasks }) {
  return <div>{/* ... */}</div>;
}
```

### Files and Directories

- Use **camelCase** for JavaScript files: `taskService.js`
- Use **PascalCase** for component files: `TaskList.js`
- Use **kebab-case** for CSS files: `task-list.css`
- Use lowercase for directories: `components/`, `utils/`, `services/`

## Code Structure

### File Organization

Each file should follow this structure:

1. Imports (external, then local)
2. Constants
3. Helper functions
4. Main function/component/class
5. Exports

**Example:**
```javascript
// Imports
import React, { useState } from 'react';
import { validateTask } from './utils/validation';

// Constants
const DEFAULT_PRIORITY = 'medium';

// Helper functions
function formatTaskDate(date) {
  return new Date(date).toLocaleDateString();
}

// Main component
function TaskItem({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  // Component logic
  return <div>{/* ... */}</div>;
}

// Export
export default TaskItem;
```

### Function Length

- Keep functions small and focused (ideally under 50 lines)
- Extract complex logic into helper functions
- Each function should do one thing well

### File Length

- Keep files under 300 lines when possible
- Split large files into smaller, focused modules
- Group related functionality together

## Comments and Documentation

### When to Comment

- Explain **why**, not **what** (code should be self-explanatory)
- Document complex algorithms or business logic
- Add JSDoc comments for public APIs

### Comment Style

**Single-line comments:**
```javascript
// Calculate the due date based on priority
const dueDate = calculateDueDate(task.priority);
```

**Multi-line comments:**
```javascript
/**
 * Processes a batch of tasks and updates their status.
 * Handles errors gracefully and logs failed operations.
 * 
 * @param {Array} tasks - Array of task objects
 * @returns {Object} Processing results with success/failure counts
 */
function processBatchTasks(tasks) {
  // Implementation
}
```

### JSDoc for Functions

Document public functions and APIs:

```javascript
/**
 * Creates a new task with the provided details.
 * 
 * @param {string} name - The task name
 * @param {string} description - The task description
 * @param {Date} dueDate - Optional due date
 * @returns {Promise<Object>} The created task object
 * @throws {ValidationError} If task data is invalid
 */
async function createTask(name, description, dueDate) {
  // Implementation
}
```

## Error Handling

### Try-Catch Blocks

- Use try-catch for asynchronous operations
- Provide meaningful error messages
- Log errors appropriately

```javascript
async function saveTask(task) {
  try {
    const response = await api.post('/tasks', task);
    return response.data;
  } catch (error) {
    console.error('Failed to save task:', error.message);
    throw new Error('Unable to save task. Please try again.');
  }
}
```

### Input Validation

- Validate all user inputs
- Validate data at API boundaries
- Return clear error messages

```javascript
function validateTaskName(name) {
  if (!name || typeof name !== 'string') {
    throw new Error('Task name must be a non-empty string');
  }
  if (name.length > 200) {
    throw new Error('Task name must be 200 characters or less');
  }
  return true;
}
```

## React-Specific Guidelines

### Component Structure

```javascript
function TaskComponent({ task, onUpdate }) {
  // Hooks at the top
  const [isEditing, setIsEditing] = useState(false);
  const [localTask, setLocalTask] = useState(task);
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [task]);
  
  // Event handlers
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  // Render helpers
  const renderEditMode = () => {
    return <div>{/* ... */}</div>;
  };
  
  // Main render
  return (
    <div>
      {isEditing ? renderEditMode() : <div>{task.name}</div>}
    </div>
  );
}
```

### Props and State

- Destructure props in function parameters
- Use meaningful prop names
- Validate props with PropTypes or TypeScript

### Hooks Rules

- Only call hooks at the top level
- Only call hooks from React functions
- Follow the Rules of Hooks

## Best Practices

### Code Reusability

- Extract reusable logic into utility functions
- Create shared components for common UI patterns
- Use custom hooks for shared React logic

### Performance

- Avoid premature optimization
- Use React.memo for expensive components
- Implement pagination for large lists
- Debounce or throttle expensive operations

### Security

- Sanitize user inputs
- Avoid using `eval()` or `innerHTML`
- Validate data on both client and server
- Use environment variables for sensitive data

### Accessibility

- Use semantic HTML elements
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Maintain proper heading hierarchy

## Version Control

### Commit Messages

Follow the conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Example:**
```
feat(tasks): add task history tracking

Implement history tracking for all task modifications.
Stores timestamp and changed fields for each update.

Closes #123
```

### Branch Naming

- Use descriptive branch names
- Format: `type/short-description`
- Examples: `feature/task-editing`, `fix/sorting-bug`, `docs/update-readme`

## Tools and Configuration

### Editor Configuration

Use `.editorconfig` to maintain consistency:

```ini
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```

### Prettier Configuration

Use Prettier for automatic code formatting:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "avoid"
}
```

## Code Review Checklist

Before submitting code for review:

- [ ] Code follows all style guidelines
- [ ] Imports are properly organized and alphabetized
- [ ] Functions are properly formatted and documented
- [ ] No linting errors or warnings
- [ ] Tests are included and passing
- [ ] Code follows DRY principle
- [ ] No unnecessary comments or console.logs
- [ ] Variables and functions have meaningful names
- [ ] Error handling is implemented
- [ ] Code is readable and maintainable

## Resources

- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
- [ESLint Documentation](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)
- [React Best Practices](https://react.dev/learn)
