---
id: T054
status: done
priority: P1
dependencies: [T012]
---
# Security-Dependency-Konvergenz nach Gesamt-Audit

## Diagnose

Der Gesamt-Audit von `main@34b0997a82030c1bf02344d6fd4c37ff0cccdc59` zeigte fünf als HIGH gemeldete installierte Dependency-Knoten, während der kanonische `npm run verify` vollständig grün blieb. Die Befunde lagen in `fast-uri`, `svgo` sowie dem über `wrangler`/`miniflare` eingebrachten `sharp`-Pfad.

Die offenen Dependabot-PRs #45–#48 basieren auf dem älteren Base-Commit `520c95006e621c33793ed1e2dcf711312923cc46`; ihre grünen Checks vom 06.09.2026 sind deshalb keine aktuelle Merge-Evidenz nach den späteren PRs #42/#44. Insbesondere hebt #46 Wrangler nur auf 4.128.0 an und terminalisiert den aktuellen Auditbefund nicht.

## Ziel

Den kleinsten nachweislich ausreichenden Security-Slice integrieren, ohne unabhängige Framework-/Produktänderungen mitzuziehen.

## Scope

- `wrangler` direkt auf `4.131.1` pinnen.
- Transitive Lockfile-Auflösung für `fast-uri` und `svgo` auf nicht verwundbare kompatible Stände aktualisieren.
- `astro` bleibt in diesem Slice auf `7.2.9`.
- `zod` bleibt in diesem Slice auf `4.4.3`.
- Keine Produkt-, DNS-, Cloudflare- oder Produktionsressourcen ändern.
- Dependabot #47/#48 bleiben unabhängige Wartungsupdates; #45 wird separat frisch gegen `main` geprüft.

## Akzeptanz

- [x] `npm audit --json` meldet 0 Vulnerabilities auf dem geprüften T054-Baum.
- [x] `npm ci` ist reproduzierbar erfolgreich.
- [x] `npm run verify` endet mit 23 PASS / 0 FAIL / 0 BLOCKED.
- [x] Worker- und Site-Dry-Run laufen innerhalb des kanonischen Verify mit Wrangler 4.131.1 erfolgreich.
- [x] Direkte Astro-/Zod-Versionen bleiben unverändert.
- [x] Die Implementierung ist gegen `main@34b0997a82030c1bf02344d6fd4c37ff0cccdc59` gebunden; der veröffentlichte PR muss zusätzlich den strikten aktuellen GitHub-Check gegen seinen exakten Head bestehen. Alte Dependabot-Checks werden nicht wiederverwendet.

## Vorvalidierung

Ein isolierter, wegwerfbarer Export des exakten Ausgangs-Heads wurde am 12.09.2026 mit genau diesem Dependency-Slice geprüft: `npm audit` 0 Vulnerabilities, `npm ci` PASS und `npm run verify` 23/23 PASS. Diese Vorvalidierung ersetzt nicht die exakte Prüfung des tatsächlichen T054-Heads.

## Exakte lokale Abschluss-Evidenz

- Task `c9e9a50469ce41019a201783`: `npm audit --json` = 0 Vulnerabilities; `npm ci` = PASS; `npm run verify` = 23 PASS / 0 FAIL / 0 BLOCKED.
- Wrangler-Dry-Runs liefen mit `4.131.1`; `fast-uri` ist `3.1.7`, `svgo` `4.1.0`; direkte `astro`-/`zod`-Pins blieben `7.2.9` bzw. `4.4.3`.
- GitHub-PR-/CI-Evidenz ist ein separates Merge-Gate und wird nicht durch ältere Dependabot-Läufe ersetzt.

## Neue Advisory-Welle und kontrollierte Patchkonvergenz — 04.11.2026

Die bisherige T054-Abnahme auf Astro `7.2.9`, Zod `4.4.3`, Wrangler `4.131.1` bleibt eine **historisch richtige Evidenz**, aber keine Garantie gegen nachträglich veröffentlichte Advisories. Die 42 offenen GitHub-Dependabot-Meldungen enthalten Duplikate über `package.json`/`package-lock.json` und teils überholte Lockstände: beispielsweise ist eine als kritisch gemeldete Astro-AVIF-Schwäche auf `<7.2.8` begrenzt, während der aktuelle Ausgangsbaum bereits Astro `7.2.9` samt Sharp `0.35.4` installierte. Diese Meldung darf nicht als noch laufender bestätigter RCE im Ausgangsstand behandelt werden.

