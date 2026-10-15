import { skillGroups } from "@/lib/content";

/** Skills as a spec sheet: one row per area, tools as mono chips. */
export function Stack() {
  return (
    <div className="divide-y divide-line border-y border-line">
      {skillGroups.map(([group, items]) => (
        <div key={group} className="grid gap-4 py-6 md:grid-cols-[220px_minmax(0,1fr)] md:gap-10">
          <h3 className="flex items-baseline gap-3 text-[15px] font-semibold text-fg">
            {group}
            <span className="font-mono text-xs font-normal text-muted tabular-nums">{items.length}</span>
          </h3>
          <ul className="flex flex-wrap gap-2">
            {items.map((item) => (
              <li
                key={item}
                className="rounded-sm border border-line bg-panel px-2.5 py-1.5 font-mono text-[12.5px] leading-5 text-fg"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
