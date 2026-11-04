# MEMORA EVENT — Business + Legal Ground Truth

Stand: 2026-09-14

Aktuelle öffentliche Marke: MEMORA EVENT seit T064. Das Dokument enthält historische Betreiber-/Freigabefakten; alte Identitäten darin sind keine aktuelle Branding-Vorgabe.
Status: Working Ground Truth für T057 (`blocked_external`)

Dieses Dokument ist die kanonische fachliche Eingabe für die noch offenen **V1-Legal-/Privacy-/Inquiry-Gates**. Es ersetzt keine finale Rechtsprüfung und erfindet keine unbekannten Betreiber-, Vertrags- oder Retentiondaten.

Es ist **kein vollständiges V1-Launchregister**: T010 und `src/release/production-approvals.json` bleiben autoritativ für öffentliche Medien, Pakete/Preise und Produktinhalte; T009/T045 führen Domain-/Deploymentgrenzen. Aktuell sind `publicMedia` und `productContent` in `production-approvals.json` weiterhin nicht freigegeben.

## Statusklassen

- `confirmed`: durch Repo, Kundenanforderung oder technische Evidenz belegt; darf als Prämisse dieser Lane verwendet werden.
- `decision-required`: externe Betreiber-/Geschäftsentscheidung fehlt; abhängige Production-Gates bleiben fail-closed.
- `deferred`: bewusst keine Entscheidung dieser Lane; eigener anderer Task bleibt zuständig.

## 1. Bestätigte V1-Wahrheiten dieser Lane

| Thema | Status | Ground Truth | Evidenz / Folge |
|---|---|---|---|
| V1-Vertragsgrenze | confirmed | Website-Anfrage ist unverbindlich und erzeugt weder Reservierung noch Buchung noch Zahlung. | `docs/inquiry-contract.md`, `docs/customer-requirements.md` |
| Anfragepfad | confirmed | Browser → Cloudflare Worker → Validierung/Turnstile → D1 → Outbox → Betreiberbenachrichtigung. | `docs/inquiry-contract.md`, `docs/privacy-data-flow.md` |
| Fachliche Anfragewahrheit | confirmed | D1 ist fachliche Wahrheit; E-Mail ist nur Benachrichtigung. | `docs/privacy-data-flow.md` |
| Kundenmail | confirmed | V1 sendet keine automatische E-Mail an die anfragende Person. | `docs/privacy-data-flow.md` |
| Adminzugriff | confirmed | Kontakt-/Detaildaten liegen hinter Cloudflare-Access-geschütztem Adminpfad; Listenansicht ist datensparsam. | T049 |
| Tracker/Marketing | confirmed | Aktueller öffentlicher Build enthält keine Analyse-, Marketing- oder Social-Embed-Integration. | T008/T027 |
| Turnstile | confirmed | Turnstile gehört ausschließlich zum Anfragepfad und wird nicht als Fachdaten gespeichert. | T008/T027, `docs/privacy-data-flow.md` |
| Contentpflege | confirmed | Git + Codex ist der bevorzugte Default für klassische öffentliche Inhalte, solange reale Nutzung keine Bedienlücke belegt. | T011 |
| Automationsplattform | confirmed | Für V1 wird keine zusätzliche Automationsplattform vorausgesetzt. Bestehender Worker/D1/Outbox-Pfad bleibt ausreichend, bis wiederkehrender Bedarf belegt ist. | T057; spätere Prüfung T058 |
| Private Eventgalerie | deferred | Der geschützte veranstaltungsbezogene Fotobereich ist ein getrenntes Produktziel und kein stiller Bestandteil des Inquiry-V1-Livegangs. | T025 |
| Verbindliche Buchung | deferred | Sofortbuchung, Holds, Zahlung, Storno und Umbuchung bleiben außerhalb dieser V1-Anfrage-Lane. | T013/T011 |

## 2. Entscheidungsbogen für Legal/Privacy/Inquiry

Nur die folgenden Punkte sind die noch offenen **fachlichen Blocker innerhalb dieser Lane**. Weitere V1-Launchblocker – insbesondere freigegebene öffentliche Medien und Produktinhalte – bleiben in T010 und den bestehenden Release-Approvals. Nicht zutreffende Felder werden ausdrücklich als `nicht einschlägig` dokumentiert statt geraten.

### D1 — Betreiberidentität

Status: `decision-required`

Benötigt:

