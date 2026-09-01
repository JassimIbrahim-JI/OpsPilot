// Ambient animated background — lightweight, GPU-accelerated, zero-lag.
// Uses pure CSS radial gradients + a slow drifting glow (no heavy canvas).
export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Drifting aurora blobs */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-brand-indigo/20 blur-[120px] animate-float-slow" />
      <div
        className="absolute top-1/3 -right-32 w-[400px] h-[400px] rounded-full bg-brand-emerald/15 blur-[120px] animate-float-slow"
        style={{ animationDelay: '-3s' }}
      />
      <div
        className="absolute -bottom-40 left-1/3 w-[450px] h-[450px] rounded-full bg-brand-violet/15 blur-[130px] animate-float-slow"
        style={{ animationDelay: '-5s' }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  )
}
