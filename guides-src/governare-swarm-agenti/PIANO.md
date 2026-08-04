# Piano — "Governare uno swarm di agenti"

Guida PDF scaricabile per omarbortolato.it/guide. Documento di allineamento, da confermare prima
della scrittura.

---

## 0. Sorgente dell'architettura

Nessun PDF è arrivato allegato a questa sessione. Ho trovato sulla macchina il documento che
corrisponde esattamente alla descrizione del brief, sezione per sezione:

`/root/board/platform/agent-runtime/docs/supervisor.html` — "Supervisor: come gira uno swarm di agenti"

Contiene: il problema (perché non basta far partire un processo), le quattro responsabilità del
supervisor, il contratto dell'agente come cartella, i rank e il DAG, la matrice di clearance, la
tabella del gating, i sei passi del ciclo di una richiesta, agenti vs capacità minori con il vincolo
di rete, le due cache, e in coda la sezione "Stato: dove siamo e cosa manca" che il brief mi dice di
ignorare. Sorgente secondaria coerente: `board/platform/agent-runtime/README.md`.

Assumo che sia questo il sorgente. Se il PDF allegato differisce, mandamelo prima che io scriva.

---

## 1. Le guide esistenti — cosa ho letto

Due guide pubblicate su `/guide`, di natura diversa.

**"Come ho costruito questo sito con Claude Code"** — PDF A4, 14 pagine, generato con ReportLab.

- Copertina: banda arancio in cima, eyebrow `GUIDA GRATUITA` in amber maiuscolo, titolo navy su tre
  righe, filetto orizzontale, sottotitolo grigio in tre righe, firma (nome navy + ruoli grigi + URL
  amber), banda navy scuro in fondo con il payoff.
- Pagina 2: indice numerato 1-10, ogni voce con titolo e sottotitolo esplicativo, seguito da un
  riquadro `NOTA`.
- Interno: filetto amber sotto la testatina; testatina con titolo guida a sinistra e `omarbortolato.it`
  a destra; H2 navy grande con filetto amber sotto; H3 in blu medio; corpo giustificato; elenchi
  puntati con lead in grassetto; riquadri `NOTA` e `TIP` su fondo chiaro; tabelle a tre colonne con
  intestazione colorata e nota a piè di tabella; piè di pagina "Pagina N" centrato.
- Chiusura: pagina 14 di ringraziamento, invito alla condivisione, blocco bio (nome, ruoli,
  omarbortolato.it, LinkedIn, payoff) e riga di colophon in corpo minuscolo con crediti, data di
  aggiornamento e licenza di distribuzione.
- Nessuna infografica: solo tabelle e riquadri.
- Nessuna bibliografia: la guida è autobiografica, non ha fonti da citare.
- La CTA di download non è nel PDF: sta sulla landing `/guide/come-ho-costruito-questo-sito`, in
  fondo, come form email.

**"Claude Fable 5: la guida pratica"** — non è un PDF, è una pagina web lunga con schede modello,
grafici a barre in CSS, tabelle di confronto e un widget interattivo. Utile come riferimento di
densità visiva, non di impaginazione.

**Le Spremute** (`/libri`) — 5 pagine A4, generate con Puppeteer da HTML. È il sistema di design PDF
più recente e più curato del sito: copertina navy piena con cerchio amber in trasparenza, badge
pill amber, titolo bianco con seconda riga amber, sezioni numerate con pallino navy, card con bordo
sottile, riquadri colorati per i contrasti, blocco CTA navy con bottone amber, footer a due colonne.

**Cosa cambio, e perché.** Prendo l'impianto editoriale della guida Claude Code (copertina, indice,
testatina, piè di pagina, pagina bio finale, colophon) e lo porto sul motore delle Spremute
(HTML + Puppeteer). Tre motivi concreti:

1. Il PDF attuale perde tutti gli accenti: legge "perche", "e", "piu". È un limite dei font di base
   di ReportLab. Con Puppeteer e Inter il problema sparisce.
2. Le infografiche richieste sono impossibili da fare in modo pulito con ReportLab e naturali in
   HTML/SVG.
3. I sorgenti restano file di testo versionabili e riesportabili, non uno script che ridisegna tutto
   a mano.

Aggiungo inoltre, rispetto alle guide esistenti: numeri di pagina nell'indice, un riquadro
"Come leggere questa guida" in apertura, la marcatura esplicita dei riquadri aggiornabili, e una
bibliografia ragionata con data di consultazione.

