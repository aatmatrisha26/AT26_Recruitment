"use client";

export default function HeroBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">

      {/* ===== PERSPECTIVE GRID ===== */}
      <div className="hero-grid" />

      {/* ===== FLOATING ORBS ===== */}
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />
      <div className="hero-orb hero-orb-4" />
      <div className="hero-orb hero-orb-5" />

      {/* ===== ROTATING RING ===== */}
      <div className="hero-ring hero-ring-1" />
      <div className="hero-ring hero-ring-2" />

      {/* ===== SHOOTING METEORS ===== */}
      <div className="hero-meteor hero-meteor-1" />
      <div className="hero-meteor hero-meteor-2" />
      <div className="hero-meteor hero-meteor-3" />
      <div className="hero-meteor hero-meteor-4" />
      <div className="hero-meteor hero-meteor-5" />

      {/* ===== FLOATING PARTICLES ===== */}
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          className="hero-particle"
          style={{
            left: `${5 + (i * 6) % 90}%`,
            top: `${10 + (i * 11) % 75}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${3 + (i % 5) * 1.2}s`,
            width: `${2 + (i % 4)}px`,
            height: `${2 + (i % 4)}px`,
            background: ['#FF206E', '#00F0FF', '#B026FF', '#FF9E64'][i % 4],
            opacity: 0.4 + (i % 3) * 0.15,
          }}
        />
      ))}

      {/* ===== PULSING CONCENTRIC RINGS ===== */}
      <div className="hero-pulse-ring hero-pulse-ring-1" />
      <div className="hero-pulse-ring hero-pulse-ring-2" />
      <div className="hero-pulse-ring hero-pulse-ring-3" />

      <style jsx>{`
        /* ===== PERSPECTIVE GRID (Tron-style) ===== */
        .hero-grid {
          position: absolute;
          bottom: 0; left: -20%; right: -20%;
          height: 50%;
          background:
            linear-gradient(rgba(255,32,110,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,32,110,0.06) 1px, transparent 1px);
          background-size: 60px 40px;
          transform: perspective(400px) rotateX(55deg);
          transform-origin: bottom center;
          mask-image: linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 80%);
          -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 80%);
          animation: grid-scroll 4s linear infinite;
        }
        @keyframes grid-scroll {
          0% { background-position: 0 0, 0 0; }
          100% { background-position: 0 40px, 0 0; }
        }

        /* ===== FLOATING ORBS ===== */
        .hero-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          will-change: transform;
        }
        .hero-orb-1 {
          width: 500px; height: 500px;
          top: -10%; left: 10%;
          background: radial-gradient(circle, rgba(255,32,110,0.35) 0%, transparent 70%);
          animation: orb-float-1 12s ease-in-out infinite;
        }
        .hero-orb-2 {
          width: 450px; height: 450px;
          top: 25%; right: -8%;
          background: radial-gradient(circle, rgba(0,240,255,0.25) 0%, transparent 70%);
          animation: orb-float-2 15s ease-in-out infinite;
        }
        .hero-orb-3 {
          width: 400px; height: 400px;
          bottom: -15%; left: 25%;
          background: radial-gradient(circle, rgba(176,38,255,0.3) 0%, transparent 70%);
          animation: orb-float-3 10s ease-in-out infinite;
        }
        .hero-orb-4 {
          width: 350px; height: 350px;
          top: 45%; left: -8%;
          background: radial-gradient(circle, rgba(255,158,100,0.25) 0%, transparent 70%);
          animation: orb-float-1 18s ease-in-out infinite reverse;
        }
        .hero-orb-5 {
          width: 300px; height: 300px;
          top: 5%; right: 15%;
          background: radial-gradient(circle, rgba(255,32,110,0.2) 0%, transparent 70%);
          animation: orb-float-2 14s ease-in-out infinite reverse;
        }

        @keyframes orb-float-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(80px, 40px) scale(1.15); }
          50% { transform: translate(-30px, 70px) scale(0.9); }
          75% { transform: translate(60px, -30px) scale(1.1); }
        }
        @keyframes orb-float-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-60px, -40px) scale(1.12); }
          50% { transform: translate(40px, -60px) scale(0.88); }
          75% { transform: translate(-70px, 30px) scale(1.05); }
        }
        @keyframes orb-float-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(70px, -50px) scale(1.15); }
          66% { transform: translate(-40px, 40px) scale(0.85); }
        }

        /* ===== ROTATING RINGS ===== */
        .hero-ring {
          position: absolute;
          top: 50%; left: 50%;
          border-radius: 50%;
          border: 1px solid;
          transform-origin: center center;
        }
        .hero-ring-1 {
          width: 500px; height: 500px;
          margin-top: -250px; margin-left: -250px;
          border-color: rgba(255,32,110,0.08);
          animation: ring-spin 25s linear infinite;
        }
        .hero-ring-2 {
          width: 650px; height: 650px;
          margin-top: -325px; margin-left: -325px;
          border-color: rgba(0,240,255,0.06);
          border-style: dashed;
          animation: ring-spin 35s linear infinite reverse;
        }

        @keyframes ring-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* ===== SHOOTING METEORS ===== */
        .hero-meteor {
          position: absolute;
          width: 120px;
          height: 1px;
          border-radius: 999px;
          transform: rotate(-35deg);
          opacity: 0;
        }
        .hero-meteor-1 {
          top: 15%; right: 10%;
          background: linear-gradient(90deg, rgba(255,32,110,0.6), transparent);
          animation: meteor-shoot 4s ease-in 0s infinite;
        }
        .hero-meteor-2 {
          top: 30%; right: 25%;
          width: 80px;
          background: linear-gradient(90deg, rgba(0,240,255,0.5), transparent);
          animation: meteor-shoot 6s ease-in 2s infinite;
        }
        .hero-meteor-3 {
          top: 8%; right: 40%;
          width: 60px;
          background: linear-gradient(90deg, rgba(176,38,255,0.5), transparent);
          animation: meteor-shoot 5s ease-in 3.5s infinite;
        }
        .hero-meteor-4 {
          top: 45%; right: 5%;
          width: 100px;
          background: linear-gradient(90deg, rgba(255,158,100,0.5), transparent);
          animation: meteor-shoot 7s ease-in 1s infinite;
        }
        .hero-meteor-5 {
          top: 20%; right: 55%;
          width: 70px;
          background: linear-gradient(90deg, rgba(255,32,110,0.4), transparent);
          animation: meteor-shoot 5.5s ease-in 4.5s infinite;
        }

        @keyframes meteor-shoot {
          0% { transform: rotate(-35deg) translateX(0); opacity: 0; }
          2% { opacity: 1; }
          8% { transform: rotate(-35deg) translateX(-300px); opacity: 0; }
          100% { opacity: 0; }
        }

        /* ===== PARTICLES ===== */
        .hero-particle {
          position: absolute;
          border-radius: 50%;
          animation: particle-drift linear infinite;
          box-shadow: 0 0 8px currentColor, 0 0 16px currentColor;
        }
        @keyframes particle-drift {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          15% { opacity: 0.8; transform: translateY(-10px) translateX(5px) scale(1.2); }
          50% { transform: translateY(-35px) translateX(15px) scale(0.8); opacity: 0.4; }
          85% { opacity: 0.7; transform: translateY(-5px) translateX(-5px) scale(1.1); }
          100% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
        }

        /* ===== PULSING CONCENTRIC RINGS ===== */
        .hero-pulse-ring {
          position: absolute;
          top: 50%; left: 50%;
          border-radius: 50%;
          border: 1px solid rgba(255,32,110,0.12);
          transform: translate(-50%, -50%) scale(0.3);
          opacity: 0;
          animation: pulse-expand 5s ease-out infinite;
        }
        .hero-pulse-ring-1 {
          width: 600px; height: 600px;
          animation-delay: 0s;
        }
        .hero-pulse-ring-2 {
          width: 600px; height: 600px;
          border-color: rgba(0,240,255,0.08);
          animation-delay: 1.7s;
        }
        .hero-pulse-ring-3 {
          width: 600px; height: 600px;
          border-color: rgba(176,38,255,0.08);
          animation-delay: 3.3s;
        }

        @keyframes pulse-expand {
          0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0.5; }
          100% { transform: translate(-50%, -50%) scale(1.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