**Frischer, reproduzierbarer Ist-Befund** auf `main@eb780cdac96d478c6617a48f42a60c2ce21f4abb`: `npm audit --json` meldete **11** offene, im installierten Lockfile wirksame Advisories (**8 high, 3 moderate, 0 critical**). Mit `--omit=dev` waren es 8 (6 high, 2 moderate). Vorwiegend betroffen waren Astro, Zod und indirekte Build-/Worker-Tooling-Pakete. Die alten Dependabot-PRs #91 (Astro 7.4.2) und #92 (Wrangler 4.151.3) sind aufgrund alter Head-Checks und mittlerweile jüngerer nötiger Patchstände keine ausreichenden aktuellen Abnahmen.

**Minimale, bewusst gemeinsam geprüfte Aktualisierung** im eigenen sauberen T054-Worktree: direkte semver-kompatible exakte Pins `astro 7.2.9→7.4.5`, `zod 4.4.3→4.6.7`, `wrangler 4.131.1→4.157.0`; ausschließlich `package.json` und `package-lock.json` ändern sich dadurch. Transitiver Lockbaum umfasst beispielsweise `sharp 0.35.5`, `vite 8.3.5`, `devalue 6.0.3`, `source-map-js 1.2.2`, `fast-uri 3.1.9`, `undici 7.30.1`. Keine Änderung an Freigaben, Site- oder Worker-Code, DNS, Kundenangaben oder Anfrageversand.

**Frische Prüfbelege:** `npm audit fix --package-lock-only` schloss den letzten indirekten `fast-uri`-Befund ohne Änderung der direkten Specs (Job `grabowski-job-46fadd914ec3`). Reproduzierbares `npm ci` mit Node `22.23.4`: PASS (Job `grabowski-job-fd175e129166`). Nach Neuinstallation `npm audit --json`: **0 Vulnerabilities** über den ganzen installierten Dependency-Baum (Job `grabowski-job-35511e42cd19`). Kanonisches `npm run verify` unter Node 22 und installiertem Chromium 156.0.8078.47: **23 PASS / 0 FAIL / 0 BLOCKED**, einschließlich Visualregression, Release-Gates, Worker-/Site-Dry-Run (Job `grabowski-job-82c128ec2498`).

**Noch getrennt zu prüfen:** PR-CI exakt auf neuem Head, geschützter Merge, GitHub-Pages-Receipt und öffentlicher Browser-Kundenweg nach Merge. Das ist ein Sicherheits- und Kompatibilitätsnachweis, **keine** Rechts-/Betreiberfreigabe F1–F12, keine authentifizierte Cloudflare-Worker-Revision und keine berechtigte echte Anfrage. Stage 1 bleibt `draft`, `noindex` und sendefrei.

## Publikationsblockade nach bestandenem Audit-/Verify-Gate — 04.11.2026

- Der **lokal commitierte** Update-Kandidat `93fadfb7de7225d2b6ac279e2bdc2ae28ce7f087` auf `fix/t054-current-audit-convergence-20261104` ist mit `npm audit = 0`, `npm ci = PASS` und `npm run verify = 23/23 PASS` geprüft. Der veröffentlichte GitHub-`main` bleibt zum Prüfzeitpunkt `eb780cdac96d478c6617a48f42a60c2ce21f4abb`; der neue Branch ist **noch nicht remote** und nicht produktiv ausgerollt.
- Der geschützte Grabowski-`branch-publish`-Grip scheiterte bei ausschließlich diesem GitHub-SSH-Push mit `Permission denied (publickey)`. Die anschließende **read-only**-Diagnose zeigte: der gehärtete GitHub-Writer-Transport bietet den vorhandenen, unverändert privaten, dedizierten `heimgewebe-github-ed25519`-Schlüssel explizit an, GitHub weist dessen öffentliche Identität jedoch zurück. Eine zweite vorhandene Benutzeridentität wird aktuell ebenfalls zurückgewiesen. Das ist kein fehlender SSH-Agent: Der gehärtete Transport setzt `IdentityAgent=none`.
- GitHub-CLI-API-Zugriff mit bereits vorhandenem `repo`-Token funktioniert weiterhin, aber das Token besitzt kein `admin:public_key` zur autoritativen Einsicht/Registrierung der Account-Schlüssel; GitHub meldet hierfür `HTTP 404` mit Hinweis auf zusätzlichen OAuth-Scope. Das Repository verfügt derzeit über **0** hinterlegte Deploy Keys. Aus diesen Tatsachen ist die **Ursache der GitHub-seitigen Key-Ablehnung unbekannt**, nicht automatisch ein widerrufenes Benutzerkonto.
- **Kein alternativer, ungeschützter Git-Transport oder GitHub-Kontenschlüsselwechsel** wurde durchgeführt. Nächster legitimer Schritt: bestehenden autorisierten GitHub-SSH-Writer-Zugang wiederherstellen, danach denselben geprüften Branch per normalem CAS-`branch-publish` veröffentlichen, PR/CI/Review/Captain-Merge und öffentlichen Stage-1-Readback frisch prüfen. Die ausstehenden Betreiberfreigaben F1–F12 werden davon nicht ersetzt.

