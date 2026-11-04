---
id: T049
status: blocked_external
priority: P0
dependencies: [T046]
---
# Inquiry-/Admin-Datenschutz vor Produktivaktivierung härten

## Ziel

Bevor echte personenbezogene Anfragen verarbeitet werden, wird der bereits vorhandene Inquiry-/Admin-Pfad nach Datenminimierung, Zugriffstrennung und Retention gehärtet. Die vorhandenen Validierungs-, Rate-Limit-, Turnstile-, CORS-, D1- und Cloudflare-Access-Verträge bleiben erhalten.

## Umsetzung

1. Admin-Listenansicht datensparsam machen: Listenendpunkte liefern nur die für die Übersicht benötigten Felder; E-Mail, Telefon, Nachricht und weitere Detaildaten werden erst über einen autorisierten Detailabruf geladen.
2. Einen expliziten autorisierten Detailendpunkt bzw. gleichwertigen Vertrag für eine einzelne Anfrage einführen.
3. Admin-Frontend und Worker-Verantwortung prüfen und unnötige Inline-HTML-/JavaScript-Kopplung abbauen, soweit dies ohne unnötige Architekturgröße möglich ist.
4. CSP des Adminpfads nach der Entkopplung verschärfen; `unsafe-inline` nicht dauerhaft nur aus Bequemlichkeit behalten.
5. Vor Produktivbetrieb Aufbewahrungs-, Lösch- und erforderliche Export-/Nachweisregeln technisch dokumentieren und implementieren, soweit die fachlichen/rechtlichen Parameter aus T008/T011 belegt sind. Fehlende Fristen nicht erfinden.
6. Notification-E-Mails bleiben datensparsam und enthalten keine unnötigen Anfrageinhalte.

## Slice 1 — Datenminimierung und Detailtrennung

Gemergt über PR #20, Merge-Commit `bcfb0e401afbeaa91f29fd98fff04e4823a54a7b`.

- Der bestehende Worker-Core bleibt unverändert für Public-Inquiry, Notifications und Status-PATCH.
- `src/privacy-entry.ts` liegt als dünner Entry vor dem Core und fängt authentifizierte Admin-GETs für Inquiry-Liste und Inquiry-Detail ab.
- `/api/admin/inquiries` selektiert nur ID, Erstellzeit, Angebot/Paket, Veranstaltungsdaten, Ort, Name, Status und Notification-Status. `email`, `phone` und `message` werden nicht mehr aus D1 gelesen und nicht als JSON-Keys ausgeliefert.
- `GET /api/admin/inquiries/:id` liefert E-Mail, Telefon und Nachricht erst nach demselben Cloudflare-Access-Vertrag; ohne gültige Identität erfolgt vor jedem D1-Read ein `403`.
- Nicht-GET-Routen werden unverändert an den bestehenden Core delegiert; insbesondere bleibt der Status-PATCH-Vertrag unangetastet.
- Lokale Wrangler-Konfiguration und Production-Beispiel zeigen beide auf den Privacy-Entry. Production-Readiness lehnt eine kundenbezogene Production-Config mit Legacy-Entry `src/index.ts` explizit ab.
- Required-Verify `32630555499`: PASS.
- Evidenz: `inquiry-admin-frontend-smoke-ok`; `admin-data-minimization-ok summary_pii=false detail_auth=true unauthorized_db_queries=0`; `production-readiness-gate-ok ... privacy_entry_required=true`; Astro Check 55 Dateien, 0/0/0; Worker-/Site-Dry-Runs PASS.

## Slice 2 — Admin-CSP ohne unsafe-inline

Gemergt über PR #21, Merge-Commit `5c585f5cd26086a0df8753b251145986eb2038c2`.

