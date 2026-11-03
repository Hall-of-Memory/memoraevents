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

## Produktionsabnahme und Abschluss 03.11.2026

- **Integration:** PR `Hall-of-Memory/memoraevents#114` regulär gemergt; Merge-Commit `12f9b573e3e99c5c77058749ce9b365a305a56fa`. Auf diesem Commit der GitHub-Workflow `41655693384` abgeschlossen mit **verify SUCCESS** und **pages-runtime SUCCESS**.
- **Echter Live-Browsernachweis nach dem Merge:** Firefox 158 WebDriver BiDi lud direkt `https://memoraevents.de/demo/` bei echten CSS-Viewports **390, 834, 1024, 1440 px**. Für alle vier Größen wurden drei `.demo-inquiry .form-grid-two`-Reihen und sämtliche sechs Feld-/Label-Grenzen geometrisch geprüft: kein Feld verlässt seine Rasterzelle, keine nebeneinanderliegenden nativen Felder überschneiden sich, kein horizontaler Seitenüberlauf. Ergebnis **4/4 PASS**, Grabowski-Task `577234272dcc49b28951fb3e`, terminaler Receipt `d1ca69f87158195ae7ef499473886d294bb883fbd270a2e372d34a45b5b710ed`. Bei 834px zeigen die zweispaltigen Rasterzellen jeweils 320px Breite mit 14px Abstand; bei 1024px jeweils rund 199,5px. Das bestätigt gerade den früheren Grid-Überlappungsfall; bloße HTTP-200- oder Scrolltests wären dafür nicht ausreichend.
- **Gegenprobe und Scope:** Bereits auf PR-#114-Fix-Head die gezielt injizierte Überbreite des Datumsfelds mit `VIS-INVARIANT-INQUIRY-FIELD-OVERLAP` erkannt; tatsächlicher Produktiv-Browserlauf nach Merge ohne die Testinjektion bestanden. Kein Anfrage-POST und keine Änderung der Stage-1-Sendesperre. **Ein physisches iPad mit Safari wurde nicht selbst bedient**; die neue Live-Regression beruht auf Firefox/BiDi und den zuvor bestätigten Chromium-Regressionen, sodass Safari-spezifisches Verhalten als kleine verbleibende Browserabweichung gesondert erkennbar bleibt.
- **Status:** T072 `done` für den produktiv reproduzierbar behobenen CSS-Rasterfehler. Keine neue Architektur oder Sonderregel erforderlich.