## Entblockung der GitHub-Veröffentlichung — 04.11.2026

Die zuvor beobachtete SSH-Key-Ablehnung war **vorübergehend**: Ein frischer Verbindungsreadback des unveränderten, gehärteten GitHub-Writer-Transports bestätigte jetzt `Server accepts key` und `Authenticated to github.com`. Es war weder eine Änderung an Schlüsseln, Secrets, `ssh-agent` noch an der Repo-Policy nötig. Danach veröffentlichte Grabowskis regulärer CAS-`branch-publish` den bereits lokal geprüften T054-Commit `7a7eb5dfc2db480b621fbfbf6e119ce646e09792` auf `origin/fix/t054-current-audit-convergence-20261104` mit exaktem Remote-HEAD-Readback. Die frühere oben dokumentierte Publikationsblockade ist damit **aufgehoben**. Merge, frische PR-CI und nachfolgende öffentliche Abnahme bleiben separat revisionsgebunden nachzuweisen.

## Cloudflare Workers Preview-Konfiguration für aktualisiertes Wrangler — 04.11.2026

- Der GitHub-PR **#123** auf `e87835760acb5b67b1322e8ee4a9fc9651f06e51` meldete `verify: SUCCESS` und Vercel-Vorschau `SUCCESS`, aber `Workers Builds: hall-of-memory: FAILURE` (Cloudflare-Build `20b7ff60-4c21-4a00-b215-77ec39bf2b04`). Das ist ein **echtes blockierendes Provider-Signal**, auch wenn der lokale Node-22-Check 23/23 und `npm run build` erfolgreich sind. Ein Cloudflare-Build-Check belegt weder dessen Fehlerursache noch die aktive Produktions-Worker-Revision.
- Cloudflare dokumentiert für neue Worker-Preview-Deployments ab Wrangler `4.135.0` die Pflicht zu einem `previews`-Konfigurationsblock; Builds benutzen auf Nicht-Produktionsbranches normalerweise `npx wrangler preview` (siehe `https://developers.cloudflare.com/workers/previews/get-started/` und `https://developers.cloudflare.com/workers/ci-cd/builds/configuration/`). Die vorhandene Site-`wrangler.jsonc` enthielt ausschließlich `name`, `compatibility_date` und `assets.directory`; der neue Wrangler-Pin ist `4.157.0`. Auch der unabhängige Wrangler-Dependabot-PR #92 meldete Cloudflare-Vorschau `FAILURE`, während ein isolierter Zod-PR #87 `SUCCESS` meldete. Diese Gegenproben sind ein **starker, aber ohne Providerlog nicht abschließend bewiesener** Hinweis auf den fehlenden Preview-Block.
- Kleinster kompatibler Quellfix: `"previews": {}` ergänzen, mit unveränderten `name=hall-of-memory`, `assets.directory=./dist` und allen geschützten Freigaben. `scripts/test-production-readiness.mjs` prüft diese drei Kontrakte nun ausdrücklich. Damit wird kein produktiver Inquiry-Worker, keine D1-Bindung und keine Rechts-/Betreiberfreigabe verändert.
- **Entscheidender Gegenbeleg steht noch aus:** nach Veröffentlichung den **Cloudflare-Build des exakt aktualisierten PR-Heads** erneut lesen. Erst bei erfolgreichem Provider-Build, frischer Required-CI und signiertem Review ist der reguläre Captain-Merge zulässig; die reale Produktionsroute ist danach erneut im Browser abzunehmen.