- Der kanonische Privacy-Entry übernimmt zusätzlich `GET /admin` vor dem Legacy-Core.
- Pro Admin-Request wird ein kryptographischer 18-Byte-Nonce erzeugt und identisch an CSP, `<style>` und `<script>` gebunden.
- Admin-CSP verwendet `default-src 'none'`, noncegebundene Script-/Style-Quellen, `connect-src 'self'`, `frame-ancestors 'none'`, `base-uri 'none'`, `form-action 'self'`, `object-src 'none'`; `unsafe-inline` ist nicht mehr nötig.
- Adminliste bleibt PII-minimiert; Kontakt-/Nachrichtendetails werden erst über eine explizite Details-Aktion nachgeladen.
- Response bleibt `no-store`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`.
- Required-Verify `32630840294`: PASS.
- Evidenz: `admin-page-security-ok unsafe_inline=false nonce_bound=true detail_on_demand=true`; bestehender Wrangler/D1/Admin-Smoke und alle Release-/Build-/Dry-Run-Verträge ebenfalls PASS; Astro Check 57 Dateien, 0/0/0.

## Slice 3 — Retention/Löschung fail-closed statt geraten

Technischer Gate-Stand auf PR #22, Head vor Closeout `33445ed0f9ef5be23bf39a8360fd503b3eb30ee5`.

- `src/release/inquiry-data-policy.json` dokumentiert die fehlende fachlich/rechtliche Vorgabe ausdrücklich als `blocked_external` durch T008/T011.
- Im realen Repo bleiben `retentionDays`, `deletionMode`, `policyEvidenceRef` und `enforcementEvidenceRef` leer/null. Es wurde keine konkrete Frist oder Löschart erfunden.
- Production-Readiness akzeptiert Inquiry-Livebetrieb erst bei `status=approved`, positiver ganzzahliger Retentionfrist, nichtleerem Lösch-/Lifecycle-Modus sowie Policy- und Enforcement-Evidenz.
- Der synthetische Ready-Test benutzt ausschließlich Testdaten; die dortige Beispielzahl ist keine Hall-of-Memory-Policy.
- Extern blockierte Policy, Retention 0 oder fehlende Enforcement-Evidenz blockieren Produktion reproduzierbar.
- Required-Verify `32631054785`: PASS.
- Evidenz: `production-readiness-gate-ok current_blockers=12 synthetic_ready=true privacy_entry_required=true data_policy_required=true`; echter Wrangler/D1/Admin-Smoke PASS; `admin-data-minimization-ok ...`; `admin-page-security-ok ...`; Astro Check 57 Dateien, 0/0/0; Worker-/Site-Dry-Runs PASS; npm audit 0 vulnerabilities.

## Externer Restblocker

Die autonome technische Arbeit dieses Tasks ist abgeschlossen. Offen bleibt ausschließlich Primärevidenz aus T008/T011 für:

- konkrete Aufbewahrungsfrist;
- konkrete Lösch-/Lifecycle-Regel;
- Policy-Freigabe;
- revisionsgebundener Nachweis, dass die gewählte Regel technisch umgesetzt bzw. betrieblich durchgesetzt wird.

Bis diese Wahrheit vorliegt, bleibt T049 `blocked_external` und das Production-Readiness-Gate blockiert den Inquiry-Livebetrieb.

## Akzeptanz

- [x] Listenabruf enthält keine unnötigen Kontakt-/Nachrichtenfelder.
- [x] Detaildaten sind nur über den bestehenden authentifizierten Adminvertrag erreichbar.
- [x] fehlende/ungültige Authentifizierung bleibt fail-closed.
- [x] bestehende Rate-Limit-, Turnstile-, CORS- und Notification-Privacy-Verträge bleiben grün.
- [x] Retention-/Löschpfad besitzt einen expliziten externen Blocker ohne erfundene Frist; Produktion bleibt bis zu Policy- und Enforcement-Evidenz gesperrt.
- [x] `npm ci` und `npm run verify` PASS.

## Nicht-Ziel

- keine Buchungsengine;
- kein neues CMS;
- keine Speicherung privater Eventfotos im Inquiry-Datenspeicher;
- keine Aktivierung produktiver D1-/Mail-/Turnstile-Ressourcen allein durch diesen Task.

## Enforcement-Schnittstelle und aktuelle Grenze — 03.11.2026

- Aktueller SQL-Stand auf `main` `611e7aaf`: `inquiries` und `inquiry_notifications` liegen getrennt; Notification-Datensätze referenzieren Inquiry per `FOREIGN KEY ... ON DELETE RESTRICT`. Löschung zuerst aus `inquiry_notifications`, dann aus `inquiries` ist als technische Abhängigkeit zu berücksichtigen. Ein bestehender Migrationstest `scripts/test-inquiry-migrations.mjs` prüft das explizite FK-Blockieren.
- Aktueller produktionsnaher Code hat Datenminimierung und Access-geschützte Summary-/Detailtrennung; der Adminpfad kann Benachrichtigungsstatus lesen und `POST /api/admin/inquiries/:id/notify` autorisiert erneut anstoßen. Ein **automatischer Retention-Purge** oder exakte Postfach-/Export-/Backup-Löschung sind **nicht nachgewiesen**.
- Erst die Betreiberantwort F4–F6 der zentralen Vorlage `docs/business-legal-ground-truth.md` macht die konkrete Frist, Status- und Löschregeln bestimmbar. Danach den kleinsten belegbaren technischen Enforcementpfad samt negativen Fällen und tatsächlicher Betriebsprüfung umsetzen; `src/release/inquiry-data-policy.json` behält vorerst `blocked_external` und `retentionDays:null`.

### Frische lokale technische Prüfungen 03.11.2026

- `scripts/test-admin-data-minimization.mjs` PASS (`summary_pii=false`, `detail_auth=true`, `unauthorized_db_queries=0`).
- `scripts/test-admin-page-security.mjs` PASS (`unsafe_inline=false`, `nonce_bound=true`, `detail_on_demand=true`).
- `scripts/test-inquiry-migrations.mjs` PASS gegen **lokales** Wrangler-D1, migrationsgebundene FK-`RESTRICT/NO_ACTION`-Invarianten; Job `grabowski-job-b07fc1ddda9a`, Abschlussreceipt `50c91debce0acaf61703be7e7cd0bec1d2f8b89d4da0efc94e6373623d7643ca`. Diese Prüfungen belegen **keine** Löschpolicy oder Remote-D1-Verifikation; T049 bleibt `blocked_external`.

## Technische Löschvorbereitung nach PR #120 — 04.11.2026

- **Keine Policy- oder Produktiv-Löschung:** F4–F6 in `docs/business-legal-ground-truth.md` bleiben ohne Betreiberbeleg, und `src/release/inquiry-data-policy.json` bleibt `blocked_external` mit `retentionDays:null` und `deletionMode:null`. T049 bleibt `blocked_external`.
- **Positive FK-Reihenfolge nun regressionstestbar:** `scripts/test-inquiry-migrations.mjs` prüft neben der bestehenden verbotenen Parent-First-Löschung mit ausschließlich synthetischen Daten die erlaubte Reihenfolge: abhängigen Notification-Datensatz entfernen, Inquiry-Datensatz entfernen, beide Tabellen leer für die ID, `PRAGMA foreign_key_check` leer. Kein neuer Tabellendienst, keine Migration, kein automatischer Purge, keine echten Anfragedaten.
- **Gezielter Readback:** Node `v22.23.4`, `node scripts/test-inquiry-migrations.mjs` gegen lokales Wrangler-D1: `inquiry-migrations-ok status_check=true created_at_desc=true notification_fk=RESTRICT/NO_ACTION child_first_delete=true`, Prozess erfolgreich beendet; Grabowski-Job `grabowski-job-62e7c54f1e6d` (04.11.2026).
- **Kanonischer Volltest:** Node 22.23.4 mit dem bereits installierten Chromium 156.0.8078.47, `npm run verify`: **23 PASS / 0 FAIL / 0 BLOCKED**, terminaler Grabowski-Job `grabowski-job-6202ad7fce88`. Ein vorheriger lokaler Verify ohne konfigurierten Browserpfad hatte ausschließlich `visual-regression` FAIL (`22 PASS / 1 FAIL`); der erneute vollständige Lauf mit explizitem `BROWSER_EXECUTABLE` ist vollständig erfolgreich. Kein Produktiv-Worker-/Provider-Nachweis.
- **Offen bis F4–F6:** freigegebene Retention/Status-Lifecycle-Regeln, sichere und beweisbare produktive Ausführung, berechtigte Ausnahmen sowie Löschung/regelkonforme Aufbewahrung im Betreiberpostfach, bei Exporten und in Backups. Dieser Test beweist ausschließlich die FK-Operationsreihenfolge, nicht die spätere Löschentscheidung oder deren Enforcement.
