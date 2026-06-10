import { useState } from "react";

const palette = {
  bg: "#0e0f14",
  surface: "#161820",
  surfaceAlt: "#1e2130",
  border: "#2a2d3e",
  accent: "#7c6fcd",
  accentBright: "#a594f9",
  gold: "#e8c96d",
  green: "#52c99a",
  red: "#e06b6b",
  text: "#e8e9f0",
  textMuted: "#8b8fa8",
  textFaint: "#555870",
  fable: "#a594f9",
  opus: "#52c99a",
  sonnet: "#e8c96d",
  haiku: "#e06b6b",
};

const models = [
  {
    name: "Haiku 4.5",
    key: "haiku",
    tier: "Speed",
    color: palette.haiku,
    cost: "~$0.25/M in",
    context: "200K tokens",
    speed: 95,
    reasoning: 35,
    vision: 30,
    coding: 40,
    longContext: 20,
    agentic: 15,
    bestFor: ["Classificazione e routing ad alto volume", "Risposte brevi automatizzate", "Pipeline di automazione (N8N, Make)", "Traduzione e normalizzazione dati"],
    notFor: ["Analisi complessa multi-documento", "Codice critico o architetturale", "Long-form content di qualità"],
    tagline: "Volume e velocità. Costo quasi nullo.",
  },
  {
    name: "Sonnet 4.6",
    key: "sonnet",
    tier: "Balance",
    color: palette.sonnet,
    cost: "~$3/M in",
    context: "200K tokens",
    speed: 80,
    reasoning: 65,
    vision: 60,
    coding: 70,
    longContext: 55,
    agentic: 55,
    bestFor: ["Chat e assistenti AI in produzione", "Draft articoli e contenuti", "Analisi dati a media complessità", "Workflow di automazione standard"],
    notFor: ["Task multi-step su codebase lunghe", "Analisi parallela di molti documenti"],
    tagline: "Il cavallo di battaglia quotidiano.",
  },
  {
    name: "Opus 4.8",
    key: "opus",
    tier: "Power",
    color: palette.opus,
    cost: "~$15/M in",
    context: "200K tokens",
    speed: 40,
    reasoning: 85,
    vision: 78,
    coding: 83,
    longContext: 78,
    agentic: 72,
    bestFor: ["Pitch deck e presentazioni strategiche", "Analisi legale e contrattuale", "Architettura di sistemi complessi", "Ragionamento profondo su un singolo documento"],
    notFor: ["Produzione in volume (costo elevato)", "Task semplici o ripetitivi"],
    tagline: "Prima scelta per profondità di ragionamento.",
  },
  {
    name: "Fable 5",
    key: "fable",
    tier: "Frontier",
    color: palette.fable,
    cost: "$10/M in · $50/M out",
    context: "1M tokens",
    speed: 55,
    reasoning: 97,
    vision: 95,
    coding: 98,
    longContext: 99,
    agentic: 97,
    bestFor: ["Refactor e migrazione di grandi codebase", "Agenti multi-step completamente autonomi", "Analisi simultanea di molti documenti complessi", "Prototipazione rapida one-shot", "Vision: screenshot → codice funzionante"],
    notFor: ["Alto volume (costo)", "Task banali o ripetitivi", "Richieste avanzate di cybersecurity (fallback automatico a Opus)"],
    tagline: "Mythos-class con safeguard. Il salto generazionale.",
  },
];

