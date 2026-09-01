"use client";

import React, { useEffect, useRef } from "react";

export interface AmbientStarfieldCanvasProps {
  className?: string;
  starCount?: number;
}

interface StarParticle {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  baseAlpha: number;
  speed: number;
  pulseSpeed: number;
  pulseOffset: number;
  color: string;
}

export function AmbientStarfieldCanvas({
  className = "",
  starCount = 140,
}: AmbientStarfieldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Generate Star Particles
    const colors = ["#FFFFFF", "#E0F2FE", "#BAE6FD", "#7DD3FC", "#FDE68A"];
    const stars: StarParticle[] = [];

    for (let i = 0; i < starCount; i++) {
      const baseAlpha = Math.random() * 0.7 + 0.2;
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.4,
        alpha: baseAlpha,
        baseAlpha,
        speed: (Math.random() * 0.15 + 0.05) * (prefersReducedMotion ? 0 : 1),
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulseOffset: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)] || "#FFFFFF",
      });
    }

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle background nebula gradient
      const grad1 = ctx.createRadialGradient(
        width * 0.3,
        height * 0.4,
        50,
        width * 0.3,
        height * 0.4,
        width * 0.5
      );
      grad1.addColorStop(0, "rgba(56, 189, 248, 0.04)");
      grad1.addColorStop(1, "rgba(3, 7, 18, 0)");
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const grad2 = ctx.createRadialGradient(
        width * 0.75,
        height * 0.65,
        50,
        width * 0.75,
        height * 0.65,
        width * 0.4
      );
      grad2.addColorStop(0, "rgba(139, 92, 246, 0.035)");
      grad2.addColorStop(1, "rgba(3, 7, 18, 0)");
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Draw and update stars
      time += 0.03;
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        if (!star) continue;

        if (!prefersReducedMotion) {
          star.y -= star.speed;
          if (star.y < -5) {
            star.y = height + 5;
            star.x = Math.random() * width;
          }
          star.alpha =
            star.baseAlpha + Math.sin(time * star.pulseSpeed * 10 + star.pulseOffset) * 0.25;
          star.alpha = Math.max(0.1, Math.min(0.95, star.alpha));
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha;
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [starCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none w-full h-full ${className}`}
      aria-hidden="true"
    />
  );
}
