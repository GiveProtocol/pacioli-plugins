# Contributing to Pacioli Plugins

Thank you for your interest in contributing to Pacioli Plugins! This document provides guidelines for contributing to the plugin ecosystem.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Plugin Development Guidelines](#plugin-development-guidelines)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Publishing Your Plugin](#publishing-your-plugin)

## Code of Conduct

This project adheres to the Contributor Covenant [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How to Contribute

### Ways to Contribute

1. **Create Plugins** - Build new plugins for the community
2. **Improve Plugin SDK** - Enhance the core plugin SDK
3. **Write Documentation** - Improve guides and tutorials
4. **Report Bugs** - Help us identify issues
5. **Suggest Features** - Propose new capabilities

### Before You Start

- Check [existing issues](https://github.com/GiveProtocol/pacioli-plugins/issues) and [pull requests](https://github.com/GiveProtocol/pacioli-plugins/pulls)
- For major changes, open an issue first to discuss your approach
- Review our [Plugin Development Guidelines](#plugin-development-guidelines)

## Development Setup

### Prerequisites

- **Node.js** v18+ and **pnpm**
- **Git**
- **Pacioli Core** (for testing your plugin)

### Initial Setup

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/pacioli-plugins.git
cd pacioli-plugins

# Install dependencies
pnpm install

# Build the Plugin SDK
cd packages/plugin-sdk
pnpm build
```

### Creating a New Plugin

```bash
# From repository root
pnpm create-plugin my-awesome-plugin

# Navigate to your plugin
cd packages/my-awesome-plugin

# Start development
pnpm dev
```

## Plugin Development Guidelines

### Plugin Structure

Every plugin should follow this structure:

```
my-plugin/
├── src/
│   ├── index.ts         # Main entry point
│   ├── types.ts         # Type definitions
│   └── components/      # React components (if needed)
├── tests/
│   └── index.test.ts    # Test files
├── package.json
├── tsconfig.json
├── README.md
└── LICENSE
```

### Plugin Requirements

All plugins must:

1. **Use the Plugin SDK** - Import from `@pacioli/plugin-sdk`
2. **Include TypeScript Types** - Full type safety
3. **Have Tests** - Minimum 80% code coverage
4. **Follow Security Best Practices** - No unauthorized data access
5. **Include Documentation** - Clear README with usage examples
6. **Specify Version Compatibility** - Declare compatible Pacioli versions

### Plugin Manifest

Every plugin needs a manifest:

```typescript
import { PluginManifest } from '@pacioli/plugin-sdk';

export const manifest: PluginManifest = {
  id: 'my-plugin',
  name: 'My Plugin',
  version: '1.0.0',
  author: 'Your Name',
  description: 'What your plugin does',
  homepage: 'https://github.com/username/my-plugin',
  compatibleVersions: '^0.1.0', // Pacioli core versions
  permissions: ['transactions:read', 'accounts:read'],
};
```

### Security Considerations

- **Request minimal permissions** - Only request what you need
- **Validate all inputs** - Never trust external data
- **Handle errors gracefully** - Don't crash the host application
- **No hardcoded secrets** - Use secure storage APIs
- **Sanitize user inputs** - Prevent XSS and injection attacks

## Coding Standards

### TypeScript

- Use **strict mode** in tsconfig.json
- Define explicit **return types** for all functions
- Use **interfaces** over type aliases when possible
- Avoid `any` - use `unknown` if type is truly unknown

### React Components

- Use **functional components** with hooks
- Use **TypeScript** for props
- Follow **React best practices** (memoization, proper dependencies)
- Keep components **small and focused**

### Naming Conventions

- **Files**: `kebab-case.ts`
- **Components**: `PascalCase.tsx`
- **Functions**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Interfaces**: `PascalCase` with descriptive names

### Code Style

We use ESLint and Prettier for code formatting:

```bash
# Check code style
pnpm lint

# Auto-fix issues
pnpm lint:fix

# Format code
pnpm format
```

## Testing

### Test Requirements

- **Unit tests** for all core functionality
- **Integration tests** for Plugin SDK interactions
- **Minimum 80% code coverage**

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

### Example Test

```typescript
import { describe, it, expect } from 'vitest';
import { myPluginFunction } from '../src';

describe('myPluginFunction', () => {
  it('should do something correctly', () => {
    const result = myPluginFunction('input');
    expect(result).toBe('expected output');
  });
});
```

## Pull Request Process

### Before Submitting

1. **Update documentation** - README, code comments, etc.
2. **Run tests** - Ensure all tests pass
3. **Check code style** - Run linter and formatter
4. **Test manually** - Verify your plugin works in Pacioli

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add QuickBooks export functionality
fix: resolve transaction date parsing issue
docs: update plugin development guide
test: add tests for tax calculator
```

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Tests added/updated and passing
- [ ] Documentation updated
- [ ] No breaking changes (or documented if unavoidable)
- [ ] Commits follow conventional commit format
- [ ] Plugin tested in Pacioli core application

### Review Process

1. **Automated checks** - CI/CD runs tests and linting
2. **Code review** - Maintainers review your code
3. **Testing** - We test the plugin functionality
4. **Approval** - Two approvals required for merge
5. **Merge** - Squash and merge to main branch

## Publishing Your Plugin

### Official Plugins

Official plugins (published under `@pacioli/` scope) are maintained by the core team. To contribute an official plugin:

1. Open an issue proposing the plugin
2. Get approval from maintainers
3. Develop the plugin following guidelines
4. Submit PR for review
5. After merge, core team publishes to npm

### Community Plugins

You can publish community plugins independently:

1. **Choose scope** - Use `@pacioli-community/` or your own scope
2. **Build your plugin**:

   ```bash
   pnpm build
   ```

3. **Publish to npm**:

   ```bash
   npm publish --access public
   ```

4. **Register in marketplace** - Submit PR to add your plugin to README

### Plugin Marketplace

To list your plugin in the official marketplace:

1. Ensure plugin meets all requirements
2. Add entry to `community-plugins.json`
3. Submit PR with plugin details
4. Maintainers review and approve

## Questions?

- **GitHub Discussions** - [Ask questions](https://github.com/GiveProtocol/pacioli-plugins/discussions)
- **Community Forum** - [community.pacioli.io](https://community.pacioli.io)
- **Email** - plugins@pacioli.io

---

Thank you for contributing to Pacioli Plugins!
