/**
 * Plugin Creation Utilities
 */

import { Plugin, PluginLifecycle, PluginManifest, PluginManifestSchema } from './types';

/**
 * Creates a new Pacioli plugin
 *
 * @param manifest - Plugin manifest with metadata
 * @param lifecycle - Plugin lifecycle hooks
 * @returns Plugin instance
 *
 * @example
 * ```typescript
 * import { createPlugin } from '@pacioli/plugin-sdk';
 *
 * export default createPlugin(
 *   {
 *     id: 'my-plugin',
 *     name: 'My Plugin',
 *     version: '1.0.0',
 *     author: 'Your Name',
 *     description: 'Does something cool',
 *     compatibleVersions: '^0.1.0',
 *     permissions: ['transactions:read'],
 *   },
 *   {
 *     onActivate: async (context) => {
 *       console.log('Plugin activated!');
 *     },
 *   }
 * );
 * ```
 */
export function createPlugin(manifest: PluginManifest, lifecycle: PluginLifecycle = {}): Plugin {
  // Validate manifest
  const validatedManifest = PluginManifestSchema.parse(manifest);

  return {
    manifest: validatedManifest,
    ...lifecycle,
  };
}

/**
 * Validates a plugin manifest
 *
 * @param manifest - Manifest to validate
 * @returns Validation result
 */
export function validateManifest(manifest: unknown): {
  valid: boolean;
  errors?: string[];
} {
  try {
    PluginManifestSchema.parse(manifest);
    return { valid: true };
  } catch (error) {
    if (error instanceof Error) {
      return {
        valid: false,
        errors: [error.message],
      };
    }
    return {
      valid: false,
      errors: ['Unknown validation error'],
    };
  }
}

/**
 * Checks if a plugin has a specific permission
 *
 * @param plugin - Plugin to check
 * @param permission - Permission to check for
 * @returns True if plugin has permission
 */
export function hasPermission(plugin: Plugin, permission: string): boolean {
  return plugin.manifest.permissions.includes(permission);
}

/**
 * Gets plugin metadata as a plain object
 *
 * @param plugin - Plugin instance
 * @returns Plugin metadata
 */
export function getPluginMetadata(plugin: Plugin) {
  return {
    id: plugin.manifest.id,
    name: plugin.manifest.name,
    version: plugin.manifest.version,
    author: plugin.manifest.author,
    description: plugin.manifest.description,
    homepage: plugin.manifest.homepage,
    permissions: plugin.manifest.permissions,
  };
}
