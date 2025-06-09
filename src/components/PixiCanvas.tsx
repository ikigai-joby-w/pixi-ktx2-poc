import { useEffect, useRef } from "react";
import { PixiRenderer, GameType } from "../utils/PixiRenderer";
import { useLocation } from "react-router-dom";

const PixiCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<PixiRenderer | null>(null);
  const location = useLocation();

  useEffect(() => {
    const initPixi = async () => {
      if (!containerRef.current) return;

      if (rendererRef.current) {
        rendererRef.current.destroy();
      }
      const renderer = new PixiRenderer();
      rendererRef.current = renderer;

      await renderer.init({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
        container: containerRef.current,
      });

      // Determine game type from URL path
      const gameType = getGameTypeFromPath(location.pathname);
      if (gameType) {
        await renderer.startGame(gameType, containerRef.current);
      }
    };

    initPixi();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current) return;
      rendererRef.current.resize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight,
      );
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      if (rendererRef.current) {
        rendererRef.current.destroy();
      }
    };
  }, [location.pathname]); // Re-run when path changes

  const getGameTypeFromPath = (path: string): GameType | null => {
    switch (path) {
      case '/bunny':
        return 'bunny';
      case '/win':
        return 'win';
      default:
        return 'bunny';
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    />
  );
};

export default PixiCanvas;
