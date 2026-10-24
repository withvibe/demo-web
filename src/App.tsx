import { useState, type CSSProperties } from "react";

type Status = "scheduled" | "en_route" | "on_site" | "done";

type Job = {
  id: string;
  customer: string;
  task: string;
  address: string;
  time: string;
  status: Status;
  tech: string;
};

const JOBS: Job[] = [
  { id: "J-1042", customer: "Harbor Dental", task: "HVAC quarterly service", address: "12 Marina Ave", time: "08:30", status: "done", tech: "Dana" },
  { id: "J-1043", customer: "Nova Fitness", task: "Compressor replacement", address: "48 King St", time: "10:00", status: "on_site", tech: "Omar" },
  { id: "J-1044", customer: "Cedar House Café", task: "Walk-in cooler inspection", address: "3 Elm Square", time: "12:15", status: "en_route", tech: "Dana" },
  { id: "J-1045", customer: "Brightline Offices", task: "Thermostat install (x6)", address: "200 Summit Blvd", time: "14:00", status: "scheduled", tech: "Maya" },
  { id: "J-1046", customer: "Loft 29 Apartments", task: "Leak check, unit 7B", address: "29 Dockside Rd", time: "16:30", status: "scheduled", tech: "Omar" },
  { id: "J-1047", customer: "Summit Grocers", task: "Refrigeration audit", address: "5 Market Ln", time: "17:15", status: "scheduled", tech: "Maya" },
];

const TEAM = [
  { name: "Dana Kedem", role: "Senior technician", jobs: 2, initials: "DK" },
  { name: "Omar Haddad", role: "Technician", jobs: 2, initials: "OH" },
  { name: "Maya Levin", role: "Technician", jobs: 2, initials: "ML" },
];

const STATUS_META: Record<Status, { label: string; fg: string; bg: string }> = {
  scheduled: { label: "Scheduled", fg: "var(--soft)", bg: "var(--bg)" },
  en_route: { label: "En route", fg: "var(--accent)", bg: "var(--accent-soft)" },
  on_site: { label: "On site", fg: "var(--amber)", bg: "var(--amber-soft)" },
  done: { label: "Done", fg: "var(--green)", bg: "var(--green-soft)" },
};

const FILTERS: Array<{ key: "all" | Status; label: string }> = [
  { key: "all", label: "All" },
  { key: "scheduled", label: "Scheduled" },
  { key: "en_route", label: "En route" },
  { key: "on_site", label: "On site" },
  { key: "done", label: "Done" },
];

