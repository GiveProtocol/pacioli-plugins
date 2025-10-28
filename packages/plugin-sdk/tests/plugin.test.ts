import { describe, it, expect } from 'vitest';
import { createPlugin, validateManifest, hasPermission } from '../src/plugin';

describe('Plugin Creation', () => {
  it('should create a plugin with valid manifest', () => {
    const plugin = createPlugin({
      id: 'test-plugin',
      name: 'Test Plugin',
      version: '1.0.0',
      author: 'Test Author',
      description: 'A test plugin',
      compatibleVersions: '^0.1.0',
      permissions: ['transactions:read'],
    });

    expect(plugin.manifest.id).toBe('test-plugin');
    expect(plugin.manifest.name).toBe('Test Plugin');
    expect(plugin.manifest.permissions).toEqual(['transactions:read']);
  });

  it('should validate a correct manifest', () => {
    const result = validateManifest({
      id: 'test-plugin',
      name: 'Test Plugin',
      version: '1.0.0',
      author: 'Test Author',
      description: 'A test plugin',
      compatibleVersions: '^0.1.0',
      permissions: [],
    });

    expect(result.valid).toBe(true);
  });

  it('should reject an invalid manifest', () => {
    const result = validateManifest({
      id: 'invalid id', // spaces not allowed
      name: 'Test',
      version: '1.0.0',
      author: 'Test',
      description: 'Test',
      compatibleVersions: '^0.1.0',
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
  });

  it('should check if plugin has permission', () => {
    const plugin = createPlugin({
      id: 'test-plugin',
      name: 'Test Plugin',
      version: '1.0.0',
      author: 'Test Author',
      description: 'A test plugin',
      compatibleVersions: '^0.1.0',
      permissions: ['transactions:read', 'accounts:read'],
    });

    expect(hasPermission(plugin, 'transactions:read')).toBe(true);
    expect(hasPermission(plugin, 'transactions:write')).toBe(false);
  });
});