const useCases = [
  {
    name: "SaaS B2B con AI integrata",
    emoji: "🤖",
    description: "Piattaforma con AI assistant, documenti, workflow utente",
    recommended: "Sonnet 4.6 + Fable 5",
    why: "Sonnet gestisce la produzione quotidiana degli utenti in modo cost-efficient. Fable entra per le feature differenzianti: analisi documenti complessi, workflow agentic multi-step, funzionalità enterprise che i competitor non possono replicare facilmente.",
    also: "Haiku per auto-categorizzazione, routing interno, notifiche.",
    model: "fable",
  },
  {
    name: "Agenzia di sviluppo AI-native",
    emoji: "⚡",
    description: "Consegna prototipi e MVP in tempi drasticamente ridotti",
    recommended: "Fable 5",
    why: "Il caso d'uso più diretto. Fable one-shot applicazioni che prima richiedevano 100 prompt. Stripe ha riportato mesi di engineering compressi in giorni su una codebase da 50M righe. Il vantaggio competitivo è consegnare cose che sembrano impossibili: Fable è il motore.",
    also: "Claude Code con Fable per sessioni di sviluppo lunghe e autonome.",
    model: "fable",
  },
  {
    name: "Automazione processi aziendali",
    emoji: "⚙️",
    description: "N8N / Make, email processing, CRM sync, report automatici",
    recommended: "Haiku in prod, Fable per l'architettura",
    why: "Il volume di operazioni (email, traduzione, classificazione, sync) non giustifica Fable in produzione. Haiku gestisce il 90% dei task a costo quasi zero. Fable entra per progettare l'architettura iniziale, scrivere i workflow complessi, e risolvere problemi che bloccano il progetto.",
    also: "Sonnet per content generation e analisi a media complessità nel flusso.",
    model: "haiku",
  },
  {
    name: "Legal tech / analisi contrattuale",
    emoji: "⚖️",
    description: "Review contratti, due diligence, comparazione documenti",
    recommended: "Fable 5",
    why: "Il context da 1M token permette di caricare più contratti in parallelo e chiedere analisi cross-documento. Harvey (legal AI) ha già adottato Fable come modello principale riportando risultati al top dei loro benchmark legali. Fable opera a livello senior research scientist su documenti strutturati.",
    also: "Opus 4.8 come alternativa economica per documenti singoli.",
    model: "fable",
  },
  {
    name: "E-commerce + marketing automation",
    emoji: "🛒",
    description: "Google Ads, copy multilingue, analisi GA4, Apps Script",
    recommended: "Sonnet 4.6",
    why: "Il volume di operazioni quotidiane (copy, traduzioni, analisi performance, script) non giustifica Fable. Sonnet è ottimo per scrivere Apps Script, interpretare GA4, generare copy multilingue in modo coerente. ROI ottimale su questo tipo di stack.",
    also: "Haiku per pipeline di traduzione bulk. Fable solo per architetture nuove o revisioni strategiche.",
    model: "sonnet",
  },
  {
    name: "Personal brand & content",
    emoji: "✍️",
    description: "Articoli LinkedIn, blog tecnici, newsletter, thought leadership",
    recommended: "Fable 5",
    why: "Per chi scrive di AI e tecnologia, usare il modello più avanzato prima degli altri è già posizionamento. Fable eccelle su articoli lunghi che richiedono ricerca + struttura + voce coerente. Il long-context mantiene la coerenza su pezzi da 5.000+ parole senza degrado.",
    also: "Sonnet per bozze veloci, LinkedIn posts corti, risposte ai commenti.",
    model: "fable",
  },
  {
    name: "Fintech / analisi dati complessi",
    emoji: "📊",
    description: "Modelli finanziari, report, analisi multi-fonte, dashboard",
    recommended: "Fable 5",
    why: "IMC ha riportato che Fable ha superato i loro benchmark di trading analysis su tutti i fronti: factual lookup, reasoning concettuale, root-cause analysis, expected-value. Hebbia Finance Benchmark vede Fable al top. Per task che coinvolgono tabelle, grafici e ragionamento numerico su documenti lunghi, non c'è alternativa.",
    also: "Opus 4.8 per analisi su documento singolo di media lunghezza.",
    model: "fable",
  },
  {
    name: "Sviluppo prodotto software",
    emoji: "💻",
    description: "Codebase esistente, refactor, nuove feature, bug fixing",
    recommended: "Fable 5 in Claude Code",
    why: "Il context da 1M token permette di caricare l'intera codebase senza finestra scorrevole. Fable mantiene il contesto architetturale attraverso sessioni lunghe e migliora autonomamente le proprie note interne. Su FrontierCode benchmark (task di produzione di qualità), Fable è il top tra i modelli frontier.",
    also: "Sonnet per debug veloci e domande puntuali.",
    model: "fable",
  },
];

