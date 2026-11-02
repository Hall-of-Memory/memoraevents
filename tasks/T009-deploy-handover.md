---
id: T009
status: blocked_external
priority: P0
dependencies: [T001, T004, T008, T010, T011]
---
# Deployment, Domain und Handover

## Akzeptanz
- produktive Konten/Domain unter Kundenhoheit oder vollständig übergebbar
- reproduzierbares Deployment
- laufende Kosten vor Aktivierung transparent
- Quellcode und relevante Zugänge vollständig übergabefähig

## Bestätigter Kundenwunsch — 2026-08-12

Domain und produktive Zugänge sollen auf den Namen des Kunden bzw. unter seine tatsächliche Kontrolle laufen. Entwicklerkonten dürfen keine dauerhafte Abhängigkeit erzeugen.

## Produktionsdomain-Entscheidung — 2026-08-22

Der Kunde möchte die Website jetzt direkt auf der vorhandenen Domain **`https://hallofmemory.de`** veröffentlichen und anschließend dort weiterentwickeln. T045 ist der operative Domain-Cutover-Task.

Live belegt:

- Registrar/DNS liegt beim Kunden bei STRATO.
- Autoritative Nameserver: `docks09.rzone.de`, `shades16.rzone.de`.
- Aktueller Apex-A-Record: `217.160.0.152`.
- `www.hallofmemory.de` ist CNAME auf `hallofmemory.de`.

Die Produktionsplattform bleibt Cloudflare. GitHub Pages ist nur noch Übergangs-Fallback und wird nach erfolgreichem Domain-Readback nicht mehr als Primärpreview benötigt.


## Produktionsdomain-Pivot — 2026-09-27

Die Kundenentscheidung vom 27.09.2026 supersediert den operativen Domainpfad vom 22.08.2026: neue Produktions-/Primärdomain ist **`https://memoraevent.de`**. T060 ist ab jetzt der operative Domain-Cutover-Task; T045/T059 bleiben historische Evidenz des früheren `hallofmemory.de`-Pfads.

Frisch belegt:

- Registrar/DNS liegt beim Kunden bei INWX.
- Autoritative Nameserver: `ns.inwx.de`, `ns2.inwx.de`, `ns3.inwx.eu`.
- Apex, `www` und der vorhandene Wildcard-`A` zeigen auf `185.181.104.242`.
- Apex-`MX`, Apex-`TXT`, `_dmarc TXT` und Apex-`CAA` sind aktuell leer.
- Beim `.de`-Parent ist kein DS veröffentlicht.
- Der bestehende Cloudflare-Worker `hall-of-memory` bleibt Zielruntime.
- Die neue Cloudflare-Zone existiert noch nicht. Der vorhandene delegierte Cloudflare-Zugang erreicht den `Add domain`-Pfad, wird bei der Zonenerstellung aber ausdrücklich wegen fehlendem `com.cloudflare.api.account.zone.create` blockiert. Es wurde keine Zone erstellt und keine kostenpflichtige Option aktiviert.

Least-Privilege-Folge: Bevorzugt legt Aram die Zone einmal selbst an und delegiert danach bei Bedarf `Domain Administrator` nur für `memoraevent.de`. Ein breiterer accountweiter Adminzugang ist dafür nicht der Standardpfad.


## Produktionsdomain-Korrektur — 2026-09-30 / Live-Readback 2026-10-01

Der Kunde hat die Primärdomain auf **`https://memoraevents.de`** korrigiert. T061 supersediert damit den operativen Domainpfad aus T060; T060 bleibt historische Evidenz des bereits gemergten `memoraevent.de`-Zwischenstands.

Frisch belegt:

- `memoraevents.de` ist öffentlich registriert und über INWX delegiert.
- Aktuelle Nameserver: `ns.inwx.de`, `ns2.inwx.de`, `ns3.inwx.eu`.
- Apex und `www` zeigen auf `185.181.104.242`; Apex-MX/TXT/CAA und `_dmarc TXT` sind leer.
- Beim `.de`-Parent ist kein DS veröffentlicht.
- Die Cloudflare-Zone `memoraevents.de` existiert bereits im kundeneigenen Aram-Account, Plan `Free Website`, Status `pending`.
- Cloudflare weist `quentin.ns.cloudflare.com` und `tia.ns.cloudflare.com` zu.
- Cloudflare enthält exakt die drei importierten A-RRsets für Apex, `www` und Wildcard `*`, jeweils auf `185.181.104.242`.
- Der bestehende Worker `hall-of-memory` bleibt Zielruntime.
- Offen ist ausschließlich der authentifizierte INWX-Provider-Readback vor der Delegationsmutation; die aktuelle Browser-Session ist bei INWX nicht angemeldet und AXFR ist nicht verfügbar.