- vollständiger Name bzw. Unternehmensbezeichnung;
- Rechtsform, falls vorhanden;
- ladungsfähige Anschrift;
- vertretungsberechtigte Person, soweit einschlägig;
- öffentliche E-Mail-/Kontaktangaben;
- Registerangaben nur, soweit tatsächlich vorhanden/einschlägig;
- USt-IdNr./W-IdNr./sonstige Pflichtangaben nur, soweit tatsächlich vorhanden/einschlägig.

Wofür nötig: finales Impressum, Verantwortlicher in Datenschutzinformationen, produktive Kontaktgrenze.

Primärevidenz: Betreiber-/Unternehmensunterlagen oder ausdrücklich freigegebene Angaben des Betreibers.

### D2 — Produktive Kontakt- und Adminziele

Status: `decision-required`

Benötigt:

- Betreiber-Zieladresse für neue Anfragehinweise;
- freigegebene Absender-/Reply-to-Regel;
- berechtigte Adminidentitäten für Cloudflare Access;
- Festlegung, welche dieser Angaben öffentlich sichtbar sein dürfen.

Wofür nötig: produktive Worker-/Mail-/Access-Konfiguration und Datenschutz-Empfänger-/Zugriffsangaben.

### D3 — Inquiry-Retention

Status: `decision-required`

Benötigt:

- konkrete Aufbewahrungsfrist für unverbindliche Anfragen;
- Ereignis, ab dem die Frist läuft (z. B. Eingang, Abschluss/Ablehnung der Bearbeitung);
- Regel für unbeantwortete, abgelehnte und erledigte Anfragen;
- Entscheidung, ob und wann Daten einer späteren tatsächlichen Vertragsbeziehung in einen getrennten Geschäfts-/Nachweispfad überführt werden.

Wichtig: T057 setzt **keine Zahl** ein. Die Frist muss aus realem Betriebsbedarf und einer belegten/freigegebenen Policy stammen.

Wofür nötig: `src/release/inquiry-data-policy.json`, T049 Production-Readiness.

### D4 — Löschumfang und Enforcement

Status: `decision-required`

Benötigt:

- Löschung/Anonymisierung in D1;
- Lebenszyklus von Outbox-/Notification-Metadaten;
- Löschregel für Betreiberpostfach;
- Umgang mit manuellen Exporten;
- Umgang mit Backups, soweit solche im realen Produktionspfad bestehen;
- revisionsgebundener technischer oder betrieblicher Nachweis, dass die Regel tatsächlich durchgesetzt wird.

Wofür nötig: T049 Closeout und produktive Freigabe.

### D5 — Produktions-Dienstleisterinventar

Status: `decision-required`

Für jeden real eingesetzten Dienst festhalten:

| Dienst/Rolle | produktiv aktiv? | verarbeitet personenbezogene Anfragedaten? | Zweck | Datenkategorie | vertragliche/technische Evidenz |
|---|---:|---:|---|---|---|
| Cloudflare Static Assets / Website | noch zu bestätigen | typischer Websitezugriff; konkrete produktive Konfiguration belegen | Websiteauslieferung | technische Zugriffsdaten nach realem Dienst | offen |
| Cloudflare Worker | noch zu bestätigen | ja, sobald Inquiry live | Annahme/Validierung der Anfrage | Formulardaten + kurzlebiger Turnstile-Transport | Repo technisch belegt, Produktivbindung offen |
| Cloudflare D1 | noch zu bestätigen | ja, sobald Inquiry live | fachliche Speicherung | Anfragefelder/Status | Repo technisch belegt, Produktivbindung offen |
| Cloudflare Turnstile | noch zu bestätigen | technischer Prüfdienst | Missbrauchsschutz | kurzlebiger Prüf-/Transportkontext | Produktiv-Key/Hostname offen |
| Cloudflare Access | noch zu bestätigen | Adminidentität/Zugriff | Adminschutz | Auth-/Zugriffskontext | Produktiv-App/Identitäten offen |
| E-Mail-/Notification-Dienst | offen | minimierte Betreiberbenachrichtigung | Betreiberhinweis | Anfrage-ID, Angebot, Wunschdatum nach aktuellem Vertrag | konkreter Anbieter/Ziel offen |

Preview-/Entwicklungssysteme wie GitHub Pages oder Vercel gelten **nicht automatisch** als Teil des produktiven personenbezogenen Inquiry-Pfads. Falls dort später echte Anfragedaten verarbeitet werden, muss diese Tabelle vor Aktivierung entsprechend erweitert werden.

### D6 — Öffentliche Rechtstextfreigabe

Status: `decision-required`

Erst nach D1–D5 und der D7-Entscheidung:

- finales Impressum aus bestätigten Betreiberangaben;
- finale Datenschutzinformation aus realem Datenfluss und realem Dienstleisterinventar;
- Consent-/Cookie-Entscheidung ausschließlich nach tatsächlich aktiven Diensten;
- keine generischen Drittanbieter, Cookies oder Rechtsgrundlagen vorsorglich behaupten;
- revisionsgebundene Freigabeevidenz dokumentieren.

Wofür nötig: T008 Closeout und Entfernen des Legal-Draft-Status.

### D7 — Externe juristische Prüfung / Rechtstext-Service

Status: `decision-required`

T057 trifft **keine juristische oder geschäftliche Vorentscheidung**, ob für V1 eine externe anwaltliche Prüfung, ein laufender Rechtstext-Service oder eine andere fachliche Freigabe erforderlich bzw. zweckmäßig ist.

Benötigt:

- Betreiberentscheidung zum Prüf-/Freigabepfad;
- geeignete Primärevidenz bzw. fachliche Begründung für diese Entscheidung;
- falls extern geprüft: konkreter Umfang, Anbieter und revisionsgebundene Freigabeevidenz;
- falls nicht extern geprüft: eindeutig dokumentierte interne Freigabeverantwortung, ohne daraus eine Aussage über rechtliche Zulässigkeit oder Haftung abzuleiten.

Folgende Themen sind **Prüfhinweise, keine automatisch festgelegte Eskalationsschwelle**:

- Rechte/Einwilligungen bei Eventfotos, Gästen oder Minderjährigen;
- öffentliche Werbenutzung von Eventbildern;
- individuelle Storno-/Haftungs-/Vermietungsklauseln;
- Widerrufsfragen bei konkreten terminbezogenen Verbraucherleistungen;
- Kombinationen aus Vermietung, Dienstleistung und Fotografie.

## 3. Bewusst vertagte bzw. separat geführte Entscheidungen

### Private Eventgalerie

Status: `deferred` → T025

Vor Aktivierung separat entscheiden und rechtlich/technisch prüfen:

- Uploadprozess;
- Zugriff per Link/Code/Authentifizierung;
- Ansichts-/Downloadrechte;
- Widerruf/Rotation;
- Aufbewahrung/Löschung;
- erwartetes Datenvolumen;
- öffentliche Werbenutzung von Eventbildern;
- Umgang mit Gästen und gegebenenfalls Minderjährigen.

Keine dieser Regeln wird aus dem Inquiry-Datenschutz abgeleitet.

### Verbindliche Buchung und Vertragsbedingungen

Status: `deferred` → T011/T013

Vor einer verbindlichen Onlinebuchung bzw. standardisierten AGB separat entscheiden:

- Vertragszeitpunkt;
- Inventar/Ressourcen;
- Miet-/Leistungsdauer und Puffer;
- Lieferung/Fahrtkosten;
- Anzahlung/Zahlung;
- Storno/Umbuchung;
- Schäden/Ausfall;
- Paket-/Kombinationsregeln.

V1 darf diese Regeln nicht implizit durch UI oder Backend behaupten.

### Public Media und Product Content

Status: separat `blocked_external` → T010 / `src/release/production-approvals.json`

T057 darf weder die fehlenden freigegebenen Produkt-/Eventbilder noch Paket-/Preis-/Finaltext-Freigaben ersetzen. Diese bleiben eigene Launch-Gates und müssen vor einem entsprechenden Produktionsstatus separat belegt werden.

### Automatisierung

Status: `deferred` → T058

Keine zusätzliche Plattform auf Vorrat. Nach realer Nutzung wird nur wiederholte manuelle Arbeit mit belegtem Zeit-/Fehlerrisiko bewertet. Entscheidungsleiter:

1. gar keine Automation;
2. normaler Worker-/TypeScript-Code;
3. vorhandene Cloudflare-Bausteine wie Cron/Queue, wenn das konkrete Problem sie verlangt;
4. langlebige Workflow-Engine erst bei nachgewiesener Orchestrierungskomplexität;
5. n8n erst, wenn visuelle Selbstpflege oder hohe SaaS-Integrationsbreite einen belegten Vorteil erzeugt.

## 4. Übergabe an bestehende Tasks

- **T008:** verwendet D1, D2, D5, D6 und D7 für finales Impressum/Datenschutz/Consent und Produktionsreadback.
- **T049:** verwendet D3 und D4 für konkrete Retention-/Löschpolicy und Enforcement-Evidenz.
- **T011:** verwendet die bestätigte Anfrage-Grenze und belässt Buchung/CMS-/Medienfragen nur dort offen, wo reale Geschäftsentscheidungen fehlen.
- **T010:** bleibt autoritativ für fehlende/freizugebende öffentliche Medien, Preise, Pakete und finale Produkttexte.
- **T025:** bleibt alleiniger Owner der privaten Eventgalerie.
- **T013:** bleibt alleiniger Owner einer verbindlichen Buchungsengine.
- **T058:** bewertet erst nach realer Nutzung, ob zusätzliche Automatisierung überhaupt nötig ist.

