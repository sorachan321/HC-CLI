
import React, { useEffect, useRef } from 'react';
import { Theme } from '../types';

interface ParticleBackgroundProps {
  theme: Theme;
  chaosMode?: 'classic' | 'psychedelic' | 'insanity';
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ theme, chaosMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    let time = 0;
    
    const isFloral = theme === 'floral';
    const isChaos = theme === 'chaos';
    const isPsychedelic = isChaos && chaosMode === 'psychedelic';
    const isInsanity = isChaos && chaosMode === 'insanity';

    // Colors
    let particleColor = 'rgba(255, 255, 255, 0.1)';
    if (theme === 'hacker') particleColor = 'rgba(0, 255, 0, 0.2)';
    if (theme === 'dark') particleColor = 'rgba(59, 130, 246, 0.15)';
    if (theme === 'nebula') particleColor = 'rgba(232, 121, 249, 0.15)';
    if (theme === 'synthwave') particleColor = 'rgba(255, 113, 206, 0.15)';

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
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = particleColor;
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
        this.y = Math.random() * canvas!.height - canvas!.height; 
        if (Math.random() > 0.5) this.y = Math.random() * canvas!.height; 

        this.size = Math.random() * 5 + 3; 
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
        this.x += Math.cos(this.angle) * 0.5; 
        this.rotation += this.rotationSpeed;

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
        
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }
    }

     // --- Classic Chaos Particle Class ---
    class ChaosParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.vx = (Math.random() - 0.5) * 10; 
        this.vy = (Math.random() - 0.5) * 10;
        this.size = Math.random() * 20 + 5;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`; 

        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
      }
    }

    // --- Surreal Egg Class (Psychedelic) ---
    class SurrealEgg {
      x: number;
      y: number;
      vx: number;
      vy: number;
      width: number;
      height: number;
      type: 'eye' | 'lava';
      angle: number;
      rotationSpeed: number;
      particles: {x: number, y: number, vx: number, vy: number, life: number, color: string}[];

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.width = 40 + Math.random() * 40;
        this.height = 50 + Math.random() * 50;
        this.type = Math.random() > 0.6 ? 'lava' : 'eye';
        this.angle = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.particles = [];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.angle += this.rotationSpeed;

        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;

        if (this.type === 'lava') {
           if (Math.random() > 0.5) {
             this.particles.push({
               x: 0, y: 0, 
               vx: (Math.random() - 0.5) * 2,
               vy: Math.random() * 2 + 1,
               life: 1.0,
               color: `hsl(${Math.random() * 60}, 100%, 50%)` 
             });
           }

           for (let i = this.particles.length - 1; i >= 0; i--) {
             const p = this.particles[i];
             p.x += p.vx;
             p.y += p.vy;
             p.life -= 0.02;
             if (p.life <= 0) this.particles.splice(i, 1);
           }
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        if (this.type === 'eye') {
           ctx.beginPath();
           ctx.ellipse(0, 0, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
           ctx.fillStyle = 'white';
           ctx.fill();
           ctx.lineWidth = 2;
           ctx.strokeStyle = 'black';
           ctx.stroke();

           const mx = mouseRef.current.x - this.x;
           const my = mouseRef.current.y - this.y;
           const cos = Math.cos(-this.angle);
           const sin = Math.sin(-this.angle);
           const rx = mx * cos - my * sin;
           const ry = mx * sin + my * cos;
           
           const len = Math.sqrt(rx * rx + ry * ry);
           const maxDist = (this.width / 4); 
           const dist = Math.min(len, maxDist);
           const angle = Math.atan2(ry, rx);
           
           const px = Math.cos(angle) * dist;
           const py = Math.sin(angle) * dist;

           ctx.beginPath();
           ctx.arc(px, py, this.width / 6, 0, Math.PI * 2);
           ctx.fillStyle = 'black';
           ctx.fill();
           
           ctx.beginPath();
           ctx.arc(px - 3, py - 3, 3, 0, Math.PI * 2);
           ctx.fillStyle = 'white';
           ctx.fill();
        } 
        else if (this.type === 'lava') {
           ctx.beginPath();
           ctx.ellipse(0, 0, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
           ctx.fillStyle = '#222'; 
           ctx.fill();
           
           ctx.beginPath();
           ctx.moveTo(-10, -20);
           ctx.lineTo(5, -5);
           ctx.lineTo(-5, 10);
           ctx.lineTo(10, 20);
           ctx.lineWidth = 3;
           ctx.strokeStyle = '#ff4500';
           ctx.stroke();

           this.particles.forEach(p => {
             ctx.globalAlpha = p.life;
             ctx.fillStyle = p.color;
             ctx.fillRect(p.x, p.y, 4, 4);
             ctx.globalAlpha = 1.0;
           });
        }
        
        ctx.restore();
      }
    }

    // --- Insanity Classes (Glitch/Vaporwave) ---

    class PixelBomb {
      x: number;
      y: number;
      size: number;
      tick: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = 4; // Pixel size
        this.tick = 0;
      }

      update() {
        this.tick++;
        // Jitter
        if (this.tick % 10 === 0) {
          this.x += (Math.random() - 0.5) * 10;
          this.y += (Math.random() - 0.5) * 10;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = (this.tick % 20 < 10) ? '#fff' : '#f00';
        
        // Simple 8x8 Bomb Sprite Map (1 = pixel)
        const map = [
            "  000   ",
            "  010   ",
            " 00000  ",
            "0000000 ",
            "0000000 ",
            " 00000  "
        ];

        for (let r = 0; r < map.length; r++) {
          for (let c = 0; c < map[r].length; c++) {
             if (map[r][c] !== ' ') {
               ctx.fillStyle = map[r][c] === '1' ? '#ff0' : (this.tick % 5 === 0 ? '#f0f' : '#000'); // Spark or Body
               ctx.fillRect(c * this.size, r * this.size, this.size, this.size);
             }
          }
        }
        ctx.restore();
      }
    }

    class ErrorPopup {
      x: number;
      y: number;
      w: number;
      h: number;
      vx: number;
      vy: number;
      color: string;

      constructor() {
        this.w = 150;
        this.h = 80;
        this.x = Math.random() * (canvas!.width - this.w);
        this.y = Math.random() * (canvas!.height - this.h);
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.color = Math.random() > 0.5 ? '#0000aa' : '#aa0000'; // Blue or Red screen
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Screen bounce
        if (this.x < 0 || this.x + this.w > canvas!.width) this.vx *= -1;
        if (this.y < 0 || this.y + this.h > canvas!.height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = '#c0c0c0'; // Win95 Grey
        ctx.fillRect(this.x, this.y, this.w, this.h);
        
        // Bevel
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(this.x, this.y, this.w, this.h);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(this.x + 1, this.y + 1, this.w - 2, this.h - 2);

        // Title Bar
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + 3, this.y + 3, this.w - 6, 18);
        
        // Title Text
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px Courier New';
        ctx.fillText('SYSTEM ERROR', this.x + 6, this.y + 15);
        
        // Content
        ctx.fillStyle = '#000';
        ctx.font = '10px Courier New';
        ctx.fillText('CRITICAL_FAILURE', this.x + 10, this.y + 40);
        ctx.fillText('0x' + Math.floor(Math.random()*16777215).toString(16).toUpperCase(), this.x + 10, this.y + 55);
        
        // Button
        ctx.fillStyle = '#c0c0c0';
        ctx.fillRect(this.x + 50, this.y + 55, 40, 15);
        ctx.strokeRect(this.x + 50, this.y + 55, 40, 15);
        ctx.fillStyle = '#000';
        ctx.fillText('OK', this.x + 62, this.y + 66);
      }
    }

    class GlitchLine {
      y: number;
      h: number;
      speed: number;
      color: string;

      constructor() {
        this.y = Math.random() * canvas!.height;
        this.h = Math.random() * 20 + 2;
        this.speed = (Math.random() + 1) * 15;
        this.color = Math.random() > 0.6 ? '#0f0' : (Math.random() > 0.5 ? '#f0f' : '#0ff'); // RGB
      }

      update() {
        this.y += this.speed;
        if (this.y > canvas!.height) {
          this.y = -this.h;
          this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.6;
        ctx.fillRect(0, this.y, canvas!.width, this.h);
        ctx.globalAlpha = 1.0;
      }
    }

    const initParticles = () => {
      particles = [];
      
      if (isInsanity) {
        // Popups
        for(let i=0; i<8; i++) particles.push(new ErrorPopup());
        // Bombs
        for(let i=0; i<10; i++) particles.push(new PixelBomb());
        // Lines
        for(let i=0; i<5; i++) particles.push(new GlitchLine());
      } else if (isPsychedelic) {
        for(let i=0; i<15; i++) particles.push(new SurrealEgg());
      } else if (isChaos) {
        for (let i = 0; i < 50; i++) particles.push(new ChaosParticle());
      } else if (isFloral) {
        const count = Math.min(100, (window.innerWidth * window.innerHeight) / 15000);
        for (let i = 0; i < count; i++) particles.push(new PetalParticle());
      } else {
        const count = Math.min(100, (window.innerWidth * window.innerHeight) / 15000);
        for (let i = 0; i < count; i++) particles.push(new NetworkParticle());
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      
      if (isInsanity) {
        // Digital Noise Background
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Random static noise strips
        for(let i=0; i<20; i++) {
           const x = Math.random() * canvas.width;
           const y = Math.random() * canvas.height;
           const w = Math.random() * 100;
           const h = Math.random() * 5;
           ctx.fillStyle = Math.random() > 0.5 ? '#111' : '#222';
           ctx.fillRect(x, y, w, h);
        }

      } else if (isPsychedelic) {
        // Kaleidoscope Background
        time += 0.01;
        
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        
        const gradient = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.max(canvas.width, canvas.height));
        gradient.addColorStop(0, `hsl(${(time * 50) % 360}, 100%, 50%)`);
        gradient.addColorStop(0.5, `hsl(${(time * 50 + 120) % 360}, 100%, 50%)`);
        gradient.addColorStop(1, `hsl(${(time * 50 + 240) % 360}, 100%, 50%)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(time * 0.5);
        
        ctx.globalCompositeOperation = 'overlay';
        ctx.lineWidth = 5;
        for(let i=0; i<12; i++) {
           ctx.rotate(Math.PI * 2 / 12);
           ctx.strokeStyle = `hsla(${(i * 30 + time * 100) % 360}, 100%, 50%, 0.5)`;
           ctx.beginPath();
           ctx.moveTo(0, 0);
           for(let r=0; r<Math.max(canvas.width, canvas.height); r+=20) {
              ctx.lineTo(r, Math.sin(r * 0.05 - time * 5) * 50);
           }
           ctx.stroke();
        }
        ctx.restore();
        ctx.globalCompositeOperation = 'source-over'; 

      } else if (isChaos) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      if (isFloral || isChaos || isPsychedelic || isInsanity) {
        particles.forEach((p) => {
          p.update();
          p.draw();
        });
      } else {
        // Network Animation
        particles.forEach((particle, index) => {
          particle.update();
          particle.draw();

          for (let j = index + 1; j < particles.length; j++) {
            const dx = particle.x - particles[j].x;
            const dy = particle.y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
              ctx.beginPath();
              ctx.strokeStyle = particleColor;
              ctx.lineWidth = 0.5;
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        });
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
  }, [theme, chaosMode]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none z-0"
      style={{ opacity: theme === 'chaos' ? (chaosMode === 'psychedelic' || chaosMode === 'insanity' ? 1 : 0.8) : 0.6 }}
    />
  );
};

export default React.memo(ParticleBackground);
