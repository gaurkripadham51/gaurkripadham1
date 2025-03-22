import React, { useEffect, useRef, useState } from 'react';

const WelcomeOverlay = () => {
  const [show, setShow] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Hide after 5s
  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Fireworks
  useEffect(() => {
    if (!show) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];

    const createFirework = () => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height * 0.5;
      const count = 50 + Math.random() * 50;
      for (let i = 0; i < count; i++) {
        particles.push({
          x,
          y,
          radius: Math.random() * 2 + 1,
          angle: Math.random() * 2 * Math.PI,
          speed: Math.random() * 4 + 1,
          alpha: 1,
          decay: Math.random() * 0.015 + 0.005,
          color: `hsl(${Math.random() * 360}, 100%, 60%)`,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, index) => {
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;
        p.alpha -= p.decay;
        if (p.alpha <= 0) {
          particles.splice(index, 1);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    };

    const fireworkInterval = setInterval(createFirework, 500);
    animate();

    return () => clearInterval(fireworkInterval);
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-md animate-fadeout">
      {/* Fireworks Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Falling Yellow Petals */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-5 h-5 bg-yellow-300 rounded-full opacity-90 animate-petal"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Center Image */}
      <img
        src="https://i.ibb.co/hJgS3gpz/birthday.jpg"
        alt="Welcome"
        className="z-30 w-64 sm:w-96 md:w-[450px] h-auto object-contain drop-shadow-2xl rounded-3xl border-4 border-yellow-400"
      />
    </div>
  );
};

export default WelcomeOverlay;