## 5. Closeout-Kriterium T057

T057 bleibt `blocked_external` und kann geschlossen werden, sobald D1–D7 mit Primärevidenz bzw. dokumentierter Betreiberentscheidung befüllt sind und T008/T049/T011 die Werte revisionsgebunden übernehmen können. `deferred` bzw. separat geführte Punkte verhindern den T057-Closeout nicht, solange sie in dieser Lane nicht fälschlich als erledigt oder freigegeben dargestellt werden.

## 6. Einheitliche Betreiber-/Launch-Entscheidungsvorlage — 03.11.2026

**Benutzung:** Dieser eine Bogen konsolidiert D1–D7 dieses Dokuments und die getrennten öffentlichen Inhalts-/Medienfreigaben aus T010. Bereits bestätigte Fakten aus Abschnitt 1 nicht erneut abfragen. Keine geheimen Schlüssel, privaten Adminadressen, Kundenidentitäten oder Postfachzugänge in das öffentliche GitHub-Repository eintragen: dort nur Freigabestatus, verantwortliche Rolle und verifizierbare **Belegreferenz** dokumentieren; eigentliche Secrets bleiben im entsprechenden Cloudflare-/GitHub-Secretstore.

| Kennung / Owner | Tatsächlich noch benötigte Betreiberentscheidung (bei Nichtanwendbarkeit ausdrücklich „nicht einschlägig“) | Freigabe- und Belegstand |
|---|---|---|
| **F1 / T057→T008** | Richtiger Betreiber/Firmenname, ggf. Rechtsform und Vertretung, ladungsfähige Anschrift, gesetzlich einschlägige Register-/Steuerangaben, öffentlich zulässige Kontaktangaben | **ausstehend**; Rechts-/Betreiber-Primärbeleg fehlt |
| **F2 / T057→T009** | Verifiziertes produktives Empfangspostfach, autorisierte Absenderadresse und Reply-to-Verhalten für **Betreiberhinweise**; tatsächliche Zuordnung zu Kundenkonto | **ausstehend**; weder Dummy-Empfänger noch automatische Kundenmail |
| **F3 / T057→T006/T049** | Berechtigte Betreiber-/Adminidentitäten, Cloudflare-Access-Team, App-Audience und Prüfverfahren für den echten Adminzugriff | **ausstehend**; nur Referenz auf vertrauliche Identitätsfreigabe im Repo |
| **F4 / T057→T049** | Frist in Tagen **und** Beginn der Frist; Regeln für neue, unbeantwortete, abgelehnte, erledigte und später vertraglich relevante Anfragen | **ausstehend**; `retentionDays=null`, keine implizite Standardfrist |
| **F5 / T057→T049** | Datenlöschung in D1 **und** Outbox/Notification-Metadaten; berechtigter Auslöser, Prüfbarkeit und Ausnahmen bei rechtmäßig erforderlichen Nachweisen | **ausstehend**; technische Reihenfolge ist wegen D1-Fremdschlüssel zu prüfen |
| **F6 / T057→T049** | Betreiberpostfach, manuelle Exporte und tatsächlich vorhandene Backups: Lebenszyklus, Zugriff, Lösch-/Ausnahmeprozess und verantwortliche Rolle | **ausstehend**; nicht auf D1-Löschung allein verkürzen |
| **F7 / T057→T008/T009** | Produktiver Dienstleister-/Binding-Readback für Cloudflare Static/Worker/D1/Turnstile/Access und tatsächlichen Maildienst, Datenkategorien, Vertrags-/Datenschutznachweise | **ausstehend**; Repo enthält nur lokale Test- und Platzhalterkonfiguration |
| **F8 / T057→T008** | Finales Impressum und Datenschutzinformation, tatsächliche Consent-/Cookie-Entscheidung, gewählter interner/externer rechtlicher Prüf-/Freigabepfad (D6/D7) | **ausstehend**; keine fingierte Rechtsprüfung |
| **F9 / T010** | Finale öffentlich zulässige Produkt-/Event-/Hero-/Galeriebilder, Urheber-, Persönlichkeits- und Werbenutzungsrechte; besonders Familien-/Verlobungsfoto | **ausstehend**; keine ungeprüften Personenfotos veröffentlichen |
| **F10 / T010/T011/T069** | Finale Produkttexte und Paket-/Preisinhalt bestätigen: zwölf vorhandene Fotobox-/Fotospiegelstufen bereits umgesetzt, Magazinbox ohne erfundenen Festpreis; Extras und variable Kosten nur bei konkreter Einzelfreigabe | **abschließende öffentliche Freigabe ausstehend**; keine Neuimplementierung der zwölf Stufen nötig |
| **F11 / T009** | Entscheidung über öffentliche Indexierung/Launch, Betreiber- und Domainhoheit, Deploymentzugänge, Kosten und Freigabe des tatsächlichen Inquiry-Sendewegs | **ausstehend**; `launchStatus=draft`, `noindex` und Sendesperre bleiben bestehen |
| **F12 / T009/T049/T069** | Freigabe einer ausdrücklich berechtigten datensparsamen Testanfrage mit dokumentiertem Zielpostfach; Bestätigung durch berechtigten Postfachinhaber | **ausstehend**; D1/Outbox/HTTP-201 ist kein Postfacheingang |

