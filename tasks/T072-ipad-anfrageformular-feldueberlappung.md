---
id: T072
status: done
priority: P1
dependencies: [T071]
---
# iPad-Anfrageformular: überlappende Felder beheben

## Fehler und Ziel

Kundenscreenshot vom 03.11.2026 auf memoraevents.de: Im Anfragesegment überlappt das native Datumsfeld Wunschdatum die rechts folgende Auswahl Veranstaltungsart. Die Formularübersicht muss ohne Felderkollision auf Smartphone, Tablet und Desktop funktionieren. Kein Eingriff in das deaktivierte Produktionsformular oder in T069.

## Ursache und Korrektur

Das gemeinsame Formularraster verwendet zwei automatisch mindestbreitebestimmte fr-Spuren: Die automatische Mindestbreite eines nativen Datumsfelds kann die linke Rasterspur über die verfügbare Hälfte hinaus vergrößern. Rasterspuren erhalten daher minmax(0, 1fr) und Formular-Labels sowie ihre direkten Eingaben min-width: 0. Der Breakpoint für die einspaltige Darstellung bleibt unverändert.

## Abnahme

- Browser-Regression misst Formulargitter und tatsächliche Feldkanten an Desktop, Tablet und Smartphone; es genügt nicht, nur den horizontalen Seiten-Scroll zu prüfen.
- Build, Demo-Test und Browserlauf nach Möglichkeit frisch auf dem Fix-Head prüfen.
- Release erst nach CI, Merge und Live-Readback der ausgelieferten CSS-Datei als produktiv erledigt bezeichnen.

## Prüfprotokoll 03.11.2026

- Der unveränderte T069-Worktree wurde nicht angefasst. T072 ist ein eigener Branch ab dem frisch abgeglichenen origin/main d74afe7.
- npm run test:demo: PASS (Astro-Build und Demo-Regression).
- Browser-Regression im Nix-Store-Chromium 156: PASS, vier Viewports 390, 834, 1024, 1440 px, zwölf Screenshots. Formularkanten auf jeder Breite innerhalb ihrer Rasterzellen; die absichtlich injizierte Datumsfeld-Überbreite wird exakt als VIS-INVARIANT-INQUIRY-FIELD-OVERLAP erkannt.
- Physisches iPad-Safari und produktive Cloudflare-Version vor Merge/Deployment nicht als geprüft behaupten.


## Produktive Abnahme und Abschluss — 03.11.2026

- Korrektur über PR #114 mit exakt geprüfter Revision 5a3442b7407523dc41f9da41fb6bdce994f3ecb5 integriert. GitHub bestätigt MERGED, Merge-Commit 12f9b573e3e99c5c77058749ce9b365a305a56fa.
- GitHub-Verifikation (Verify-Run 41655693384), Pages-Runtime und Cloudflare Workers Builds für den Merge-Commit: jeweils SUCCESS.
- Produktiver Cloudflare-Readback auf https://memoraevents.de/demo/: HTML referenziert /_astro/BaseLayout.Btq4JtSz.css; dieses tatsächlich ausgelieferte CSS enthält repeat(2, minmax(0, 1fr)) sowie min-width: 0 für die Formularfelder. Das alte CSS-Asset wurde zuvor als abweichender Ausgangszustand gelesen.
- Frischer Browserdurchlauf direkt auf der echten Domain in Chromium 156 bei 390, 834, 1024 und 1440 Pixeln: drei Formulargitter pro Breite vorhanden; alle Felder innerhalb ihrer Rasterzellen, keine Überschneidung und kein horizontaler Overflow. Ergebnis: T072_LIVE_BROWSER_4_VIEWPORTS_PASS.
- Das physische Kunden-iPad mit iPadOS Safari konnte nicht aus dieser Betriebsumgebung ferngesteuert werden. Eine ergänzende WebKitGTK-WebDriver-Probe wurde versucht, lieferte aber beim Navigieren keine nutzbaren Messungen (Session terminated without a reply); daraus folgt weder ein Safari-PASS noch ein Produktfehler. Die Safari-Gerätegegenprobe bleibt eine optionale zusätzliche Sichtkontrolle, kein Ersatz für die erfolgreich nachgewiesene produktive Korrektur.
- T069 und andere laufende Aufgaben werden nicht geändert; ein erneuter Inquiry-Produktivversand war nicht Bestandteil dieses reinen Layoutfehlers.

**Status:** done — Korrektur, Merge, CI, Cloudflare-Auslieferung und direkte produktive Browsergeometrie nachgewiesen.
