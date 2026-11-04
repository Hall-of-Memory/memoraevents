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