const timeline = [
  { phase: "Ora (fino 22 giugno)", status: "included", note: "Incluso nei piani a pagamento. Nessun costo aggiuntivo." },
  { phase: "Dopo 22 giugno", status: "credit", note: "Passa a sistema a crediti. Valuta Max plan ($100/mo) o API diretta." },
  { phase: "Prossimi mesi", status: "improve", note: "Anthropic promette riduzione dei falsi positivi e potenziale ritorno come modello standard." },
];

const RadarChart = ({ model }) => {
  const dims = [
    { key: "coding", label: "Coding" },
    { key: "reasoning", label: "Reasoning" },
    { key: "vision", label: "Vision" },
    { key: "longContext", label: "Long Context" },
    { key: "agentic", label: "Agentic" },
    { key: "speed", label: "Speed" },
  ];
  const cx = 110, cy = 110, r = 85;
  const n = dims.length;
  const toXY = (angle, radius) => ({
    x: cx + radius * Math.cos(angle - Math.PI / 2),
    y: cy + radius * Math.sin(angle - Math.PI / 2),
  });
  const gridLevels = [0.25, 0.5, 0.75, 1.0];
  const getPoints = (vals) =>
    dims.map((d, i) => {
      const angle = (2 * Math.PI * i) / n;
      const val = (vals[d.key] || 0) / 100;
      const pt = toXY(angle, r * val);
      return `${pt.x},${pt.y}`;
    }).join(" ");

  return (
    <svg viewBox="0 0 220 220" style={{ width: "100%", maxWidth: 220 }}>
      {gridLevels.map((lv, li) => (
        <polygon
          key={li}
          points={dims.map((_, i) => { const pt = toXY((2 * Math.PI * i) / n, r * lv); return `${pt.x},${pt.y}`; }).join(" ")}
          fill="none"
          stroke={palette.border}
          strokeWidth="1"
        />
      ))}
      {dims.map((_, i) => {
        const pt = toXY((2 * Math.PI * i) / n, r);
        return <line key={i} x1={cx} y1={cy} x2={pt.x} y2={pt.y} stroke={palette.border} strokeWidth="1" />;
      })}
      <polygon
        points={getPoints(model)}
        fill={`${model.color}30`}
        stroke={model.color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {dims.map((d, i) => {
        const angle = (2 * Math.PI * i) / n;
        const pt = toXY(angle, r + 16);
        return (
          <text key={i} x={pt.x} y={pt.y} textAnchor="middle" dominantBaseline="middle"
            style={{ fontSize: "9px", fill: palette.textMuted, fontFamily: "system-ui" }}>
            {d.label}
          </text>
        );
      })}
    </svg>
  );
};

const Bar = ({ value, color, label }) => (
  <div style={{ marginBottom: 8 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
      <span style={{ fontSize: 11, color: palette.textMuted }}>{label}</span>
      <span style={{ fontSize: 11, color: color, fontWeight: 600 }}>{value}</span>
    </div>
    <div style={{ background: palette.border, borderRadius: 4, height: 6 }}>
      <div style={{ width: `${value}%`, background: color, borderRadius: 4, height: 6, transition: "width 0.6s ease" }} />
    </div>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedModel, setSelectedModel] = useState("fable");
  const [selectedUseCase, setSelectedUseCase] = useState(null);

  const currentModel = models.find(m => m.key === selectedModel);

  const tabs = [
    { id: "overview", label: "Panoramica" },
    { id: "compare", label: "Confronto Modelli" },
    { id: "usecases", label: "Casi d'Uso" },
    { id: "guide", label: "Guida Pratica" },
  ];

  const styles = {
    app: { background: palette.bg, minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", color: palette.text },
    header: { padding: "32px 24px 0", borderBottom: `1px solid ${palette.border}` },
    headerTitle: { fontSize: 28, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 4 },
    headerSub: { fontSize: 13, color: palette.textMuted, marginBottom: 20 },
    pill: (active) => ({
      padding: "8px 16px", borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: "pointer",
      background: active ? palette.accent : "transparent",
      color: active ? "#fff" : palette.textMuted,
      border: active ? "none" : `1px solid ${palette.border}`,
      transition: "all 0.2s",
    }),
    tabBar: { display: "flex", gap: 8, paddingBottom: 0, overflowX: "auto" },
    content: { padding: "24px 24px" },
    card: { background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: 12, padding: 20, marginBottom: 16 },
    cardHighlight: (color) => ({ background: palette.surface, border: `1px solid ${color || palette.border}`, borderRadius: 12, padding: 20, marginBottom: 16 }),
    h2: { fontSize: 18, fontWeight: 700, marginBottom: 4, letterSpacing: "-0.3px" },
    h3: { fontSize: 14, fontWeight: 600, color: palette.textMuted, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.5px" },
    tag: (color) => ({ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: `${color}20`, color: color, marginRight: 6, marginBottom: 6 }),
    modelBtn: (active, color) => ({
      flex: 1, padding: "10px 8px", borderRadius: 8, cursor: "pointer", textAlign: "center",
      background: active ? `${color}20` : palette.surfaceAlt,
      border: active ? `1.5px solid ${color}` : `1.5px solid ${palette.border}`,
      color: active ? color : palette.textMuted,
      fontSize: 12, fontWeight: active ? 700 : 400, transition: "all 0.2s",
    }),
    grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
    badge: (color) => ({ background: `${color}18`, color: color, border: `1px solid ${color}40`, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600 }),
  };

  return (
    <div style={styles.app}>
      <div style={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${palette.fable}20`, border: `1px solid ${palette.fable}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✦</div>
          <div>
            <div style={styles.headerTitle}>Claude Fable 5</div>
            <div style={styles.headerSub}>Rilasciato il 9 giugno 2026 · Mythos-class · Disponibile sui piani a pagamento</div>
          </div>
        </div>
        <div style={styles.tabBar}>
          {tabs.map(t => (
            <button key={t.id} style={styles.pill(activeTab === t.id)} onClick={() => setActiveTab(t.id)}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={styles.content}>

        {activeTab === "overview" && (
          <>
            <div style={{ ...styles.cardHighlight(palette.fable), background: `${palette.fable}08` }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 12, color: palette.fable, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Cos'è Fable 5</div>
                  <div style={styles.h2}>Il primo modello Mythos-class per uso generale</div>
                  <div style={{ fontSize: 14, color: palette.textMuted, lineHeight: 1.6, marginTop: 8 }}>
                    Anthropic ha impiegato 2 mesi dopo Mythos Preview per aggiungere safeguard sufficienti e renderlo pubblico. Fable è la versione con protezioni integrate; Mythos 5 è lo stesso modello identico senza limitazioni, disponibile solo per cyberdifesa via Project Glasswing.
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: palette.textMuted }}>Prezzo API</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: palette.fable }}>$10/$50</div>
                  <div style={{ fontSize: 11, color: palette.textMuted }}>input/output per M token</div>
                  <div style={{ marginTop: 8 }}>
                    <span style={styles.badge(palette.green)}>1M token context</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.h3}>Capacità chiave</div>
            <div style={styles.grid2}>
              {[
                { icon: "⚙️", title: "Software Engineering", desc: "Stripe: mesi di engineering in giorni. Migrazione di una codebase Ruby da 50M righe completata in autonomia in un solo giorno." },
                { icon: "👁️", title: "Vision SOTA", desc: "Screenshot → codice sorgente. Analisi grafici scientifici. Ha battuto Pokémon FireRed usando solo screenshot raw, senza mappe o helper." },
                { icon: "🧠", title: "Long Context 1M", desc: "Memoria persistente file-based. Rimane focalizzato su task lunghissimi. Con memoria attiva, migliora le proprie prestazioni 3x rispetto a Opus." },
                { icon: "💼", title: "Knowledge Work", desc: "Top su Hebbia Finance Benchmark. IMC: ha superato le valutazioni di trading-analysis quasi interamente su tutti gli assi." },
              ].map((c, i) => (
                <div key={i} style={styles.card}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{c.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{c.title}</div>
                  <div style={{ fontSize: 12, color: palette.textMuted, lineHeight: 1.5 }}>{c.desc}</div>
                </div>
              ))}
            </div>

            <div style={styles.h3}>Timeline disponibilità</div>
            <div style={styles.card}>
              {timeline.map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < timeline.length - 1 ? 16 : 0, alignItems: "flex-start" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: t.status === "included" ? palette.green : t.status === "credit" ? palette.gold : palette.fable, marginTop: 4, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{t.phase}</div>
                    <div style={{ fontSize: 12, color: palette.textMuted }}>{t.note}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.card}>
              <div style={{ fontSize: 12, color: palette.gold, fontWeight: 600, marginBottom: 6 }}>⚠ Safeguard automatici</div>
              <div style={{ fontSize: 13, color: palette.textMuted, lineHeight: 1.6 }}>
                Meno del 5% delle sessioni viene rediretto a Opus 4.8. Le aree protette includono cybersecurity avanzata, biologia, chimica, e sviluppo di LLM frontier. Per la stragrande maggioranza dei casi d'uso aziendali e di sviluppo, questo limite non si incontra mai.
              </div>
            </div>
          </>
        )}

        {activeTab === "compare" && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {models.map(m => (
                <button key={m.key} style={styles.modelBtn(selectedModel === m.key, m.color)} onClick={() => setSelectedModel(m.key)}>
                  <div>{m.name}</div>
                  <div style={{ fontSize: 10, marginTop: 2 }}>{m.tier}</div>
                </button>
              ))}
            </div>

            <div style={{ ...styles.cardHighlight(currentModel.color), background: `${currentModel.color}08` }}>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <div style={{ flex: "0 0 200px" }}>
                  <RadarChart model={currentModel} />
                </div>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ ...styles.badge(currentModel.color), marginBottom: 10, display: "inline-block" }}>{currentModel.tier}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{currentModel.name}</div>
                  <div style={{ fontSize: 13, color: palette.textMuted, marginBottom: 16, fontStyle: "italic" }}>{currentModel.tagline}</div>
                  <div style={{ fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: palette.textMuted }}>Costo: </span>
                    <span style={{ color: currentModel.color, fontWeight: 600 }}>{currentModel.cost}</span>
                  </div>
                  <div style={{ fontSize: 12 }}>
                    <span style={{ color: palette.textMuted }}>Context: </span>
                    <span style={{ color: currentModel.color, fontWeight: 600 }}>{currentModel.context}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.grid2}>
              <div style={styles.card}>
                <div style={styles.h3}>Performance</div>
                {["reasoning", "coding", "vision", "longContext", "agentic", "speed"].map(k => (
                  <Bar key={k} value={currentModel[k]} color={currentModel.color} label={{ reasoning: "Reasoning", coding: "Coding", vision: "Vision", longContext: "Long Context", agentic: "Agentic", speed: "Velocità" }[k]} />
                ))}
              </div>
              <div>
                <div style={styles.card}>
                  <div style={styles.h3}>Ideale per</div>
                  {currentModel.bestFor.map((b, i) => (
                    <div key={i} style={{ fontSize: 12, color: palette.text, marginBottom: 6, display: "flex", gap: 6 }}>
                      <span style={{ color: palette.green }}>✓</span> {b}
                    </div>
                  ))}
                </div>
                <div style={styles.card}>
                  <div style={styles.h3}>Non usare per</div>
                  {currentModel.notFor.map((b, i) => (
                    <div key={i} style={{ fontSize: 12, color: palette.textMuted, marginBottom: 6, display: "flex", gap: 6 }}>
                      <span style={{ color: palette.red }}>✗</span> {b}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.h3}>Confronto rapido tutti i modelli</div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr>
                      {["Modello", "Tier", "Costo", "Context", "Coding", "Reasoning", "Vision", "Agentic"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: palette.textMuted, fontWeight: 500, borderBottom: `1px solid ${palette.border}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {models.map(m => (
                      <tr key={m.key} style={{ background: selectedModel === m.key ? `${m.color}08` : "transparent" }}
                        onClick={() => setSelectedModel(m.key)}>
                        <td style={{ padding: "8px 10px", color: m.color, fontWeight: 700, cursor: "pointer" }}>{m.name}</td>
                        <td style={{ padding: "8px 10px", color: palette.textMuted }}>{m.tier}</td>
                        <td style={{ padding: "8px 10px", color: palette.text }}>{m.cost}</td>
                        <td style={{ padding: "8px 10px", color: palette.text }}>{m.context}</td>
                        {["coding", "reasoning", "vision", "agentic"].map(k => (
                          <td key={k} style={{ padding: "8px 10px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <div style={{ background: palette.border, borderRadius: 2, height: 4, width: 50 }}>
                                <div style={{ width: `${m[k]}%`, background: m.color, borderRadius: 2, height: 4 }} />
                              </div>
                              <span style={{ color: palette.textMuted }}>{m[k]}</span>
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === "usecases" && (
          <>
            <div style={{ fontSize: 13, color: palette.textMuted, marginBottom: 16 }}>
              Quale modello usare per settore e tipo di progetto. Clicca per i dettagli.
            </div>
            {useCases.map((p, i) => (
              <div key={i}
                style={{ ...styles.cardHighlight(models.find(m => m.key === p.model)?.color), cursor: "pointer", transition: "all 0.2s" }}
                onClick={() => setSelectedUseCase(selectedUseCase === i ? null : i)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 22 }}>{p.emoji}</span>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: palette.textMuted }}>{p.description}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                    <span style={styles.badge(models.find(m => m.key === p.model)?.color || palette.fable)}>{p.recommended}</span>
                  </div>
                </div>
                {selectedUseCase === i && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${palette.border}` }}>
                    <div style={{ fontSize: 13, color: palette.text, lineHeight: 1.6, marginBottom: 10 }}>{p.why}</div>
                    <div style={{ fontSize: 12, color: palette.textMuted }}>
                      <span style={{ color: palette.gold }}>➕ </span>{p.also}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {activeTab === "guide" && (
          <>
            <div style={styles.card}>
              <div style={styles.h2}>Decision tree: quale modello scegliere</div>
              <div style={{ fontSize: 12, color: palette.textMuted, marginTop: 4 }}>Cinque domande per arrivare alla scelta giusta.</div>
              <div style={{ marginTop: 16 }}>
                {[
                  { q: "Task in volume (>100/giorno) e bassa complessità?", a: "Haiku 4.5", color: palette.haiku },
                  { q: "Chat utente, bozze, workflow di automazione standard?", a: "Sonnet 4.6", color: palette.sonnet },
                  { q: "Analisi profonda, strategia, ragionamento complesso su un singolo documento?", a: "Opus 4.8", color: palette.opus },
                  { q: "Codice lungo, multi-file, agentic, più documenti in parallelo?", a: "Fable 5", color: palette.fable },
                  { q: "Context > 200K token? Task che dura ore in autonomia?", a: "Fable 5 — obbligatorio", color: palette.fable },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, background: `${item.color}20`, color: item.color, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: palette.text }}>{item.q}</div>
                      <div style={{ fontSize: 12, color: item.color, fontWeight: 600, marginTop: 2 }}>→ {item.a}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.h2}>Come usare Fable 5 al massimo</div>
              <div style={{ marginTop: 14 }}>
                {[
                  { title: "Sfrutta il context da 1M token", desc: "Carica l'intera codebase o tutti i documenti rilevanti all'inizio della sessione. Fable non degrada su testi lunghi: con memoria file-based, le prestazioni migliorano nel tempo fino a 3x rispetto a sessioni senza memoria (testato su task multi-step)." },
                  { title: "Brief completo, non prompt frammentati", desc: "Fable eccelle sui problemi lunghi e complessi. Invece di 10 prompt sequenziali, scrivi un brief unico con obiettivo, constraint e output atteso. L'autonomia è il suo punto di forza: lascia che lavori in modo esteso prima di intervenire." },
                  { title: "Vision per il workflow di sviluppo", desc: "Screenshot di UI → codice funzionante. Screenshot di errori → debug immediato. Fable può ricostruire il codice sorgente di un'intera web app partendo solo da uno screenshot, senza descrizioni aggiuntive." },
                  { title: "Usa subito: finestra inclusa fino al 22 giugno", desc: "I piani a pagamento includono Fable 5 senza costi aggiuntivi fino al 22 giugno. Dopo, passa a crediti. Priorità immediate: qualsiasi progetto con codebase lunga, analisi multi-documento, o prototipazione rapida." },
                  { title: "Calcolo ROI per l'uso API in produzione", desc: "A $10/M input e $50/M output, è costoso per volume. La regola pratica: un task da 10K token costa ~$0.10. Se quel task vale più di €0.10 di tempo umano risparmiato — Fable vince. Applicalo solo dove il delta qualitativo è reale." },
                ].map((item, i) => (
                  <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: i < 4 ? `1px solid ${palette.border}` : "none" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: palette.fable, marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontSize: 13, color: palette.textMuted, lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ ...styles.card, background: `${palette.fable}08`, border: `1px solid ${palette.fable}30` }}>
              <div style={{ fontSize: 12, color: palette.fable, fontWeight: 600, marginBottom: 6 }}>RACCOMANDAZIONE FINALE</div>
              <div style={{ fontSize: 14, lineHeight: 1.7, color: palette.text }}>
                Usa Fable 5 come default per tutto quello che oggi mandi a Opus. La differenza qualitativa è reale, specialmente su task lunghi e complessi — il vantaggio di Fable si allarga proporzionalmente alla durata e complessità del problema. Tieni Haiku per volume e Sonnet come default economico per tutto il resto. Il vero ROI emerge sui progetti dove comprimere mesi in giorni è possibile: lì il costo API diventa irrilevante.
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.h3}>Stack consigliato per tipo di business</div>
              {[
                { type: "Startup / Agenzia AI", stack: "Fable 5 per dev e prototipazione · Sonnet in produzione · Haiku per volume" },
                { type: "SaaS con AI integrata", stack: "Sonnet come default utenti · Fable per feature premium · Haiku per routing" },
                { type: "Consulente / Freelance AI", stack: "Fable 5 per tutto il lavoro client-facing · Sonnet per admin e bozze veloci" },
                { type: "Enterprise / Processi interni", stack: "Opus o Fable per analisi strategica · Sonnet per produzione · Haiku per automazioni" },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < 3 ? 14 : 0, alignItems: "flex-start" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: palette.fable, marginTop: 5, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{s.type}</div>
                    <div style={{ fontSize: 12, color: palette.textMuted }}>{s.stack}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div style={{ borderTop: `1px solid ${palette.border}`, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <span style={{ fontSize: 12, color: palette.textFaint }}>Guida creata da</span>
        <a href="https://omarbortolato.it" target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 12, fontWeight: 600, color: palette.fable, textDecoration: "none", borderBottom: `1px solid ${palette.fable}40`, paddingBottom: 1 }}>
          omarbortolato.it
        </a>
      </div>
    </div>
  );
}
