/**
 * Plugin SDK Type Definitions
 *
 * Core types and interfaces for Pacioli plugin development
 */

import { z } from 'zod';

// Plugin Manifest

export const PluginManifestSchema = z.object({
  id: z.string().min(1).regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  version: z.string().regex(/^\d+\.\d+\.\d+/),
  author: z.string().min(1),
  description: z.string().min(1),
  homepage: z.string().url().optional(),
  compatibleVersions: z.string(),
  permissions: z.array(z.string()).default([]),
  icon: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type PluginManifest = z.infer<typeof PluginManifestSchema>;

// Permissions

export type Permission =
  | 'transactions:read'
  | 'transactions:write'
  | 'accounts:read'
  | 'accounts:write'
  | 'categories:read'
  | 'categories:write'
  | 'network:external'
  | 'storage:local'
  | 'ui:settings'
  | 'ui:menu'
  | 'ui:dashboard';

// Database Types

export interface Transaction {
  id: string;
  hash: string;
  fromAddress: string;
  toAddress: string;
  value: string;
  gasUsed: string | null;
  gasPrice: string | null;
  blockNumber: number;
  timestamp: number;
  status: 'success' | 'failed' | 'pending';
  chainId: number;
  categoryId: string | null;
  notes: string | null;
}

export interface Account {
  id: string;
  address: string;
  label: string | null;
  chainId: number;
  balance: string | null;
  lastSynced: number | null;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense' | 'transfer';
  parentId: string | null;
  color: string | null;
}

// Repository Interfaces

export interface TransactionRepository {
  findById(id: string): Promise<Transaction | null>;
  findByHash(hash: string): Promise<Transaction | null>;
  findByAddress(address: string): Promise<Transaction[]>;
  findByCategory(categoryId: string): Promise<Transaction[]>;
  findAll(filters?: TransactionFilters): Promise<Transaction[]>;
  create(transaction: Partial<Transaction>): Promise<Transaction>;
  update(id: string, updates: Partial<Transaction>): Promise<Transaction>;
  delete(id: string): Promise<void>;
}

export interface AccountRepository {
  findById(id: string): Promise<Account | null>;
  findByAddress(address: string): Promise<Account | null>;
  findAll(): Promise<Account[]>;
  create(account: Partial<Account>): Promise<Account>;
  update(id: string, updates: Partial<Account>): Promise<Account>;
  delete(id: string): Promise<void>;
}

export interface CategoryRepository {
  findById(id: string): Promise<Category | null>;
  findByName(name: string): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  create(category: Partial<Category>): Promise<Category>;
  update(id: string, updates: Partial<Category>): Promise<Category>;
  delete(id: string): Promise<void>;
}

export interface TransactionFilters {
  startDate?: number;
  endDate?: number;
  minValue?: string;
  maxValue?: string;
  status?: Transaction['status'];
  chainId?: number;
  categoryId?: string;
}

// Event System

export type PluginEvent =
  | { type: 'transaction.created'; data: Transaction }
  | { type: 'transaction.updated'; data: Transaction }
  | { type: 'transaction.deleted'; data: { id: string } }
  | { type: 'account.created'; data: Account }
  | { type: 'account.updated'; data: Account }
  | { type: 'account.deleted'; data: { id: string } }
  | { type: 'category.created'; data: Category }
  | { type: 'category.updated'; data: Category }
  | { type: 'category.deleted'; data: { id: string } }
  | { type: 'sync.started'; data: { chainId: number } }
  | { type: 'sync.completed'; data: { chainId: number; count: number } }
  | { type: 'sync.failed'; data: { chainId: number; error: string } };

export type EventHandler<T extends PluginEvent = PluginEvent> = (
  event: T
) => void | Promise<void>;

export interface EventEmitter {
  on<T extends PluginEvent['type']>(
    eventType: T,
    handler: EventHandler<Extract<PluginEvent, { type: T }>>
  ): void;
  off<T extends PluginEvent['type']>(
    eventType: T,
    handler: EventHandler<Extract<PluginEvent, { type: T }>>
  ): void;
  emit(event: PluginEvent): void;
}

// Storage API

export interface StorageAPI {
  get<T = unknown>(key: string): Promise<T | null>;
  set<T = unknown>(key: string, value: T): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  keys(): Promise<string[]>;
}

// UI Integration

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  onClick: () => void;
  position?: 'top' | 'bottom';
}

export interface SettingsPanel {
  id: string;
  title: string;
  component: React.ComponentType;
}

export interface DashboardWidget {
  id: string;
  title: string;
  component: React.ComponentType;
  width?: 'full' | 'half' | 'third';
  height?: number;
}

export interface UIContext {
  registerMenuItem(item: MenuItem): void;
  unregisterMenuItem(id: string): void;
  registerSettingsPanel(panel: SettingsPanel): void;
  unregisterSettingsPanel(id: string): void;
  registerDashboardWidget(widget: DashboardWidget): void;
  unregisterDashboardWidget(id: string): void;
  showNotification(message: string, type: 'info' | 'success' | 'warning' | 'error'): void;
}

// Plugin Context

/**
 * Plugin Context provided to plugins during activation
 *
 * The PluginContext gives plugins access to the host application's APIs.
 *
 * **PERMISSION ENFORCEMENT**: The host application implementing this interface
 * is responsible for enforcing the permissions declared in the plugin's manifest.
 * Each API should check the plugin's permissions before allowing operations.
 *
 * Example enforcement in host app:
 * ```typescript
 * class HostTransactionRepository implements TransactionRepository {
 *   constructor(private plugin: Plugin) {}
 *
 *   async delete(id: string): Promise<void> {
 *     // Enforce permissions before allowing operation
 *     if (!this.plugin.manifest.permissions.includes('transactions:write')) {
 *       throw new Error('Permission denied: transactions:write required');
 *     }
 *     // Perform actual deletion
 *     await this.actualDelete(id);
 *   }
 * }
 * ```
 *
 * @see {@link Permission} for available permission types
 */
export interface PluginContext {
  /** Plugin's own manifest (read-only reference) */
  manifest: PluginManifest;

  /**
   * Database access APIs
   *
   * Host app should enforce:
   * - `transactions:read` for read operations
   * - `transactions:write` for write operations
   * - `accounts:read` for read operations
   * - `accounts:write` for write operations
   * - `categories:read` for read operations
   * - `categories:write` for write operations
   */
  db: {
    transactions: TransactionRepository;
    accounts: AccountRepository;
    categories: CategoryRepository;
  };

  /** Event system for subscribing to and emitting events */
  events: EventEmitter;

  /**
   * Persistent storage API
   *
   * Host app should enforce: `storage:local` permission
   */
  storage: StorageAPI;

  /**
   * UI integration APIs
   *
   * Host app should enforce appropriate `ui:*` permissions
   */
  ui: UIContext;

  /** Logger for plugin messages (no permission required) */
  logger: {
    info(message: string, ...args: unknown[]): void;
    warn(message: string, ...args: unknown[]): void;
    error(message: string, ...args: unknown[]): void;
    debug(message: string, ...args: unknown[]): void;
  };
}

// Plugin Lifecycle

export interface PluginLifecycle {
  onActivate?(context: PluginContext): void | Promise<void>;
  onDeactivate?(): void | Promise<void>;
  onSettingsChange?(settings: Record<string, unknown>): void | Promise<void>;
}

// Plugin Interface

export interface Plugin extends PluginLifecycle {
  manifest: PluginManifest;
}
