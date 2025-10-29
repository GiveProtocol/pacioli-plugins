/**
 * Pacioli Plugin SDK
 *
 * Official SDK for developing Pacioli plugins
 *
 * @packageDocumentation
 */

// Export all types
export type {
  // Plugin
  Plugin,
  PluginManifest,
  PluginLifecycle,
  PluginContext,
  Permission,
  // Database
  Transaction,
  Account,
  Category,
  TransactionRepository,
  AccountRepository,
  CategoryRepository,
  TransactionFilters,
  // Events
  PluginEvent,
  EventHandler,
  EventEmitter,
  // Storage
  StorageAPI,
  // UI
  MenuItem,
  SettingsPanel,
  DashboardWidget,
  UIContext,
} from './types';

// Export schemas
export { PluginManifestSchema } from './types';

// Export utilities
export {
  createPlugin,
  hasPermission,
  getPluginMetadata,
} from './plugin';
