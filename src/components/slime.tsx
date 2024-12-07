import { useEffect, useRef } from 'react';
import Verly from '../verly/Verly';
import Vector from '../verly/Vector';
import Point from '../verly/Point';
import Entity from '../verly/Entity';

interface FluidProps {
  config: {
    PARTICLES_COUNT: number;
    POINT_COLOR: string;
    JOIN_DIST: number;
    STIFFNESS: number;
    GRAVITY: number;
    LINE_COLOR: string;
  }
}

export function FluidSimulation({ config }: FluidProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const width = window.innerWidth - 4;
    const height = window.innerHeight - 4;
    canvas.width = width;
    canvas.height = height;

    // Initialize Verly simulation
    const verly = new Verly(50, canvas, ctx);

    class Fluid extends Entity {
      constructor(iteration: number, verlyInstance: Verly, fluidConfig: FluidProps['config']) {
        super(iteration, verlyInstance);
        this.config = fluidConfig;
        this.init();
      }

      init() {
        for (let i = 0; i < this.config.PARTICLES_COUNT; i++) {
          this.addFluid();
        }
      }

      addFluid() {
        const p = new Point(
          Math.random() * this.verlyInstance.WIDTH,
          Math.random() * this.verlyInstance.HEIGHT
        ).setRadius(5);
        this.addPoint(p).setColor(this.config.POINT_COLOR);
      }
    }

    // Create fluid instance
    const fluid = new Fluid(50, verly, config);
    verly.addEntity(fluid);

    // Animation loop
    function animate() {
      ctx.fillStyle = '#090909';
      ctx.fillRect(0, 0, width, height);

      verly.update();
      verly.render();

      requestAnimationFrame(animate);
    }
    animate();

    // Cleanup
    return () => {
      // Cancel animation frame if needed
    };
  }, [config]); // Re-initialize when config changes

  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{ touchAction: 'none' }}
    />
  );
}