export function App() {
  const [filter, setFilter] = useState<"all" | Status>("all");
  const visible = filter === "all" ? JOBS : JOBS.filter((j) => j.status === filter);
  const done = JOBS.filter((j) => j.status === "done").length;

  return (
    <div style={styles.shell}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <span style={styles.brandDot} /> FieldOps
        </div>
        <nav style={styles.nav}>
          {["Dispatch", "Jobs", "Team", "Customers", "Reports", "Settings"].map((item, i) => (
            <div key={item} style={{ ...styles.navItem, ...(i === 0 ? styles.navActive : {}) }}>
              {item}
            </div>
          ))}
        </nav>
        <div style={styles.sidebarFoot}>Dispatch console · v1.0</div>
      </aside>

      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.h1}>Dispatch</h1>
            <p style={styles.sub}>Tuesday · {JOBS.length} jobs scheduled · {done} completed</p>
          </div>
          <button style={styles.primaryBtn}>+ New job</button>
        </header>

        <section style={styles.stats}>
          <Stat label="Jobs today" value={`${JOBS.length}`} />
          <Stat label="In progress" value={`${JOBS.filter((j) => j.status === "on_site" || j.status === "en_route").length}`} />
          <Stat label="Completed" value={`${done}`} tone="green" />
          <Stat label="On-time rate" value="98%" />
        </section>

        <section style={styles.grid}>
          <div style={styles.panel}>
            <div style={styles.panelHead}>
              <h2 style={styles.h2}>Today’s jobs</h2>
              <div style={styles.filters}>
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    style={{ ...styles.filter, ...(filter === f.key ? styles.filterActive : {}) }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <table style={styles.table}>
              <thead>
                <tr>
                  {["Job", "Customer", "Task", "Time", "Tech", "Status"].map((h) => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((j) => {
                  const m = STATUS_META[j.status];
                  return (
                    <tr key={j.id} style={styles.tr}>
                      <td style={{ ...styles.td, color: "var(--soft)", fontVariantNumeric: "tabular-nums" }}>{j.id}</td>
                      <td style={{ ...styles.td, fontWeight: 600 }}>{j.customer}</td>
                      <td style={styles.td}>{j.task}</td>
                      <td style={{ ...styles.td, fontVariantNumeric: "tabular-nums" }}>{j.time}</td>
                      <td style={styles.td}>{j.tech}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, color: m.fg, background: m.bg }}>{m.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={styles.panel}>
            <div style={styles.panelHead}>
              <h2 style={styles.h2}>Team</h2>
            </div>
            <div style={styles.teamList}>
              {TEAM.map((t) => (
                <div key={t.name} style={styles.teamRow}>
                  <div style={styles.avatar}>{t.initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{t.name}</div>
                    <div style={{ color: "var(--soft)", fontSize: 13 }}>{t.role}</div>
                  </div>
                  <div style={styles.teamJobs}>{t.jobs} jobs</div>
                </div>
              ))}
            </div>
            <div style={styles.mapHint}>
              <div style={styles.mapDot} />
              <div style={{ ...styles.mapDot, left: "60%", top: "40%", background: "var(--amber)" }} />
              <div style={{ ...styles.mapDot, left: "35%", top: "68%", background: "var(--green)" }} />
              <span style={styles.mapLabel}>Live crew map</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "green" }) {
  return (
    <div style={styles.statCard}>
      <div style={{ ...styles.statValue, color: tone === "green" ? "var(--green)" : "var(--ink)" }}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  shell: { display: "flex", height: "100%", minHeight: "100vh" },
  sidebar: { width: 212, background: "#0f1222", color: "#e6e9f2", display: "flex", flexDirection: "column", padding: "20px 14px" },
  brand: { display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 16, padding: "4px 8px 18px" },
  brandDot: { width: 12, height: 12, borderRadius: 4, background: "var(--accent)" },
  nav: { display: "flex", flexDirection: "column", gap: 2 },
  navItem: { padding: "9px 10px", borderRadius: 8, color: "#aab0c6", fontSize: 14, cursor: "pointer" },
  navActive: { background: "rgba(79,70,229,.28)", color: "#fff", fontWeight: 600 },
  sidebarFoot: { marginTop: "auto", color: "#6b7194", fontSize: 12, padding: 8 },
  main: { flex: 1, padding: "24px 28px", overflow: "auto" },
  header: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 },
  h1: { fontSize: 24, fontWeight: 700 },
  sub: { color: "var(--soft)", marginTop: 2 },
  primaryBtn: { background: "var(--accent)", color: "#fff", border: 0, borderRadius: 10, padding: "10px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  stats: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 18 },
  statCard: { background: "var(--card)", border: "1px solid var(--line)", borderRadius: 14, padding: "14px 16px" },
  statValue: { fontSize: 24, fontWeight: 700 },
  statLabel: { color: "var(--soft)", fontSize: 13, marginTop: 2 },
  grid: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) 300px", gap: 16, alignItems: "start" },
  panel: { background: "var(--card)", border: "1px solid var(--line)", borderRadius: 16, padding: 18 },
  panelHead: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, gap: 12, flexWrap: "wrap" },
  h2: { fontSize: 15, fontWeight: 700 },
  filters: { display: "flex", gap: 6, flexWrap: "wrap" },
  filter: { border: "1px solid var(--line)", background: "#fff", borderRadius: 999, padding: "5px 12px", fontSize: 13, fontWeight: 600, color: "var(--soft)", cursor: "pointer" },
  filterActive: { background: "var(--ink)", borderColor: "var(--ink)", color: "#fff" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", fontSize: 12, textTransform: "uppercase", letterSpacing: ".5px", color: "var(--soft)", padding: "0 10px 10px", fontWeight: 700 },
  tr: { borderTop: "1px solid var(--line)" },
  td: { padding: "12px 10px", fontSize: 14 },
  badge: { padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" },
  teamList: { display: "flex", flexDirection: "column", gap: 4 },
  teamRow: { display: "flex", alignItems: "center", gap: 12, padding: "10px 4px", borderBottom: "1px solid var(--line)" },
  avatar: { width: 38, height: 38, borderRadius: 19, background: "var(--accent-soft)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 },
  teamJobs: { color: "var(--soft)", fontSize: 13 },
  mapHint: { position: "relative", marginTop: 16, height: 150, borderRadius: 12, background: "linear-gradient(135deg,#eef2ff,#f6f7f9)", border: "1px solid var(--line)", overflow: "hidden" },
  mapDot: { position: "absolute", left: "20%", top: "30%", width: 12, height: 12, borderRadius: 6, background: "var(--accent)", boxShadow: "0 0 0 4px rgba(79,70,229,.18)" },
  mapLabel: { position: "absolute", bottom: 10, left: 12, fontSize: 12, color: "var(--soft)", fontWeight: 600 },
};
