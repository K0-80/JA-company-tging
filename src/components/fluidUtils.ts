export class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  dist(v: Vector) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  add(v: Vector) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  sub(v: Vector) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  mult(n: number) {
    this.x *= n;
    this.y *= n;
    return this;
  }

  normalize() {
    const len = Math.sqrt(this.x * this.x + this.y * this.y);
    if (len !== 0) {
      this.x /= len;
      this.y /= len;
    }
    return this;
  }
}

export class Point {
  pos: Vector;
  oldpos: Vector;
  radius: number;
  color: string;
  friction: number;
  pinned: boolean;
  mass: number;

  constructor(x: number, y: number) {
    this.pos = new Vector(x, y);
    this.oldpos = new Vector(x, y);
    this.radius = 1;
    this.color = '#ffffff';
    this.friction = 0.97;
    this.pinned = false;
    this.mass = 1;
  }

  setRadius(r: number) {
    this.radius = r;
    return this;
  }

  setColor(color: string) {
    this.color = color;
    return this;
  }

  resolveBehaviors(point: any, distance: number, strength: number) {
    const delta = new Vector(0, 0);
    delta.x = point.pos.x - this.pos.x;
    delta.y = point.pos.y - this.pos.y;
    
    const dist = Math.sqrt(delta.x * delta.x + delta.y * delta.y);
    
    if (dist < distance) {
      const force = (dist - distance) / dist * strength;
      delta.mult(force);
      if (!this.pinned) {
        this.pos.add(delta);
      }
    }
  }

  update() {
    if (this.pinned) return;

    const vel = new Vector(
      this.pos.x - this.oldpos.x,
      this.pos.y - this.oldpos.y
    );

    this.oldpos.x = this.pos.x;
    this.oldpos.y = this.pos.y;

    vel.mult(this.friction);
    this.pos.add(vel);
  }
}

export class Entity {
  iteration: number;
  verly: any;
  points: Point[];
  sticks: any[];
  gravity: Vector;

  constructor(iteration: number, verly: any) {
    this.iteration = iteration;
    this.verly = verly;
    this.points = [];
    this.sticks = [];
    this.gravity = new Vector(0, 0.8);
  }

  addPoint(point: Point) {
    this.points.push(point);
    return point;
  }

  addStick(i: number, j: number) {
    const stick = {
      p0: this.points[i],
      p1: this.points[j],
      length: this.points[i].pos.dist(this.points[j].pos),
      stiffness: 1,
      color: '#ffffff'
    };

    this.sticks.push(stick);

    return {
      setStiffness: (stiffness: number) => {
        stick.stiffness = stiffness;
        return {
          setColor: (color: string) => {
            stick.color = color;
            return stick;
          }
        };
      }
    };
  }

  setGravity(vector: Vector) {
    this.gravity = vector;
  }

  update() {
    for (const point of this.points) {
      if (!point.pinned) {
        point.pos.add(this.gravity);
      }
      point.update();
    }

    for (let i = 0; i < this.iteration; i++) {
      for (const stick of this.sticks) {
        const dx = stick.p1.pos.x - stick.p0.pos.x;
        const dy = stick.p1.pos.y - stick.p0.pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const diff = (stick.length - dist) / dist * stick.stiffness;

        const offsetX = dx * diff * 0.5;
        const offsetY = dy * diff * 0.5;

        if (!stick.p0.pinned) {
          stick.p0.pos.x -= offsetX;
          stick.p0.pos.y -= offsetY;
        }
        if (!stick.p1.pinned) {
          stick.p1.pos.x += offsetX;
          stick.p1.pos.y += offsetY;
        }
      }
    }
  }
}

export class Verly {
  WIDTH: number;
  HEIGHT: number;
  mouse: { coord: Vector };
  ctx: CanvasRenderingContext2D;
  entities: Entity[];

  constructor(iterations: number, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.WIDTH = canvas.width;
    this.HEIGHT = canvas.height;
    this.mouse = { coord: new Vector(0, 0) };
    this.ctx = ctx;
    this.entities = [];

    canvas.addEventListener('mousemove', (e) => {
      this.mouse.coord.x = e.clientX;
      this.mouse.coord.y = e.clientY;
    });
  }

  addEntity(entity: Entity) {
    this.entities.push(entity);
  }

  update() {
    for (const entity of this.entities) {
      entity.update();
    }
  }

  render() {
    for (const entity of this.entities) {
      // Draw points
      for (const point of entity.points) {
        this.ctx.beginPath();
        this.ctx.arc(point.pos.x, point.pos.y, point.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = point.color;
        this.ctx.fill();
        this.ctx.closePath();
      }

      // Draw sticks
      for (const stick of entity.sticks) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = stick.color;
        this.ctx.lineWidth = 2;
        this.ctx.moveTo(stick.p0.pos.x, stick.p0.pos.y);
        this.ctx.lineTo(stick.p1.pos.x, stick.p1.pos.y);
        this.ctx.stroke();
        this.ctx.closePath();
      }
    }
  }
} 