---
id: T070
status: active
priority: P1
dependencies: [T061, T064]
---
# Aktive Altmarke Hall of Memory aus MEMORA EVENT entfernen

## Kundenauftrag und Live-Befund (01.11.2026)

Der sichtbare Markenname ist laut T064 MEMORA EVENT; die kanonische Domain lautet memoraevents.de. Bei einem HTTP-Crawl waren Titel, OG-Metadaten und sichtbare Texte auf Startseite, Preisen, Produktseiten, Impressum und Datenschutz bereits korrekt. Noch aktiv: alter Hero-Dateiname und interne Site-ID. Zusätzlich veraltete aktuelle Arbeits-/Verify-Bezeichnungen. hallofmemory.de liefert die neue Website noch unter dem alten Hostnamen; www.hallofmemory.de meldete TLS 525.

## Umsetzung

- Aktive Hero-Bilddatei ohne Pixeländerung auf memora-event-example-event.webp migrieren, Referenzen und Tests anpassen.
- Interne Site-ID, aktuelle Einstiegs-/Entwicklerdokumentation und Verify-Ausgabe umstellen.
- npm ci + npm run verify, gezielte Asset-/Browser-Prüfung, PR und revisionsgebundener Produktions-Readback.
- Legacy-Domain nach frischem Cloudflare-DNS-/Redirect-/TLS-Readback auf memoraevents.de umleiten. Kein unkontrollierter DNS-, Worker- oder Secret-Eingriff.

## Bewusst unverändert

GitHub-Org Hall-of-Memory, bestehender Cloudflare-Worker hall-of-memory, Pages-Receipt-Pfad und Base-Path-Testfixtures, fundusgebundene Dateinamen/Hashes sowie historische Aufgaben, Quellen und Designer-Assets sind stabile technische Identitäten beziehungsweise historische Evidenz. Keine blind-globale Ersetzung. Freigaben, noindex und Anfrage-Gates bleiben erhalten.

## Akzeptanz / Journal

- Besucherseiten ausschließlich mit MEMORA EVENT in Titel und sichtbaren Texten; aktives Hero-Asset und Site-ID ohne Altmarke.
- Alle betroffenen Tests sowie der kanonische Verify erfolgreich.
- Integration und tatsächlicher Readback an memoraevents.de belegt, sonst Status offen.
- Legacy-Redirect erst nach Provider- und HTTP-/TLS-Nachweis; sonst verbleibender Blocker dokumentieren.
- 01.11.2026: Ausgangs-main 8441a32bfb73380ba87898309e5d201fdf82ca36, separater T070-Writer-Branch.

## Prüfung 01.11.2026

- Bildrename byteidentisch: SHA-256 528fbcd86c497faf759ac54316b360931ed2e2569c1a143ceac8629021a58e23. Keine Medienänderung.
- Erste npm-ci/verify-Prüfung unter Node 24: 20 PASS, 3 FAIL; Demo-Regex war noch auf Legacy-Dateipfad festgelegt und wurde korrigiert.
- Zweite npm-ci/verify-Prüfung unter Node 22.23.4 und explizitem Chrome 156: 21 PASS, 2 FAIL. Demo-, Quality-, Build-, Preview-Base-, Pages-, Domain-, Release-Safety- und Astro-Gates PASS.
- Verbleibende lokale Fehler ohne Zusammenhang zum T070-Branding: Inquiry-Spike liefert human-verification-unavailable statt received; Visual CDP-Timeout bei Page.navigate. Code für diese Fremdfehler nicht verändert. GitHub-CI als unabhängige Zielumgebung noch ausstehend.
- Cloudflare-Provider-CLI (Wrangler whoami) ist nicht authentifiziert. Legacy-Host und dessen www-TLS können daher noch nicht autorisiert umgestellt werden. Nur tatsächlicher HTTP-Readback dokumentiert.
- Nach PR #98 verblieb eine eigenständige **Konsolen**-Überschrift `HALL OF MEMORY VERIFY SUMMARY` in `renderConsoleSummary`; der Markdown-Bericht war bereits auf MEMORA EVENT. Diese konkrete Ausgabe wird im isolierten T070-Nachtrag auf `MEMORA EVENT VERIFY SUMMARY` geändert und positiv/negativ regressionsgetestet. `npm ci` und `npm run test:verification-runner` unter Node 22.23.4 PASS; Frischer lokaler `npm run verify` auf dem korrigierten Worktree: **21 PASS / 2 FAIL** (`inquiry-spike`, `visual-regression`, identisch zu den bereits dokumentierten fremden Lokalfehlern); Konsolen-Überschrift und Runner-Regression PASS. Hauptbranch-/Produktivnachweis erst nach GitHub-Verify und Merge.


## Eingrenzung auf den zuerst lieferbaren Besucherpfad — 01.11.2026

