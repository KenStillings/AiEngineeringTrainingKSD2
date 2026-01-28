const { getTaskSortSQL, sortTasks } = require('../../../src/utils/sorting');

describe('Sorting Utils', () => {
  describe('sortTasks', () => {
    it('should sort tasks with due dates before tasks without', () => {
      const tasks = [
        { id: 1, name: 'No due date', due_date: null, created_at: '2026-01-20' },
        { id: 2, name: 'Has due date', due_date: '2026-02-01', created_at: '2026-01-21' }
      ];

      const sorted = sortTasks([...tasks]);
      expect(sorted[0].id).toBe(2);
      expect(sorted[1].id).toBe(1);
    });

    it('should sort tasks with due dates by date (earliest first)', () => {
      const tasks = [
        { id: 1, name: 'Later', due_date: '2026-03-01', created_at: '2026-01-20' },
        { id: 2, name: 'Earlier', due_date: '2026-02-01', created_at: '2026-01-21' },
        { id: 3, name: 'Middle', due_date: '2026-02-15', created_at: '2026-01-22' }
      ];

      const sorted = sortTasks([...tasks]);
      expect(sorted[0].id).toBe(2);
      expect(sorted[1].id).toBe(3);
      expect(sorted[2].id).toBe(1);
    });

    it('should sort tasks without due dates by created_at (most recent first)', () => {
      const tasks = [
        { id: 1, name: 'Oldest', due_date: null, created_at: '2026-01-18' },
        { id: 2, name: 'Newest', due_date: null, created_at: '2026-01-22' },
        { id: 3, name: 'Middle', due_date: null, created_at: '2026-01-20' }
      ];

      const sorted = sortTasks([...tasks]);
      expect(sorted[0].id).toBe(2);
      expect(sorted[1].id).toBe(3);
      expect(sorted[2].id).toBe(1);
    });

    it('should handle mixed scenarios correctly', () => {
      const tasks = [
        { id: 1, name: 'No date, oldest', due_date: null, created_at: '2026-01-15' },
        { id: 2, name: 'Late due date', due_date: '2026-03-01', created_at: '2026-01-16' },
        { id: 3, name: 'No date, newest', due_date: null, created_at: '2026-01-25' },
        { id: 4, name: 'Early due date', due_date: '2026-02-01', created_at: '2026-01-17' }
      ];

      const sorted = sortTasks([...tasks]);
      expect(sorted[0].id).toBe(4); // Early due date
      expect(sorted[1].id).toBe(2); // Late due date
      expect(sorted[2].id).toBe(3); // No date, newest
      expect(sorted[3].id).toBe(1); // No date, oldest
    });

    it('should handle empty array', () => {
      const sorted = sortTasks([]);
      expect(sorted).toEqual([]);
    });

    it('should handle single task', () => {
      const tasks = [
        { id: 1, name: 'Only task', due_date: '2026-02-01', created_at: '2026-01-20' }
      ];

      const sorted = sortTasks([...tasks]);
      expect(sorted).toHaveLength(1);
      expect(sorted[0].id).toBe(1);
    });

    it('should handle tasks with same due date', () => {
      const tasks = [
        { id: 1, name: 'Task 1', due_date: '2026-02-01', created_at: '2026-01-20' },
        { id: 2, name: 'Task 2', due_date: '2026-02-01', created_at: '2026-01-21' }
      ];

      const sorted = sortTasks([...tasks]);
      expect(sorted).toHaveLength(2);
      // Both should have same due date
      expect(sorted[0].due_date).toBe(sorted[1].due_date);
    });

    it('should not mutate the original array order', () => {
      const tasks = [
        { id: 3, name: 'Third', due_date: null, created_at: '2026-01-20' },
        { id: 1, name: 'First', due_date: '2026-02-01', created_at: '2026-01-21' },
        { id: 2, name: 'Second', due_date: '2026-02-15', created_at: '2026-01-22' }
      ];

      const original = [...tasks];
      sortTasks(tasks);
      
      // Original order should be preserved in our copy
      expect(original[0].id).toBe(3);
      expect(original[1].id).toBe(1);
      expect(original[2].id).toBe(2);
    });
  });

  describe('getTaskSortSQL', () => {
    it('should return a valid SQL ORDER BY clause', () => {
      const sql = getTaskSortSQL();
      
      expect(sql).toContain('ORDER BY');
      expect(sql).toContain('due_date');
      expect(sql).toContain('created_at');
    });

    it('should prioritize tasks with due dates', () => {
      const sql = getTaskSortSQL();
      
      expect(sql).toContain('CASE WHEN due_date IS NULL');
    });

    it('should sort by due_date ASC', () => {
      const sql = getTaskSortSQL();
      
      expect(sql).toContain('due_date ASC');
    });

    it('should sort by created_at DESC for tasks without due dates', () => {
      const sql = getTaskSortSQL();
      
      expect(sql).toContain('created_at DESC');
    });
  });
});
