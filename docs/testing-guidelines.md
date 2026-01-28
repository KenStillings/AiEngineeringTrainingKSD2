# Testing Guidelines

## Overview

This document outlines the testing requirements and best practices for the task management application. All code must be thoroughly tested to ensure reliability, maintainability, and quality.

## Testing Requirements

### Code Coverage Standards

**Minimum Coverage Threshold:** 80%

All components of the application must maintain at least 80% code coverage:

- **Backend Tests:** 80% minimum coverage
- **UI Tests:** 80% minimum coverage
- **Integration Tests:** 80% minimum coverage

Coverage is measured across:
- Line coverage
- Branch coverage
- Function coverage
- Statement coverage

### Mandatory Test Requirements

- **All new features** must include corresponding unit tests
- **All bug fixes** must include tests that verify the fix
- **All code changes** must maintain or improve existing coverage
- **All tests must be maintainable** - Write clear, readable tests that can be easily understood and modified
- Pull requests that reduce coverage below 80% will not be accepted

## Testing Strategy

### Unit Tests

Unit tests verify individual components, functions, and modules in isolation.

**Backend Unit Tests:**
- Test individual functions and methods
- Mock external dependencies (database, APIs, etc.)
- Validate business logic
- Test error handling and edge cases
- Verify input validation

**Frontend Unit Tests:**
- Test individual React components
- Test utility functions and helpers
- Verify component props and state management
- Test user interactions (clicks, inputs, etc.)
- Validate conditional rendering

**Best Practices:**
- Each test should test one specific behavior
- Tests should be independent and not rely on execution order
- Use descriptive test names that explain what is being tested
- Follow the AAA pattern: Arrange, Act, Assert
- Keep tests simple and focused

### Integration Tests

Integration tests verify that multiple components work together correctly.

**Requirements:**
- Test API endpoints with database integration
- Test frontend components with backend API calls
- Verify data flow between layers
- Test authentication and authorization flows
- Validate error handling across system boundaries

**Best Practices:**
- Use test databases or containers for isolation
- Clean up test data after each test
- Test realistic user scenarios
- Verify both success and failure paths

### End-to-End Tests (Optional)

While not required for the 80% coverage threshold, E2E tests are recommended for critical user flows.

**Recommended Scenarios:**
- Complete task creation workflow
- Task editing and history tracking
- Task completion flow
- Task sorting and filtering

## Testing Tools

### Backend
- **Test Runner:** Jest
- **Assertion Library:** Jest built-in assertions
- **Mocking:** Jest mocking utilities
- **Coverage:** Jest coverage reporting

### Frontend
- **Test Runner:** Jest
- **Testing Library:** React Testing Library
- **Component Testing:** @testing-library/react
- **User Event Simulation:** @testing-library/user-event
- **Coverage:** Jest coverage reporting

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Run Backend Tests Only
```bash
cd packages/backend
npm test
```

### Run Frontend Tests Only
```bash
cd packages/frontend
npm test
```

### Watch Mode (Development)
```bash
npm test -- --watch
```

## Coverage Reports

### Viewing Coverage Reports

After running tests with coverage, view the report:
- **Terminal Output:** Summary displayed in console
- **HTML Report:** Open `coverage/lcov-report/index.html` in browser
- **Detailed Report:** Check `coverage/` directory for detailed metrics

### Coverage Thresholds Configuration

Configure Jest to enforce coverage thresholds in `jest.config.js`:

```javascript
module.exports = {
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

## Test Organization

### File Structure

**Backend Tests:**
```
packages/backend/
  __tests__/
    unit/
      services/
      controllers/
      utils/
    integration/
      api/
```

**Frontend Tests:**
```
packages/frontend/
  src/
    __tests__/
      components/
      utils/
      integration/
```

### Naming Conventions

- Test files should be named: `[filename].test.js`
- Test suites should describe the component/function being tested
- Test cases should clearly describe the expected behavior

**Example:**
```javascript
describe('TaskService', () => {
  describe('createTask', () => {
    it('should create a new task with valid data', () => {
      // test implementation
    });
    
    it('should throw an error when task name is missing', () => {
      // test implementation
    });
  });
});
```

## Best Practices

### Writing Testable Code

1. **Keep functions small and focused:** Easier to test single responsibilities
2. **Avoid tight coupling:** Use dependency injection for easier mocking
3. **Separate concerns:** Business logic should be separate from UI logic
4. **Use pure functions:** Functions without side effects are easier to test
5. **Avoid global state:** Makes tests more predictable and isolated

### Test Quality

1. **Test behavior, not implementation:** Focus on what the code does, not how it does it
2. **Write readable tests:** Tests serve as documentation
3. **Test edge cases:** Boundary conditions, null values, empty arrays, etc.
4. **Test error scenarios:** Verify proper error handling
5. **Avoid test duplication:** Use setup/teardown for common test code

### Continuous Testing

1. **Run tests before committing:** Ensure all tests pass locally
2. **Run tests in CI/CD pipeline:** Automated testing on every push
3. **Review test coverage reports:** Identify untested code paths
4. **Update tests with code changes:** Keep tests in sync with implementation
5. **Refactor tests when needed:** Maintain test code quality

## Pre-Commit Checklist

Before submitting a pull request:

- [ ] All new code includes unit tests
- [ ] All tests pass (`npm test`)
- [ ] Coverage meets 80% threshold (`npm test -- --coverage`)
- [ ] Tests are meaningful and test actual behavior
- [ ] No tests are skipped or disabled without justification
- [ ] Test names clearly describe what is being tested
- [ ] Tests follow project conventions and style guide

## Handling Coverage Exceptions

In rare cases where achieving 80% coverage is not feasible (e.g., third-party library wrappers), exceptions may be requested:

1. Document the reason for the exception
2. Get approval from team lead or reviewer
3. Add coverage exclusions to configuration if approved
4. Ensure critical paths are still tested

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Test-Driven Development (TDD)](https://martinfowler.com/bliki/TestDrivenDevelopment.html)
