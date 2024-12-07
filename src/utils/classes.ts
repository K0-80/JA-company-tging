export class Vector {
    constructor(public x: number, public y: number) {}
  
    dist(v: Vector): number {
      const dx = this.x - v.x;
      const dy = this.y - v.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
  }
  
  export class Point {
    pos: Vector;
    oldPos: Vector;
    radius: number;
    color: string;
  
    constructor(x: number, y: number) {
      this.pos = new Vector(x, y);
      this.oldPos = new Vector(x, y);
      this.radius = 5;
      this.color = "#ffffff";
    }
  
    setRadius(r: number): Point {
      this.radius = r;
      return this;
    }
  
    setColor(c: string): Point {
      this.color = c;
      return this;
    }
  
    constrain(minX: number, minY: number, maxX: number, maxY: number): void {
      this.pos.x = Math.max(minX, Math.min(this.pos.x, maxX));
      this.pos.y = Math.max(minY, Math.min(this.pos.y, maxY));
    }
  
    resolveBehaviors(point: Point | { pos: Vector }, distance: number, strength: number): void {
      const delta = new Vector(this.pos.x - point.pos.x, this.pos.y - point.pos.y);
      const dist = Math.sqrt(delta.x * delta.x + delta.y * delta.y);
      if (dist < distance && dist > 0) {
        const force = (distance - dist) / distance;
        const dx = delta.x * force * strength;
        const dy = delta.y * force * strength;
        this.pos.x += dx;
        this.pos.y += dy;
      }
    }
  }
  
  export class Stick {
    startPoint: Point;
    endPoint: Point;
    stiffness: number;
    color: string;
  
    constructor(startPoint: Point, endPoint: Point) {
      this.startPoint = startPoint;
      this.endPoint = endPoint;
      this.stiffness = 0.02;
      this.color = "#ffffff";
    }
  
    setStiffness(s: number): Stick {
      this.stiffness = s;
      return this;
    }
  
    setColor(c: string): Stick {
      this.color = c;
      return this;
    }
  }
  
  export class Fluid {
    points: Point[];
    sticks: Stick[];
    config: any;
    width: number;
    height: number;
  
    constructor(width: number, height: number, config: any) {
      this.points = [];
      this.sticks = [];
      this.config = config;
      this.width = width;
      this.height = height;
      this.init();
    }
  
    init(): void {
      for (let i = 0; i < this.config.PARTICLES_COUNT; i++) {
        this.addFluid();
      }
    }
  
    addFluid(): void {
      const p = new Point(
        Math.random() * this.width,
        Math.random() * this.height
      ).setRadius(5).setColor(this.config.POINT_COLOR);
      this.points.push(p);
    }
  
    makeSurfaceTension(): void {
      this.sticks = [];
      for (let i = 0; i < this.points.length; i++) {
        for (let j = 0; j < this.points.length; j++) {
          const dist = this.points[i].pos.dist(this.points[j].pos);
          if (dist > 0 && dist < this.config.JOIN_DIST) {
            const s = new Stick(this.points[i], this.points[j])
              .setStiffness(this.config.STIFFNESS)
              .setColor(this.config.LINE_COLOR);
            this.sticks.push(s);
          }
        }
      }
    }
  
    setGravity(gravity: Vector): void {
      this.points.forEach(p => {
        p.pos.y += gravity.y;
      });
    }
  
    update(mouse: { x: number, y: number }): void {
      this.makeSurfaceTension();
      this.setGravity(new Vector(0, this.config.GRAVITY));
  
      for (let i = 0; i < this.points.length; i++) {
        if (isNaN(this.points[i].pos.x) || isNaN(this.points[i].pos.y)) {
          this.points = [];
          this.init();
          break;
        }
        this.points[i].resolveBehaviors({ pos: new Vector(mouse.x, mouse.y) }, 200, 15);
        for (let j = 0; j < this.points.length; j++) {
          this.points[j].resolveBehaviors(this.points[i], this.config.JOIN_DIST - 10, 10);
          this.points[i].resolveBehaviors(this.points[j], this.config.JOIN_DIST - 10, 10);
        }
        this.points[i].constrain(0, 0, this.width, this.height);
      }
    }
  
    render(ctx: CanvasRenderingContext2D): void {
      this.points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.pos.x, p.pos.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
  
      this.sticks.forEach(s => {
        ctx.beginPath();
        ctx.moveTo(s.startPoint.pos.x, s.startPoint.pos.y);
        ctx.lineTo(s.endPoint.pos.x, s.endPoint.pos.y);
        ctx.strokeStyle = s.color;
        ctx.stroke();
      });
    }
  }
  
  