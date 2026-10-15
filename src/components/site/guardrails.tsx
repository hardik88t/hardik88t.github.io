import { agentic } from "@/lib/content";

/** Numbered guardrail rules, plus the tools built to enforce them. */
export function Guardrails() {
  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
      <div>
        <h3 className="eyebrow">Guardrails · enforced in CI and locally</h3>
        <ol className="mt-5 hairline-x border-y border-line">
          {agentic.guardrails.map((rule, i) => (
            <li key={rule} className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-3 py-4">
              <span className="font-mono text-xs leading-6 text-muted tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[15px] leading-6 text-fg">{rule}</span>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <h3 className="eyebrow">Tooling I built</h3>
        <ul className="mt-5 hairline-x border-y border-line">
          {agentic.tooling.map((tool) => (
            <li key={tool.name} className="grid gap-1.5 py-4 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] sm:gap-6">
              <span className="font-mono text-[14px] leading-6 font-medium text-fg">{tool.name}</span>
              <span className="text-[15px] leading-6 text-muted">{tool.detail}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[14px] leading-6 text-muted">
          Agents in the fleet: {agentic.agents.join(", ")}.
        </p>
      </div>
    </div>
  );
}
