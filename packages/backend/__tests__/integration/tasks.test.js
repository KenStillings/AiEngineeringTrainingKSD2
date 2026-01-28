const request = require('supertest');

const { app, db } = require('../../src/app');

describe('Task API Integration Tests', () => {
  afterAll(() => {
    if (db) {
      db.close();
    }
  });

  describe('GET /api/tasks', () => {
    it('should return a list of tasks', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return tasks sorted by due date', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      const tasks = response.body;
      
      // Check that tasks with due dates come before those without
      let foundTaskWithoutDueDate = false;
      for (const task of tasks) {
        if (task.due_date === null) {
          foundTaskWithoutDueDate = true;
        } else if (foundTaskWithoutDueDate) {
          // Found a task with due date after one without - sorting is wrong
          fail('Tasks with due dates should come before tasks without');
        }
      }
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return a single task by ID', async () => {
      // Create a task first
      const createResponse = await request(app)
        .post('/api/tasks')
        .send({ name: 'Test Task for Get' });

      const taskId = createResponse.body.id;

      const response = await request(app)
        .get(`/api/tasks/${taskId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', taskId);
      expect(response.body).toHaveProperty('name', 'Test Task for Get');
    });

    it('should return 404 for non-existent task', async () => {
      await request(app)
        .get('/api/tasks/999999')
        .expect(404);
    });

    it('should return 400 for invalid ID', async () => {
      await request(app)
        .get('/api/tasks/invalid')
        .expect(400);
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task with all fields', async () => {
      const newTask = {
        name: 'Test Task',
        description: 'Test description',
        due_date: '2026-02-15',
        completed: 0
      };
      
      const response = await request(app)
        .post('/api/tasks')
        .send(newTask)
        .expect(201)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', 'Test Task');
      expect(response.body).toHaveProperty('description', 'Test description');
      expect(response.body).toHaveProperty('due_date', '2026-02-15');
      expect(response.body).toHaveProperty('completed', 0);
      expect(response.body).toHaveProperty('created_at');
      expect(response.body).toHaveProperty('updated_at');
    });

    it('should create a task with minimal data', async () => {
      const newTask = {
        name: 'Minimal Task'
      };
      
      const response = await request(app)
        .post('/api/tasks')
        .send(newTask)
        .expect(201);

      expect(response.body).toHaveProperty('name', 'Minimal Task');
      expect(response.body.description).toBeNull();
      expect(response.body.due_date).toBeNull();
    });

    it('should return 400 if task name is missing', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ description: 'No name' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid task data', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ name: '' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update an existing task', async () => {
      // Create a task first
      const createResponse = await request(app)
        .post('/api/tasks')
        .send({ name: 'Original Task for Update' });

      const taskId = createResponse.body.id;

      // Update it
      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send({
          name: 'Updated Task',
          description: 'Updated description'
        })
        .expect(200);

      expect(response.body).toHaveProperty('name', 'Updated Task');
      expect(response.body).toHaveProperty('description', 'Updated description');
    });

    it('should return 404 for non-existent task', async () => {
      await request(app)
        .put('/api/tasks/999999')
        .send({ name: 'Updated' })
        .expect(404);
    });

    it('should return 400 for invalid ID', async () => {
      await request(app)
        .put('/api/tasks/invalid')
        .send({ name: 'Updated' })
        .expect(400);
    });

    it('should return 400 for invalid update data', async () => {
      const createResponse = await request(app)
        .post('/api/tasks')
        .send({ name: 'Test Task for Validation' });

      const taskId = createResponse.body.id;

      await request(app)
        .put(`/api/tasks/${taskId}`)
        .send({ name: 'a'.repeat(201) })
        .expect(400);
    });
  });

  describe('PATCH /api/tasks/:id/complete', () => {
    it('should toggle task completion status', async () => {
      // Create a task
      const createResponse = await request(app)
        .post('/api/tasks')
        .send({ name: 'Test Task for Toggle', completed: 0 });

      const taskId = createResponse.body.id;

      // Toggle to completed
      const response1 = await request(app)
        .patch(`/api/tasks/${taskId}/complete`)
        .expect(200);

      expect(response1.body).toHaveProperty('completed', 1);

      // Toggle back to incomplete
      const response2 = await request(app)
        .patch(`/api/tasks/${taskId}/complete`)
        .expect(200);

      expect(response2.body).toHaveProperty('completed', 0);
    });

    it('should return 404 for non-existent task', async () => {
      await request(app)
        .patch('/api/tasks/999999/complete')
        .expect(404);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete an existing task', async () => {
      // Create a task first
      const createResponse = await request(app)
        .post('/api/tasks')
        .send({ name: 'Task to delete' });

      const taskId = createResponse.body.id;

      // Delete it
      const response = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('id', taskId);

      // Verify it's deleted
      await request(app)
        .get(`/api/tasks/${taskId}`)
        .expect(404);
    });

    it('should return 404 for non-existent task', async () => {
      await request(app)
        .delete('/api/tasks/999999')
        .expect(404);
    });

    it('should return 400 for invalid ID', async () => {
      await request(app)
        .delete('/api/tasks/invalid')
        .expect(400);
    });
  });

  describe('GET /api/tasks/:id/history', () => {
    it('should return task history', async () => {
      // Create and update a task
      const createResponse = await request(app)
        .post('/api/tasks')
        .send({ name: 'Test Task for History' });

      const taskId = createResponse.body.id;

      await request(app)
        .put(`/api/tasks/${taskId}`)
        .send({ name: 'Updated Task' });

      // Get history
      const response = await request(app)
        .get(`/api/tasks/${taskId}/history`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('changed_field');
      expect(response.body[0]).toHaveProperty('old_value');
      expect(response.body[0]).toHaveProperty('new_value');
    });

    it('should return empty array for task with no history', async () => {
      const createResponse = await request(app)
        .post('/api/tasks')
        .send({ name: 'Test Task No History' });

      const taskId = createResponse.body.id;

      const response = await request(app)
        .get(`/api/tasks/${taskId}/history`)
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return 400 for invalid ID', async () => {
      await request(app)
        .get('/api/tasks/invalid/history')
        .expect(400);
    });
  });
});
