---
id: T010
status: blocked_external
priority: P0
dependencies: []
---
# Kundeneingaben einarbeiten

## Kundenstand — 2026-08-13 / Public-Grenze 2026-08-22

- Der Kunde hat die Hall-of-Memory-Grafiken selbst beauftragt.
- Die ursprünglichen Designer-Originale und das Quellen-ZIP bleiben privat als Projekt-/Recovery-Evidenz erhalten und werden nicht in die neue öffentliche Git-Historie übernommen.
- Für die Website sind drei unveränderte Web-Exports hashgebunden:
  - `public/brand/hall-of-memory-logo-primary.svg` — `76f3055f5e16081ad58b555263b4a92dec5fc52a87abe238c8f8c6459f573c13`
  - `public/brand/hall-of-memory-logo-dark.jpg` — `4bf4bd0a524af72cc7a9375531e1a00f9d385d62318666fb662aef5f3f040c22`
  - `public/brand/hall-of-memory-logo-light.jpg` — `7bd29e4f79b830ea6c97a75118098abfc36a70d616bfba8093b8f01253211c3e`
- Designerdateien werden nicht verändert, nachgezeichnet, umgefärbt oder gefiltert.
- Logo-/Markenmaterial darf nicht als Event-/Produktfotografie eingesetzt werden.

## Bereits umgesetzt

- ursprüngliches Kundenquellenpaket privat und hashgebunden als Recovery-Evidenz erhalten
- öffentliche Weblogoassets byteidentisch an die bestätigten Designer-Exports gebunden
- öffentliche Repository-Grenze so geändert, dass `.ai`, `.pdf`, ZIP und sonstige Arbeitsquellen nicht für GitHub Pages/Codex veröffentlicht werden müssen
- Logo und Eventfotografie im Layout sauber getrennt
- konsolidierte Kundenanforderungen in `docs/customer-requirements.md` geführt

## Fehlt weiterhin

- Originalbilder / freigegebenes Galerie-, Produkt- und Eventmaterial
- gegebenenfalls freigegebenes kurzes Hero-Video
- angekündigte zusätzliche Referenz-Websites
- finale Texte
- echte Hall-of-Memory-WhatsApp-Businessnummer
- produktives Kontaktziel / Betreiberadresse für Anfragen

## Akzeptanz nach weiterer Zulieferung

- echte Produkt-/Eventbilder mit korrekten Formaten, Alt-Texten, responsiven Größen und Performance-Budgets integrieren
- Paketnamen, Leistungen, Preise und Texte nur aus bestätigten Kundendaten übernehmen
- echte WhatsApp-Businessnummer erst nach bestätigter Zulieferung aktivieren
- neue Referenzen nur als Inspiration analysieren; keine fremden Texte, Bilder oder eigenständigen Gestaltungselemente kopieren

## Entblockt durch

Lieferung beziehungsweise Bestätigung der noch fehlenden Originaldaten. T010 bleibt bis dahin `blocked_external`.

## Abgleich mit dem aktuell integrierten MEMORA-Angebot — 03.11.2026

**Überholte Fehlbestände korrigiert:** Die zwölf von Kunden ausdrücklich gewählten Fotobox-/Fotospiegelpakete sind bereits seit PR #82 (`8441a32bfb73380ba87898309e5d201fdf82ca36`) integriert und durch PR #113 im Kundenweg getestet. Die kanonische Domain `memoraevents.de` ist seit T061 aktiv. Das aktuelle MEMORA-Original-SVG `public/brand/memora-event-logo.svg` wurde mit PR #81 (`41bf800ad086466ea5bfe266928eca16a26e884d`) integriert; die obigen älteren Hall-of-Memory-Assets bleiben ausschließlich historische Quellbelege. Gerätefotos T066 wurden auf ausdrücklichen Kundenwunsch durch Illustrationen T067 ersetzt; kein Reaktivierungsauftrag.

**Tatsächlich verbleibende externe Inputs:** abschließende Freigabe der heute öffentlich sichtbaren Medien einschließlich Nutzungs-/Persönlichkeitsrechten (besonders Magazinbox-Familienfoto, weiterhin nicht ohne Rechte veröffentlichen); finale Produkttexte und Darstellung tatsächlich angebotener Leistungen; ausdrückliche Produktinhaltsfreigabe einschließlich der zwölf bereits umgesetzten Preisstufen; bestätigter öffentlicher Betreiberkontakt sowie tatsächliche Empfänger-/Absender-/Adminziele über T057. Falls weitere Eventbilder oder ein Hero-Video eingesetzt werden sollen, erst nach Lieferung und Freigabe. Eine angekündigte, nicht zwingende Referenzseite ist **kein Stage-2-Blocker**.

Die kanonische Antwortvorlage für Betreiberangaben, reale Dienstleister und Medien-/Produktfakten befindet sich gesammelt in `docs/business-legal-ground-truth.md`. `src/release/production-approvals.json` bleibt bis zur expliziten belegten Freigabe `false`; T010 bleibt `blocked_external`. Keine fiktiven Kontaktdaten, Preis-Extras oder Bildrechte einsetzen.
