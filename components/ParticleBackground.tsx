
import React, { useEffect, useRef } from 'react';
import { Theme } from '../types';

interface ParticleBackgroundProps {
  themeName: Theme;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ themeName }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    
    const isFloral = themeName === 'floral';
    const isChaos = themeName === 'd$ck';

    // Colors
    let particleColor = 'rgba(255, 255, 255, 0.1)';
    if (themeName === 'hacker') particleColor = 'rgba(0, 255, 0, 0.2)';
    if (themeName === 'dark') particleColor = 'rgba(59, 130, 246, 0.15)';
    if (themeName === 'nebula') particleColor = 'rgba(232, 121, 249, 0.15)';
    if (themeName === 'synthwave') particleColor = 'rgba(255, 113, 206, 0.15)';
    if (isChaos) particleColor = '#ff00ff'; // Base magenta for chaos

    const floralColors = [
      'rgba(255, 183, 178, 0.6)', // pastel red
      'rgba(255, 218, 193, 0.6)', // pastel orange
      'rgba(226, 240, 203, 0.6)', // pastel green
      'rgba(181, 234, 215, 0.6)', // pastel teal
      'rgba(199, 206, 234, 0.6)', // pastel purple
      'rgba(255, 255, 255, 0.7)'  // white
    ];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    // --- Tech/Network Particle Class ---
    class NetworkParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2;
        
        // Chaos speedup
        if (isChaos) {
          this.vx *= 25;
          this.vy *= 25;
          this.size = Math.random() * 6 + 2;
        }
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;
        
        if (isChaos && Math.random() < 0.1) {
          this.x = Math.random() * canvas!.width; // Teleport
          this.vx = (Math.random() - 0.5) * 40; // Random violent speed change
          this.vy = (Math.random() - 0.5) * 40;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = isChaos ? `hsl(${Math.random() * 360}, 100%, 50%)` : particleColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // --- Floral Petal Class ---
    class PetalParticle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      swaySpeed: number;
      swayAmp: number;
      angle: number;
      rotation: number;
      rotationSpeed: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height - canvas!.height; // Start above or random
        if (Math.random() > 0.5) this.y = Math.random() * canvas!.height; // Initial fill

        this.size = Math.random() * 5 + 3; // 3 to 8px
        this.speedY = Math.random() * 1 + 0.5;
        this.swaySpeed = Math.random() * 0.02 + 0.005;
        this.swayAmp = Math.random() * 50 + 20;
        this.angle = Math.random() * Math.PI * 2;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.05;
        this.color = floralColors[Math.floor(Math.random() * floralColors.length)];
      }

      update() {
        this.y += this.speedY;
        this.angle += this.swaySpeed;
        this.x += Math.cos(this.angle) * 0.5; // Gentle sway
        this.rotation += this.rotationSpeed;

        // Reset if goes below screen
        if (this.y > canvas!.height + 10) {
          this.y = -10;
          this.x = Math.random() * canvas!.width;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color;
        
        // Draw Petal Shape (two ellipses)
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }
    }
    
    // --- Chaos Glitch Rectangle ---
    const POPUP_TYPES = ['error', 'warning', 'info', 'glitch', 'system'];
    
    class ChaosPopUp {
        x: number;
        y: number;
        w: number;
        h: number;
        life: number;
        type: string;
        vx: number;
        vy: number;
        color: string;
        
        constructor() {
            this.x = Math.random() * canvas!.width;
            this.y = Math.random() * canvas!.height;
            this.w = Math.random() * 250 + 80;
            this.h = Math.random() * 120 + 40;
            this.life = Math.random() * 15 + 5; // Short life
            this.type = POPUP_TYPES[Math.floor(Math.random() * POPUP_TYPES.length)];
            
            // Extreme Movement
            this.vx = (Math.random() - 0.5) * 30;
            this.vy = (Math.random() - 0.5) * 30;
            
            // Rainbow colors
            this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        }
        
        update() {
            this.life--;
            this.x += this.vx;
            this.y += this.vy;
            // Jitter
            this.x += (Math.random() - 0.5) * 10;
            this.y += (Math.random() - 0.5) * 10;
        }
        
        draw() {
            if (!ctx || this.life <= 0) return;
            
            // Background
            ctx.fillStyle = '#000';
            ctx.fillRect(this.x, this.y, this.w, this.h);
            
            // Border
            ctx.lineWidth = 3;
            ctx.strokeStyle = this.color;
            ctx.strokeRect(this.x, this.y, this.w, this.h);
            
            // Header
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.w, 25);
            
            // Content simulation
            ctx.fillStyle = this.color;
            if (this.type === 'error') {
               // Big X
               ctx.beginPath();
               ctx.moveTo(this.x + 20, this.y + 40);
               ctx.lineTo(this.x + this.w - 20, this.y + this.h - 20);
               ctx.moveTo(this.x + this.w - 20, this.y + 40);
               ctx.lineTo(this.x + 20, this.y + this.h - 20);
               ctx.stroke();
            } else if (this.type === 'glitch') {
               // Random noise bars
               for(let i=0; i<5; i++) {
                   ctx.fillRect(this.x + 10, this.y + 40 + (i*15), Math.random() * (this.w - 20), 10);
               }
            } else {
               // Text lines
               ctx.fillRect(this.x + 10, this.y + 40, this.w - 20, 5);
               ctx.fillRect(this.x + 10, this.y + 55, this.w - 50, 5);
               ctx.fillRect(this.x + 10, this.y + 70, this.w - 30, 5);
            }
        }
    }
    
    let chaosPopups: ChaosPopUp[] = [];

    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(100, (window.innerWidth * window.innerHeight) / 15000);
      
      for (let i = 0; i < particleCount; i++) {
        if (isFloral) {
          particles.push(new PetalParticle());
        } else {
          particles.push(new NetworkParticle());
        }
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      // Chaos trail effect
      if (isChaos) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // Stronger trails
          ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      if (isFloral) {
        particles.forEach((p) => {
          p.update();
          p.draw();
        });
      } else {
        // Network Animation
        particles.forEach((particle, index) => {
          particle.update();
          particle.draw();

          // Connect particles
          for (let j = index + 1; j < particles.length; j++) {
            const dx = particle.x - particles[j].x;
            const dy = particle.y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            const threshold = isChaos ? 250 : 100;

            if (distance < threshold) {
              ctx.beginPath();
              // Rainbow Lines for Chaos
              if (isChaos) {
                 ctx.strokeStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
                 ctx.lineWidth = Math.random() * 3;
              } else {
                 ctx.strokeStyle = particleColor;
                 ctx.lineWidth = 0.5;
              }
              
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        });
        
        // Extra chaos rendering
        if (isChaos) {
            // Random horizontal glitch lines
            if (Math.random() > 0.3) { // Increased freq
                const y = Math.random() * canvas.height;
                const h = Math.random() * 20 + 2;
                ctx.fillStyle = `hsla(${Math.random() * 360}, 100%, 50%, 0.7)`;
                ctx.fillRect(0, y, canvas.width, h);
            }
            
            // Vertical lines
            if (Math.random() > 0.3) {
                const x = Math.random() * canvas.width;
                const w = Math.random() * 10 + 2;
                ctx.fillStyle = `hsla(${Math.random() * 360}, 100%, 50%, 0.7)`;
                ctx.fillRect(x, 0, w, canvas.height);
            }
            
            // Popups
            if (Math.random() < 0.15) chaosPopups.push(new ChaosPopUp()); // High spawn rate
            chaosPopups = chaosPopups.filter(p => p.life > 0);
            chaosPopups.forEach(p => {
                p.update();
                p.draw();
            });
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [themeName]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
};

export default React.memo(ParticleBackground);
