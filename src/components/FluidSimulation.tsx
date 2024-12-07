"use client"
//poorly made fluid ill fix later maybe
import React, { useRef, useEffect, useState } from 'react';
import { Fluid } from '../utils/classes';

const defaultConfig = {
  PARTICLES_COUNT: 200,
  JOIN_DIST: 50,
  STIFFNESS: 0.02,
  GRAVITY: 0.1, 
  POINT_COLOR: "#d0e6a6",
  LINE_COLOR: "#dff6ca",
  DAMPING: 0.99, // Add damping to reduce velocity
  BOUNCE: 0.5    // Add bounce factor for collisions
};

export default function FluidSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [config, setConfig] = useState(defaultConfig);
  const fluidRef = useRef<Fluid | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (fluidRef.current) {
        fluidRef.current.width = canvas.width;
        fluidRef.current.height = canvas.height;
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    fluidRef.current = new Fluid(canvas.width, canvas.height, config);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // ctx.fillStyle = "#090909";
      // ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (fluidRef.current) {
        fluidRef.current.update(mouseRef.current);
        fluidRef.current.render(ctx);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [config]);

  return (
    <div className="relative w-full h-screen">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="absolute top-4 left-4 bg-white bg-opacity-80 p-4 rounded">
        <h2 className="text-lg font-bold mb-2">test stuffs</h2>
        <div className="space-y-2">
          {Object.entries(config).map(([key, value]) => (
            <div key={key} className="flex items-center">
              <label className="w-32">{key}:</label>
              <input
                type={typeof value === 'number' ? 'number' : 'text'}
                value={value}
                onChange={(e) => setConfig(prev => ({ ...prev, [key]: e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value }))}
                className="border rounded px-2 py-1 w-40"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