## Primärdomain live — 2026-10-01

Der statische Stage-1-Domain-Livegang auf `https://memoraevents.de` ist technisch abgeschlossen:

- vollständiger INWX→Cloudflare-Zonen-/DNSSEC-Vergleich: PASS;
- INWX delegiert auf `quentin.ns.cloudflare.com` / `tia.ns.cloudflare.com`;
- DENIC, `1.1.1.1` und `8.8.8.8` sehen die Cloudflare-Delegation;
- Cloudflare-Zone ist `active`;
- Worker-Custom-Domain `memoraevents.de` ist an Production/`hall-of-memory` gebunden;
- aktueller revisionsgebundener Worker-Deploy: `077c864f-3e7c-433f-94c5-a7597a90de70`;
- Apex: `/ -> 302 /demo/`, `/demo/ -> 200`, `/demo/rahmen/ -> 200`, Security Header und `noindex,nofollow` grün;
- Live-`/demo/` ist byte-identisch zum geprüften Artefakt, SHA-256 `27fe8a420e4829880607caa2d665f2a703ff6041997ec401622a1064f58e0ddd`;
- `www.memoraevents.de` wird per Cloudflare Single Redirects temporär (`302`) und pfad-/query-erhaltend auf den Apex kanonisiert.

Die frühere Legacy-Weiterleitung für `memoraevent.de` ist durch die kundenseitig angeforderte Löschung superseded. Die Primärdomain selbst braucht keine weitere DNS-Mutation.

## GitHub-/Source-Entscheidung — aktualisiert 2026-08-22

- Das kanonische Kundenrepo ist `Hall-of-Memory/memoraevents`.
- Der bisherige Public-First-Schritt war ein Bootstrap, um kundenkontrollierten Remote, CI, Pages und Branch Protection ohne Zusatzkosten sicher zu etablieren.
- Der Kunde möchte den Source nun möglichst privat halten. Das ist architektonisch sinnvoll, weil die öffentliche Website und die Repository-Sichtbarkeit getrennte Schichten sind.
- Eine Sichtbarkeitsänderung darf aber **nicht** stillschweigend den gerade eingerichteten `main`-Schutz entfernen. GitHub dokumentiert Branch Protection/Rulesets für private Repositories nicht für GitHub Free for organizations, sondern für passende bezahlte Pläne.
- Deshalb gilt fail-closed: Repo erst dann auf `private` umstellen, wenn live belegt ist, dass der Kundentarif die benötigten Schutzregeln für private Repositories unterstützt, oder der Kunde bewusst eine andere Schutz-/Kostenentscheidung trifft.
- Keine kostenpflichtige GitHub-Aufwertung wird ohne ausdrückliche Freigabe aktiviert.
- Unabhängig von der Sichtbarkeit bleiben private Eventmedien, Secrets, personenbezogene Kundendaten und nicht öffentliche Designer-Source-Master außerhalb von Git.

## Technische Vorbereitung — 2026-08-11 bis 2026-08-22

- `docs/deployment-handover.md` beschreibt den reproduzierbaren Preflight, öffentliche Buildvariablen, serverseitige Bindings/Variablen/Secrets, D1-Export und Migrationen, Worker-vor-Site-Reihenfolge, Smokes, Readbacks und Rollback.
- `.env.example` enthält ausschließlich leere öffentliche Buildvariablen. `spikes/inquiry-worker/wrangler.production.example.jsonc` ist absichtlich nicht produktiv deploybar und enthält kein Secret.
- `npm run dry-run:worker` und `npm run dry-run:site` prüfen beide Artefakte lokal ohne Upload. Das vollständige `npm run verify` umfasst Inquiry-Smoke, Domain/Form/Quality, Astro-Check/Build und beide Dry-Runs.
- Das Kundenrepo ist live; `main` besitzt PR-Pflicht, Required Check `verify`, Conversation Resolution, Admin-Enforcement sowie deaktivierten Force-Push und Branch-Löschung.
- Der erste öffentliche GitHub-Runner-Fehler im Rate-Limit-Smoke wurde in PR #1 korrigiert und im kanonischen T043-Journal dokumentiert.
- GitHub Pages aus dem Kundenrepo ist als Übergangs-Preview live und extern read-backbar.

