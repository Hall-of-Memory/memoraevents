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