---

## 2. Brand kit — dedotto, non trovato

Non esiste un file di brand kit nel repository. L'ho ricavato da `tailwind.config.ts`, dal template
delle Spremute e dal PDF esistente. Questo è ciò che applico:

| Elemento | Valore |
|---|---|
| Navy primario | `#1E3A8A` — copertina, H2, numeri di sezione, bottoni |
| Navy scuro | `#161F47` — bande piene, footer di copertina |
| Amber accento | `#F59E0B` — eyebrow, filetti, badge, evidenziazioni, seconda riga del titolo |
| Testo | `#111827` primario, `#6B7280` secondario, `#9CA3AF` terziario |
| Sfondi | `#FFFFFF`, `#F9FAFB` chiaro, `#EFF4FF` info, `#FFFBEB` warning |
| Bordi | `#E5E7EB`, `0.5px` sulle card |
| Font | Inter, tutti i pesi. Weight 900 sui titoli di copertina, 700 sugli H2, 400/500 sul corpo |
| Raggi | 12-14px sulle card, 20px sui badge pill, 6-7px sui bottoni |
| Griglia A4 | margini 40-48px, corpo 13.5-14px, interlinea 1.7 |
| Logo | `public/images/logo_omarbortolato.jpg` |
| Foto | `public/images/omar-hero.png` per la pagina bio |
| Payoff | "AI pratica per chi vuole fare, non solo sapere." |
| Firma | "Omar Bortolato — AI Manager \| Imprenditore \| Speaker" |

Una nota: la firma delle guide esistenti dice "AI Manager". Il brief dice "Chief AI Officer".
Serve una decisione, è nelle domande.

---

## 3. Voce — dagli ultimi tre articoli

Letti: *Da utente ad architetto* (4 agosto 2026), *Quaranta minuti con Italo* (31 luglio),
*Come ho guadagnato 72 euro in 10 minuti con una telefonata* (27 luglio).

Cosa prendo:

- Apertura che parte da una scena o da un problema concreto, mai da una definizione.
- Paragrafi di due o tre frasi. Molti a capo. Nessun muro di testo.
- Il "tu" diretto al lettore, alternato all'impersonale quando si descrive un meccanismo.
- Frasi brevi usate come stacco dopo un ragionamento lungo. "Sono rimasto quaranta."
- Onestà sul costo delle cose: cosa non funziona, cosa si paga, cosa non si sa ancora.
- Nessun elenco puntato dove può stare una frase.
- Termini tecnici spiegati in mezza riga e poi usati senza scuse.

Cosa non prendo, perché il brief lo vieta o perché il registro qui è diverso:

- Gli em dash. Il blog ne è pieno, la guida non ne avrà nessuno.
- Il racconto in prima persona del percorso. Qui l'architettura si descrive al presente.
- Gli emoji nei titoli.

---

## 4. Indice proposto e stima pagine

Tengo l'ossatura del brief. Due modifiche, motivate.

**Modifica 1.** Sposto il confronto fra pattern di orchestrazione dentro la sezione 1, non in coda.
Serve al lettore per collocarsi prima di leggere le decisioni, non dopo. La tassonomia diventa la
seconda metà del capitolo di apertura.

**Modifica 2.** Aggiungo una pagina di apertura non numerata, "Come leggere questa guida", che
dichiara in dieci righe il contratto col lettore: cosa trova, cosa non trova, e che ogni sezione
risponde a problema / decisione / costo. Le guide esistenti aprono con l'indice e basta.

| # | Sezione | Pagine |
|---|---|---|
| — | Copertina | 1 |
| — | Come leggere questa guida | 1 |
| — | Indice | 1 |
| 1 | Il salto da uno a dieci — i modi in cui un sistema di agenti diventa incomprensibile, e la tassonomia dei pattern di orchestrazione | 4 |
| 2 | Il control-plane — le quattro responsabilità che non sono delegabili | 3 |
| 3 | Il contratto minimo — perché un agente è una cartella e non una riga in un registro | 3 |
| 4 | La topologia — i rank, la regola di delega, il DAG come proprietà dell'ordinamento | 5 |
| 5 | Il gating — le regole nel punto di passaggio obbligato | 3 |
| 6 | Il ciclo di una richiesta — i controlli in sequenza e il perché dell'ordine | 3 |
| 7 | Agenti e capacità — quando un'unità di lavoro merita un'identità | 3 |
| 8 | La spesa come vincolo di governance — le cache e la regola che non possono violare | 2 |
| 9 | Limiti e trade-off dell'architettura | 3 |
| 10 | Le decisioni che devi prendere tu | 3 |
| 11 | Fonti e letture | 2 |
| — | Chiusura, bio, colophon | 1 |

