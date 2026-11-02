---
id: T069
status: active
priority: P0
dependencies: [T004, T056]
---
# MEMORA EVENT: Anfragekonfigurator mit Paketen und Zusatzleistungen

## Ziel und Kundenentscheidung

Kundenwunsch vom 01.11.2026: Die Bedienführung von https://melody-fotobox.de/ als funktionale Referenz für MEMORA EVENT nutzen. Besucher sollen Produkt, Veranstaltung, freigegebene Pakete und optional buchbare Zusatzleistungen verständlich zusammenstellen, die vorläufige Preissumme sehen und eine **unverbindliche Anfrage** stellen können. Eigene Gestaltung und Inhalte behalten; keine fremden Medien, Bewertungen, Texte, Geschäftsbedingungen oder Preise unautorisiert übernehmen.

Der erste produktive Zielablauf bleibt **Anfrage → Betreiberangebot → manuelle Bestätigung**. Keine automatische Reservierung, Verfügbarkeitsgarantie, Bezahlung oder Vertragsannahme. Verbindliche Echtzeitbuchung bleibt T013.

## Ausgangslage (GitHub main 8441a32, 10.10.2026)

- Astro-Landingpage, drei Produktdetailseiten und eine Preisseite sind vorhanden.
- Die zwölf vom Kunden bestätigten Fotobox-/Fotospiegelpakete sind in src/content/packages.json hinterlegt (T068, PR #82).
- Der gemeinsame Inquiry-Vertrag in shared/inquiry-contract.ts verarbeitet derzeit **ein** Angebot und optional **ein** Paket; Add-ons, Mengen, Gästezahl und Mehrproduktkombinationen fehlen.
- Formular, Worker, Turnstile-/Validierungsvertrag, D1-/Outbox-Basis und Adminfunktionen existieren technisch (T004/T006/T049); produktive Bindings, Kontaktziele und Betriebsfreigaben sind jedoch offen.
- Die Stage-1-Route /demo/ enthält ein deaktiviertes Anfrageformular; die Root-Weiterleitung und der aktuelle Deploy müssen extern frisch geprüft werden (T009).
- Rechtstexte/Betreiberangaben, Retention/Löschung und Releasefreigaben sind nicht bestätigt (T008/T010/T049/T057).

**Aufgabengrenze:** T069 ist für den neuen Konfigurator, das notwendige Datenmodell und dessen Prüfung zuständig. T009 führt Deployment; T057/T049 führen Legal/Retention; T010/T007 führen echte Inhalte/Medien; T025 den privaten Fotozugang. Keine zweite Taskwahrheit schaffen.

## Arbeitsfolge nach Nutzwert

### A. Betriebsfähiger Basiskontakt vor vollständigem Konfigurator (bestehende Tasks T009/T010/T057)

1. Den tatsächlich ausgelieferten Cloudflare-Stand von memoraevents.de einschließlich Root, /demo/, /preise/, Produktseiten und Kontakt-CTAs auf exakte Revision readbacken.
2. Von Aram bestätigte Kontaktadresse und/oder WhatsApp-Businessnummer sowie erforderliche Betreiberangaben eintragen; ausschließlich einen echten, transparent funktionierenden Kontaktkanal anbieten, bis der vollständige Inquiry-Pfad freigegeben ist.
3. Formular nicht scheinbar absenden lassen; auf der realen Domain einen Nachrichteneingang mit zulässigen Testdaten bis zum Betreiber nachweisen.
4. Rechtliches, Datenpolitik, produktive Bindings und Freigaben über die bestehenden T008/T009/T010/T049/T057 abschließen; noindex erst nach echter Launchfreigabe entfernen.

**Abnahme A:** Kein prominent beworbener CTA endet an einem unbenutzbaren Kontaktweg. Produktive Website-Version und Zustellung sind belegbar.

### B. Produkt- und Zusatzleistungsregeln bestätigen (T011/T010; Input für T069)

Aram bestätigt eine strukturierte Angebotsmatrix mit folgenden Feldern je Extra: Name, Beschreibung, für welche Produkte zulässig, verfügbare Menge/Einheiten, Preisart (fest, je Stunde, je Einheit oder Angebot auf Anfrage), tatsächlicher Preis, enthaltene/ausgeschlossene Leistungen und ggf. Kombinationsregeln. Denkbare Kategorien sind Hintergründe, Gästebuch, eigenes Drucklayout, VIP-Ausstattung und Betreuung; **keine davon gilt ohne Einzelbestätigung als verfügbares MEMORA-Angebot**.

Auch klären: mehrere Hauptprodukte pro Event ja/nein; je Produkt genau ein Paket; ggf. Betreuungsdauer, Anfahrt/Liefergebiet, weitere variable Kosten, Preisdarstellung und verbindliche Verfügbarkeit. Die bereits bestätigten zwölf Paketpreise bleiben unverändert. Magazinbox und weitere Angebote nur mit freigegebenen Daten bepreisen.

**Abnahme B:** Eine freigegebene Tabelle aus produktseitigen Angebots-IDs, Paketen, Extras, Preisen und Regeln liegt als fachliche Quelle vor. Ohne Preisregel kein erfundener Endbetrag.

### C. Vierstufigen Konfigurator entwickeln (T069)

1. **Produkte:** Fotobox, Fotospiegel, Magazinbox anzeigen; exakte Auswahl von Produkt **und** Paket aus den Preis-/Detailseiten übernehmen. Mehrere Produkte nur, wenn B das bestätigt.
2. **Event:** Veranstaltungsart, Datum und Ort erfassen; Gästezahl nur ergänzen, wenn der Betreiber sie benötigt. Keine automatische Verfügbarkeitsbehauptung.
3. **Pakete & Extras:** Nur passende, freigegebene Zusatzleistungen als einzeln auswählbare, verständliche Karten mit Kosten/Einheiten anzeigen; unpassende Kombinationen nicht anbieten.
4. **Kontakt & Senden:** Übersicht aller gewählten Leistungen und transparenter voraussichtlicher Summe; Name, E-Mail, optional Telefon, Freitext und korrekte Datenschutzinformation; unverbindliche Anfrage senden.

UX-Vorgaben: Auswahl kann beim Zurückgehen geändert werden, ohne andere Felder zu verlieren; Fortschritt sichtbar; CTAs von jeder Produkt-/Preiskarte mit korrekter Vorbelegung; Preiszusammenfassung auf Desktop sichtbar und mobil gut erreichbar; Tastatur, Screenreader, fokussierbare Fehlermeldungen und reduzierte Animationen unterstützen. Keine neue Frontend-Plattform/CMS-Architektur.

### D. Anfragevertrag und Betreiberansicht erweitern (T069)

- Die bestehenden strukturierten Contentdateien unter src/content/ und den gemeinsamen Vertrag in shared/inquiry-contract.ts erweitern, ohne die vorhandenen Pakete doppelt zu führen.
- Zentrale IDs, Zulässigkeit, Mengen und Preisregeln serverseitig verifizieren; Browserpreise niemals als Autorität akzeptieren. Variable/offene Positionen klar als „auf Anfrage“ ausweisen.
- Anfragedaten mit bestätigter Auswahl und ggf. Preis-Snapshot in D1 speichern; bestehende Outbox, Admin-Detailansicht und sparsame Betreiberbenachrichtigung weiterverwenden. Beim Übergang bestehende Anfragen und Tests kompatibel halten.
- Die bestehende eindeutige Antwort **received / bookingCreated=false** bewahren: eine erfolgreich eingegangene Anfrage ist keine Buchung.
- Keine Payment-Schnittstelle, verbindlichen Holds, neuen SaaS-Workflow oder zusätzlichen Monatskosten einführen.

### E. Test, Freigabe und Veröffentlichung (T069 mit T009/T057)

- Vertragstests: alle zwölf Basispakete korrekt, gültige Extras/Mengen und Angebotsgrenzen; ungültige/gefälschte Kombinationen oder manipulierte Preise werden abgewiesen; variable Kosten nicht als Festpreise dargestellt.
- Browser: Mobile (390 px), Tablet (834 px), Desktop (1440 px); Vorbelegung, Schritte, Zurück/Vor, Eingabeerhalt, Preisanzeige, Formularfehler, Screenreader-/Tastaturpfad.
- E2E: echte Testanfrage → Worker → D1 → Outbox/Betreiberbenachrichtigung → Adminanzeige, ohne vorgetäuschten Erfolg; negative Fälle und keine fremden Daten sichtbar.
- Freigabe: finaler Legal-/Medien-/Produkt-Approval, Retention/Enforcement, produktive Cloudflare-Bindings und End-to-End-Readback auf exakt der veröffentlichten Revision. Release nicht auf grünes CI allein stützen.

**Definition of Done T069:** Ein Besucher kann auf der tatsächlichen MEMORA-Domain aus einer Preiskarte heraus Produkt/Paket und freigegebene Extras auswählen, eine nachvollziehbare Kostenschätzung sehen und eine unverbindliche Anfrage abschicken, deren vollständige Konfiguration der Betreiber tatsächlich erhält. Das wird auf Mobil/Desktop und im realen Produktionspfad frisch geprüft. Bis zur Produktionsfreigabe bleibt die Funktion Vorschau.

## Nachgelagerte Verbesserungen, keine Blocker für den ersten Anfrage-Launch

- T007/T010: Freigegebene echte Event-/Produktfotos, Beispielausdrucke, passende Erklärtexte, echte Referenzen und ggf. Layout-Galerie ergänzen.
- T025: Persönlicher, widerrufbarer Fotozugang pro Veranstaltung mit privater Medienauslieferung getrennt entwickeln; bleibt verbindliches Produktziel.
- T011/T006: Selbstpflege nur nach echtem Bedienbedarf über den bereits bevorzugten Git-/Codex-Workflow hinaus erweitern.
- T013: Verbindliche Sofortbuchung erst bei bestätigten Inventar-, Zahlungs-, Fahrt-, Puffer- und Stornoregeln.
- T064–T068: Nachweise der gemergten Arbeiten mit aktuellem Deployment abgleichen und ihre überholten Task-Status gesondert bereinigen.

## Offene Entscheidungen / Blocker

1. Welche Zusatzleistungen werden tatsächlich angeboten, mit welchen Preisen und erlaubten Kombinationen?
2. Sind mehrere Hauptprodukte in einer Anfrage zulässig? Welche Stunden-/Mengenregeln gelten?
3. Wie werden Anfahrt, Betreuung und nicht fest kalkulierbare Leistungen ausgewiesen?
4. Welche produktive Zieladresse/WhatsApp-Nummer und berechtigten Betreiberzugänge sollen genutzt werden?
5. Wann liegen bestätigte Impressums-/Datenschutzangaben, Anfrage-Retention und Medien-/Produktfreigaben vor?

Keiner dieser Punkte wird durch Melodys öffentlich gezeigte Konditionen ersetzt.

## Arbeitsjournal / Evidenz

- 01.11.2026: Kundenwunsch und differenzierter Melody-/Memora-Vergleich aus Projektkonversation übernommen; kein Livebuchungsabschluss bei der Referenz behauptet.
- GitHub-Readback: main 8441a32bfb73380ba87898309e5d201fdf82ca36; tasks/INDEX.md bis T068; src/release/production-approvals.json mit legal/publicMedia/productContent=false. Nur Planung, keine Website-, Backend-, Preis- oder Deploymentänderung.
## Implementierungsslice A — 01.11.2026

**Erster eigenständig testbarer Slice für das bestehende T069-Ziel:**

- Freigegebenes Paketmodell bleibt unverändert (zwölf Fotobox-/Fotospiegelpakete).
- `src/lib/configurator-preview.ts` berechnet Preise in Cent und lehnt fremde Produkt-/Paketkombinationen und nicht erlaubte Extras ab. Variabel bepreiste Leistungen sind keine angeblich feste Endsumme.
- `src/content/extras.json` ist absichtlich leer, bis Aram einzelne Extras einschließlich Preisen und Kombinationsregeln bestätigt. Die ergänzte Astro-Content-Schema-Prüfung verhindert unvollständige/erfundene feste Extra-Preise.
- `scripts/test-inquiry-contract.mjs` prüft bekannte Paketpreise, Synthetik-Extras, unpassende Kombinationen und offene Magazinbox-Kosten.
- Dieser Grundlagenslice ändert keine öffentlichen Routen und aktiviert keinen Versand. Eine eigenständige nachfolgende UI-Änderung setzt den vierstufigen Konfigurator und dessen Produkt-/Paket-Verlinkung um.
- Weitere produktive Umsetzung des Anfragevertrags und der Betreiberzustellung bleibt abhängig von bestehenden T008/T009/T010/T011/T049/T057 sowie bestätigten zusätzlichen Fachregeln.

## Implementierungsslice B — 01.11.2026

- Eigenständige vierstufige, noindex-geschützte, nicht sendende Vorschau unter `/demo/konfigurator/` auf `feat/t069-configurator-ui`.
- Produkt- und Preisseite verlinken direkt zur Auswahl mit exakter Vorbelegung beider IDs.
- Eventort, Datum und Anlass; Paket-/Extraauswahl, Preisübersicht und schrittweise Navigation sind clientseitig nutzbar, ohne Kontaktdaten oder Übermittlung.
- Passende Zusatzleistungen erscheinen erst nach konkret freigegebenem Katalog; keine Melody-Preise übernommen.
- Tests für Base-Path, Paket-Deep-Links, mobile Viewports, Zurück/Ändern und fehlende Versandmöglichkeit wurden in bestehende Verify-Suite integriert.
- Ursprünglicher kompletter Feature-Head `a4f266fe77b458bc56c1dead8a7467d608a260a5` war mit GitHub-Verify erfolgreich; die getrennten finalen PR-Heads benötigen jeweils neue CI-Prüfung und revisionsgebundenen Readback.
- Kein produktiver Anfrageversand, kein erfundenes Impressum, keine Änderung an T008/T009/T010/T011/T049/T057.

## CI- und Integrationsstand — 01.11.2026

- Teil A: PR #94, exakter Head `989b1362c2de3214ba92525de4bad90dcc3d4111`, 6 Dateien / 244 geänderte Zeilen, GitHub `verify` SUCCESS: https://github.com/Hall-of-Memory/memoraevents/actions/runs/41301394525.
- Teil B: PR #95, exakter Head `fcc70ef79b9985c303064d3c67524f48a2c3995f`, 10 Dateien / 477 geänderte Zeilen, GitHub `verify` SUCCESS: https://github.com/Hall-of-Memory/memoraevents/actions/runs/41301451504. Der zweite PR ist bis zur Integration des ersten bewusst auf dessen Branch gestapelt.
- Der reale Cloudflare-Lesecheck zeigte die Stage-1-Domain erreichbar; `/` führt noch auf `/demo/`, der neue Konfigurator ist auf dem Production-Origin noch nicht veröffentlicht.
- **Technischer Mergeblocker (außerhalb dieses Repos):** Das installierte Grabowski-Selbstreview-System akzeptiert bei seiner Git-Quellidentitätsprüfung aktuell nur `heimgewebe/*`; ein für `Hall-of-Memory/memoraevents` ansonsten formal passender PR-Review wird deshalb mit `signed first-party material review history unresolved or invalid` abgewiesen. `captain-run` darf ohne gültigen revisionsgebundenen Reviewbeleg nicht ausgeführt werden. Die Projekt-Branchschutzregeln bleiben unverändert; kein alternativer Merge-Bypass.
- Nächster zulässiger Schritt: Betreiber-Reviewwerkzeug um den echten kanonischen Repo-Owner ergänzen und geprüft bereitstellen **oder** einen ebenso authentischen, ausdrücklich zugelassenen Reviewweg verwenden; danach #94 und #95 gegen aktuelle Base-SHAs integrieren und Cloudflare-Produktionsreadback durchführen.

## Live-Preview-Readback — 01.11.2026

- GitHub-Bot `cloudflare-workers-and-pages` lieferte für PR #95 den konkreten, an den geprüften Stand `3c066986f1a58052fcc62abd9fdf9b2ce1d1a4ca` gebundenen Workers-Preview-Origin: https://feat-t069-configurator-ui-hall-of-memory.aram21.workers.dev
- Frischer HTTP-Test direkt vom Heim-PC: `/` → `/demo/` HTTP 200; `/demo/konfigurator/` HTTP 200; konkreter Deep-Link `?produkt=fotobox&paket=fotobox-classic` HTTP 200; `/preise/`, `/produkte/fotobox/` und `/impressum/` jeweils HTTP 200. Die Vorschau enthält vier `data-wizard-step`-Abschnitte und `noindex,nofollow`.
- **Das ist eine echte Cloudflare-Vorschau, kein Beweis für Produktivfreigabe oder erfolgreiche Anfragezustellung.** Der echte Domain-Origin `memoraevents.de/demo/konfigurator/` wurde zuvor mit HTTP 404 geprüft; die Produktionsdomain bleibt auf Stage 1. GitHub Verify und dessen Browserchecks waren für beide Feature-Slices erfolgreich; der ergänzende lokale Chrome-Semantiklauf scheiterte an einer Browser-Protokollstörung und zählt nicht als Bestätigung.
- Der ursächliche Operator-Review-Fix wurde als `heimgewebe/grabowski#1704` auf `main` regulär per Captain gemergt; Merge-Commit `d4d44d6951ec59a7556c1de42c7fd424a504d7fc`. Das installierte Operator-Release läuft weiterhin mit Source `8259921996010ac77ff9a02013d3af322ed55937`, sodass die neue Repo-Owner-Zulassung noch nicht produktiv ist. Für ein Operator-Deployment verlangt die vorhandene Releasepolitik einen Serving-to-Target-R3- und Main-CI-Nachweis; es wurde keine Freigabe vorgetäuscht und kein Deployment ausgelöst.
- T069 bleibt `active`; nächster Integrationsschritt sind echte Revision-/Signaturgates auf dem neuen Operator-Release, danach PR #94 → PR #95 und ein frischer Produktionsreadback. Arams Betreiber-, Datenschutz- und Extras-Freigaben bleiben davon unabhängig offen.

## Operator-R3 und finale CI-Basis — 01.11.2026

- PR #94 (Paket-/Extras-Modell) wurde nach T070/T071/Verify-Konsolenänderungen auf `cfd17e6ee195f2cf0119375b6ebbbad0b58e2ee8` aktualisiert; PR #95 (vierstufiger Wizard) darauf als Stack auf `fca6cbfca11888504fdf088bd531ee5c0838076a`. Beide sind beim frischen GitHub-Readback `MERGEABLE/CLEAN`; der Required-Check `verify` ist für die beiden exakten Heads `SUCCESS`. Main steht auf `a2a44e5c4430a994524524d423c32622434d54cf`.
- Der Cloudflare-Bot bestätigt den Vorschau-Deploy von `fca6cbf` auf https://feat-t069-configurator-ui-hall-of-memory.aram21.workers.dev . Frischer HTTPS-Readback: `/demo/`, `/preise/` und `/demo/konfigurator/?produkt=fotobox&paket=fotobox-classic` HTTP 200. Bei `memoraevents.de` sind Demo und Preise erreichbar, der produktive Konfigurator-Deep-Link liefert weiterhin HTTP 404.
- Die laufende Grabowski-Version `8259921996010ac77ff9a02013d3af322ed55937` kann den bereits in `heimgewebe/grabowski#1704` implementierten engen Repo-Origin-Fix noch nicht bereitstellen. Für das aktuelle geschützte Operator-`main` `2e4f434c13ce309d42270ae0ddcd4ee593f31848` wurden die fünf isolierten technischen R3-Prüfungen erfolgreich ausgeführt sowie das vollständige Serving→Target-Diff auf fünf Signaturachsen gelesen. Der unveränderte Quell-, Test- und Signaturbeleg liegt als `/home/alex/.local/state/grabowski/release-self-review-audits/1b00ab975c70366765b5e01c55de990fd6c01aa049016b90d09ae0af515d2bba.json` mit Audit-SHA256 `a01e97b8f45a3f1cd106c6bb181e57e84d6f49ca762c135107f030a8884f7713` vor (PASS, fünf signierte Achsen, null offene Materialbefunde). Die geschützte `main`-CI `validate` auf diesem Commit ist grün: https://github.com/heimgewebe/grabowski/actions/runs/41335708616 .
- **Wichtige Grenze:** Nach vollständigem PASS des offiziellen Captain-Preflights wurde ein einzelner autorisierter `runtime-deploy`-Scheduling-Versuch für `2e4f` ausgeführt. Der Captain meldete `verification_failed_after_execution`, `runtime_deploy_scheduling_raised_an_exception` und `mutation_outcome_unknown=true`. Das ist kein bestätigtes Scheduling oder Release. Danach wurde **nicht erneut gescheduled**. Runtime-/Prozess-Readbacks zeigen unverändert und gesund `82599219`; ein gezielter Read-only-Scan nach dem Release-Ziel fand in den seit dem Versuch neuen Job-Metadaten keinen entsprechenden Job. Diese negative Beobachtung ist kein vollständiger Ausschluss eines verzögerten Effekts. Vor weiteren Versuchen muss das einmalige Captain-Resultat anhand des zuständigen Schedule-Receipt und der tatsächlichen Jobzustände abgeglichen werden.
- T069 bleibt `active`; keine PR-Merge- oder Produktionsbehauptung ohne aktuelle Operator-Autorität und frischen Domain-Readback. Externe Betreiber-/Datenschutz-/Versand- und Extras-Freigaben sind weiterhin separat offen. Der sendefreie Wizard darf im Preview funktionieren, aber keine echten Anfragen annehmen.

## Integrationsfortschritt — 02.11.2026

- PR #94, Paket-/Extras-Grundlagen mit genau zwölf bestätigten Paketen und ohne erfundene Zusatzleistungen, wurde in MEMORA main gemergt (Merge `a323d9103a991798d33cc774a2ca28f2bcf5a387`).
- Der E2E-/Deployment-Arbeitsplan aus T009 wurde über PR #105 integriert (Merge `9574e2ebb435ddd956ebd26137362c54f26b2d0d`); er ersetzt keine offenen Betreiberfreigaben und belegt keinen erfolgreichen Produktionsversand.
- PR #95 wurde gegen den aktuellen main-Stand `9574e2ebb435ddd956ebd26137362c54f26b2d0d` konvergiert. Die vierstufige sendefreie Vorschau bleibt von der Preisseite und dem Landing-Anfragebereich erreichbar, nicht als echte Sendestrecke.
- Der Upstream-Fehler der signierten Grabowski-Prüfung für legitime Astro-Dynamikrouten mit eckigen Klammern wurde ursächlich in `heimgewebe/grabowski#1710` behoben und nach 71 bestandenen Tests und signierter Fünf-Achsen-Prüfung am 02.11.2026 gemergt (Merge `0506aab07a4a6f37491cc975049a2fd970bfe0a1`). Die aktive NixOS-Operator-Revision `37bdcbb2c38a1e8df310634c1e21dc6688b8921d` enthält den Fix noch nicht.
- Für die unmittelbare signierte Integration von PR #95 bleibt die bestehende dynamische Produktdetailroute zunächst unverändert; die dort geplante direkte Vorbelegung aus dem Produktdetail wird nach Aktivierung des korrigierten Operators in T069 ergänzt. Die Preis-/Paket-Vorbelegung von `/preise/` bleibt erhalten. Dies ist eine bewusste vorübergehende Reichweiteneinschränkung, kein Ersatz für den ursächlichen Upstream-Fix.
- Produktionsfreigabe und echtes Anfrage-E2E weiterhin abhängig von verifizierten Legal-, Kontakt-, Retention-, Produkt- und Cloudflare-Bindings (T009/T057/T049/T010/T011). Bis dahin `noindex` und kein Senden.

## Live-Abnahme sendefreie Auswahlvorschau — 02.11.2026

- PR #95 wurde nach aktueller GitHub-CI `verify: SUCCESS`, fünf echten signierten First-Party-Prüfachsen und revisionsgebundenem Captain-Run regulär in `main` integriert: `f78fec88a79995abc296daf11bf368e32c7cf5d9` (02.11.2026 11:43:38 UTC). Signiertes Review-Audit: SHA256 `f8f7c04e16a66fd8214622e20f07af056ace710123fbce0527ba52b575d6b9e0`. Die GitHub-Provider-Diffidentität `b0c396a53e91035faf472919f58f78900025deeadb42ea8914577a7436b2bd41` wurde im Mergeguard frisch erneut gebunden; keine Review-/Mergeumgehung.
- **Echtes Cloudflare-Ziel statt nur Build/Preview:** `https://memoraevents.de/demo/konfigurator/` HTTP 200; `/preise/` HTTP 200 mit allen zwölf Paket-Deep-Links. Public HTML ist bytegleich zum geprüften PR-Head `d25f016`-Build: 13172 Bytes, SHA256 `340dd11f905265914dcaa5983c7f5ea4d9c609eb9c9c83a335775baf1e4b9a71`. Zugehöriges kompiliertes Public-JS ist ebenfalls bytegleich: 5469 Bytes, SHA256 `07c131fc7029d7ae35d19e7cc0392f562403457b503347062db85c041d35cb27`.
- **Produktiver Chrome-156-Nutzerweg:** Direktlink `?produkt=fotobox&paket=fotobox-classic` setzt Produkt/Paket korrekt und zeigt 349 €; leere Pflicht-Eventangaben erzeugen eine sichtbare Validierungsfehlermeldung. Nach Eventdaten `Hochzeit`, zukünftigem Datum und Stadt `Lübeck`: Schritt 2→3→4, Zurück/Ändern auf `fotobox-party` aktualisiert auf 449 €, Ort/Datum bleiben erhalten. Drei echte Browserbreiten 1440/834/390 ohne horizontalen Überlauf, Preiszusammenfassung sichtbar.
- **Keine falsche Produktionsbehauptung:** Browser zeigt vier Schritte, `noindex,nofollow`, `form-action 'none'`, keine Kontaktdaten und null echte Formulare; die Schaltfläche `Unverbindliche Anfrage – noch nicht aktiv` ist disabled. Das ist die abgeschlossene **sendefreie Stage-1-Vorschau**, nicht die Definition of Done von T069. T069 bleibt `active` bis zu freigegebenen Extras/Fachregeln, integrierter unverbindlicher Anfrage, D1/Outbox/Admin und echtem Betreiber-E2E über T009.
- Die Produktdetail-URLs bleiben zunächst noch beim ausdrücklich deaktivierten Anfrageabschnitt; direkt vorgewählte Paketlinks funktionieren ab `/preise/`. Die ausstehende kleine Produktdetail-Routenergänzung setzt den bereits gemergten Fix `heimgewebe/grabowski#1710` im aktiven NixOS-Operator voraus. Die notwendige Betreiber-/Legal-/Retention-/Mailfreigabe wird weiterhin nicht behauptet (T057/T009/T049/T010/T011).

## Technischer Slice C – Konfigurator → bestehende Anfrage V1, 02.11.2026

**Umfang dieses Slices (noch nicht der vollständige Produktivlaunch):** Die sendefreie Route `/demo/konfigurator/` und die neue, releasegegatterte Route `/anfrage/` verwenden dieselbe Astro-Wizard-Komponente. Vier Schritte führen Produkt/Paket/Eventangaben zur Kontaktsektion; die bestehenden `src/scripts/inquiry-form.ts`, `src/lib/inquiry-form.ts` und `shared/inquiry-contract.ts` übernehmen Turnstile, Consent, V1-Payload, serverseitige IDs, D1/Outbox/Admin. Die Preistabelle leitet ihre zwölf Paket-Deep-Links erst nach `launchStatus=production` auf `/anfrage/` um. Browser-Preise werden niemals in V1-Requests übertragen; ungeklärte Extras bleiben leer bzw. sperren die produktive Formularroute. Ein bestätigtes `201 received / bookingCreated:false` sperrt weitere Sends, bewahrt den Kundenerfolg und löst weiterhin keine Buchung aus.

**Releasegrenze:** Aktuelle reale Release-Dateien bleiben unverändert (`src/content/site.json` draft, drei Approvals false, `inquiry-data-policy.json` blocked_external). Deshalb bleiben sowohl Live-Demo als auch die neue `/anfrage/`-Route sendefrei und `noindex`. Nur wenn Release-Status, belegte Legal-/Medien-/Produktfreigaben, positive Retention, Löschmodus/-nachweis, echte API/Turnstile-Buildkonfiguration und leere nicht freigegebene Extras konsistent sind, wird die produktive Formular-HTML-Variante erzeugt. Die vorhandene `check:production-readiness` bleibt zusätzlich maßgeblich für echten Deploy und verhindert Scheinfreigaben.

**Frisch verifizierte lokale Belege:** Im exakt isolierten Grabowski-Worktree wurde `npm run verify` mit Node 22.23.4, Nix-Chrome 156 und lokaler Wrangler-/D1-Umgebung vollständig ausgeführt: **23 PASS, 0 FAIL, 0 BLOCKED**. Dabei beweist `inquiry-spike` ein lokales `201 received`, D1/Outbox, simulierte Benachrichtigung mit Message-ID, Access-Admin und negative HTTP-Pfade. Die zuvor vom restringierten Terminal verursachte libuv-`uv_interface_addresses errno 97`-Störung ist durch einen normalen systemd-User-Testlauf umgangen, nicht durch Abschwächung der Geschäftsvalidierung; lokale Turnstile-Testschlüssel werden nur bei `SPIKE_MODE=local-only` ohne externen Siteverify-Aufruf deterministisch geprüft, `production` behält echte Cloudflare-Siteverify. `test:form` erzeugt zwei isolierte synthetische Builds und prüft Draft-Failsafe, Production-Form, sämtliche V1-Felder, Consent, initial deaktivierten Submit sowie zwölf korrekte /anfrage/-Paketlinks. Zusätzlich wurde der volle Browser-Nutzerweg auf einer ausschließlich lokalen synthetischen Fixture getestet: Fotobox/Classic → Hochzeit/02.11.2027/Dresden → Kontakt + Consent → exakt ein V1-POST ohne Browserpreis/Extras → simuliertes `201 received`, sichtbare Erfolgsmeldung und Submit gesperrt. Die beiden Test-Services wurden danach gestoppt und die Fixture entfernt.

**Nicht behauptet:** Es wurde kein realer produktiver Worker, keine Cloudflare-D1, kein echter Betreibermaileingang und keine öffentliche Kundenanfrage aktiviert. Betreiber-/Legal-/Retention-/Extras-Freigaben bleiben offen; T069 bleibt `active`, T009 `blocked_external`. Die direkte Vorbelegung aus dynamischen Produktdetailrouten bleibt gesonderte UX-Folgearbeit nach Aktivierung des bereits upstream gemergten Astro-Pfad-Signerfixes.

## PR107 GitHub Review P2 – Annahmezustand eingefroren (02.11.2026)

- Der Captain-Merge wurde vor Dispatch mit `pr_merge_state_not_clean_before_execution` gestoppt. GitHub-Primärquelle: genau ein offener Codex-Reviewthread `PRRT_kwDOT-_pNc6ysBeI`, P2. Ein Kunde konnte nach bestätigtem `201 received` seine Wizard-Auswahl nachträglich ändern, ohne dass die Bestätigung sich änderte.
- Korrektur: Das Formular sendet nach bestätigtem Eingang `memora:inquiry-received`; daraufhin deaktiviert der Wizard Produkt-, Paket-, Extra- und Event-Eingaben sowie Zurück/Weiter. Auch manuell ausgelöste Klicks und ein zweites Submit ändern die akzeptierte Zusammenfassung nicht.
- Echter Chrome-156-Test gegen eine ausschließlich lokale synthetische Fixture: Fotobox Classic 349 Euro, Hochzeit am 02.11.2027 in Dresden, gültiger V1-POST, simulierte 201-Antwort. Danach weiterhin Schritt 4, identische Auswahl/Zwischensumme, null bearbeitbare Wizard-Felder, deaktivierte Navigations-/Submit-Knöpfe, exakt ein Request und weiterhin sichtbare Erfolgsmeldung. Testkennung `PR107_CODEX_P2_CHROME_FIX_PASS`. Testserver und Browser beendet; Fixture gelöscht.
- Der finale PR107-Head braucht erneut vollständige GitHub CI, signierte Source-Prüfung und Captain-Mergeguard. Produktive Freigaben und echtes Betreiber-Mail-E2E bleiben ausstehend; T069 bleibt `active` und T009 `blocked_external`.