## Externe Blockade

Der **statische Domain-Livegang auf `memoraevents.de` ist abgeschlossen**. Für Stage 1 besteht kein externer Produktionsblocker mehr.

Für die vollständige V1 mit Anfrage/Admin bleiben weiterhin die produktiven Ressourcen/Freigaben aus T008/T010/T011 erforderlich: Turnstile, Access, D1, Rate Limit, Email-Binding, verifizierte Ziel-/Absenderadresse, finale Inhalte sowie Datenschutz-/Löschregel.

T009 bleibt deshalb für Stage 2 `blocked_external`. T061 ist für den statischen Domain-Cutover `done`; `memoraevent.de` wurde kundenseitig zur Löschung eingereicht und wird nicht als Legacy-Redirect weitergeführt.

## Ausführungsplan: erster echter Kundenanfrage-End-to-End-Weg — 02.11.2026

**Messbares Ziel:** Besucher gelangen von einer realen Produkt-/Preiskarte über Produkt- und Paketauswahl sowie Veranstaltungs- und Kontaktdaten zu einer **unverbindlichen Anfrage**. Nur ein vom Worker bestätigtes `201 received` mit `bookingCreated: false` gilt als Annahme. Danach sind genau eine D1-Anfrage, eine Outbox-Benachrichtigung, der autorisierte Adminabruf und die tatsächliche Betreiberbenachrichtigung belegbar. Weder Reservierung noch Zahlung noch automatische Kundenmail werden daraus abgeleitet.

**Zuständigkeit:** T009 führt Produktivkonfiguration, Auslieferung und Abnahme. T069 führt Konfigurator, Auswahl- und Preisregeln; T004 den vorhandenen Anfragevertrag; T057 bündelt die fachlichen Legal-/Privacy-Eingaben für T008/T011/T049; T010 die öffentlichen Inhalte und Freigaben. Detailbefehle und Rollback stehen in `docs/deployment-handover.md`. Kein neuer Task, kein Bureau- oder Issue-Doppelregister.

### Aktueller Nachweis und offener kritischer Pfad

