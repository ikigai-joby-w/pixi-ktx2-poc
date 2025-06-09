import { Application, Assets, Renderer } from "pixi.js";
import { Stats } from "pixi-stats";
import { BunnyGame } from "./Bunny";
import { WinEffect } from "./WinEffect";

export interface PixiRendererConfig {
  width: number;
  height: number;
  container: HTMLDivElement;
}

export type GameType = 'bunny' | 'win';

export class PixiRenderer {
  public app: Application;
  public renderer: Renderer | null = null;
  private activeGame: GameType | null = null;
  private bunnyGame: BunnyGame | null = null;
  private winEffect: WinEffect | null = null;

  constructor() {
    this.app = new Application();
  }

  async init({ width, height, container }: PixiRendererConfig) {
    // Initialize with container dimensions
    await this.app.init({
      background: "#1099bb",
      width,
      height,
      antialias: true,
      // preference: "webgpu",
    });

    this.renderer = this.app.renderer;

    // Append the application canvas to the container
    container.appendChild(this.app.canvas);

    this.initStats(container);
  }

  async startGame(type: GameType, container: HTMLDivElement) {
    // Check if the requested game is already active
    if (this.activeGame === type) {
      console.warn(`${type} game is already running`);
      return;
    }

    // Cleanup any existing game
    await this.cleanupCurrentGame();

    // Start the requested game
    switch (type) {
      case 'bunny':
        if (!this.bunnyGame) {
          this.bunnyGame = new BunnyGame(this.app);
          await this.bunnyGame.init(
            this.app.screen.width,
            this.app.screen.height,
            container
          );
        }
        break;
      case 'win':
        // WinEffect initialization would go here when needed
        if (!this.winEffect) {
          const texture = await Assets.load("/assets/bunny.ktx2");
          this.winEffect = new WinEffect(this.app, texture, {
            startPosition: { x: 0, y: this.app.screen.height / 2 },
            endPosition: { x: this.app.screen.width, y: this.app.screen.height / 2 },
            duration: 500
          });
        }
        break;
    }

    this.activeGame = type;
  }

  private async cleanupCurrentGame() {
    if (!this.activeGame) return;

    switch (this.activeGame) {
      case 'bunny':
        if (this.bunnyGame) {
          this.bunnyGame.destroy();
          this.bunnyGame = null;
        }
        break;
      case 'win':
        if (this.winEffect) {
          this.winEffect.destroy();
          this.winEffect = null;
        }
        break;
    }

    this.activeGame = null;
  }

  async initStats(container: HTMLDivElement) {
    // Find or create a container for stats
    let statsContainer = container.querySelector(
      ".stats-container",
    ) as HTMLDivElement;

    // If stats container already exists, don't create again
    if (statsContainer) {
      return;
    }

    // Create new stats container
    statsContainer = document.createElement("div");
    statsContainer.className = "stats-container";
    statsContainer.style.position = "absolute";
    statsContainer.style.top = "0px";
    statsContainer.style.left = "0px";
    statsContainer.style.zIndex = "1000";
    container.appendChild(statsContainer);

    // Initialize stats
    new Stats(this.renderer!, statsContainer);
  }

  getCurrentGame(): GameType | null {
    return this.activeGame;
  }

  resize(width: number, height: number) {
    this.renderer?.resize(width, height);
    if (this.bunnyGame) {
      this.bunnyGame.resize(width, height);
    }
  }

  destroy() {
    this.cleanupCurrentGame();
    this.renderer?.destroy();
  }
}
