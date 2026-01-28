const { sanitizeTaskData, validateTask, validateTaskId } = require('../../../src/utils/validation');

describe('Validation Utils', () => {
  describe('validateTask', () => {
    describe('for new tasks', () => {
      it('should validate a valid task', () => {
        const taskData = {
          name: 'Test Task',
          description: 'Test description',
          due_date: '2026-02-15',
          completed: false
        };

        const result = validateTask(taskData, false);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should require task name', () => {
        const taskData = {
          description: 'Test description'
        };

        const result = validateTask(taskData, false);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Task name is required and must be a string');
      });

      it('should reject empty task name', () => {
        const taskData = {
          name: '   '
        };

        const result = validateTask(taskData, false);
        expect(result.isValid).toBe(false);
        expect(result.errors.some(e => e.includes('empty'))).toBe(true);
      });

      it('should reject task name longer than 200 characters', () => {
        const taskData = {
          name: 'a'.repeat(201)
        };

        const result = validateTask(taskData, false);
        expect(result.isValid).toBe(false);
        expect(result.errors.some(e => e.includes('200'))).toBe(true);
      });

      it('should reject non-string task name', () => {
        const taskData = {
          name: 123
        };

        const result = validateTask(taskData, false);
        expect(result.isValid).toBe(false);
        expect(result.errors.some(e => e.includes('string'))).toBe(true);
      });

      it('should allow null description', () => {
        const taskData = {
          name: 'Test Task',
          description: null
        };

        const result = validateTask(taskData, false);
        expect(result.isValid).toBe(true);
      });

      it('should reject description longer than 1000 characters', () => {
        const taskData = {
          name: 'Test Task',
          description: 'a'.repeat(1001)
        };

        const result = validateTask(taskData, false);
        expect(result.isValid).toBe(false);
        expect(result.errors.some(e => e.includes('1000'))).toBe(true);
      });

      it('should reject non-string description', () => {
        const taskData = {
          name: 'Test Task',
          description: 123
        };

        const result = validateTask(taskData, false);
        expect(result.isValid).toBe(false);
        expect(result.errors.some(e => e.includes('string'))).toBe(true);
      });

      it('should accept valid due date', () => {
        const taskData = {
          name: 'Test Task',
          due_date: '2026-02-15'
        };

        const result = validateTask(taskData, false);
        expect(result.isValid).toBe(true);
      });

      it('should reject invalid due date', () => {
        const taskData = {
          name: 'Test Task',
          due_date: 'invalid-date'
        };

        const result = validateTask(taskData, false);
        expect(result.isValid).toBe(false);
        expect(result.errors.some(e => e.includes('valid date'))).toBe(true);
      });

      it('should allow null or empty due date', () => {
        const taskData1 = {
          name: 'Test Task',
          due_date: null
        };
        const taskData2 = {
          name: 'Test Task',
          due_date: ''
        };

        expect(validateTask(taskData1, false).isValid).toBe(true);
        expect(validateTask(taskData2, false).isValid).toBe(true);
      });

      it('should accept boolean completed status', () => {
        const taskData = {
          name: 'Test Task',
          completed: true
        };

        const result = validateTask(taskData, false);
        expect(result.isValid).toBe(true);
      });

      it('should accept numeric completed status', () => {
        const taskData = {
          name: 'Test Task',
          completed: 1
        };

        const result = validateTask(taskData, false);
        expect(result.isValid).toBe(true);
      });

      it('should reject invalid completed status', () => {
        const taskData = {
          name: 'Test Task',
          completed: 'yes'
        };

        const result = validateTask(taskData, false);
        expect(result.isValid).toBe(false);
        expect(result.errors.some(e => e.includes('boolean'))).toBe(true);
      });
    });

    describe('for updates', () => {
      it('should allow partial updates', () => {
        const updates = {
          description: 'Updated description'
        };

        const result = validateTask(updates, true);
        expect(result.isValid).toBe(true);
      });

      it('should validate fields that are present', () => {
        const updates = {
          name: 'a'.repeat(201)
        };

        const result = validateTask(updates, true);
        expect(result.isValid).toBe(false);
      });
    });
  });

  describe('validateTaskId', () => {
    it('should validate a valid numeric ID', () => {
      const result = validateTaskId('123');
      expect(result.isValid).toBe(true);
      expect(result.id).toBe(123);
    });

    it('should validate a valid number', () => {
      const result = validateTaskId(456);
      expect(result.isValid).toBe(true);
      expect(result.id).toBe(456);
    });

    it('should reject non-numeric ID', () => {
      const result = validateTaskId('abc');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Valid task ID is required');
    });

    it('should reject negative ID', () => {
      const result = validateTaskId('-5');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Valid task ID is required');
    });

    it('should reject zero ID', () => {
      const result = validateTaskId('0');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Valid task ID is required');
    });

    it('should reject null or undefined', () => {
      expect(validateTaskId(null).isValid).toBe(false);
      expect(validateTaskId(undefined).isValid).toBe(false);
    });
  });

  describe('sanitizeTaskData', () => {
    it('should trim task name', () => {
      const taskData = {
        name: '  Test Task  '
      };

      const result = sanitizeTaskData(taskData);
      expect(result.name).toBe('Test Task');
    });

    it('should trim description', () => {
      const taskData = {
        description: '  Test description  '
      };

      const result = sanitizeTaskData(taskData);
      expect(result.description).toBe('Test description');
    });

    it('should convert empty description to null', () => {
      const taskData = {
        description: ''
      };

      const result = sanitizeTaskData(taskData);
      expect(result.description).toBe(null);
    });

    it('should convert null description to null', () => {
      const taskData = {
        description: null
      };

      const result = sanitizeTaskData(taskData);
      expect(result.description).toBe(null);
    });

    it('should convert empty due_date to null', () => {
      const taskData = {
        due_date: ''
      };

      const result = sanitizeTaskData(taskData);
      expect(result.due_date).toBe(null);
    });

    it('should preserve valid due_date', () => {
      const taskData = {
        due_date: '2026-02-15'
      };

      const result = sanitizeTaskData(taskData);
      expect(result.due_date).toBe('2026-02-15');
    });

    it('should convert completed to 1 for truthy values', () => {
      expect(sanitizeTaskData({ completed: true }).completed).toBe(1);
      expect(sanitizeTaskData({ completed: 1 }).completed).toBe(1);
      expect(sanitizeTaskData({ completed: 'yes' }).completed).toBe(1);
    });

    it('should convert completed to 0 for falsy values', () => {
      expect(sanitizeTaskData({ completed: false }).completed).toBe(0);
      expect(sanitizeTaskData({ completed: 0 }).completed).toBe(0);
      expect(sanitizeTaskData({ completed: '' }).completed).toBe(0);
    });

    it('should only sanitize provided fields', () => {
      const taskData = {
        name: 'Test'
      };

      const result = sanitizeTaskData(taskData);
      expect(result).toHaveProperty('name');
      expect(result).not.toHaveProperty('description');
      expect(result).not.toHaveProperty('due_date');
    });
  });
});
