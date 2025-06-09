import { Application, Graphics, Assets, Texture } from "pixi.js";
import { SpriteBase } from "./SpriteBase";

export const TOTAL_BUNNIES = 20000;

export class Bunny extends SpriteBase {
  constructor(app: Application, texture: Texture) {
    super(app, texture);
    this.sprite.tint = Math.random() * 0xffffff;
    this.setSpeed((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4);
  }

  setInitialPosition(screenWidth: number, screenHeight: number) {
    this.setPosition(
      screenWidth / 2 + Math.random() * 100 - 50,
      screenHeight / 2 + Math.random() * 100 - 50
    );
  }

  update(deltaTime: number) {
    const screenWidth = this.app.screen.width;
    const screenHeight = this.app.screen.height;
    const gravity = 0.5 * deltaTime;
    const groundY = screenHeight - this.sprite.height / 2;

    // Apply gravity
    this.speed.y += gravity;

    // Update position based on speed
    this.position.x += this.speed.x * deltaTime;
    this.position.y += this.speed.y * deltaTime;

    // Ground collision - jump in random direction
    if (this.position.y >= groundY) {
      this.position.y = groundY;
      this.speed.y = -20 * Math.random(); // Make bunny jump
      // Change to random horizontal direction
      this.speed.x = (Math.random() - 0.5) * 8; // Random speed between -4 and 4
    }

    // Wall collision
    if (
      this.position.x <= this.sprite.width / 2 ||
      this.position.x >= screenWidth - this.sprite.width / 2
    ) {
      this.speed.x *= -1;
      this.position.x = Math.max(
        this.sprite.width / 2,
        Math.min(screenWidth - this.sprite.width / 2, this.position.x)
      );
    }

    // Update sprite position
    this.updatePosition(deltaTime);
  }

  checkHoleCollision(
    holeX: number,
    holeY: number,
    holeWidth: number,
    holeHeight: number,
  ): boolean {
    const bunnyBounds = this.getBounds();
    return (
      bunnyBounds.x < holeX + holeWidth &&
      bunnyBounds.x + bunnyBounds.width > holeX &&
      bunnyBounds.y < holeY + holeHeight &&
      bunnyBounds.y + bunnyBounds.height > holeY
    );
  }
}

export class BunnyGame {
  private bunnies: Bunny[] = [];
  private rabbitHole!: Graphics;
  private capturedCount: number = 0;
  private countText!: HTMLDivElement;
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  async init(width: number, height: number, container: HTMLDivElement) {
    this.initCountText(container);
    this.initRabbitHole(width, height);
    await this.renderBunnies();
  }

  private initRabbitHole(width: number, height: number) {
    // Check if rabbit hole already exists
    if (this.rabbitHole && this.app.stage.children.includes(this.rabbitHole)) {
      return; // Rabbit hole already exists
    }

    // Create rabbit hole
    this.rabbitHole = new Graphics();
    this.rabbitHole.rect(0, 0, 50, 20);
    this.rabbitHole.fill(0x000000);
    // this.rabbitHole.endFill();
    this.rabbitHole.position.set(
      Math.random() * (width - 50), // Random X position
      height - 20, // At the bottom
    );
    this.app.stage.addChild(this.rabbitHole);
  }

  private initCountText(container: HTMLDivElement) {
    // Check if count text already exists
    const existingCountText = container.querySelector(
      ".bunny-count",
    ) as HTMLDivElement;
    if (existingCountText) {
      this.countText = existingCountText;
      return;
    }

    // Create count display
    this.countText = document.createElement("div");
    this.countText.className = "bunny-count";
    this.countText.style.position = "absolute";
    this.countText.style.top = "120px";
    this.countText.style.left = "10px";
    this.countText.style.color = "white";
    this.countText.style.fontSize = "20px";
    this.countText.style.fontFamily = "Arial";
    this.countText.style.zIndex = "1000";
    this.updateCountDisplay();
    container.appendChild(this.countText);
  }

  private async renderBunnies() {
    try {
      // Load the bunny texture using standard PNG format for now
      const texture = await Assets.load("/assets/bunny.ktx2");
      // const texture = await Assets.load("/assets/bunny.png");

      for (let i = 0; i < TOTAL_BUNNIES; i++) {
        const bunny = new Bunny(this.app, texture);
        bunny.setInitialPosition(this.app.screen.width, this.app.screen.height);
        this.bunnies.push(bunny);
      }

      // Add single ticker for all bunnies
      this.app.ticker.add((time) => {
        for (const bunny of this.bunnies) {
          this.updateBunny(bunny, time.deltaTime);
        }
      });
    } catch (error) {
      console.error("Error loading or rendering sprite:", error);
    }
  }

  private updateBunny(bunny: Bunny, deltaTime: number) {
    const holeBounds = this.rabbitHole.getBounds();

    // Check if bunny falls into the hole
    if (
      bunny.checkHoleCollision(
        holeBounds.x,
        holeBounds.y,
        holeBounds.width,
        holeBounds.height,
      )
    ) {
      // Remove the bunny
      bunny.destroy();
      const index = this.bunnies.indexOf(bunny);
      if (index > -1) {
        this.bunnies.splice(index, 1);
      }
      this.capturedCount++;
      this.updateCountDisplay();
      return;
    }

    bunny.update(deltaTime);
  }

  private updateCountDisplay() {
    this.countText.textContent = `Captured Bunnies: ${this.capturedCount}`;
  }

  public resize(width: number, height: number) {
    // Add any resize logic specific to the game
  }

  public destroy() {
    // Add any cleanup logic specific to the game
    this.bunnies.forEach(bunny => {
      bunny.destroy();
    });
    if (this.rabbitHole) {
      this.app.stage.removeChild(this.rabbitHole);
    }
    this.bunnies = [];
  }
}
