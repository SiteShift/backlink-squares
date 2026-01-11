export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bauhaus-cream">
      <div className="flex flex-col items-center gap-6">
        {/* Bauhaus Animated Grid */}
        <div className="grid grid-cols-3 gap-1">
          {[...Array(9)].map((_, i) => {
            const colors = ['bg-bauhaus-red', 'bg-bauhaus-yellow', 'bg-bauhaus-blue']
            return (
              <div
                key={i}
                className={`w-10 h-10 border-3 border-dark ${colors[i % 3]} animate-pulse`}
                style={{
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            )
          })}
        </div>

        {/* Loading Text */}
        <p className="text-sm font-bold uppercase tracking-wider text-dark animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  )
}
