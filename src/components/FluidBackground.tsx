import { useEffect, useRef } from 'react';
import { Vector, Point, Entity, Verly } from './fluidUtils';

//for inetractive slime background tghing. i  swear it worked now it broke

class Fluid extends Entity {
  config: any;
  sticks: any[];
  points: any[];
  verlyInstance: any;

  constructor(iteration: number, verly: any, config: any) {
    super(iteration, verly);
    this.config = config;
    this.sticks = [];
    this.points = [];
    this.verlyInstance = verly;
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

  makeSurfaceTension() {
    this.sticks = [];
    for (let i = 0; i < this.points.length; i++) {
      for (let j = 0; j < this.points.length; j++) {
        const dist = this.points[i].pos.dist(this.points[j].pos);
        if (dist > 0 && dist < this.config.JOIN_DIST) {
          this.addStick(i, j)
            .setStiffness(this.config.STIFFNESS)
            .setColor(this.config.LINE_COLOR);
        }
      }
    }
  }
}

const FluidBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const config = {
      PARTICLES_COUNT: 100,
      JOIN_DIST: 50,
      STIFFNESS: 0.05,
      GRAVITY: 1,
      POINT_COLOR: "#40ffa6",
      LINE_COLOR: "#1ba364"
    };

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // the uhh Verly and fluid instances things (broke grr why)
    const verly = new Verly(50, canvas, ctx);
    const fluid = new Fluid(50, verly, config);
    verly.addEntity(fluid);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      verly.WIDTH = canvas.width = width;
      verly.HEIGHT = canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      ctx.fillStyle = "#090909";
      ctx.fillRect(0, 0, width, height);

      verly.update();
      verly.render();

      fluid.setGravity(new Vector(0, config.GRAVITY));
      fluid.makeSurfaceTension();

      for (let i = 0; i < fluid.points.length; i++) {
        if (isNaN(fluid.points[i].pos.x) || isNaN(fluid.points[i].pos.y)) {
          fluid.points = [];
          fluid.init();
          break;
        }
        fluid.points[i].resolveBehaviors({ pos: verly.mouse.coord }, 200, 15);
        for (let j = 0; j < fluid.points.length; j++) {
          fluid.points[j].resolveBehaviors(fluid.points[i], config.JOIN_DIST - 10, 10);
          fluid.points[i].resolveBehaviors(fluid.points[j], config.JOIN_DIST - 10, 10);
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
};

export default FluidBackground; 