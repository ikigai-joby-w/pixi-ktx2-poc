import { Application, Texture } from "pixi.js";
import { SpriteBase, Position } from "./SpriteBase";

export interface WinEffectParams {
  startPosition: Position;
  endPosition: Position;
  duration?: number;
}

export class WinEffect extends SpriteBase {
  private startPosition: Position = { x: 0, y: 0 };
  private endPosition: Position = { x: 0, y: 0 };
  private progress: number = 0;
  private duration: number = 1; // seconds
  private isAnimating: boolean = false;
  private onComplete?: () => void;
  private tickerCallback: (time: { deltaTime: number }) => void;

  constructor(app: Application, texture: Texture, params: WinEffectParams) {
    super(app, texture);
    
    // Set initial position and target
    this.startPosition = params.startPosition;
    this.endPosition = params.endPosition;
    this.duration = params.duration || 1;
    
    // Set sprite to start position
    this.setPosition(this.startPosition.x, this.startPosition.y);

    // Create ticker callback
    this.tickerCallback = (time) => this.update(time.deltaTime);
    this.app.ticker.add(this.tickerCallback);

    // Start animation immediately
    this.start();
  }

  update(deltaTime: number) {
    if (!this.isAnimating) return;

    // Update progress based on deltaTime and duration
    this.progress += deltaTime / (this.duration);

    if (this.progress >= 1) {
      // Animation complete
      this.progress = 1;
      this.isAnimating = false;
      this.setPosition(this.endPosition.x, this.endPosition.y);
      this.onComplete?.();
      return;
    }

    // Interpolate position using easing for smoother motion
    const easeProgress = this.easeInOutCubic(this.progress);
    const currentX = this.startPosition.x + (this.endPosition.x - this.startPosition.x) * easeProgress;
    const currentY = this.startPosition.y + (this.endPosition.y - this.startPosition.y) * easeProgress;
    
    // Update position and add effects
    this.setPosition(currentX, currentY);
    this.sprite.rotation += 0.1 * deltaTime;
    this.sprite.scale.set(1 + Math.sin(this.progress * Math.PI) * 0.2);
  }

  private easeInOutCubic(x: number): number {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  start(onComplete?: () => void) {
    this.progress = 0;
    this.isAnimating = true;
    this.onComplete = onComplete;
    this.sprite.rotation = 0;
    this.sprite.scale.set(1);
  }

  stop() {
    this.isAnimating = false;
  }

  destroy() {
    // Remove ticker before destroying
    if (this.tickerCallback) {
      this.app.ticker.remove(this.tickerCallback);
    }
    super.destroy();
  }
}