Die erste T070-Fassung bündelte 19 Dateien einschließlich AGENTS.md und Deployment-Runbook; der echte Review-Gate-Readback klassifizierte das als high_critical (viele Dateien und Policy-/Deployment-Pfade). Der vorliegende PR #96 wurde deshalb auf den wirksamen öffentlichen Website-Slice eingegrenzt: Hero-Dateipfad (bytegleich), interne Site-ID, unveränderte Markenanzeige und passende Tests sowie diese Projektaufgabe. Das ist eine echte Scope-Reduktion, keine Änderung der Review-Regeln. Bereits erstellte Änderungen an Einstiegs-/Entwicklerdokumentation und Verify-Loglabels sind für eine getrennte dokumentationsspezifische Nachlieferung vorgesehen; diese Inhalte gelten nicht als bereits in main erledigt. Historische Asset-IDs, Cloudflare-Worker und GitHub-Org bleiben absichtlich unangetastet. Legacy-Domain-Weiterleitung bleibt ohne Provider-Readback separat offen.

## Integration / Produktionsgrenze — 01.11.2026

- PR #96 zu Commit e76b2a7d385d273ebf9ac555290b8c496d82adb3 eröffnet: https://github.com/Hall-of-Memory/memoraevents/pull/96
- GitHub Verify SUCCESS, Workflow-Run 41308719281; Cloudflare Workers Builds und Vercel Preview SUCCESS. Der lokale Inquiry-Spike und CDP-Navigations-Timeout waren nicht reproduzierbar als GitHub-CI-Fehler.
- Branchschutz auf main: required check verify, strict, Admin-Enforcement, keine verpflichtenden Fremdreviews. Der direkte Merge über Grabowski wurde ausdrücklich mit direct_pr_merge blockiert: Captain pr-merge ist der vorgeschriebene Pfad. Keine Umgehung des kontrollierten Mergepfads.
- Der vorgesehene Captain-Pfad ist inzwischen über das installierte Grabowski-Grip verfügbar. Nach risikoskaliertem Selbstreview (zwei unterschiedliche Prüfachsen, Gate PASS), grüner GitHub-CI und korrektem terminalem Work-Lane-Closeout wurde PR #96 revisionsgebunden in main gemergt (2980ce00b3b243b5503be863ef0bb2bc788a64d6). Live-Readback: memoraevents.de/demo/ nutzt das neue Bild, der alte aktiv eingebundene Bildpfad fehlt und das neue Asset liefert 200. GitHub Pages wird separat über main-CI gespiegelt.
- Legacy-Redirect hallofmemory.de -> memoraevents.de und www-TLS-Fehler bleiben mangels authentifiziertem Cloudflare-Providerzugriff offen.

## Nachtrag: aktuelle Dokumentation

- Der separate Dokumentations-PR übernimmt aus der zuvor umfangreichen T070-Fassung nur aktuelle Projekt- und Betriebsdokumente. Historische Quellennamen, gebundene Asset-Dateinamen, Cloudflare-Worker und GitHub-Org bleiben weiterhin unverändert.
- Der Domain-Altredirect und www-TLS bleiben bis zum authentifizierten Cloudflare-Provider-Readback offen; ein Frontend-Commit allein kann diese Providerregeln nicht wirksam setzen.


## Nachprüfung und restliche aktive Anzeigen — 01.11.2026

- PR #97 ist in `main` gemergt: `92248dc19733b1c50fd69aee13d37e6b6173b1ec`. GitHub-Verify und Pages-Runtime auf genau diesem Commit sind PASS; die öffentliche Pages-Receipt bestätigt den Commit. Cloudflare `memoraevents.de/demo/` liefert den neuen Bildpfad und `MEMORA EVENT`.
- Verbleibender aktiver interner Text: Verify-Summary `Hall of Memory Verify` und Kommentar in `.env.example`. Beides wird im eigenen PR samt Regression korrigiert, ohne technische Worker-/Org-/Asset-IDs umzubenennen.
- Die alten Domains `hallofmemory.de` (weiterhin HTTP 200 auf alter Hostadresse) und `www.hallofmemory.de` (TLS/HTTP 525) benötigen Provider- und TLS-Konfiguration; eine globale Static-Assets-`_redirects`-Regel auf der primären Domain wäre die falsche Ursache und würde deren korrekte Auslieferung beeinträchtigen.
- `AGENTS.md` und `docs/deployment-handover.md` enthalten jeweils noch eine alte Markenformulierung. Beide betroffenen Dateien liegen in einer höher eingestuften Reviewklasse und werden nicht als in diesem PR bereits behoben ausgegeben.


## Dokumentations-Restkorrektur — 01.11.2026

