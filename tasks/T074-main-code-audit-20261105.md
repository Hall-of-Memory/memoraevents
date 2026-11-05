---
id: T074
status: done
priority: P1
dependencies: []
---
# Code-Audit von MEMORA EVENT und zwei bestätigte Fehlerkorrekturen

## Ziel und Grenze

Kanonischen `main` inklusive öffentlicher Astro-Seiten, Inhaltsprojektion und Zod-Schemas, Konfigurator-/Anfrageclient, Cloudflare Worker (CORS, Turnstile, Access, D1, Outbox, Admin), Migrationen, CI/Release-Gates und Testprogrammen auf nachvollziehbare Fehler prüfen. Nur reproduzierbare Defekte minimal korrigieren; keine fachlichen Freigaben, Produktangebote oder produktiven Ressourcen verändern. Dies ist keine Behauptung, dass jede Codezeile oder jede mögliche Fehlerklasse formal bewiesen wurde.

## Ausgangsstand und Evidenz vom 05.11.2026

- Exakt isolierter Ausgangscheckout `main@db9c0afd6f45d7d67633c00261003f5f472f3f0b`, bestehende T069-Dirty-Arbeit nicht verändert; Branch `audit/t074-code-review-20261105`.
- Inventur: **101 versionierte Dateien** unter `src/`, `shared/`, `scripts/` und `spikes/inquiry-worker/`. Automatisierte Quellmustersuche und gezielte manuelle Prüfung der Laufzeitpfade, Datenschutz-/Rechte- und Release-Gates.
- `npm ci` im Audit-Checkout reproduzierbar erfolgreich: Grabowski-Job `grabowski-job-5b32febc8104`.
- `npm audit --json`: **0 gemeldete Schwachstellen** im aktuellen Lockfile, Job `grabowski-job-bd05090cfa71`. Dies ist kein vollständiger Ersatz für Code-Scanning oder aktuelle Betreiber-/Cloudflare-Konfiguration.
- Ausgangs-`npm run verify`: **23 PASS / 0 FAIL / 0 BLOCKED**, Job `grabowski-job-419e4e7305f4`.
- GitHub Dependabot meldet **42 offene Alerts**. Vollständiger Abgleich **aller 42** gemeldeten GitHub-Versionsbereiche gegen jede tatsächlich im aktuellen `package-lock.json` enthaltene Paketversion mittels `semver.satisfies` (Grabowski-Job `grabowski-job-9f486d9cbc1e`): **0 installierte Versionen im verwundbaren Bereich**; **41 Alerts** betreffen bereits nicht mehr verwundbare Lockfileversionen, **1 Alert** (`js-yaml` #12) ein nicht mehr installiertes Paket. Beispiele: Astro #8 (`<7.2.8`, aktuell `7.4.5`); Zod #49 (`<4.6.6`, aktuell `4.6.7`); Undici #48 (`>=7.0.0, <7.30.1`, aktuell `8.12.3`). **Die GitHub-Alerts sind weiterhin offen; keine Alerts wurden stillschweigend geschlossen oder als Sicherheitsbeweis ausgegeben.** GitHub-Code-Scanning bot bei dieser Prüfung keine vorhandene Analyse.

## Reproduzierte Defekte und Fix

**A. Betreiberbenachrichtigung mit Altmarke.** `spikes/inquiry-worker/src/privacy.ts` verwendete im tatsächlich generierten Mailtext noch `Neue Anfrage über Hall of Memory`. Neue Regression in `scripts/test-quality.mjs`: verlangt `MEMORA EVENT` und weist Altmarke zurück. Vor Korrektur FAIL (`grabowski-job-06c73e0ca9b6`), nach Änderung PASS (`grabowski-job-f9172e67d776`). Keine Änderung der versendeten personenbezogenen Inhalte, Empfängeradressen oder Mailkonfiguration.

**B. Unbehandelte ungültige %-Kodierung in Admin-Schreibwegen.** Authentifizierte `PATCH /api/admin/inquiries/%ZZ` und `POST /api/admin/inquiries/%ZZ/notify` riefen `decodeURIComponent()` ohne Fehlerfang auf. Reale lokale Wrangler-/Access-E2E-Gegenprobe: erster Pfad gab **500 statt 400** zurück (`grabowski-job-a872cf133643`). Gemeinsamer eng begrenzter Decoder liefert bei ungültiger Kodierung `400 {"error":"invalid-inquiry-id"}`; korrekte IDs laufen unverändert über Status-/Notification-Handler. Beide negativen HTTP-Fälle im bestehenden `scripts/smoke-inquiry-spike.mjs` ergänzt; nach Korrektur PASS (`grabowski-job-68e2bac716f7`).

## Konkrete Akzeptanz

- [x] Isolierter Ausgangsstand und relevante Code-/Konfigurations-/Migrationseinheiten inventarisiert.
- [x] Fresh install, npm-Audit und Ausgangs-Verify nachvollziehbar.
- [x] Beide Fehler vor Korrektur rot reproduziert und danach fokussiert grün.
- Nach den Fixes lokaler `npm run verify` unter Node 24.22.1: **22 PASS, 1 FAIL (nur `visual-regression`)**, Job `grabowski-job-2037d10e6101`. Grund der Abweichung: Das inzwischen fehlende ausführbare Chrome/Chromium auf dem Betreiberhost (`No Chrome/Chromium executable found`), **kein nachgewiesener Layoutfehler**. Die volle gültige visuelle/Node22-Gegenprobe wird daher bewusst der neuen exakten GitHub-CI auf dem PR-Head überlassen.
- Gezielt geänderte Worker- und Qualitätsregression sind trotz der lokalen Browserumgebungsgrenze jeweils PASS; kein Versuch, die Visualprüfung aus dem kanonischen Verify zu entfernen.
- [x] Vollständiges GitHub-Verify auf dem endgültigen PR-Head unter der gepinnten Node-22-/Chromium-CI erfolgreich; lokaler Chrome-Umgebungsfehler blieb unverändert dokumentiert.
- [x] Required-CI und Cloudflare Preview auf exakt `c779c7e3615a642ba958d007787f16781ceaca3b` grün, Merge PR #125 und frischer Main-/Pages-/HTTP-Readback erfolgreich.

## Unveränderte Produktions- und Beleggrenzen

`launchStatus=draft`, `noindex`, deaktivierter öffentlicher Anfrageversand, nicht bestätigte F1–F12, drei Production-Approvals `false` und `inquiry-data-policy=blocked_external` bleiben bestehen. Authentifizierte produktive Worker-/D1-/Access-/Mail-/Postfacheingangsabnahme ist ohne Betreiberfreigabe nicht möglich; lokal simulierte Mailzustellung ist keine echte Operator-Zustellung. T070 bleibt für den Legacy-Host-`www`-TLS-Fehler und Cloudflare-Zonenredirect zuständig. Keine Secrets, Personen-/Kundendaten oder fiktive Freigaben eingetragen.

## Integrations- und Post-Merge-Abnahme — 05.11.2026

- PR [#125](https://github.com/Hall-of-Memory/memoraevents/pull/125) ist laut GitHub um **11:48:29 UTC** gemergt, Head `c779c7e3615a642ba958d007787f16781ceaca3b`, Merge `93303cb574598f7d044318e4271db60f211c2829`.
- Revisionsgebundener Selfreview-Audit (lokaler privater Operatorbeleg, **nicht** ins öffentliche Repo kopiert), zwei inhaltlich unterschiedliche Durchgänge, Gate **PASS**, exakter Diff-SHA-256 `c4f1a027cfbb2e1b822469055ef3c1e133c2c01b52e47ece0d69f5173d7e94f8`, keine untriagierten materiellen Befunde. Captain meldete beim nachfolgenden Mergeversuch den bereits erfolgten Merge und führte **keinen** zweiten aus.
- Für den exakten PR-Head waren GitHub-`verify`, Cloudflare Workers Builds und Vercel **SUCCESS**. Auf dem tatsächlich gemergten `main@93303cb5` bestätigt GitHub Workflow [42021943734](https://github.com/Hall-of-Memory/memoraevents/actions/runs/42021943734) die Jobs `verify` und `pages-runtime` mit `success`; Cloudflare Workers Builds meldet für denselben Commit `SUCCESS`.
- GitHub-Pages-Livereceipt `https://hall-of-memory.github.io/memoraevents/hall-of-memory-deployment.json` meldet exakt `sourceRevision=93303cb574598f7d044318e4271db60f211c2829`, `verifyRunId=42021943734`. Der öffentliche Kundenpfad `https://memoraevents.de/demo/konfigurator/` liefert HTTP 200, weiterhin `noindex,nofollow`, **0 Formulare und keine aktive Submitfunktion**.
- Dies schließt den **Codeaudit- und Fix-Scope T074**. Nicht nachgewiesen sind reale Cloudflare-Worker-/D1-/Turnstile-/Access-/Mail-Bindings und ein tatsächlich eingegangenes Betreiberpostfach. Diese ausdrücklich noch nicht freigegebene Stage-2-Abnahme verbleibt in T009/T049/T057/T069; Legacy-Domain-Fehler bleibt T070. Weder `launchStatus=draft` noch die Freigabe- oder Sendesperren wurden geändert.
