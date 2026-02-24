"use client";

export function Web3Background() {
  const particles = Array.from({ length: 18 });

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(1100px_680px_at_14%_16%,rgba(255,66,93,0.18),transparent_62%),radial-gradient(1200px_760px_at_86%_22%,rgba(46,216,255,0.2),transparent_64%),linear-gradient(180deg,#02040b_0%,#060d1a_48%,#0a1528_100%)]" />

      <div className="absolute -left-[8%] top-[8%] h-[34vmax] w-[34vmax] rounded-full bg-[#ff425d]/10 blur-[90px] animate-[pulse_6s_ease-in-out_infinite]" />
      <div className="absolute -right-[8%] top-[16%] h-[35vmax] w-[35vmax] rounded-full bg-[#2ed8ff]/12 blur-[90px] animate-[pulse_7s_ease-in-out_infinite]" />

      <div className="absolute left-[12%] top-[26%] h-[140px] w-[2px] origin-top bg-gradient-to-b from-[#ff425d]/90 via-[#ff425d]/35 to-transparent blur-[0.4px] animate-[beamPulse_3.8s_ease-in-out_infinite]" />
      <div className="absolute right-[16%] top-[18%] h-[180px] w-[2px] origin-top bg-gradient-to-b from-[#2ed8ff]/90 via-[#2ed8ff]/35 to-transparent blur-[0.4px] animate-[beamPulse_4.6s_ease-in-out_infinite]" />

      <div className="absolute left-1/2 top-1/2 h-[58vmax] w-[58vmax] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 opacity-35 animate-[spin_44s_linear_infinite]" />
      <div className="absolute left-1/2 top-1/2 h-[36vmax] w-[36vmax] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#2ed8ff]/25 opacity-40 animate-[spin_28s_linear_infinite_reverse]" />

      {particles.map((_, i) => {
        const left = 5 + ((i * 11) % 92);
        const size = i % 3 === 0 ? 5 : i % 2 === 0 ? 4 : 3;
        const delay = `${(i % 7) * 0.7}s`;
        const duration = `${7 + (i % 6)}s`;
        const color = i % 2 === 0 ? "bg-[#2ed8ff]/75" : "bg-[#ff425d]/65";

        return (
          <span
            key={i}
            className={`absolute top-[102%] rounded-full ${color}`}
            style={{
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              filter: "blur(0.2px)",
              animation: `floatParticle ${duration} linear ${delay} infinite`,
            }}
          />
        );
      })}

      <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:56px_56px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_58%,transparent_0,rgba(3,6,12,.05)_35%,rgba(3,6,12,.35)_78%,rgba(2,4,10,.58)_100%)]" />
    </div>
  );
}