## Provider-Readback nach fehlgeschlagenem Preview-Fix — 04.11.2026

- **Exakter GitHub-Zustand:** PR #123 bleibt OPEN, Basis main@eb780cdac96d478c6617a48f42a60c2ce21f4abb, Head e4b5b3b857f8d9d426f17586085505adde10ca90. Der T054-Worktree war bei diesem Readback sauber, ohne laufende fremde T054-Lease; der unabhängige Dependabot-Review besitzt einen eigenen Branch.
- **Cloudflare auf diesem Head:** Workers Builds: hall-of-memory = FAILURE; Build 731c0148-06f5-47e4-bf45-0ee05b905848 (04.11.2026, 13:08 UTC). Der zuvor hinzugefügte previews-Block hat den externen Fehler **nicht** beseitigt. Derselbe Head meldet GitHub verify = SUCCESS, pages-runtime = SKIPPED (auf Pull Requests erwartbar) und Vercel Preview = SUCCESS. Die GitHub-Check-API enthält für den Cloudflare-Fehler null Annotations und nur die Dashboard-Build-ID, keinen Fehlertext.
- **Frische Gegenproben:** Cloudflare-Previews von #122 (08:51 UTC) und Zod-only #87 (11:31 UTC) erfolgreich; Wrangler-only #92 (11:34 UTC) und Astro #91 (11:32 UTC) fehlgeschlagen. Ein allgemeiner Ausfall aller Previews ist damit unwahrscheinlich, aber eine konkrete Ursache oder Fehlerphase noch **nicht** belegt.
- **Authentifizierung/Node:** Im echten T054-Checkout meldet Wrangler 4.157.0 über npx wrangler whoami weiterhin *You are not authenticated*. Die verlinkte Cloudflare-Dashboard-Buildseite liefert ohne authentifizierte Sitzung keine Logs. Die vorhandene .nvmrc pinnt Node 22.23.2; Cloudflare dokumentiert standardmäßig Node 24 mit Vorrang für Versionsdateien. Die tatsächlich verwendete Provider-Node-Version ist nicht belegt. Keine neue Konfigurationsänderung auf Vermutung.
- **Nächster tatsächlicher Blocker:** Mit autorisiertem **read-only Cloudflare Workers Build-History-/Build-Log-Zugang** für hall-of-memory den exakten Build lesen und den ersten tatsächlichen Fehler nach Phase (Installation, Node, Astro, Assets, Preview-API, Token/Konto) eingrenzen. Erst darauf basierend einen minimalen Fix mit neuer Provider-CI prüfen. Bis dahin PR nicht mergen, keine produktive Anfrage aktivieren. Stage 1, draft und sendefreie Vorschau bleiben unverändert.

## Lokale Workers-CI-Build-Reproduktion — 04.11.2026

Auf exakt PR-Head 5741c3e926981c840b14a56c58890685fc05b956 ohne Source- oder Konfigurationsänderung wurde im exklusiv geleasten T054-Checkout unter Node 22.23.4 mit CI=true, WORKERS_CI=1 und WORKERS_CI_BRANCH=fix/t054-current-audit-convergence-20261104 getestet:

- **Build-Pfad** (Job grabowski-job-6435cd4c9de7): `npm run build` = PASS. Die Production-Readiness wird korrekt übersprungen, da launchStatus=draft; Astro 7.4.5 erstellt 23 statische Seiten in dist. Keine Build-Fehler, nur vorhandene Gallery-/Extras-Empty-Warnungen.
- **Site-Bundle** (Job grabowski-job-016b12f2fc6e): `npm run dry-run:site` unter denselben CI-/Workers-Variablen = PASS mit Wrangler 4.157.0; 88 Dateien aus dist gelesen; keine Bindings; Dry-Run korrekt beendet. Keine Cloudflare-API-Mutation.
- **Grenze:** Das sind echte lokale CLI- und Buildprüfungen mit Cloudflare-typischen Systemvariablen, keine vollständige Reproduktion der unbekannten Provider-Buildumgebung. Sie sprechen gegen einen stets auftretenden Fehler im Buildscript oder lokalen Wrangler-Paketieren; sie können eine abweichende Cloudflare-Installation, Provider-Node-Version, Build-Einstellung, Token/Berechtigung oder den authentifizierten Preview-API-Schritt nicht ausschließen.
- **Externer Status:** Der am 03.11.2026 von Cloudflare bestätigte allgemeine Workers-Builds-Vorfall war laut Provider-Status bereits um 19:38 UTC aufgelöst. Die reproduzierten PR-#123-Providerfehler am 04.11.2026 sind später; eine Ursache durch diese historische Störung ist nicht belegt (https://www.cloudflarestatus.com/history?service=Workers).
- Für den entscheidenden Provider-Build-Log-Readback fehlt weiterhin der autorisierte Cloudflare-Account-Zugriff; ohne Fehlertext keinen weiteren Versions-/Konfigurationsfix und keinen geschützten Merge erzwingen.

