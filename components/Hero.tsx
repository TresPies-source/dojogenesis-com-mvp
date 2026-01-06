export function Hero() {
  return (
    <header className="w-full bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Dojo Genesis
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Dojo Genesis helps you think by collecting perspectives before
            solutions. Bring a real situation. Add 3 lenses. Get a clean next
            move.
          </p>
          <div className="pt-4" aria-label="Call to action">
            <p className="text-sm md:text-base text-muted-foreground/80">
              Try the live demo below
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