- Frischer GitHub-Readback: `main` `2f684abf6c1d69fe9c16d19d699c16ce0220bddb` mit erfolgreichem `Verify`-Run `41354040230` (01.11.2026). HTTP-Readback 02.11.2026: `https://memoraevents.de/demo/` und `/preise/` liefern `200`; `/demo/konfigurator/` liefert noch `404`. Stage 1 zeigt weiterhin die deaktivierte Anfragevorschau.
- T069 ist in **offenen** gestapelten PRs: [#94](https://github.com/Hall-of-Memory/memoraevents/pull/94) enthält Preis-/Extras-Modell und Testbasis, [#95](https://github.com/Hall-of-Memory/memoraevents/pull/95) den vierstufigen, sendefreien Wizard. Ihre `verify`-Checks sind grün, aber damit weder ein gültiger Merge noch ein Livegang belegt. Die erforderliche Operator-Selbstreview ist durch die derzeitige Repo-Origin-/Operator-Release-Inkompatibilität blockiert; deren Ursache im zuständigen Grabowski-/NixOS-Releasepfad lösen, keine Merge-/Review-Umgehung.
- `src/release/production-approvals.json` hat `legal`, `publicMedia` und `productContent` weiterhin auf `approved: false`. `src/release/inquiry-data-policy.json` bleibt `blocked_external`; eine Frist oder Freigabe wird nicht erfunden.

### Operator-Review-Origin-Readback (02.11.2026, frische Laufzeit)

- **Neuer Iststand:** Der NixOS-Operator samt Rootbroker läuft gesund auf dem sourcegebundenen Release `3fbe93d2-nixos-lock264e747ad05a-contract23851f3e6dea`. Der vorherige Hinweis auf Serving `82599219` ist damit überholt; der historische fehlgeschlagene Rootbroker-Cutover bleibt nur Vergangenheitsevidenz.
- **Belegte Ursache der weiterhin blockierten PR-Integration:** Die Source-Zulassung für `Hall-of-Memory/memoraevents` wurde in `heimgewebe/grabowski#1704` auf Commit `d4d44d6951ec59a7556c1de42c7fd424a504d7fc` integriert, **nach** dem aktuell in NixOS gepinnten `3fbe93d2`. Die tatsächliche installierte `grabowski_self_review_producer.py` akzeptiert im Remote-Origin-Regex weiterhin nur `heimgewebe/*` und `alexdermohr/*`, nicht das MEMORA-Repository. Ein echter `plan-firstparty`-Aufruf für den unveränderten, sauberen PR #105 (Head `7ac7b625`, Base `2f684abf`, GitHub-Diff-Digest `4b2c0a4c…`) endet daher mit `ReviewExecutionRejected: review source repository origin invalid`, bevor eine signierte Prüfung beginnt. **Kein Review-PASS und keine Merge-Autorität.**
- **Kleinste vorbereitete NixOS-Abhilfe:** gemeinsamer, hashgebundener Operator-/Rootbroker-Quellpin auf `d4d44d69` (beide Commit-Identitäten und Release-Assertions) statt alter NixOS- und unveränderter Agent-Runtime. Das unveränderte Upstream-Dependency-Lock benötigt keine neuen Paketregeln; der originale GitHub-Source-Tarball wurde mit Nix abgeholt und auf `sha256-g5FbYvn16qJqFVP63uSwlcFGiif61eDSn8Zg9FnnkeA=` geprüft. Isolierter, **noch nicht committeter** Grabowski-Worktree `/home/alex/repos/.grabowski-worktrees/heim-pc-memora-origin-release-20261102` enthält nur zwölf zusammengehörige Pin- und Regressionstest-Anpassungen (30 Einfügungen/30 Löschungen, `git diff --check` PASS). Nixer bestätigt in der Kandidatenquelle die neue Release-ID und den gemeinsamen Broker-/Operator-Quellrevision-Wert. Die globale `flake check --no-build` lieferte keinen Gesamt-PASS. **Danach bestand aber der echte Nix-Build** von `packages.x86_64-linux.grabowski-operator-pinned` (Grabowski-Task `532a3d32833147c4a649ecb6`) und der gezielte Nix-Check `checks.x86_64-linux.grabowski-release-artifacts` mit **beiden** quellgebundenen Operator-/Rootbroker-Binaries, unverändertem Dependency-Lock und geprüftem Release-Vertrag (Task `aa7e1ee7f30146e696c1b294`). Der tatsächlich neu gebaute Operator akzeptiert den sauberen PR-#105-Worktree per `_managed_repository_identity` als `Hall-of-Memory/memoraevents` (Task `8894410f8f544c9d931f1b77`, terminal SUCCESS). Das belegt den Fix im **gebauten Kandidaten**, nicht in der weiterhin aktiven Produktionsruntime. Geschützter Commit/PR, gesamter CI-/VM-Lauf und tatsächlicher NixOS-Aktivierungs-/Client-Readback bleiben ausstehend.
- **Reihenfolge:** erst die deklarative Pin-Korrektur vollständig testen, regulär integrieren und die neue tatsächlich erreichbare Operator-Runtime belegen; dann PR #105 sowie #94/#95 (gegebenenfalls nach PR-Base-Konvergenz) mit echtem First-Party-Self-Review, frischem `verify` und Captain-Gates integrieren. Ein neuer Rootbroker-Schedulingversuch auf altem Quellstand oder ein direkter GitHub-Merge am Gate vorbei ist keine Behebung. Externe Betreiber-/Legal-/Extras-Entscheidungen bleiben getrennt.

### Arbeitspakete in wirksamer Reihenfolge

1. **Sendefreie Vorschau lieferbar machen (T069, autonom):** Operator-/Review-Origin-Blockade an der Ursache klären; erst #94 und anschließend den gestapelten #95 mit exaktem PR-Head, `verify` und zulässigem Review integrieren. Nach bestätigtem Cloudflare-Deploy `/demo/konfigurator/` im Browser auf Mobil/Tablet/Desktop öffnen: passende Produkt-/Paketvorbelegung, zwölf bestätigte Preise, Navigation/Eingabeerhalt, keine Extras ohne Freigabe, `noindex`, **keine Kontaktübermittlung oder Netzwerk-Anfrage**. Eine erfolgreiche Vercel-Preview ist kein Produktionsnachweis.
2. **Echte Freigabegrundlagen parallel einholen (T057/T008/T010/T011/T049, extern):** Betreiberidentität und öffentliche Pflichtangaben, produktive Empfänger-/Absenderadresse und berechtigte Adminidentitäten, konkrete Retention und Löschung einschließlich Postfach/Outbox/Backups, reales Dienstleisterinventar und freigegebene Rechtstexte dokumentieren. Öffentliche Medien und Produktinhalte separat aus T010 und `production-approvals.json` abnehmen. Kundendaten oder Secrets nicht im Repo ablegen; nur Belegreferenzen. T011 belässt V1 ausdrücklich bei `inquiry-only`.
3. **Kleinsten echten Konfigurator→Anfragevertrag verbinden (T069/T004):** Für den ersten produktiven Pfad reicht genau **ein freigegebenes Hauptprodukt mit einem dazu passenden Paket** und den bestehenden Veranstaltungs-/Kontaktfeldern. Die Extras-Liste ist bis zur Einzelbestätigung leer; deshalb keine neue Pflichtdatenstruktur oder unbelegte Endsumme erzwingen. Bestehende `shared/inquiry-contract.ts`, Frontend-Fehlerzustände und Worker-Validierung verwenden; Angebot/Paket serverseitig prüfen, Browserpreis nie als Autorität. Erweiterte Extras-/Mengen- und Preis-Snapshots erst nach fachlicher Freigabe als separaten kompatiblen T069-Slice ergänzen.
4. **Produktive Ressourcen erst nach Freigaben binden (T009/T049):** Reale kundeneigene Cloudflare-Worker-, D1-, Turnstile-, Rate-Limit-, Access- und Mail-Bindings samt Kosten/Limits readbacken. Die bereits dokumentierte Reihenfolge im Runbook strikt beibehalten: exakte produktive Config → configgebundener Dry-Run → D1-Backup/Migrationsreadback → Secrets am **richtigen Inquiry-Worker** → Worker-Deploy → `/health`, CORS, Access und Outbox. Keine Platzhalter, keine zusätzlichen kostenpflichtigen Dienste ohne Freigabe.
5. **Primären Websitepfad bewusst umschalten (T009/T069):** Die Stage-1-Weiterleitung `/ /demo/ 302` nicht durch bloßes Setzen zweier Buildvariablen vermeintlich aktivieren. In einem kleinen geprüften Site-/Routing-Commit den wirklichen Besucherpfad auf den verbundenen, aktivierten Anfrageflow führen. Release-Approvals und Data-Policy erst nach Belegen setzen; `npm run check:production-readiness`, `npm run verify`, gegateten `npm run build` und `npm run deploy` auf genau der freigegebenen Revision ausführen. `noindex` erst bei eigener öffentlicher Launchfreigabe entfernen.
6. **E2E am tatsächlichen Kundenweg abnehmen (T009, zwingend):** Auf `https://memoraevents.de` mit zulässigen kontrollierten Testdaten mindestens mobil und am Desktop Produkt → Paket → Event → Kontakt/Einwilligung → Absenden durchlaufen. Erfolg: echtes `201 received`, `bookingCreated: false`, ein D1-Record, genau ein passender Outbox-Eintrag, Zugriff auf richtige Anfrage im Access-Admin, und **verifizierter Eingang der Betreiberbenachrichtigung**. Ein `queued` ist noch kein Mail-Eingangsbeleg. Negativpfade für ungültige Pakete, Turnstile, `429`, Storage-Fehler, fremde Origins, unberechtigten Admin und Doppel-Submit testen; Lösch-/Retention-Enforcement gemäß freigegebener Policy nachweisen. Commit, Build, Worker-/Site-Version und Testbelege zusammen dokumentieren.

**Fertig nur mit frischem Produktionsnachweis:** Ein grüner PR, erfolgreicher Build, sichtbarer Wizard oder eine Outbox-Queue allein erfüllen diesen Meilenstein nicht. Bei gescheiterter Aktivierung auf die letzte nachweislich funktionierende Stage-1-Site/Worker-Version zurückgehen; D1 nicht blind zurücksetzen. T009 bleibt bis zur realen E2E-Abnahme `blocked_external`, T069 bis zur vollständigen Konfigurator-/Anfrageabnahme `active`.

**Nicht auf dem kritischen Anfragepfad:** Legacy-Domain-Redirect (T070), private Eventgalerie (T025), verbindliche Buchungsengine (T013), finale Rahmenwahl (T038) und weitere Designdetails (T064–T068); eigene Prioritäten bleiben bestehen, blockieren diesen ersten unverbindlichen Anfrageweg aber nicht.

## Historischer Preview-Befund — 2026-08-11

- Frühere unauthentifizierte Cloudflare-Temporary-Previews unter wechselnden `workers.dev`-Hostnamen waren ausdrücklich nicht dauerhaft.
- Diese temporären Hosts sind keine Produktions- oder Handover-Wahrheit.
- Der damalige Primärdomain-Befund zu `hallofmemory.de` sowie der zwischenzeitliche `memoraevent.de`-Pivot sind historische Evidenz. Seit der korrigierten Kundenentscheidung vom 30.09.2026 ist `memoraevents.de` die vorgesehene produktive Primäradresse; T061 ist dafür autoritativ.

## Stage-1-Konfigurator jetzt real ausgeliefert — 02.11.2026

**Neue, frühere 404-/Review-Blockade supersedierende Betriebsbelege:** PR #94 (Paketlogik), PR #105 (diese Stage-2-Arbeitsplanung) und jetzt PR #95 (vierstufiger, sendefreier Wizard) sind regulär in `Hall-of-Memory/memoraevents` integriert. PR #95 wurde nach fünf echten signierten First-Party-Reviewachsen, aktuellem `verify: SUCCESS` und Captain-Merge am 02.11.2026 11:43:38 UTC in `main` gemergt. Exakter Merge-Commit: `f78fec88a79995abc296daf11bf368e32c7cf5d9`; Review-Audit-SHA256: `f8f7c04e16a66fd8214622e20f07af056ace710123fbce0527ba52b575d6b9e0`; Captain-Receipt: `57ace3d6244e9a50e4a63af6b4f6005980020950077878b3239de0ba74df77eb`.

**Frischer echter Origin- und Artefaktbeleg:** `https://memoraevents.de/demo/konfigurator/` und `?produkt=fotobox&paket=fotobox-classic` liefern HTTP 200; auch `/` → `/demo/`, `/preise/`, alle drei `/produkte/...`-Seiten sowie Impressum und Datenschutz liefern 200. `/preise/` enthält zwölf konkrete Produkt/Paket-Deep-Links. Das ausgelieferte Wizard-HTML ist **byte-identisch** zum direkt aus dem geprüften PR95-Commit `d25f016fc6224c4b6d75602b70665d645d8db1e8` erzeugten Astro-Artefakt: 13172 Bytes, SHA256 `340dd11f905265914dcaa5983c7f5ea4d9c609eb9c9c83a335775baf1e4b9a71`. Auch das ausgelieferte kompilierte Wizard-JavaScript ist byte-identisch: 5469 Bytes, SHA256 `07c131fc7029d7ae35d19e7cc0392f562403457b503347062db85c041d35cb27`. Kein Vercel-Preview-Ersatz, sondern Antwort der echten Kunden-Domain.

**Echter Browser-Kundenweg (Chrome 156, Produktivdomain):** Fotobox/Fotobox-Classic wird nach Deep-Link korrekt vorgewählt, die Preisanzeige beträgt 349 €. Ohne Eventdaten blockiert eine sichtbare Fehlermeldung den Übergang. Nach `Hochzeit`, künftigem Datum und Stadt `Lübeck` führt die Navigation zu Paketwahl und Übersicht; Zurück/Ändern auf Fotobox-Party aktualisiert den Preis auf 449 € und erhält die Eventangaben. Bei 1440, 834 und 390 px kein horizontaler Überlauf; mobile Zusammenfassung bleibt sichtbar. Vier Schritte, `noindex,nofollow`, CSP `form-action 'none'`, null Formular-Submits, deaktivierte Anfrage-Schaltfläche. Der temporäre Browserworker wurde danach gestoppt.

**Abnahmegrenze:** Dieser Erfolg schließt ausschließlich T009 Stage-1-Konfigurator-Preview und den browserseitigen Teil von T069 ab, **nicht** T009 Stage 2. `T009: blocked_external` bleibt richtig: Betreiber-/Kontaktidentität, bestätigte rechtliche Texte, Retention/Löschung, produktive Worker-/D1-/Turnstile-/Access-/Mail-Bindings, echte `201 received`-Annahme, Outbox und nachgewiesener Betreibermaileingang fehlen weiter. `src/release/production-approvals.json` bleibt auf drei `approved: false`; `inquiry-data-policy.json` bleibt `blocked_external`. Kein Senden aktivieren, keine Freigaben erfinden, `noindex` beibehalten. Der direkte Produktdetail→Wizard-Link (Astro-Dynamikrouten) ist weiterhin eine kleine T069-Folgearbeit; bis zur Aktivierung des in `heimgewebe/grabowski#1710` bereits gemergten Dateinamen-Fixes bietet die Preisseite den geprüften Paket-Deep-Link.
