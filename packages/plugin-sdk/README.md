# @pacioli/plugin-sdk

Official Plugin SDK for [Pacioli](https://github.com/GiveProtocol/pacioli-core) - the open-source crypto accounting platform for the Polkadot ecosystem.

## Installation

```bash
npm install @pacioli/plugin-sdk
# or
pnpm add @pacioli/plugin-sdk
# or
yarn add @pacioli/plugin-sdk
```

## Quick Start

### Creating a Plugin

```typescript
import { createPlugin, PluginManifest } from '@pacioli/plugin-sdk';

const manifest: PluginManifest = {
  id: 'my-awesome-plugin',
  name: 'My Awesome Plugin',
  version: '1.0.0',
  author: 'Your Name',
  description: 'Does something awesome with transactions',
  compatibleVersions: '^0.1.0',
  permissions: ['transactions:read'],
};

export default createPlugin(manifest, {
  onActivate: async (context) => {
    console.log('Plugin activated!');

    // Listen to transaction events
    context.events.on('transaction.created', (event) => {
      console.log('New transaction:', event.data);
    });

    // Query transactions
    const transactions = await context.db.transactions.findAll();
    console.log(`Found ${transactions.length} transactions`);
  },

  onDeactivate: async () => {
    console.log('Plugin deactivated!');
  },
});
```

## Features

### Type-Safe API

Full TypeScript support with comprehensive type definitions:

```typescript
import type { Transaction, Account, Category, PluginContext } from '@pacioli/plugin-sdk';
```

### Database Access

Query and modify financial data:

```typescript
// Read transactions
const transactions = await context.db.transactions.findByAddress(address);

// Update transaction category
await context.db.transactions.update(txId, {
  categoryId: categoryId,
  notes: 'Payment for services',
});

// Create custom category
const category = await context.db.categories.create({
  name: 'Mining Rewards',
  type: 'income',
});
```

### Event System

Listen to and react to events:

```typescript
// Listen to specific events
context.events.on('transaction.created', (event) => {
  // Handle new transaction
});

context.events.on('sync.completed', (event) => {
  console.log(`Synced ${event.data.count} transactions`);
});
```

### Persistent Storage

Store plugin configuration and data:

```typescript
// Save settings
await context.storage.set('api_key', userApiKey);

// Load settings
const apiKey = await context.storage.get<string>('api_key');

// List all keys
const keys = await context.storage.keys();
```

### UI Integration

Add custom UI elements:

```typescript
// Add menu item
context.ui.registerMenuItem({
  id: 'my-plugin-settings',
  label: 'My Plugin Settings',
  onClick: () => {
    // Open settings
  },
});

// Add settings panel
context.ui.registerSettingsPanel({
  id: 'my-plugin-settings',
  title: 'My Plugin',
  component: MySettingsComponent,
});

// Show notifications
context.ui.showNotification('Transaction categorized!', 'success');
```

## Permissions

### Overview

Pacioli uses a permission-based security model. Plugins must declare all required permissions in their manifest, and users can review these permissions before installing a plugin.

```typescript
permissions: [
  'transactions:read', // Read transaction data
  'transactions:write', // Modify transactions
  'accounts:read', // Read account data
  'accounts:write', // Modify accounts
  'categories:read', // Read categories
  'categories:write', // Modify categories
  'network:external', // Make external API calls
  'storage:local', // Local storage access
  'ui:settings', // Settings panel
  'ui:menu', // Menu items
  'ui:dashboard', // Dashboard widgets
];
```

### Permission Enforcement Model

**Important**: The SDK only defines the permission types. **Permission enforcement is the responsibility of the host application** that loads plugins.

#### For Plugin Developers

When you declare permissions in your manifest:

```typescript
const manifest = {
  id: 'my-plugin',
  permissions: ['transactions:read', 'transactions:write'],
  // ...
};
```

You're declaring what your plugin **intends to do**. The host app will:

1. Show these permissions to users before installation
2. Enforce these permissions by checking before API calls
3. Throw errors if you try to use APIs without proper permissions

Example of what happens at runtime:

```typescript
// ALLOWED: Plugin has 'transactions:write' permission
await context.db.transactions.update(id, { notes: 'Updated' }); // Works

// DENIED: Plugin doesn't have 'accounts:write' permission
await context.db.accounts.update(id, { label: 'Updated' }); // Throws error
```

#### For Host Application Developers

If you're building a host application that loads plugins, you must enforce permissions. Here's a reference implementation:

```typescript
import { Plugin, TransactionRepository, Transaction } from '@pacioli/plugin-sdk';

class PermissionEnforcedTransactionRepository implements TransactionRepository {
  constructor(
    private plugin: Plugin,
    private actualRepository: TransactionRepository
  ) {}

  // Read operation - check 'transactions:read'
  async findAll(filters?: TransactionFilters): Promise<Transaction[]> {
    if (!this.plugin.manifest.permissions.includes('transactions:read')) {
      throw new Error(`Plugin '${this.plugin.manifest.id}' missing permission: transactions:read`);
    }
    return this.actualRepository.findAll(filters);
  }

  // Write operation - check 'transactions:write'
  async update(id: string, updates: Partial<Transaction>): Promise<Transaction> {
    if (!this.plugin.manifest.permissions.includes('transactions:write')) {
      throw new Error(`Plugin '${this.plugin.manifest.id}' missing permission: transactions:write`);
    }
    return this.actualRepository.update(id, updates);
  }

  // Implement other methods with similar checks...
}

// When activating a plugin, wrap repositories with permission enforcement
function activatePlugin(plugin: Plugin) {
  const context: PluginContext = {
    manifest: plugin.manifest,
    db: {
      transactions: new PermissionEnforcedTransactionRepository(plugin, realTransactionRepository),
      // ... wrap other repositories
    },
    // ... other context properties
  };

  plugin.onActivate?.(context);
}
```

### Permission Best Practices

**For Plugin Developers:**

- Only request permissions you actually need
- Explain why you need each permission in your plugin description
- Handle permission errors gracefully
- Don't request `write` permissions if you only need `read`

**For Host App Developers:**

- Always enforce permissions on every API call
- Show clear permission prompts to users
- Log permission violations for debugging
- Consider implementing permission scopes (e.g., read-only mode)

## Validation

The SDK uses [Zod](https://github.com/colinhacks/zod) for runtime validation and exports schemas you can use.

### Basic Validation

Use `safeParse()` for validation with detailed error messages:

```typescript
import { PluginManifestSchema } from '@pacioli/plugin-sdk';

// Validate a manifest
const result = PluginManifestSchema.safeParse(manifestData);

if (result.success) {
  console.log('Valid manifest:', result.data);
} else {
  console.error('Validation errors:');
  result.error.issues.forEach((issue) => {
    console.error(`  ${issue.path.join('.')}: ${issue.message}`);
  });
}
```

Example validation error output:

```
Validation errors:
  id: Invalid
  version: Invalid
```

For stricter validation that throws on error:

```typescript
// This will throw ZodError if validation fails
const manifest = PluginManifestSchema.parse(manifestData);
```

### Using Zod in Your Plugin

The SDK includes Zod as a dependency, so you can use the exported schemas without installing Zod separately. However, if you want to use Zod for your own validation needs, you should install it explicitly:

```bash
npm install zod
# or
pnpm add zod
```

Then you can use Zod alongside the SDK:

```typescript
import { PluginManifestSchema } from '@pacioli/plugin-sdk';
import { z } from 'zod';

// Use SDK schemas
const manifestResult = PluginManifestSchema.safeParse(data);

// Define your own schemas
const MyConfigSchema = z.object({
  apiKey: z.string(),
  enabled: z.boolean(),
});

const configResult = MyConfigSchema.safeParse(userConfig);
```

This approach avoids version conflicts while giving you full access to Zod's features when you need them.

## API Reference

### Plugin Manifest

```typescript
interface PluginManifest {
  id: string; // Unique identifier (kebab-case)
  name: string; // Display name
  version: string; // Semver version
  author: string; // Author name
  description: string; // Short description
  homepage?: string; // Homepage URL
  compatibleVersions: string; // Compatible Pacioli versions
  permissions: string[]; // Required permissions
  icon?: string; // Icon URL
  tags?: string[]; // Tags for categorization
}
```

### Plugin Context

```typescript
interface PluginContext {
  manifest: PluginManifest;
  db: {
    transactions: TransactionRepository;
    accounts: AccountRepository;
    categories: CategoryRepository;
  };
  events: EventEmitter;
  storage: StorageAPI;
  ui: UIContext;
  logger: Logger;
}
```

### Lifecycle Hooks

```typescript
interface PluginLifecycle {
  onActivate?(context: PluginContext): void | Promise<void>;
  onDeactivate?(): void | Promise<void>;
  onSettingsChange?(settings: Record<string, unknown>): void | Promise<void>;
}
```

## Examples

### Transaction Categorizer

```typescript
import { createPlugin, Transaction } from '@pacioli/plugin-sdk';

export default createPlugin(
  {
    id: 'auto-categorizer',
    name: 'Auto Categorizer',
    version: '1.0.0',
    author: 'Your Name',
    description: 'Automatically categorize transactions',
    compatibleVersions: '^0.1.0',
    permissions: ['transactions:read', 'transactions:write', 'categories:read'],
  },
  {
    onActivate: async (context) => {
      context.events.on('transaction.created', async (event) => {
        const tx = event.data;

        // Simple categorization logic
        let categoryName = 'Other';
        if (tx.value > '1000000000000000000') {
          categoryName = 'Large Transfer';
        }

        const category = await context.db.categories.findByName(categoryName);
        if (category) {
          await context.db.transactions.update(tx.id, {
            categoryId: category.id,
          });

          context.ui.showNotification(`Transaction categorized as ${categoryName}`, 'success');
        }
      });
    },
  }
);
```

### Export Plugin

```typescript
import { createPlugin } from '@pacioli/plugin-sdk';

export default createPlugin(
  {
    id: 'csv-exporter',
    name: 'CSV Exporter',
    version: '1.0.0',
    author: 'Your Name',
    description: 'Export transactions to CSV',
    compatibleVersions: '^0.1.0',
    permissions: ['transactions:read', 'ui:menu'],
  },
  {
    onActivate: async (context) => {
      context.ui.registerMenuItem({
        id: 'export-csv',
        label: 'Export to CSV',
        onClick: async () => {
          const transactions = await context.db.transactions.findAll();

          // Create CSV
          const csv = transactions
            .map((tx) => `${tx.timestamp},${tx.hash},${tx.fromAddress},${tx.toAddress},${tx.value}`)
            .join('\n');

          // Trigger download (implementation depends on environment)
          console.log(csv);

          context.ui.showNotification('Export complete!', 'success');
        },
      });
    },
  }
);
```

## Development

### Building

```bash
pnpm build
```

### Testing

```bash
pnpm test
```

### Linting

```bash
pnpm lint
pnpm lint:fix
```

## Documentation

- [Plugin Development Guide](https://docs.pacioli.io/plugins/development)
- [API Reference](https://docs.pacioli.io/plugins/api)
- [Examples](https://github.com/GiveProtocol/pacioli-plugins/tree/main/packages/example-plugins)

## License

Dual-licensed under MIT or Apache 2.0. See [LICENSE-MIT](../../LICENSE-MIT) and [LICENSE-APACHE](../../LICENSE-APACHE).

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## Support

- [GitHub Issues](https://github.com/GiveProtocol/pacioli-plugins/issues)
- [Community Forum](https://community.pacioli.io)
- [Documentation](https://docs.pacioli.io/plugins)
