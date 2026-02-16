export default function Hero() {
  return (
    <section className="relative w-full h-[520px] overflow-hidden">
      {/* Background image */}
      <img
        src="/hero.jpg"
        alt="hero"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 h-full flex items-end pb-16">
        <div className="text-white max-w-2xl">
          <span className="text-xs uppercase tracking-widest bg-yellow-500 text-black px-3 py-1">
            Featured Analysis
          </span>

          <h1 className="text-5xl font-serif font-bold mt-4 leading-tight">
            The Shifting Balance of Power
          </h1>

          <p className="mt-4 text-lg text-gray-200">
            Regional alliances are reshaping the Middle East landscape.
          </p>

          <button className="mt-6 bg-yellow-500 text-black px-6 py-3 font-semibold">
            Read Full Analysis →
          </button>
        </div>
      </div>
    </section>
  );
}