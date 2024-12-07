// src/verly/verly.d.ts
declare module './Verly' {
  export default class Verly {
    constructor(iterations: number, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D);
    WIDTH: number;
    HEIGHT: number;
    mouse: { coord: { x: number; y: number } };
    addEntity(entity: any): void;
    update(): void;
    render(): void;
  }
}

declare module './Vector' {
  export default class Vector {
    constructor(x: number, y: number);
  }
}

declare module './Point' {
  export default class Point {
    constructor(x: number, y: number);
    setRadius(radius: number): this;
    setColor(color: string): this;
    pos: { x: number; y: number; dist(other: { x: number; y: number }): number };
    resolveBehaviors(target: { pos: { x: number; y: number } }, distance: number, force: number): void;
  }
}

declare module './Entity' {
  export default class Entity {
    constructor(iterations: number, verly: any);
    verlyInstance: any;
    points: any[];
    sticks: any[];
    addPoint(point: any): any;
    addStick(i: number, j: number): any;
    setGravity(vector: any): void;
  }
}