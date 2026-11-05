---
id: T074
status: active
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
- [ ] Vollständiges Verify auf dem endgültigen Diff und exakte Node22-/Chrome-Umgebung abgenommen.
- [ ] GitHub-Required-CI und Cloudflare Preview auf dem veröffentlichten PR-Head grün; zulässiger Merge, Source-Readback.

## Unveränderte Produktions- und Beleggrenzen

`launchStatus=draft`, `noindex`, deaktivierter öffentlicher Anfrageversand, nicht bestätigte F1–F12, drei Production-Approvals `false` und `inquiry-data-policy=blocked_external` bleiben bestehen. Authentifizierte produktive Worker-/D1-/Access-/Mail-/Postfacheingangsabnahme ist ohne Betreiberfreigabe nicht möglich; lokal simulierte Mailzustellung ist keine echte Operator-Zustellung. T070 bleibt für den Legacy-Host-`www`-TLS-Fehler und Cloudflare-Zonenredirect zuständig. Keine Secrets, Personen-/Kundendaten oder fiktive Freigaben eingetragen.
