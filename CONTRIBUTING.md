# Contributing to Predictive Content Publishing Scheduler

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the behavior
- **Expected behavior**
- **Actual behavior**
- **Screenshots** if applicable
- **Environment details** (OS, Node version, browser)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case** - why is this enhancement needed?
- **Proposed solution**
- **Alternative solutions** considered
- **Additional context**

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

#### Pull Request Guidelines

- Follow the existing code style
- Update documentation as needed
- Add tests if applicable
- Ensure all tests pass
- Keep PRs focused on a single feature/fix
- Write clear commit messages

## Development Setup

1. Clone the repository
```bash
git clone https://github.com/sksinha2410/Predictive-Content-Publishing-Scheduler.git
cd Predictive-Content-Publishing-Scheduler
```

2. Run setup script
```bash
./setup.sh
```

3. Configure environment variables
```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your credentials

# Frontend
cd ../frontend
cp .env.example .env
```

4. Seed the database
```bash
cd backend
node seed.js
```

5. Start development servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

## Code Style

### JavaScript/React

- Use ES6+ features
- Follow React best practices
- Use functional components with hooks
- Keep components small and focused
- Use meaningful variable names

### Backend

- Use async/await for asynchronous operations
- Handle errors appropriately
- Validate input data
- Use meaningful HTTP status codes
- Document complex logic

### CSS

- Use BEM naming convention where applicable
- Keep styles modular
- Use CSS variables for colors and common values
- Ensure responsive design

## Project Structure

```
backend/
  ├── controllers/    # Request handlers
  ├── models/        # Database schemas
  ├── routes/        # API routes
  └── server.js      # Entry point

frontend/
  ├── src/
  │   ├── components/    # React components
  │   ├── services/      # API services
  │   └── App.js         # Main app
  └── public/
```

## Testing

Currently, the project doesn't have automated tests. Contributions to add testing are welcome!

### Manual Testing Checklist

Before submitting a PR, ensure:

- [ ] Backend starts without errors
- [ ] Frontend builds successfully
- [ ] All CRUD operations work
- [ ] Calendar drag-and-drop functions
- [ ] Analytics display correctly
- [ ] AI features work (with API key)
- [ ] CSV export generates valid file
- [ ] No console errors
- [ ] Responsive design works

## Git Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests

Examples:
```
Add AI headline generation feature
Fix calendar drag-and-drop on mobile
Update README with setup instructions
Refactor post controller for better error handling
```

## Adding New Features

### Backend Features

1. Create/update model in `models/`
2. Add controller logic in `controllers/`
3. Define routes in `routes/`
4. Update server.js if needed
5. Test endpoints manually or with automated tests
6. Document in API_TESTING.md

### Frontend Features

1. Create component in `components/`
2. Add necessary state management
3. Integrate with backend API
4. Style component with CSS
5. Update parent components as needed
6. Test across different screen sizes

### AI Features

1. Add controller method in `aiController.js`
2. Define route in `routes/ai.js`
3. Implement OpenAI integration
4. Handle errors and edge cases
5. Update frontend to consume new endpoint
6. Document expected response format

## Documentation

When adding features, update:

- README.md - if setup changes
- API_TESTING.md - for new endpoints
- DEMO_GUIDE.md - for new UI features
- ARCHITECTURE.md - for structural changes

## Community

- Be respectful and inclusive
- Help others learn
- Provide constructive feedback
- Follow the code of conduct

## Questions?

Feel free to:
- Open an issue for discussion
- Ask in pull request comments
- Reach out to maintainers

## License

By contributing, you agree that your contributions will be licensed under the ISC License.

Thank you for contributing! 🎉
