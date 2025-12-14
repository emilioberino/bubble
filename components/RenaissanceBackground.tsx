'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface PathSegment {
  points: { x: number; y: number }[];
  progress: number;
  speed: number;
  delay: number;
}

export default function RenaissanceCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathsRef = useRef<PathSegment[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number>(0);

  const easeInOutQuad = (t: number): number => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  };

  const generateSketchPaths = (width: number, height: number): PathSegment[] => {
    const paths: PathSegment[] = [];
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = Math.min(width, height) / 600;

    const createPath = (points: { x: number; y: number }[], speed: number, delay: number) => {
      return {
        points: points.map(p => ({ x: centerX + p.x * scale, y: centerY + p.y * scale })),
        progress: 0,
        speed: speed * 0.3, // Slower and more elegant
        delay,
      };
    };

    // 1. Golden Spiral (Logarithmic)
    const spiralPoints = [];
    const growth = 0.3063489; // ln(phi) / (pi/2)
    // Start from a bit offset to avoid dense center
    for (let t = 0; t < 6 * Math.PI; t += 0.05) {
      const r = 10 * Math.exp(growth * t * 0.6); // Adjusted growth
      const x = r * Math.cos(t);
      const y = r * Math.sin(t);
      spiralPoints.push({ x, y });
      if (r > 600) break;
    }
    paths.push(createPath(spiralPoints, 0.8, 0));

    // 2. Central Composition Circle
    const circlePoints = [];
    for (let i = 0; i <= Math.PI * 2; i += 0.05) {
      circlePoints.push({ x: Math.cos(i) * 180, y: Math.sin(i) * 180 });
    }
    paths.push(createPath(circlePoints, 0.5, 1.5));

    // 3. Compositional Diagonals (Rule of Thirds / Golden Triangles)
    paths.push(createPath([{x: -400, y: -300}, {x: 400, y: 300}], 0.6, 0.5));
    paths.push(createPath([{x: 400, y: -300}, {x: -400, y: 300}], 0.6, 0.8));
    
    // 4. Vertical and Horizontal Center Lines
    paths.push(createPath([{x: 0, y: -350}, {x: 0, y: 350}], 0.5, 2.0));
    paths.push(createPath([{x: -450, y: 0}, {x: 450, y: 0}], 0.5, 2.2));

    // 5. Golden Rectangle Frame (Centered)
    const grW = 400;
    const grH = 400 / 1.618;
    paths.push(createPath([
      {x: -grW/2, y: -grH/2}, {x: grW/2, y: -grH/2}, 
      {x: grW/2, y: grH/2}, {x: -grW/2, y: grH/2}, 
      {x: -grW/2, y: -grH/2}
    ], 0.4, 3.0));

    return paths;
  };

  const drawPath = (ctx: CanvasRenderingContext2D, path: PathSegment, currentTime: number) => {
    if (currentTime < path.delay) return;

    const adjustedTime = currentTime - path.delay;
    const progress = Math.min(1, adjustedTime * path.speed);
    const easedProgress = easeInOutQuad(progress);

    if (path.points.length < 2) return;

    const totalLength = path.points.length - 1;
    const currentIndex = Math.floor(easedProgress * totalLength);
    const segmentProgress = (easedProgress * totalLength) % 1;

    ctx.strokeStyle = 'rgba(60, 60, 60, 0.08)'; // Extremely faint base line
    ctx.lineWidth = 0.8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(path.points[0].x, path.points[0].y);

    for (let i = 1; i <= currentIndex; i++) {
      ctx.lineTo(path.points[i].x, path.points[i].y);
    }

    if (currentIndex < path.points.length - 1) {
      const currentPoint = path.points[currentIndex];
      const nextPoint = path.points[currentIndex + 1];
      const interpX = currentPoint.x + (nextPoint.x - currentPoint.x) * segmentProgress;
      const interpY = currentPoint.y + (nextPoint.y - currentPoint.y) * segmentProgress;
      ctx.lineTo(interpX, interpY);
    }
    ctx.stroke();

    if (currentIndex < path.points.length) {
      const headIdx = Math.min(currentIndex, path.points.length - 1);
      let headX, headY;
      
      if (currentIndex < path.points.length - 1) {
        const currentPoint = path.points[currentIndex];
        const nextPoint = path.points[currentIndex + 1];
        headX = currentPoint.x + (nextPoint.x - currentPoint.x) * segmentProgress;
        headY = currentPoint.y + (nextPoint.y - currentPoint.y) * segmentProgress;
      } else {
        headX = path.points[headIdx].x;
        headY = path.points[headIdx].y;
      }

      // Subtle Graphite Glow - Reduced intensity for readability
      const glowLayers = [
        { color: 'rgba(40, 40, 40, 0.4)', width: 1.5, blur: 0 },   // Core
        { color: 'rgba(80, 80, 80, 0.1)', width: 3, blur: 2 },     // Soft edge
      ];

      for (const layer of glowLayers) {
        ctx.strokeStyle = layer.color;
        ctx.lineWidth = layer.width;
        ctx.lineCap = 'round';
        ctx.shadowBlur = layer.blur;
        ctx.shadowColor = 'rgba(40, 40, 40, 0.2)';

        const trailStart = Math.max(0, currentIndex - 15); // Longer, smoother trail
        ctx.beginPath();
        
        let startIdx = Math.floor(trailStart);
        let startX = path.points[startIdx].x;
        let startY = path.points[startIdx].y;

        ctx.moveTo(startX, startY);
        
        for (let i = startIdx + 1; i <= currentIndex; i++) {
          ctx.lineTo(path.points[i].x, path.points[i].y);
        }
        ctx.lineTo(headX, headY);
        ctx.stroke();

        ctx.shadowBlur = 0;
      }
    }
  };

  const animate = (timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const currentTime = (timestamp - startTimeRef.current) / 1000;

    pathsRef.current.forEach((path) => {
      drawPath(ctx, path, currentTime);
    });

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
      }

      pathsRef.current = generateSketchPaths(canvas.width, canvas.height);
      startTimeRef.current = 0;
    };

    let resizeTimeout: NodeJS.Timeout;
    const throttledResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 100);
    };

    handleResize();
    window.addEventListener('resize', throttledResize);

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', throttledResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-stone-50 dark:bg-stone-900">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="relative w-full h-full"
      >
        <Image
          src="/background.png"
          alt="Renaissance sketch background"
          fill
          className="object-cover opacity-40 mix-blend-multiply dark:mix-blend-overlay"
          priority
        />
        <motion.canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ willChange: 'transform' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
        />
      </motion.div>
    </div>
  );
}
