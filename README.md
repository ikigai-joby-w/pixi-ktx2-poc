# pixi-ktx2-poc

A PixiJS project demonstrating KTX2 texture loading for optimized performance.

## Setup

```bash
npm i
npm run start
```

## KTX2 Texture Loading

### Prerequisites

This project uses PixiJS v8 with KTX2 texture support. The required dependencies are:
- `pixi.js` (v8.10.0 or later)
- `@pixi/basis` (for KTX2/Basis Universal support)
- `@pixi/compressed-textures` (for compressed texture support)

### Basic Usage

1. Import the KTX2 loader:
```typescript
import 'pixi.js/ktx2';
```

2. Load KTX2 textures using the Assets system:
```typescript
const texture = await Assets.load("/assets/your-texture.ktx2");
```

### Advanced Usage with Fallback

The project includes a `TextureLoader` utility that handles both KTX2 and standard texture formats:

```typescript
import { TextureLoader } from './utils/TextureLoader';

// Load with KTX2 preference
const texture = await TextureLoader.load('assets/texture', {
  preferCompressed: true,
  fallback: 'assets/texture.png'
});

// Preload multiple textures
await TextureLoader.preload([
  'assets/texture1',
  'assets/texture2'
], {
  preferCompressed: true
});
```

### Converting Textures to KTX2

To convert your existing textures to KTX2 format:

1. Install [KTX-Software](https://github.com/KhronosGroup/KTX-Software)
2. Convert your texture using the command:
```bash
toktx --t2 --bcmp output.ktx2 input.png
```

## Benefits of KTX2

- Smaller file sizes
- Faster GPU upload times
- Hardware-accelerated texture decompression
- Better runtime performance
- Automatic format selection based on device capabilities

## Project Structure

- `/src/utils/TextureLoader.ts` - Utility class for handling texture loading
- `/public/assets/` - Directory for storing texture files

``` bash
npm i
npm run start
```

