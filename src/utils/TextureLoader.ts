import { Assets, Texture } from 'pixi.js';

export interface TextureLoadOptions {
  preferCompressed?: boolean;
  fallback?: string;
}

export class TextureLoader {
  private static compressedExtensions = ['.ktx2', '.basis'];
  private static standardExtensions = ['.png', '.jpg', '.jpeg', '.webp'];

  static async load(basePath: string, options: TextureLoadOptions = {}): Promise<Texture> {
    try {
      if (options.preferCompressed) {
        // Try loading compressed texture first
        try {
          const ktx2Path = `${basePath}.ktx2`;
          return await Assets.load(ktx2Path);
        } catch (e) {
          console.warn('Failed to load compressed texture, falling back to standard format');
        }
      }

      // Load standard texture
      const standardPath = options.fallback || `${basePath}.png`;
      return await Assets.load(standardPath);

    } catch (error) {
      console.error('Error loading texture:', error);
      throw error;
    }
  }

  static async preload(paths: string[], options: TextureLoadOptions = {}): Promise<void> {
    const loadPromises = paths.map(path => this.load(path, options));
    await Promise.all(loadPromises);
  }

  static async loadBundles(bundles: Record<string, string[]>): Promise<void> {
    for (const [bundleName, paths] of Object.entries(bundles)) {
      Assets.addBundle(bundleName, paths.reduce((acc, path) => {
        acc[path] = path;
        return acc;
      }, {} as Record<string, string>));
    }
  }
} 