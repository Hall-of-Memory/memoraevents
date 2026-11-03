---
id: T072
status: active
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