## Providerdiagnose: Legacy-Preview-/Token-Schnittstelle — 04.11.2026

- **Frischer Ist-Stand nach weiteren GitHub-Actions-Merges:** main@3550f83d46c4735a7e495865906439c84c03e928 ist inzwischen zehn Commits vor der ursprünglichen PR-#123-Basis eb780cda; die dazwischenliegenden Quelländerungen betreffen nur `.github/workflows/verify.yml`. PR #123 selbst bleibt auf Head `a7af7fefa0bf091996a80fa2329f541e1923d8f2` OPEN, GitHub verify SUCCESS, Cloudflare Build `25618d28-b52a-49db-9f97-8d1bf7e23afd` FAILURE. Vor späterem Merge muss die aktuelle Base-Bindung neu geprüft und, falls notwendig, regulär konvergiert werden; Cloudflare-Blocker nicht wegmergen.
- **Provider-Primärquellen, Stand 04.11.2026:** Workers Builds führt auf nichtproduktiven Branches den konfigurierten *Preview-Befehl* aus (standardmäßig `npx wrangler preview`), der anders als `wrangler deploy --dry-run` einen authentifizierten Account-/Preview-API-Aufruf braucht. Cloudflare dokumentiert die einmalige Migration *bestehender* Builds-Worker auf Worker Previews unter https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/; sie ist nicht durch das bloße Hinzufügen eines leeren `previews`-Blocks nachweislich erfolgt.
- **Zwei konkrete noch zu unterscheidende Provider-Fälle, keine MEMORA-Diagnose:** Cloudflare-Bug https://github.com/cloudflare/developer-platform/issues/84 beschreibt einen veralteten Preview-Build-Token trotz neuem Token in Previews Base und Fehler 10000/9109 *nach erfolgreichem lokalen Build*. Cloudflare-Bug https://github.com/cloudflare/developer-platform/issues/75 dokumentiert unerwartete per-Branch-Preview-Triggers und falsche Root-/Path-Bindung. Beides passt als Untersuchungskandidat zum Unterschied von GitHub Verify und Cloudflare Workers Build, ist aber für MEMORA ohne konkreten Buildlog **nicht bewiesen**.
- **Negativabgleich:** Der aus https://github.com/cloudflare/workers-sdk/issues/15791 bekannte `_headers`-Fehler verlangt einen *echten Worker-main-Script* zusammen mit `_headers`; bei MEMORA hat die Site-`wrangler.jsonc` lediglich `assets.directory=./dist`, kein `main`. Den öffentlichen Bug daher nicht als fertige Ursache behandeln. Vorhandene `.nvmrc=22.23.2` wird laut https://developers.cloudflare.com/changelog/post/2026-10-14-workers-builds-default-tooling/ grundsätzlich von Workers Builds für Node-Versionwahl berücksichtigt. Keine `NODE_VERSION`-/`packageManager`-Änderung ohne Installations-/Node-Fehler im Providerlog.
- **Konkreter Betreiber-Readback in minimaler Reihenfolge:** (1) fehlgeschlagenen Build `25618d28-b52a-49db-9f97-8d1bf7e23afd` samt ersten Fehlerzeilen/Phase öffnen; (2) *genau dessen* Build-Trigger, Build-/Deploy-/Preview-Befehl, Root-Verzeichnis, verwendete Node-/npm-Version sowie Build-Token-Identität (nur ID/Alter/Scopes, niemals Wert) mit dem erfolgreichen Zod-Preview-Build `c4178205-0b98-48d6-84ad-16cbad5aac8b` vergleichen; (3) auf Abweichung gezielt reagieren. Die Builds-API verlangt gemäß https://developers.cloudflare.com/workers/ci-cd/builds/api-reference/ einen **user-scoped** API-Token; für die dort dokumentierten Build-Konfigurationsoperationen sind `Workers Builds Configuration: Edit` und zum Ermitteln des Worker-Tags `Workers Scripts: Read` angegeben. Nicht ungeprüft einen account-scoped Token nutzen oder diese Edit-Berechtigung als zwangsläufig für reines Dashboard-Lesen behaupten.
- **Betriebsgrenze:** Preview-Build-Checks nicht deaktivieren und keine Statuschecks umgehen, nur um ein grünes Signal zu erhalten. `launchStatus=draft`, `noindex`, sendefreier Konfigurator und F1–F12 bleiben unverändert. Neuer Betreiber-Logbefund ist die einzige belegpflichtige Grundlage für gezielten Code- oder Providerfix.

