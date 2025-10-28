# Pacioli Plugins

**Extensible Plugin System for Pacioli**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE-MIT)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE-APACHE)

Official plugin repository for [Pacioli](https://github.com/GiveProtocol/pacioli-core) - the open-source crypto accounting platform for the Polkadot ecosystem.

**Main Repository**: [GiveProtocol/pacioli-core](https://github.com/GiveProtocol/pacioli-core)
**Documentation**: [docs.pacioli.io](https://docs.pacioli.io)

---

## Overview

Pacioli's plugin system allows developers to extend the platform with custom functionality:

- **Custom Transaction Categorizers** - AI/ML-powered categorization
- **Import/Export Formats** - Support for QuickBooks, Xero, etc.
- **Custom Reports** - Specialized financial reports
- **Blockchain Integrations** - Support for additional chains
- **Tax Calculators** - Region-specific tax rules
- **Data Enrichment** - Enhance transactions with external data

---

## Repository Structure

```
pacioli-plugins/
├── packages/
│   ├── plugin-sdk/           # Plugin SDK for developers
│   │   ├── src/
│   │   ├── package.json
│   │   └── README.md
│   └── example-plugins/      # Example plugin implementations
│       ├── hello-world/      # Minimal plugin example
│       ├── transaction-categorizer/  # ML-powered categorization
│       └── quickbooks-export/        # QuickBooks export format
├── docs/                     # Plugin development documentation
│   ├── getting-started.md
│   ├── api-reference.md
│   └── publishing.md
└── README.md                 # This file
```

---

## Quick Start

### For Plugin Users

Install plugins via npm:

```bash
# Install a plugin
npm install @pacioli/plugin-transaction-categorizer

# Or use the Pacioli UI to browse and install plugins
```

### For Plugin Developers

```bash
# Clone the repository
git clone https://github.com/GiveProtocol/pacioli-plugins.git
cd pacioli-plugins

# Install dependencies
pnpm install

# Create a new plugin from template
pnpm create-plugin my-custom-plugin

# Develop your plugin
cd packages/my-custom-plugin
pnpm dev

# Build and publish
pnpm build
pnpm publish
```

---

## Plugin SDK

The Plugin SDK (`@pacioli/plugin-sdk`) provides:

- **Type-safe API** - Full TypeScript support
- **Hooks System** - React hooks for UI integration
- **Database Access** - Query transaction and account data
- **Event System** - Listen to and emit events
- **Storage API** - Persistent plugin configuration
- **Testing Utilities** - Unit and integration testing

### Example Plugin

```typescript
import { createPlugin, PluginManifest } from '@pacioli/plugin-sdk';

const manifest: PluginManifest = {
  id: 'my-plugin',
  name: 'My Custom Plugin',
  version: '1.0.0',
  author: 'Your Name',
  description: 'Does something awesome',
};

export default createPlugin(manifest, {
  onActivate: async (context) => {
    console.log('Plugin activated!');

    // Listen to new transactions
    context.events.on('transaction.created', (transaction) => {
      // Do something with the transaction
    });
  },

  onDeactivate: async () => {
    console.log('Plugin deactivated!');
  },
});
```

---

## Available Plugins

### Official Plugins

| Plugin | Description | Status |
|--------|-------------|--------|
| `@pacioli/plugin-quickbooks-export` | Export to QuickBooks format | Coming Soon |
| `@pacioli/plugin-xero-export` | Export to Xero format | Coming Soon |
| `@pacioli/plugin-tax-calculator-us` | US tax calculations | Coming Soon |
| `@pacioli/plugin-ml-categorizer` | ML-powered categorization | Coming Soon |

### Community Plugins

Check the [Pacioli Plugin Marketplace](https://pacioli.io/plugins) for community-contributed plugins.

---

## Contributing

We welcome plugin contributions! Please read our [Contributing Guide](CONTRIBUTING.md) before submitting.

### Publishing Your Plugin

1. **Develop** - Use the Plugin SDK to build your plugin
2. **Test** - Ensure thorough testing with the test utilities
3. **Document** - Write clear README and API documentation
4. **Publish** - Publish to npm with `@pacioli-community/` scope
5. **Submit** - Open a PR to add your plugin to this README

### Plugin Requirements

- Must use `@pacioli/plugin-sdk`
- Must include TypeScript types
- Must have comprehensive tests (>80% coverage)
- Must follow security best practices
- Must have clear documentation
- Must specify compatible Pacioli versions

---

## Security

Plugin security is critical. All plugins:

- Run in sandboxed environment
- Require explicit permissions
- Cannot access sensitive data without user consent
- Are reviewed before official endorsement

**Report security issues**: security@pacioli.io

See [Security Policy](SECURITY.md) for details.

---

## License

Dual-licensed under your choice of:

- **[MIT License](LICENSE-MIT)** - Simple and permissive
- **[Apache License 2.0](LICENSE-APACHE)** - Includes patent protection

Choose whichever works best for your use case.

---

## Plugin API

### Core Interfaces

```typescript
interface PluginContext {
  // Database queries
  db: {
    transactions: TransactionRepository;
    accounts: AccountRepository;
    // ...
  };

  // Event system
  events: EventEmitter;

  // Storage
  storage: StorageAPI;

  // UI hooks
  ui: {
    registerMenuItem: (item: MenuItem) => void;
    registerSettingsPanel: (panel: SettingsPanel) => void;
  };
}
```

Full API reference: [docs.pacioli.io/api/plugins](https://docs.pacioli.io/api/plugins)

---

## Community & Support

- **GitHub Issues** - [Report bugs](https://github.com/GiveProtocol/pacioli-plugins/issues)
- **GitHub Discussions** - [Ask questions](https://github.com/GiveProtocol/pacioli-plugins/discussions)
- **Community Forum** - [community.pacioli.io](https://community.pacioli.io)
- **Plugin Marketplace** - [pacioli.io/plugins](https://pacioli.io/plugins)

---

## Roadmap

### Current (v0.1)
- Plugin SDK development
- Example plugins
- Documentation

### Coming Soon (v0.2)
- Plugin marketplace
- Visual plugin builder
- Plugin templates

### Future
- Plugin revenue sharing
- Plugin analytics
- Plugin certification program

---

**Made with care by the Pacioli community**
