# Security Policy

## Supported Versions

We release security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

## Reporting a Vulnerability

**Please DO NOT report security vulnerabilities through public GitHub issues.**

Security is critical for a financial application like Pacioli. We take all security reports seriously.

### Reporting Methods

**Preferred Method: GitHub Security Advisories**

1. Go to [Security Advisories](https://github.com/GiveProtocol/pacioli-plugins/security/advisories)
2. Click "Report a vulnerability"
3. Fill out the form with details
4. Submit privately to maintainers

**Alternative: Email**

Send an email to: **security@pacioli.io**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### What to Include

A good security report includes:

- **Type of vulnerability** (e.g., XSS, data leak, permission bypass)
- **Affected component** (e.g., Plugin SDK, specific plugin)
- **Attack scenario** - How it could be exploited
- **Impact assessment** - What data/functionality is at risk
- **Reproduction steps** - Clear steps to demonstrate the issue
- **Environment details** - Pacioli version, OS, etc.

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity
  - Critical: 7 days
  - High: 14 days
  - Medium: 30 days
  - Low: 90 days

### Disclosure Policy

- We follow **coordinated disclosure**
- Security advisories published after fix is released
- Credit given to reporter (unless anonymity requested)
- CVE assigned for significant vulnerabilities

## Security Best Practices for Plugin Developers

### Plugin Sandboxing

All plugins run in a sandboxed environment with:

- **Limited file system access** - Plugins cannot access arbitrary files
- **Network restrictions** - External requests require permission
- **Database access control** - Only granted tables/columns accessible
- **Memory limits** - Prevent resource exhaustion

### Required Permissions

Plugins must declare all permissions in their manifest:

```typescript
permissions: [
  'transactions:read',      // Read transaction data
  'transactions:write',     // Modify transactions
  'accounts:read',          // Read account data
  'accounts:write',         // Modify accounts
  'network:external',       // Make external API calls
  'storage:local',          // Local storage access
  'ui:settings',            // Settings panel access
]
```

### Secure Coding Guidelines

**Input Validation**
```typescript
// Always validate and sanitize inputs
function processTransaction(input: unknown) {
  const validated = TransactionSchema.parse(input);
  // Process validated data
}
```

**Avoid Hardcoded Secrets**
```typescript
// BAD - Never do this
const API_KEY = 'sk_live_abc123';

// GOOD - Use secure storage
const apiKey = await context.storage.get('api_key');
```

**Safe External Requests**
```typescript
// Validate URLs and use HTTPS
function fetchExternalData(url: string) {
  if (!url.startsWith('https://')) {
    throw new Error('Only HTTPS URLs allowed');
  }
  // Make request
}
```

**Error Handling**
```typescript
// Don't expose sensitive information in errors
try {
  await processPayment(data);
} catch (error) {
  // Don't log sensitive data
  console.error('Payment processing failed');
  throw new Error('Payment failed'); // Generic message
}
```

### Security Checklist

Before publishing your plugin:

- [ ] All inputs validated and sanitized
- [ ] No hardcoded credentials or API keys
- [ ] Minimal permissions requested
- [ ] External requests use HTTPS only
- [ ] Error messages don't leak sensitive data
- [ ] Dependencies are up-to-date
- [ ] Security scanning passed (npm audit)
- [ ] Code review completed
- [ ] Tests include security scenarios

## Plugin Review Process

### Automated Security Checks

All plugins undergo:

- **Dependency scanning** - Check for known vulnerabilities
- **Static analysis** - Code quality and security issues
- **Permission analysis** - Verify requested permissions are necessary
- **License compliance** - Ensure compatible licenses

### Manual Security Review

Official plugins receive manual security review:

- Code review by security team
- Threat modeling
- Penetration testing (if applicable)
- Third-party audit (for high-risk plugins)

## Vulnerability Management

### For Plugin SDK

Security vulnerabilities in the Plugin SDK are:

1. **Assessed** for severity and impact
2. **Patched** in private development branch
3. **Tested** thoroughly
4. **Released** with security advisory
5. **Disclosed** after users have time to update

### For Community Plugins

If we discover vulnerabilities in community plugins:

1. **Contact plugin author** privately
2. **Provide details** and assistance
3. **Set deadline** for fix (based on severity)
4. **Public disclosure** if not fixed in time
5. **Marketplace warning** for vulnerable plugins

## Security Resources

### Tools

- **npm audit** - Check for vulnerable dependencies
- **Snyk** - Continuous security monitoring
- **ESLint security rules** - Catch common issues
- **OWASP ZAP** - Web application security testing

### Documentation

- [Plugin Security Guide](https://docs.pacioli.io/plugins/security)
- [Secure Coding Practices](https://docs.pacioli.io/security/coding)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

## Questions?

For non-sensitive security questions:
- GitHub Discussions
- Community Forum

For sensitive security matters:
- **security@pacioli.io**

---

Thank you for helping keep Pacioli and its ecosystem secure!
