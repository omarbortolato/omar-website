# Domande aperte — dopo la consegna

Aggiornato il 4 agosto 2026. Le quindici domande del piano hanno avuto risposta e sono state
applicate. Qui restano solo le cose che ho trovato lavorando e che devi decidere tu.

---

## Blocca la pubblicazione, o quasi

### 1. La privacy policy va letta da te prima di restare online

Ho scritto `/privacy` sulla base di quello che il sito fa davvero: raccolta email via Notion, invio
via Resend, hosting Vercel, prenotazioni Cal.com. È accurata rispetto al codice.

Due cose non le posso decidere io:

- **Identificazione del titolare.** Ho messo nome e email. Se raccogli email nell'ambito di
  un'attività professionale con partita IVA, l'informativa dovrebbe riportare anche i dati
  identificativi completi. Dimmi se aggiungerli e quali.
- **I sotto-responsabili.** Ho elencato Vercel, Notion, Resend e Cal.com. Se hai firmato con loro
  gli accordi sul trattamento dei dati, il riferimento andrebbe citato. Se non li hai firmati vanno
  firmati: sono tutti disponibili nei rispettivi pannelli.

Finché non mi dici il contrario la pagina resta com'è, e ti copre più di quanto ti coprisse
l'assenza di qualsiasi informativa.

### 2. Il link di cancellazione nelle email non esiste ancora

La privacy dichiara che ogni comunicazione contiene un link di cancellazione. Oggi le email che il
sito manda sono transazionali (consegna del file) e non ne hanno bisogno. Ma nel momento in cui
agganci la prima sequenza, quel link deve esistere davvero. È un lavoro da fare **prima** della
prima email di sequenza, non dopo.

---

## Da decidere quando vuoi

### 3. Il consenso raccolto prima di oggi

Nel database Notion ci sono iscritti raccolti con la vecchia microcopy, che diceva "zero spam, solo
risorse utili" senza casella di consenso separata. Per una sequenza di marketing quel consenso è
debole.

**La mia proposta:** i contatti vecchi restano fuori dalla prima sequenza. Se li vuoi dentro, la
strada pulita è una singola email di ri-consenso esplicito. Dimmi quale delle due preferisci e la
predispongo.

### 4. Il pulsante di fine articolo è su tre articoli, non su uno

Mi avevi indicato *Da utente ad architetto*. L'ho messo lì e su altri due dove il richiamo regge:
*Come ho costruito un sistema quasi automatico per trasformare un'idea in un articolo* e
*Stiamo costruendo cose bellissime per risolvere il problema sbagliato*.

Si gestisce da `lib/guides.ts`, mappa `PROMO_BY_POST`: aggiungere o togliere un articolo è una riga.

### 5. Quattro dettagli architetturali: risolti nel codice, ma verificali

Non li ho inventati, li ho letti in `board/platform/`. Se qualcosa è cambiato da quando Michele ha
estratto il documento, correggimi:

- **La funzione di clearance** (`centralbrain/catalog.py`): l'ordine dei controlli è auto-chiamata,
  privato, entrata, ordine sui rank, poi laterale cross-dominio, coordinatore solo esplicito,
  foglia. Il chiamante esterno vale rank meno uno. Nel capitolo 4 c'è scritto così.
- **La classificazione del dominio** (`centralbrain/memory.py`): densità di parole chiave,
  deterministica, parità risolta verso il dominio di ripiego. Nel capitolo 5.
- **Il campo `tier`**: è la classe di modello passata alla chiamata attraverso il varco. Nella guida
  l'ho chiamato "classe di modello" senza nominare modelli, così non invecchia.
- **La chiave dell'answer-cache** (`agent-runtime/answer_cache.py`): agente, domanda e storia. La
  versione dell'agente **non** entra nella chiave: si invalida tutto al rilascio. Nel capitolo 8
  l'ho usato come esempio positivo, perché è la scelta giusta.

### 6. La guida è di 41 pagine, non 25-40

Avevo stimato 38. Ne sono venute 41 senza pagine mezze vuote: il controllo automatico non segnala
nessuna pagina sotto il 72% di riempimento. Per scendere a 40 dovrei togliere contenuto, non spazio.
Se il numero ti importa taglio dal capitolo 1, che è il più comprimibile.

### 7. Estendere la conformità agli altri progetti

Ho salvato la regola AI Act come prioritaria a livello CISO, quindi d'ora in poi la applico a tutto.
I progetti che secondo me vanno guardati per primi:

- **I quattro chatbot Herbalife.** Se un utente ci parla, l'articolo 50 paragrafo 1 chiede che sia
  dichiarato che sta interagendo con un sistema di AI. È il caso più esposto che hai.
- **La piattaforma marketing**, per i contenuti generati e pubblicati sui siti cliente.
- **I siti WordPress dei clienti**, dove i contenuti escono a nome del cliente: lì la responsabilità
  editoriale è sua, e va deciso chi dichiara cosa.

Non ho toccato niente di tutto questo, era fuori dal perimetro di oggi. Dimmi da dove partire.

### 8. In copertina c'è scritto "Chief AI Officer"

Come mi hai detto. L'altra guida, la pagina About e il footer dicono ancora "AI Manager". Non le ho
allineate perché non me l'hai chiesto: dimmi se vuoi che lo faccia, così il posizionamento è
coerente ovunque.