**Totale stimato: 38 pagine**, di cui 8 occupate in buona parte dalle infografiche. Se in
composizione supera le 40 taglio dalla 1 e dalla 10, che sono le più comprimibili. Il capitolo 4
non si tocca: è quello che il brief chiede di portare a fondo, ed è la parte che resta valida più a
lungo.

Ogni sezione da 1 a 9 chiude con un blocco fisso di tre righe, graficamente marcato:
**Il problema · La decisione · Cosa costa.** È lo scheletro che il brief impone, reso visibile e
verificabile a colpo d'occhio.

---

## 5. Infografiche

Otto, come da brief, più una nona che propongo. Ognuna con titolo autoportante e didascalia di una
riga, tutte in SVG scritto a mano, esportate anche come PNG a 300 dpi e incorporate nel PDF.

| # | Titolo | Sezione | Cosa mostra |
|---|---|---|---|
| 1 | Il grafo di delega, quattro livelli | 4 | Rank 0-3, frecce ammesse in navy, frecce vietate in rosso tratteggiato e barrate, il cappio impossibile marcato |
| 2 | Chi può chiamare chi | 4 | Matrice di clearance, righe chiamante e colonne bersaglio, spunta o punto, con il triangolo superiore vuoto evidenziato come conseguenza dell'ordine |
| 3 | Cosa succede a una richiesta | 6 | Sei controlli in sequenza verticale, con i codici di uscita a lato e il ramo del chiarimento marcato come esito valido |
| 4 | Conformato, in attesa, quarantena | 5 | Tabella situazione / esito / motivo, tre colori: verde conformato, ambra in attesa, rosso quarantena |
| 5 | Il contratto dell'agente | 3 | La cartella con i quattro file, uno obbligatorio e tre facoltativi, con accanto cosa succede se manca |
| 6 | Agente o capacità | 7 | Confronto affiancato su cinque attributi, e sotto la regola di rete che decide dove può stare una capacità |
| 7 | I due livelli di cache | 8 | Dove intercettano lungo il ciclo, cosa saltano, e la guardia di spesa disegnata come sbarramento che nessuna delle due attraversa |
| 8 | Cinque modi di orchestrare | 1 | Supervisor, gerarchico, swarm, handoff, blackboard, disegnati con la stessa grammatica, e il posizionamento dell'architettura descritta |
| 9 | Cicli impossibili contro cicli rilevati *(proposta)* | 4 | Due colonne: a sinistra il rilevamento a runtime con il punto in cui fallisce, a destra l'ordine stretto che rende il problema inesprimibile |

La nona la propongo perché il brief chiede di portare a fondo il perché i sistemi che si affidano al
rilevamento dei cicli a runtime falliscono, e quella differenza è visiva prima che verbale. Se la
consideri di troppo, la taglio.

---

## 6. Ricerca prevista

Otto aree, con le fonti che intendo consultare. Tutte da verificare davvero, ognuna citata con
titolo, autore o organizzazione, URL e data di consultazione. Se una non regge alla verifica, cade.

**Pattern di orchestrazione.** Anthropic Engineering, *Building effective agents* e il resoconto
sul sistema multi-agente di ricerca. LangGraph, documentazione sui pattern supervisor, swarm e
handoff. OpenAI, documentazione dell'Agents SDK. Microsoft, il paper AutoGen su arXiv. Per la
blackboard vado alla letteratura originale, Hayes-Roth 1985, non alle riscritture recenti.

**Teoria dei grafi.** La formulazione precisa di ordine stretto e la sua antisimmetria, DAG e
ordinamento topologico (Kahn 1962, e la trattazione in CLRS). Il parallelo che voglio portare a
fondo è la prevenzione del deadlock per ordinamento totale delle risorse: è lo stesso identico
meccanismo, ha cinquant'anni, e nessuno lo chiama più "prevenzione dei cicli". Fonte primaria:
Havender 1968 e la gerarchia di allocazione di Dijkstra.

