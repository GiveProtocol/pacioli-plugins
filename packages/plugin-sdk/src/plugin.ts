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
export function createPlugin(
  manifest: PluginManifest,
  lifecycle: PluginLifecycle = {}
): Plugin {
  // Validate manifest
  const validatedManifest = PluginManifestSchema.parse(manifest);

  return {
    manifest: validatedManifest,
    ...lifecycle,
  };
}

/**
 * Checks if a plugin has declared a specific permission in its manifest
 *
 * **IMPORTANT**: This function only checks if a permission is DECLARED in the
 * plugin's manifest. It does NOT enforce permissions. Permission enforcement
 * must be implemented by the host application that loads plugins.
 *
 * This is a convenience helper equivalent to:
 * ```typescript
 * plugin.manifest.permissions.includes(permission)
 * ```
 *
 * @param plugin - Plugin to check
 * @param permission - Permission to check for
 * @returns True if the plugin has declared this permission in its manifest
 *
 * @example
 * ```typescript
 * const plugin = createPlugin({
 *   id: 'my-plugin',
 *   name: 'My Plugin',
 *   permissions: ['transactions:read'],
 *   // ...
 * });
 *
 * hasPermission(plugin, 'transactions:read');  // true
 * hasPermission(plugin, 'transactions:write'); // false
 * ```
 *
 * @see {@link PluginContext} for how the host app should enforce permissions
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
