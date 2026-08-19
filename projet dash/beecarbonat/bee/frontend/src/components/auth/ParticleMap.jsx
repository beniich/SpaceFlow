import { useEffect, useRef } from 'react';

export default function ParticleMap({ color = '#1a1a1a', particleCount = 2500, className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles = [];
    let animationId;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      width = rect.width;
      height = rect.height;
      initParticles();
    };

    class Particle {
      constructor(worldX, worldY, region) {
        this.x = worldX;
        this.y = worldY;
        this.baseX = worldX;
        this.baseY = worldY;
        this.vx = 0;
        this.vy = 0;
        this.region = region;
        this.size = region === 'void' ? 0 : 1.5 + Math.random() * 1.5;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.02 + Math.random() * 0.03;
      }

      update(mouseX, mouseY, w, h) {
        this.pulse += this.pulseSpeed;

        const offsetX = (w / 2 - this.baseX) * 0.02;
        const offsetY = (h / 2 - this.baseY) * 0.02;
        this.x = this.baseX + offsetX;
        this.y = this.baseY + offsetY;

        if (mouseX > 0 || mouseY > 0) {
          const dx = this.x - mouseX;
          const dy = this.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const force = (100 - dist) / 100;
            this.vx += (dx / dist) * force * 2;
            this.vy += (dy / dist) * force * 2;
          }
        }

        this.vx *= 0.9;
        this.vy *= 0.9;
        this.x += this.vx;
        this.y += this.vy;
      }

      draw(ctx) {
        if (this.region === 'void') return;
        const scale = Math.sin(this.pulse) * 0.3 + 1;
        const alpha = 0.4 + Math.sin(this.pulse * 2) * 0.2;
        ctx.fillStyle = `rgba(26, 26, 26, ${alpha})`;
        ctx.fillRect(
          this.x - (this.size * scale) / 2,
          this.y - (this.size * scale) / 2,
          this.size * scale,
          this.size * scale
        );
      }
    }

    const initParticles = () => {
      particles = [];

      const landMap = [];

      const northAmerica = [[22, 28], [25, 30], [28, 32], [30, 34], [32, 36], [30, 38], [28, 40], [30, 42], [32, 44], [30, 46], [28, 48], [25, 52], [22, 56], [24, 60], [26, 64], [28, 68], [26, 72], [22, 76]];
      const southAmerica = [[32, 75], [30, 78], [28, 82], [30, 86], [32, 88], [30, 90], [26, 92], [24, 90], [22, 86], [24, 82]];
      const europe = [[48, 25], [50, 28], [52, 30], [54, 28], [55, 26], [53, 24], [51, 22], [49, 24], [50, 32], [52, 35], [50, 38], [48, 40]];
      const africa = [[50, 40], [52, 44], [54, 48], [55, 52], [54, 56], [52, 60], [50, 64], [48, 62], [47, 58], [48, 54], [49, 50], [48, 46], [49, 42]];
      const asia = [[58, 22], [62, 25], [66, 28], [70, 30], [74, 32], [78, 30], [82, 32], [80, 36], [76, 38], [72, 40], [68, 42], [72, 44], [76, 46], [80, 48], [78, 52], [74, 54], [72, 50], [76, 42], [80, 40], [82, 36]];
      const oceania = [[82, 70], [85, 72], [88, 74], [85, 76], [82, 75]];

      const allLand = [
        ...northAmerica.map(c => ({ x: c[0], y: c[1], region: 'na' })),
        ...southAmerica.map(c => ({ x: c[0], y: c[1], region: 'sa' })),
        ...europe.map(c => ({ x: c[0], y: c[1], region: 'eu' })),
        ...africa.map(c => ({ x: c[0], y: c[1], region: 'af' })),
        ...asia.map(c => ({ x: c[0], y: c[1], region: 'as' })),
        ...oceania.map(c => ({ x: c[0], y: c[1], region: 'oc' }))
      ];

      for (let i = 0; i < particleCount; i++) {
        const isLand = Math.random() < 0.45;
        if (isLand && allLand.length > 0) {
          const pos = allLand[Math.floor(Math.random() * allLand.length)];
          const x = (pos.x / 100) * width + (Math.random() - 0.5) * 12;
          const y = (pos.y / 100) * height + (Math.random() - 0.5) * 12;
          particles.push(new Particle(x, y, 'land'));
        } else {
          particles.push(new Particle(
            Math.random() * width,
            Math.random() * height,
            'void'
          ));
        }
      }
    };

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update(mouseX, mouseY, width, height);
        p.draw(ctx);
      });
      animationId = requestAnimationFrame(animate);
    };

    resize();
    animate();

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', resize);
    };
  }, [particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`auth-particle-canvas ${className}`}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        inset: 0
      }}
    />
  );
}