**Fallimenti documentati.** *Why Do Multi-Agent LLM Systems Fail?* (Berkeley, arXiv) per la
tassonomia degli errori con i numeri. Cognition, *Don't Build Multi-Agents*, per l'argomento
contrario all'architettura descritta. *Lost in the Middle* (Liu et al.) per la degradazione del
contesto lungo. Cerco numeri veri, non aneddoti.

**Control-plane e policy.** Kubernetes, documentazione degli admission controller. Open Policy
Agent per la policy-as-code. La separazione control plane / data plane in Envoy e Istio. Per la
sicurezza a capacità risalgo a Dennis e Van Horn 1966 e a Saltzer e Schroeder 1975 per il minimo
privilegio: sono i testi che hanno definito i termini che oggi usiamo a sproposito.

**Isolamento ed esecuzione.** OWASP Top 10 for LLM Applications, in particolare la voce sull'agency
eccessiva. Il capitolo config di The Twelve-Factor App per le credenziali fuori dal codice. La
letteratura sulla prompt injection nei sistemi che eseguono strumenti.

**Caching.** RFC 9111 sul caching HTTP. È il parallelo più forte che ho: la composizione della
chiave di cache e l'header Vary sono esattamente il problema della history che deve entrare nella
chiave, formalizzato trent'anni fa. Aggiungo la letteratura sul cache poisoning per il motivo per
cui una guardia non deve mai stare a valle della cache.

**Descoperta contro registro.** La riconciliazione fra stato desiderato e stato osservato nei
controller Kubernetes, e la distinzione fra sistemi level-triggered ed edge-triggered. La
letteratura sul configuration drift. È il fondamento del "un registro che diverge dal disco è un
registro che mente".

**Granularità.** Parnas 1972 sui criteri di decomposizione modulare, che è ancora il testo migliore
sull'argomento. Fowler sui trade-off dei microservizi. L'antipattern dei nanoservizi.

Sul vincolo evergreen: dove un riferimento è volatile (un prodotto, una versione, un limite di
piattaforma) lo isolo in un riquadro marcato "da rivedere", così una revisione futura tocca solo
quello. Il resto punta a principi che non scadono.

Se la ricerca contraddice una scelta dell'architettura, la contraddizione entra nel capitolo 9.
L'argomento di Cognition contro i sistemi multi-agente è il candidato più probabile, e va affrontato
di petto.

---

## 7. Deliverable e dove finiscono

| # | Cosa | Dove |
|---|---|---|
| 1 | PDF impaginato | `public/downloads/governare-swarm-agenti.pdf` |
| 2 | Sorgenti infografiche | `guides-src/governare-swarm-agenti/figures/*.svg` + PNG 300 dpi |
| 3 | Sorgente HTML della guida e script di build | `guides-src/governare-swarm-agenti/` |
| 4 | Anteprima due pagine | PNG per la landing |
| 5 | Landing di download | `app/guide/governare-swarm-agenti/page.tsx` + voce in `lib/guides.ts` |
| 6 | Testo del bottone di fine articolo | in consegna, testo pronto da incollare |
| 7 | Predisposizione email | modifica a `app/api/subscribe/route.ts` e al database Notion iscritti |
| 8 | Domande aperte | file separato |

**Sulla predisposizione email.** L'infrastruttura c'è già in parte. Il database Notion iscritti
(`c3a083f7...`) ha oggi: Email, Nome, Guida (select), Data, Source (select, unico valore `website`).
Serve poco per renderlo agganciabile a una sequenza futura:

- aggiungere l'opzione `governare-swarm-agenti` al campo Guida;
- aggiungere `Tag provenienza` (multi-select) così che la stessa email raccolta da landing, da fondo
  articolo o da newsletter sia distinguibile;
- aggiungere `Sequenza` (select, vuoto di default) e `Stato sequenza` (select), che restano vuoti
  finché una sequenza non esiste: sono il punto di aggancio;
- passare dal front-end il punto esatto di raccolta, che oggi non viene passato.

Non scrivo nessuna email e non attivo nessun invio. La modifica allo schema Notion e al codice
richiede il tuo via libera: è nelle domande.

---

## 8. Cosa mi serve da te

Le domande sono nel file separato `DOMANDE-APERTE.md`. Le tre che bloccano la scrittura sono la 1,
la 2 e la 3. Sulle altre posso partire con l'assunzione dichiarata e correggere dopo.
