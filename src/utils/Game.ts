import { Application } from "pixi.js";

export abstract class Game {
  protected app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  abstract init(params: any): Promise<void>;
  abstract update(deltaTime: number): void;
  abstract resize(width: number, height: number): void;
  abstract destroy(): void;
  abstract restart(): void;
}