- PR #98 (nur Verify-Bericht, Regressionstest, `.env.example` und dieses Journal) wurde mit grünem Verify und revisionsgebundener Selbstreview über Captain in main gemergt: `910db5580894a3411e6835447269fd8d116b565d`.
- Im getrennten Folge-PR wird die lediglich sprachliche Altmarke in `AGENTS.md` und `docs/deployment-handover.md` korrigiert. GitHub-Org, Workername, DNS-/Asset-IDs, Zoneninformationen und Stage-2-Launch-Gates bleiben unverändert.
- Öffentliche DNS-Readbacks von 01.11.2026 zeigen für `hallofmemory.de` ebenfalls Cloudflare-Nameserver `quentin.ns.cloudflare.com` und `tia.ns.cloudflare.com`; Apex und www lösen Cloudflare-Anycast-Adressen auf. Der lokale Wrangler ist dennoch nicht authentifiziert, und es existiert kein nachgewiesener Schreibzugriff auf die Legacy-Zone. Daher keine erfundene Redirect-/TLS-Provideränderung; `hallofmemory.de` und `www.hallofmemory.de` müssen nach realem Provider-Write nochmals extern abgenommen werden.


## Provider-spezifische Restmaßnahme: alte Domain (noch nicht ausgeführt)

- Live-Abnahme am 01.11.2026: `https://hallofmemory.de/` und `/demo/rahmen/?t070=check` liefern unter der **alten** Hostadresse HTTP 200 statt zur Hauptdomain zu wechseln. Beide Hostnamen haben proxied Cloudflare-DNS-Antworten; `https://www.hallofmemory.de/` und `/demo/?t070=check` liefern weiterhin Cloudflare HTTP 525. Die gleichnamigen Seiten auf `memoraevents.de` liefern HTTP 200. Das ist ein **Provider-Routing-/Origin-TLS-Problem**, kein Fehler in den statischen HTML-Markenbezeichnungen.
- **Neu und auf drei Routen reproduziert (01.11.2026):** `http://www.hallofmemory.de/`, `/demo/` und `/produkte/fotobox/` liefern jeweils `200` mit dem HTML-Titel `STRATO - Domain reserved` über den Cloudflare-Proxy (`CF-Cache-Status: DYNAMIC`); die zugehörigen HTTPS-URLs liefern weiterhin `525`. Der `www`-Host führt also öffentlich zu einer **geparkten Fremd-Origin-Seite**, nicht zur MEMORA-EVENT-Anwendung; die konkrete Origin-IP und Zoneneinstellung sind ohne authentifizierten Provider-Readback noch nicht bewiesen. **Nicht** nur einen neuen TLS-Ursprung konfigurieren oder STRATO-DNS nach Vermutung entfernen: Zuerst die Cloudflare-Zonen-Redirectregel auf beide Hostnamen legen, damit Besucher weder die Parkseite noch den Origin-TLS-Fehler erreichen. Anschließend beide Schemes und Pfad/Query mit realem 302-`Location` readbacken.
- Kleinste Providerkorrektur in der **Cloudflare-Zone `hallofmemory.de`**, nicht in `memoraevents.de`: genau **eine** Redirect Rule mit Filter `(http.host eq "hallofmemory.de") or (http.host eq "www.hallofmemory.de")`, dynamischem Ziel `concat("https://memoraevents.de", http.request.uri.path)`, **Querystring erhalten**, zunächst reversibel **302**. Vor dem Setzen bestehende Single Redirects, Worker-Routen und Custom-Domain-Bindings der Legacy-Zone readbacken und kollidierende Regeln nicht ungeprüft überschreiben. Bestehende proxied Web-DNS-Records nicht allein aufgrund des 525 ändern.
- Nach authentifiziertem Write beide Hosts und Pfade **ohne automatisches Folgen** testen: `/` und `/demo/rahmen/?t070=check` beziehungsweise `/demo/?t070=check` müssen `302` mit `Location: https://memoraevents.de/...` samt Pfad und Query liefern. Der kanonische Host muss weiter wie zuvor funktionieren; anschließend Browser-/TLS-Readback. Bleibt `www` bei 525, gezielt Cloudflare-Rule-Priorität/Host-Match/Worker-Route und Edge-/Origin-TLS-Konfiguration prüfen, statt den Redirect als erfolgreich zu behaupten.
- Die Workers-Static-Assets-Datei `public/_redirects` bietet laut Cloudflare-Referenz **keine Domain-Level-Redirects**: https://developers.cloudflare.com/workers/static-assets/redirects/ . Die offizielle Providerregel ist unter https://developers.cloudflare.com/fundamentals/manage-domains/redirect-domain/ beschrieben. Ohne authentifizierten Cloudflare-Zonenzugriff wird kein künstlicher Frontend-Redirect oder risikoreicher DNS-Wechsel vorgenommen.
- PR #100 enthält die letzten beiden aktiven Doku-Formulierungen, vor diesem Journal-Nachtrag geprüfter Head `aeb36e6d164f643c75843d18a43db5035d014e6a`, `verify` auf GitHub PASS (Run `41340223743`). Der nach Dateirisiko verpflichtende **fünfachsige, signierte First-Party-Review** ist mit der laufenden Grabowski-Version `82599219` für dieses Repo noch nicht möglich; der Quellcode-Fix liegt bereits upstream. Bis zum zulässigen Operator-Release ist ein Captain-Merge dieser Dokuänderung nicht freigegeben.