## Nach Zod-Integration: minimale T054-Lockfile-Konfliktbereinigung — 04.11.2026

- **Neue Git-Wahrheit:** Zod-PR #87 ist in `main@d1d9eddfad2d2a032e68ac8ffdeb2dc3840c8482` gemergt. Dieser GitHub-Mergecommit besitzt exakt denselben Tree `63d5e066fc9d22c3553e7d9fe157ca3352522302` wie der lokal durch den geschützten PR87-CAS-Mechanismus importierte Commit `922a8b30bdb945b2f2784463ca65671ae7cbb949`. PR #123 (vor dieser Korrektur Head `5c545f72a5174370ab518c7ea043158ed6b1c27e`) ist aufgrund eines echten package-lock.json-Mergekonflikts gegen den neuen Main-Tree nicht mergebar.
- **Exakte Ursache des Lock-Konflikts:** Der Drei-Wege-Git-`merge-tree` zeigt nur `package-lock.json` als unaufgelöst. Zod wurde in beiden Zweigen identisch auf 4.6.7 aktualisiert. Die zwei tatsächlichen Konflikthunks betreffen lediglich `node_modules/@img/sharp-freebsd-wasm32` und `node_modules/@img/sharp-wasm32`: T054 bringt jeweils `0.35.5` samt `dev: true`, der Zod-Branch entfernt dieselbe Dev-Markierung bei noch alten 0.35.4-Versionen. `package.json` und GitHub-Actions-Pins sind im lokalen Drei-Wege-Merge automatisch kompatibel.
- **Minimaler vorbereiteter Fix im exklusiven T054-Checkout:** Nur bei diesen zwei optionalen Sharp-Paketen je eine redundante `dev: true`-Lockfile-Metadatenzeile entfernt; Versionen, Registry-URLs, Integrities, direkte Pins, Quellcode und Veröffentlichungsgates unverändert. Eine erste uncommittete Rekonstruktion mit verlorenen Zeilenumbrüchen wurde per Grabowski-Quarantäne-CAS vollständig zurückgerollt; die korrigierte Fassung weist `git diff --check = PASS` und **exakt zwei entfernte Zeilen** nach.
- **Frische Regressionen für diese exakte Änderung:** Node 22.23.4 `npm ci --no-audit --no-fund` PASS, 304 Pakete (Grabowski-Job `a7946d469346`); `npm audit --json` **0 vulnerabilities** (Job `403cd7ff6bd9`); `npm run verify` mit Chromium 156 **23 PASS / 0 FAIL / 0 BLOCKED** (Job `6cd4ba4adfb7`). Noch **nicht** gleichbedeutend mit einer erfolgreichen geschützten PR-Base-Konvergenz oder einem erfolgreichen Cloudflare-Provider-Build.
- **Weiterer Gate-Pfad:** T054-Änderung in genau diesem Branch über reguläres CAS committen und publizieren, danach die jetzt notwendige Base-Konvergenz auf den tatsächlich aktuellen `main` versuchen. Cloudflare Preview bleibt ein eigenes externes Fehlersignal und darf durch diesen Lockfix oder einen lokalen Dry-Run nicht grün interpretiert werden. Kein produktiver Anfrage-Submit, keine Freigabe F1–F12 verändert.
