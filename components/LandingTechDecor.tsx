type TechZone = "hero" | "modules" | "pipeline";

export function LandingTechDecor({ zone }: { zone: TechZone }) {
  if (zone === "hero") {
    return (
      <div className="landing-tech-layer landing-tech-layer--hero" aria-hidden>
        <span className="landing-tech-aurora" />
        <span className="landing-tech-grid" />
        <span className="landing-tech-beam" />
        <span className="landing-tech-rail" />
        <span className="landing-tech-ring landing-tech-ring--a" />
        <span className="landing-tech-ring landing-tech-ring--b" />
        <span className="landing-tech-node landing-tech-node--tl" />
        <span className="landing-tech-node landing-tech-node--br" />
        <span className="landing-tech-node landing-tech-node--mid" />
      </div>
    );
  }

  if (zone === "modules") {
    return (
      <div className="landing-tech-layer landing-tech-layer--modules" aria-hidden>
        <span className="landing-tech-section-glow" />
        <span className="landing-tech-dots" />
      </div>
    );
  }

  return (
    <div className="landing-tech-layer landing-tech-layer--pipeline" aria-hidden>
      <span className="landing-tech-pipeline-mesh" />
    </div>
  );
}
