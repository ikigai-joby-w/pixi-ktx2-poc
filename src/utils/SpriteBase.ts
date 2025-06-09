import { Application, Sprite, Texture, Point } from "pixi.js";

export interface Position {
  x: number;
  y: number;
}

export abstract class SpriteBase {
  protected app: Application;
  public sprite: Sprite;
  protected position: Point;
  protected speed: Point;

  constructor(app: Application, texture: Texture) {
    this.app = app;
    this.sprite = new Sprite(texture);
    this.position = new Point(0, 0);
    this.speed = new Point(0, 0);
    
    // Common sprite setup
    this.sprite.anchor.set(0.5);
    this.app.stage.addChild(this.sprite);
  }

  protected updatePosition(deltaTime: number) {
    this.sprite.position.set(this.position.x, this.position.y);
  }

  public setPosition(x: number, y: number) {
    this.position.set(x, y);
    this.sprite.position.set(x, y);
  }

  public setSpeed(x: number, y: number) {
    this.speed.set(x, y);
  }

  abstract update(deltaTime: number): void;

  public destroy() {
    if (this.sprite) {
      this.app.stage.removeChild(this.sprite);
      this.sprite.destroy();
    }
  }

  public getPosition(): Position {
    return { x: this.position.x, y: this.position.y };
  }

  public getBounds() {
    return this.sprite.getBounds();
  }
} 