### Technischer Ist-Befund zum Bogen

- GitHub `main` am 03.11.2026: `611e7aaf37e1deee041ca1d4e254f1b7baf7b35a`; `src/release/production-approvals.json` enthält dreimal `approved:false`, `src/release/inquiry-data-policy.json` ist `blocked_external`, `src/content/site.json` ist `draft`.
- Der V1-Sendevertrag existiert bereits: öffentliches Formular (nur nach Freigaben) → Worker mit produktivem Turnstile/Rate-Limits → D1-Inquiry und Outbox in einem Batch → Betreiberbenachrichtigung → Cloudflare-Access-Admin. Form- und Backend-Basistests wurden in PR #107/#112 dokumentiert; 54/54 echte Stage-1-Firefox-Browserchecks in PR #113.
- GitHub-Actions-Readback zeigte zu diesem Stichtag **keine hinterlegten Repo-Variablen/Actions-Secrets** für die Inquiry-Produktivübergabe; `spikes/inquiry-worker/wrangler.production.jsonc` liegt im isolierten Checkout nicht vor. Die Beispielkonfiguration enthält absichtlich `REPLACE_WITH_*`-Platzhalter. Reale Cloudflare-Worker-/D1-/Access-/Turnstile-/Send-Email-Ressourcen sind damit **nicht nachgewiesen** und werden nicht als nicht existent behauptet.
- D1-Schema: `inquiry_notifications` referenziert `inquiries` mit `ON DELETE RESTRICT`, also kann ein Datensatz nicht vor abhängigen Benachrichtigungsdatensätzen gelöscht werden. Aktuell gibt es **keinen belegten automatischen Retention-Purge**; der Adminvertrag bietet die gezielte Benachrichtigungswiederholung. Nach F4–F6 ist der kleinste nachvollziehbare Lösch- und Verifikationspfad in T049 zu implementieren, ohne eine erfundene Frist.

### Freigabe → technisch zulässige Folgeaktion

1. Betreiber dokumentiert die tatsächlich einschlägigen F1–F12-Entscheidungen mit aussagekräftigen Primärbelegen; T057 verankert die fachliche Wahrheit, T010 die öffentliche Medien-/Produktfreigabe und T049 die umgesetzte Policy.
2. Erst auf dieser Basis reale Cloudflare-Bindings und produktive Empfänger-/Absenderidentitäten authentisch readbacken; `inquiry-data-policy.json` nur mit freigegebenen Werten und **Enforcement-Nachweis** aktualisieren. Keine geheimen Werte im Repo.
3. Die bestehenden `check:production-readiness`-/CI-/Deploy-Gates und das Runbook `docs/deployment-handover.md` auf exakt freigegebene Revision anwenden. Stage-1 bis dahin unverändert.
4. **Abnahmepunkt:** echte öffentliche autorisierte Anfrage, API-201-/D1-/Outbox-Readback, Nachweis `sent` samt Message-ID und **tatsächliche Bestätigung im vorgesehenen Betreiberpostfach**, Adminzugriff, Fehlerfälle, Retention-/Löschung und Kundenanzeige. Mail-Provider-Akzeptanz allein ist kein Betreiberempfang.

Die Tabelle ist eine zentrale **offene Entscheidungsvorlage**, keine erteilte Freigabe, kein juristisches Gutachten und kein Auftrag, unnötige spätere Produkte zu aktivieren. T025/T013/T058/T038/T044 bleiben eigenständige, für den Inquiry-Launch nicht sperrende Themen.
