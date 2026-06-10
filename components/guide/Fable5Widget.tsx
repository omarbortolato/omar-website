"use client";

import { useState } from "react";

// ─── Palette ─────────────────────────────────────────────────────────────────

const p = {
  bg:           "#0e0f14",
  surface:      "#161820",
  surfaceAlt:   "#1e2130",
  border:       "#2a2d3e",
  accent:       "#7c6fcd",
  accentBright: "#a594f9",
  gold:         "#e8c96d",
  green:        "#52c99a",
  red:          "#e06b6b",
  text:         "#e8e9f0",
  textMuted:    "#8b8fa8",
  textFaint:    "#555870",
  fable:        "#a594f9",
  opus:         "#52c99a",
  sonnet:       "#e8c96d",
  haiku:        "#e06b6b",
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const models = [
  {
    name: "Haiku 4.5", key: "haiku", tier: "Speed", color: p.haiku,
    cost: "~$0,25/M in", context: "200K token", speed: 95, reasoning: 35,
    vision: 30, coding: 40, longContext: 20, agentic: 15,
    tagline: "Volume e velocità. Costo quasi nullo.",
    bestFor: ["Classificazione e routing ad alto volume", "Risposte brevi automatizzate", "Pipeline di automazione (n8n, Make)", "Traduzione e normalizzazione dati"],
    notFor:  ["Analisi complessa multi-documento", "Codice critico o architetturale", "Long-form content di qualità"],
  },
  {
    name: "Sonnet 4.6", key: "sonnet", tier: "Balance", color: p.sonnet,
    cost: "~$3/M in", context: "200K token", speed: 80, reasoning: 65,
    vision: 60, coding: 70, longContext: 55, agentic: 55,
    tagline: "Il cavallo di battaglia quotidiano.",
    bestFor: ["Chat e assistenti AI in produzione", "Draft articoli e contenuti", "Analisi dati a media complessità", "Workflow di automazione standard"],
    notFor:  ["Task multi-step su codebase lunghe", "Analisi parallela di molti documenti"],
  },
  {
    name: "Opus 4.8", key: "opus", tier: "Power", color: p.opus,
    cost: "~$15/M in", context: "200K token", speed: 40, reasoning: 85,
    vision: 78, coding: 83, longContext: 78, agentic: 72,
    tagline: "Prima scelta per profondità di ragionamento.",
    bestFor: ["Pitch deck e presentazioni strategiche", "Analisi legale e contrattuale", "Architettura di sistemi complessi", "Ragionamento profondo su un singolo documento"],
    notFor:  ["Produzione in volume (costo elevato)", "Task semplici o ripetitivi"],
  },
  {
    name: "Fable 5", key: "fable", tier: "Frontier", color: p.fable,
    cost: "$10/$50 in/out", context: "1M token", speed: 55, reasoning: 97,
    vision: 95, coding: 98, longContext: 99, agentic: 97,
    tagline: "Mythos-class con safeguard. Il salto generazionale.",
    bestFor: ["Refactor e migrazione di grandi codebase", "Agenti multi-step completamente autonomi", "Analisi simultanea di molti documenti complessi", "Prototipazione rapida one-shot", "Vision: screenshot → codice funzionante"],
    notFor:  ["Alto volume (costo)", "Task banali o ripetitivi", "Richieste avanzate di cybersecurity (→ Opus)"],
  },
] as const;

type ModelKey = typeof models[number]["key"];
type Model    = typeof models[number];

const useCases = [
  { emoji: "🤖", name: "SaaS B2B con AI integrata",         description: "Piattaforma con AI assistant, documenti, workflow utente",      recommended: "Sonnet 4.6 + Fable 5", model: "fable" as ModelKey, why: "Sonnet gestisce la produzione quotidiana degli utenti in modo cost-efficient. Fable entra per le feature differenzianti: analisi documenti complessi, workflow agentic multi-step, funzionalità enterprise che i competitor non possono replicare facilmente.", also: "Haiku per auto-categorizzazione, routing interno, notifiche." },
  { emoji: "⚡", name: "Agenzia di sviluppo AI-native",     description: "Consegna prototipi e MVP in tempi drasticamente ridotti",      recommended: "Fable 5",              model: "fable" as ModelKey, why: "Il caso d'uso più diretto. Fable one-shot applicazioni che prima richiedevano 100 prompt. Stripe ha riportato mesi di engineering compressi in giorni su una codebase da 50M righe.",                                                                           also: "Claude Code con Fable per sessioni di sviluppo lunghe e autonome." },
  { emoji: "⚙️", name: "Automazione processi aziendali",    description: "n8n / Make, email processing, CRM sync, report automatici",    recommended: "Haiku + Fable arch",   model: "haiku" as ModelKey, why: "Haiku gestisce il 90% dei task a costo quasi zero. Fable entra per progettare l'architettura iniziale, scrivere i workflow complessi, e risolvere problemi che bloccano il progetto.",                                                                        also: "Sonnet per content generation e analisi a media complessità nel flusso." },
  { emoji: "⚖️", name: "Legal tech / analisi contrattuale", description: "Review contratti, due diligence, comparazione documenti",     recommended: "Fable 5",              model: "fable" as ModelKey, why: "Il context da 1M token permette di caricare più contratti in parallelo e chiedere analisi cross-documento. Harvey (legal AI) ha già adottato Fable come modello principale.",                                                                             also: "Opus 4.8 come alternativa economica per documenti singoli." },
  { emoji: "🛒", name: "E-commerce + marketing automation", description: "Google Ads, copy multilingue, analisi GA4, Apps Script",      recommended: "Sonnet 4.6",           model: "sonnet" as ModelKey, why: "Il volume di operazioni quotidiane non giustifica Fable. Sonnet è ottimo per scrivere Apps Script, interpretare GA4, generare copy multilingue in modo coerente.",                                                                                         also: "Haiku per pipeline di traduzione bulk. Fable solo per architetture nuove." },
  { emoji: "✍️", name: "Personal brand & content",          description: "Articoli LinkedIn, blog tecnici, newsletter",                 recommended: "Fable 5",              model: "fable" as ModelKey, why: "Fable eccelle su articoli lunghi che richiedono ricerca + struttura + voce coerente. Il long-context mantiene la coerenza su pezzi da 5.000+ parole senza degrado.",                                                                                     also: "Sonnet per bozze veloci, LinkedIn posts corti, risposte ai commenti." },
  { emoji: "📊", name: "Fintech / analisi dati complessi",   description: "Modelli finanziari, report, analisi multi-fonte",            recommended: "Fable 5",              model: "fable" as ModelKey, why: "IMC ha riportato che Fable ha superato i loro benchmark di trading analysis su tutti i fronti. Hebbia Finance Benchmark vede Fable al top.",                                                                                                             also: "Opus 4.8 per analisi su documento singolo di media lunghezza." },
  { emoji: "💻", name: "Sviluppo prodotto software",         description: "Codebase esistente, refactor, nuove feature, bug fixing",    recommended: "Fable 5 in Claude Code", model: "fable" as ModelKey, why: "Il context da 1M token permette di caricare l'intera codebase senza finestra scorrevole. Su FrontierCode benchmark, Fable è il top tra i modelli frontier.",                                                                                         also: "Sonnet per debug veloci e domande puntuali." },
];

const decisionTree = [
  { q: "Task in volume (>100/giorno) e bassa complessità?",                         a: "Haiku 4.5",              color: p.haiku  },
  { q: "Chat utente, bozze, workflow di automazione standard?",                     a: "Sonnet 4.6",             color: p.sonnet },
  { q: "Analisi profonda, strategia, ragionamento su un singolo documento?",        a: "Opus 4.8",               color: p.opus   },
  { q: "Codice lungo, multi-file, agentic, più documenti in parallelo?",            a: "Fable 5",                color: p.fable  },
  { q: "Context > 200K token? Task che dura ore in autonomia?",                     a: "Fable 5 — obbligatorio", color: p.fable  },
];

const tips = [
  { title: "Sfrutta il context da 1M token",        desc: "Carica l'intera codebase o tutti i documenti rilevanti all'inizio della sessione. Fable non degrada su testi lunghi: con memoria file-based, le prestazioni migliorano fino a 3x rispetto a sessioni senza memoria." },
  { title: "Brief completo, non prompt frammentati", desc: "Invece di 10 prompt sequenziali, scrivi un brief unico con obiettivo, constraint e output atteso. L'autonomia è il punto di forza: lascia che lavori in modo esteso prima di intervenire." },
  { title: "Vision per il workflow di sviluppo",     desc: "Screenshot di UI → codice funzionante. Screenshot di errori → debug immediato. Fable può ricostruire il codice sorgente di un'intera web app partendo solo da uno screenshot." },
  { title: "Calcolo ROI prima della produzione",     desc: "A $10/M input, un task da 10K token costa ~$0,10. Se quel task vale più di €0,10 di tempo umano risparmiato — Fable vince. Applicalo solo dove il delta qualitativo è reale." },
  { title: "Finestra inclusa fino al 22 giugno",     desc: "I piani a pagamento includono Fable 5 senza costi aggiuntivi fino al 22 giugno. Dopo, passa a crediti. Priorità immediate: codebase lunghe, analisi multi-documento, prototipazione rapida." },
];

const businessStacks = [
  { type: "Startup / Agenzia AI",        stack: "Fable 5 per dev e prototipazione · Sonnet in produzione · Haiku per volume" },
  { type: "SaaS con AI integrata",       stack: "Sonnet come default utenti · Fable per feature premium · Haiku per routing" },
  { type: "Consulente / Freelance AI",   stack: "Fable 5 per tutto il lavoro client-facing · Sonnet per admin e bozze veloci" },
  { type: "Enterprise / Processi interni", stack: "Opus o Fable per analisi strategica · Sonnet per produzione · Haiku per automazioni" },
];

// ─── Radar Chart ─────────────────────────────────────────────────────────────

const radarDims = [
  { key: "coding",      label: "Coding" },
  { key: "reasoning",   label: "Reasoning" },
  { key: "vision",      label: "Vision" },
  { key: "longContext", label: "Long Context" },
  { key: "agentic",     label: "Agentic" },
  { key: "speed",       label: "Speed" },
];

function RadarChart({ model }: { model: Model }) {
  const cx = 110, cy = 110, r = 78;
  const n  = radarDims.length;

  const toXY = (angle: number, radius: number) => ({
    x: cx + radius * Math.cos(angle - Math.PI / 2),
    y: cy + radius * Math.sin(angle - Math.PI / 2),
  });

  const getPoints = (m: Model) =>
    radarDims.map((d, i) => {
      const angle = (2 * Math.PI * i) / n;
      const val   = (m[d.key as keyof Model] as number) / 100;
      const pt    = toXY(angle, r * val);
      return `${pt.x},${pt.y}`;
    }).join(" ");

  return (
    <svg viewBox="0 0 220 220" style={{ width: "100%", maxWidth: 220 }}>
      {/* Grid */}
      {[0.25, 0.5, 0.75, 1.0].map((lv, li) => (
        <polygon
          key={li}
          points={radarDims.map((_, i) => {
            const pt = toXY((2 * Math.PI * i) / n, r * lv);
            return `${pt.x},${pt.y}`;
          }).join(" ")}
          fill="none"
          stroke={p.border}
          strokeWidth="1"
        />
      ))}
      {/* Spokes */}
      {radarDims.map((_, i) => {
        const pt = toXY((2 * Math.PI * i) / n, r);
        return <line key={i} x1={cx} y1={cy} x2={pt.x} y2={pt.y} stroke={p.border} strokeWidth="1" />;
      })}
      {/* Data polygon */}
      <polygon
        points={getPoints(model)}
        fill={`${model.color}30`}
        stroke={model.color}
        strokeWidth="2"
        strokeLinejoin="round"
        style={{ transition: "all 0.4s ease" }}
      />
      {/* Labels */}
      {radarDims.map((d, i) => {
        const angle = (2 * Math.PI * i) / n;
        const pt    = toXY(angle, r + 18);
        return (
          <text
            key={i}
            x={pt.x}
            y={pt.y}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontSize: "9px", fill: p.textMuted, fontFamily: "system-ui" }}
          >
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}

// ─── Mini bar ─────────────────────────────────────────────────────────────────

function Bar({ value, color, label }: { value: number; color: string; label: string }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: 11, color: p.textMuted }}>{label}</span>
        <span style={{ fontSize: 11, color, fontWeight: 600 }}>{value}</span>
      </div>
      <div style={{ background: p.border, borderRadius: 4, height: 6 }}>
        <div style={{ width: `${value}%`, background: color, borderRadius: 4, height: 6, transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
}

// ─── Widget ───────────────────────────────────────────────────────────────────

const tabs = [
  { id: "overview",  label: "Panoramica" },
  { id: "compare",   label: "Confronto Modelli" },
  { id: "usecases",  label: "Casi d'Uso" },
  { id: "guide",     label: "Guida Pratica" },
] as const;
type TabId = typeof tabs[number]["id"];

export function Fable5Widget() {
  const [activeTab,    setActiveTab]    = useState<TabId>("overview");
  const [selectedModel, setSelectedModel] = useState<ModelKey>("fable");
  const [openCase,      setOpenCase]      = useState<number | null>(null);

  const currentModel = models.find(m => m.key === selectedModel)!;

  const card  = { background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, padding: 20, marginBottom: 16 };
  const pill  = (active: boolean) => ({
    padding: "7px 15px", borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: "pointer",
    background: active ? p.accent : "transparent",
    color:      active ? "#fff" : p.textMuted,
    border:     active ? "none" : `1px solid ${p.border}`,
    transition: "all 0.2s", whiteSpace: "nowrap" as const,
  });
  const modelBtn = (active: boolean, color: string) => ({
    flex: 1, padding: "9px 6px", borderRadius: 8, cursor: "pointer", textAlign: "center" as const,
    background: active ? `${color}20` : p.surfaceAlt,
    border:     active ? `1.5px solid ${color}` : `1.5px solid ${p.border}`,
    color:      active ? color : p.textMuted,
    fontSize: 12, fontWeight: active ? 700 : 400, transition: "all 0.2s",
  });
  const badge  = (color: string) => ({ background: `${color}18`, color, border: `1px solid ${color}40`, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600 });
  const h3style = { fontSize: 12, fontWeight: 600, color: p.textMuted, marginBottom: 12, textTransform: "uppercase" as const, letterSpacing: "0.5px" };

  return (
    <div style={{ background: p.bg, fontFamily: "'Inter', system-ui, sans-serif", color: p.text, borderRadius: 16, overflow: "hidden" }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div style={{ padding: "28px 24px 0", borderBottom: `1px solid ${p.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${p.fable}20`, border: `1px solid ${p.fable}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✦</div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px" }}>Claude Fable 5</div>
            <div style={{ fontSize: 12, color: p.textMuted }}>Rilasciato il 9 giugno 2026 · Mythos-class · 1M token context</div>
          </div>
        </div>
        {/* Tab bar */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 0 }}>
          {tabs.map(t => (
            <button key={t.id} style={pill(activeTab === t.id)} onClick={() => setActiveTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────────────── */}
      <div style={{ padding: "24px" }}>

        {/* ── PANORAMICA ─────────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <>
            {/* Hero card */}
            <div style={{ ...card, background: `${p.fable}08`, border: `1px solid ${p.fable}30`, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 11, color: p.fable, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Cos&apos;è Fable 5</div>
                  <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>Il primo modello Mythos-class per uso generale</div>
                  <div style={{ fontSize: 13, color: p.textMuted, lineHeight: 1.6 }}>
                    Anthropic ha impiegato 2 mesi dopo Mythos Preview per aggiungere safeguard e renderlo pubblico.
                    Fable è la versione con protezioni integrate; Mythos 5 è lo stesso modello senza limitazioni,
                    disponibile solo per cyberdifesa via Project Glasswing.
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: p.textMuted }}>Prezzo API</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: p.fable }}>$10/$50</div>
                  <div style={{ fontSize: 11, color: p.textMuted }}>input/output per M token</div>
                  <div style={{ marginTop: 8 }}><span style={badge(p.green)}>1M token context</span></div>
                </div>
              </div>
            </div>

            {/* Capability cards */}
            <div style={h3style}>Capacità chiave</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              {[
                { icon: "⚙️", title: "Software Engineering",   desc: "Stripe: mesi di engineering in giorni. Migrazione di una codebase Ruby da 50M righe completata in autonomia in un solo giorno." },
                { icon: "👁️", title: "Vision SOTA",            desc: "Screenshot → codice sorgente. Analisi grafici scientifici. Ha battuto Pokémon FireRed usando solo screenshot raw, senza mappe o helper." },
                { icon: "🧠", title: "Long Context 1M",        desc: "Memoria persistente file-based. Rimane focalizzato su task lunghissimi. Con memoria attiva, migliora le proprie prestazioni 3× rispetto a Opus." },
                { icon: "💼", title: "Knowledge Work",          desc: "Top su Hebbia Finance Benchmark. IMC: ha superato le valutazioni di trading-analysis quasi interamente su tutti gli assi." },
              ].map((c, i) => (
                <div key={i} style={card}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{c.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{c.title}</div>
                  <div style={{ fontSize: 12, color: p.textMuted, lineHeight: 1.5 }}>{c.desc}</div>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div style={h3style}>Timeline disponibilità</div>
            <div style={card}>
              {[
                { phase: "Ora (fino 22 giugno)",  status: "green",  note: "Incluso nei piani a pagamento. Nessun costo aggiuntivo." },
                { phase: "Dopo 22 giugno",         status: "gold",   note: "Passa a sistema a crediti. Valuta Max plan ($100/mo) o API diretta." },
                { phase: "Prossimi mesi",           status: "fable",  note: "Anthropic promette riduzione dei falsi positivi e potenziale ritorno come modello standard." },
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < 2 ? 16 : 0, alignItems: "flex-start" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: p[t.status as keyof typeof p] as string, marginTop: 4, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{t.phase}</div>
                    <div style={{ fontSize: 12, color: p.textMuted }}>{t.note}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Safeguard note */}
            <div style={card}>
              <div style={{ fontSize: 12, color: p.gold, fontWeight: 600, marginBottom: 6 }}>⚠ Safeguard automatici</div>
              <div style={{ fontSize: 13, color: p.textMuted, lineHeight: 1.6 }}>
                Meno del 5% delle sessioni viene rediretto a Opus 4.8. Le aree protette includono cybersecurity avanzata, biologia, chimica e sviluppo di LLM frontier. Per la stragrande maggioranza dei casi d&apos;uso aziendali, questo limite non si incontra mai.
              </div>
            </div>
          </>
        )}

        {/* ── CONFRONTO MODELLI ──────────────────────────────────────── */}
        {activeTab === "compare" && (
          <>
            {/* Model selector */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {models.map(m => (
                <button key={m.key} style={modelBtn(selectedModel === m.key, m.color)} onClick={() => setSelectedModel(m.key)}>
                  <div>{m.name}</div>
                  <div style={{ fontSize: 10, marginTop: 2 }}>{m.tier}</div>
                </button>
              ))}
            </div>

            {/* Radar + stats */}
            <div style={{ ...card, background: `${currentModel.color}08`, border: `1px solid ${currentModel.color}30`, marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <div style={{ flex: "0 0 200px" }}>
                  <RadarChart model={currentModel} />
                </div>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ ...badge(currentModel.color), marginBottom: 10, display: "inline-block" }}>{currentModel.tier}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{currentModel.name}</div>
                  <div style={{ fontSize: 13, color: p.textMuted, marginBottom: 16, fontStyle: "italic" }}>{currentModel.tagline}</div>
                  <div style={{ fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: p.textMuted }}>Costo: </span>
                    <span style={{ color: currentModel.color, fontWeight: 600 }}>{currentModel.cost}</span>
                  </div>
                  <div style={{ fontSize: 12 }}>
                    <span style={{ color: p.textMuted }}>Context: </span>
                    <span style={{ color: currentModel.color, fontWeight: 600 }}>{currentModel.context}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bars + best/not */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div style={card}>
                <div style={h3style}>Performance</div>
                {(["reasoning", "coding", "vision", "longContext", "agentic", "speed"] as const).map(k => (
                  <Bar key={k} value={currentModel[k]} color={currentModel.color} label={{ reasoning: "Reasoning", coding: "Coding", vision: "Vision", longContext: "Long Context", agentic: "Agentic", speed: "Velocità" }[k]} />
                ))}
              </div>
              <div>
                <div style={card}>
                  <div style={h3style}>Ideale per</div>
                  {currentModel.bestFor.map((b, i) => (
                    <div key={i} style={{ fontSize: 12, color: p.text, marginBottom: 6, display: "flex", gap: 6 }}>
                      <span style={{ color: p.green }}>✓</span> {b}
                    </div>
                  ))}
                </div>
                <div style={card}>
                  <div style={h3style}>Non usare per</div>
                  {currentModel.notFor.map((b, i) => (
                    <div key={i} style={{ fontSize: 12, color: p.textMuted, marginBottom: 6, display: "flex", gap: 6 }}>
                      <span style={{ color: p.red }}>✗</span> {b}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Comparison table */}
            <div style={card}>
              <div style={h3style}>Confronto rapido tutti i modelli</div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr>
                      {["Modello", "Tier", "Costo", "Context", "Coding", "Reasoning", "Vision", "Agentic"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: p.textMuted, fontWeight: 500, borderBottom: `1px solid ${p.border}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {models.map(m => (
                      <tr key={m.key}
                        style={{ background: selectedModel === m.key ? `${m.color}08` : "transparent", cursor: "pointer" }}
                        onClick={() => setSelectedModel(m.key)}>
                        <td style={{ padding: "8px 10px", color: m.color, fontWeight: 700 }}>{m.name}</td>
                        <td style={{ padding: "8px 10px", color: p.textMuted }}>{m.tier}</td>
                        <td style={{ padding: "8px 10px", color: p.text }}>{m.cost}</td>
                        <td style={{ padding: "8px 10px", color: p.text }}>{m.context}</td>
                        {(["coding", "reasoning", "vision", "agentic"] as const).map(k => (
                          <td key={k} style={{ padding: "8px 10px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <div style={{ background: p.border, borderRadius: 2, height: 4, width: 50 }}>
                                <div style={{ width: `${m[k]}%`, background: m.color, borderRadius: 2, height: 4, transition: "width 0.4s ease" }} />
                              </div>
                              <span style={{ color: p.textMuted }}>{m[k]}</span>
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

        {/* ── CASI D'USO ─────────────────────────────────────────────── */}
        {activeTab === "usecases" && (
          <>
            <div style={{ fontSize: 13, color: p.textMuted, marginBottom: 16 }}>
              Quale modello usare per settore e tipo di progetto. Clicca per i dettagli.
            </div>
            {useCases.map((uc, i) => {
              const ucModel = models.find(m => m.key === uc.model);
              const isOpen  = openCase === i;
              return (
                <div key={i}
                  style={{ ...card, border: `1px solid ${isOpen ? (ucModel?.color ?? p.border) : p.border}`, cursor: "pointer", transition: "all 0.2s", background: isOpen ? `${ucModel?.color ?? p.surface}08` : p.surface }}
                  onClick={() => setOpenCase(isOpen ? null : i)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 22 }}>{uc.emoji}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{uc.name}</div>
                        <div style={{ fontSize: 12, color: p.textMuted }}>{uc.description}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, marginLeft: 12 }}>
                      <span style={badge(ucModel?.color ?? p.fable)}>{uc.recommended}</span>
                      <span style={{ color: p.textMuted, fontSize: 14, transition: "transform 0.2s", display: "inline-block", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>↓</span>
                    </div>
                  </div>
                  {isOpen && (
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${p.border}` }}>
                      <div style={{ fontSize: 13, color: p.text, lineHeight: 1.6, marginBottom: 10 }}>{uc.why}</div>
                      <div style={{ fontSize: 12, color: p.textMuted }}>
                        <span style={{ color: p.gold }}>➕ </span>{uc.also}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* ── GUIDA PRATICA ──────────────────────────────────────────── */}
        {activeTab === "guide" && (
          <>
            {/* Decision tree */}
            <div style={card}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Decision tree: quale modello scegliere</div>
              <div style={{ fontSize: 12, color: p.textMuted, marginTop: 4, marginBottom: 16 }}>Cinque domande per arrivare alla scelta giusta.</div>
              {decisionTree.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: `${item.color}20`, color: item.color, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: p.text }}>{item.q}</div>
                    <div style={{ fontSize: 12, color: item.color, fontWeight: 600, marginTop: 2 }}>→ {item.a}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div style={card}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Come usare Fable 5 al massimo</div>
              {tips.map((tip, i) => (
                <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: i < tips.length - 1 ? `1px solid ${p.border}` : "none" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: p.fable, marginBottom: 4 }}>{tip.title}</div>
                  <div style={{ fontSize: 12, color: p.textMuted, lineHeight: 1.6 }}>{tip.desc}</div>
                </div>
              ))}
            </div>

            {/* Stack by business */}
            <div style={card}>
              <div style={h3style}>Stack consigliato per tipo di business</div>
              {businessStacks.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < businessStacks.length - 1 ? 14 : 0, alignItems: "flex-start" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.fable, marginTop: 5, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{s.type}</div>
                    <div style={{ fontSize: 12, color: p.textMuted }}>{s.stack}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Final rec */}
            <div style={{ ...card, background: `${p.fable}08`, border: `1px solid ${p.fable}30` }}>
              <div style={{ fontSize: 11, color: p.fable, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Raccomandazione finale</div>
              <div style={{ fontSize: 13, lineHeight: 1.7, color: p.text }}>
                Usa Fable 5 come default per tutto quello che oggi mandi a Opus. La differenza qualitativa è reale, specialmente su task lunghi e complessi — il vantaggio di Fable si allarga proporzionalmente alla durata e complessità del problema. Tieni Haiku per volume e Sonnet come default economico per tutto il resto. Il vero ROI emerge sui progetti dove comprimere mesi in giorni è possibile: lì il costo API diventa irrilevante.
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <div style={{ borderTop: `1px solid ${p.border}`, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <span style={{ fontSize: 12, color: p.textFaint }}>Guida creata da</span>
        <a href="https://omarbortolato.it" target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 12, fontWeight: 600, color: p.fable, textDecoration: "none", borderBottom: `1px solid ${p.fable}40`, paddingBottom: 1 }}>
          omarbortolato.it
        </a>
      </div>
    </div>
  );
}
