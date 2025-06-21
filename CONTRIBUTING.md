# Contributing to LLM-OS

Thank you for your interest in contributing to LLM-OS! This document provides guidelines and information for contributors.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please treat all contributors and users with respect.

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Git

### Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/llm-os.git`
3. Install dependencies: `npm install`
4. Copy `.env.example` to `.env.local` and configure your environment variables
5. Start the development server: `npm run dev`

### Project Structure

```
src/
├── app/                 # Next.js App Router pages and API routes
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── shell/          # Terminal shell components
│   ├── launcher/       # App launcher components
│   ├── autonomy/       # Autonomy control components
│   ├── verifier/       # Visual verifier components
│   └── common/         # Common components
├── lib/                 # Utility libraries
│   ├── store/          # Zustand state management
│   ├── llm/            # LLM service integration
│   └── agents/         # Agent orchestration
├── types/               # TypeScript type definitions
└── styles/              # Global styles and CSS
```

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow the existing code formatting (Prettier configuration)
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Follow React best practices and hooks patterns

### Commit Messages

Use conventional commit format:
- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `style:` formatting changes
- `refactor:` code refactoring
- `test:` adding tests
- `chore:` maintenance tasks

Example: `feat: add voice input support to terminal`

### Pull Requests

1. Create a feature branch from `main`
2. Make your changes
3. Add tests if applicable
4. Ensure all tests pass
5. Update documentation if needed
6. Submit a pull request with a clear description

### Testing

- Write unit tests for new components
- Test across different browsers and devices
- Ensure accessibility standards are met
- Test with different LLM providers

## Component Development

### UI Components

- Use the existing design system and tokens
- Ensure components are accessible (ARIA labels, keyboard navigation)
- Support both light and dark themes
- Include TypeScript interfaces for props
- Add proper error handling and loading states

### Integration Components

- Follow the established patterns for LLM integration
- Handle API errors gracefully
- Implement proper loading and error states
- Add user feedback for long-running operations

## Architecture Guidelines

### State Management

- Use Zustand for global state
- Keep component state local when possible
- Implement proper data flow patterns
- Use React Query for server state management

### API Design

- Follow RESTful conventions
- Implement proper error handling
- Add rate limiting and validation
- Document API endpoints

### Performance

- Optimize bundle size (tree shaking, code splitting)
- Implement proper caching strategies
- Use React.memo and useMemo appropriately
- Optimize images and assets

## Security Guidelines

- Never commit API keys or secrets
- Validate all user inputs
- Implement proper authentication checks
- Follow OWASP security guidelines
- Use environment variables for configuration

## Documentation

- Update README.md for significant changes
- Add JSDoc comments for complex functions
- Update the design system documentation
- Include examples in component documentation

## Feature Requests and Bug Reports

### Bug Reports

Include:
- Description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS information
- Screenshots if applicable

### Feature Requests

Include:
- Clear description of the feature
- Use cases and benefits
- Potential implementation approach
- Any relevant research or examples

## Release Process

1. Features are developed in feature branches
2. Pull requests are reviewed and tested
3. Changes are merged to `main`
4. Releases are tagged and deployed
5. Documentation is updated

## Getting Help

- Check existing issues and discussions
- Join our community chat [link]
- Ask questions in discussions
- Review the documentation

## Recognition

Contributors will be acknowledged in:
- README.md contributors section
- Release notes for significant contributions
- Project documentation

Thank you for contributing to LLM-OS! Your contributions help build the future of AI-powered computing interfaces.
