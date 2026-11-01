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

## Integration / Produktionsgrenze — 01.11.2026

- PR #96 zu Commit e76b2a7d385d273ebf9ac555290b8c496d82adb3 eröffnet: https://github.com/Hall-of-Memory/memoraevents/pull/96
- GitHub Verify SUCCESS, Workflow-Run 41308719281; Cloudflare Workers Builds und Vercel Preview SUCCESS. Der lokale Inquiry-Spike und CDP-Navigations-Timeout waren nicht reproduzierbar als GitHub-CI-Fehler.
- Branchschutz auf main: required check verify, strict, Admin-Enforcement, keine verpflichtenden Fremdreviews. Der direkte Merge über Grabowski wurde ausdrücklich mit direct_pr_merge blockiert: Captain pr-merge ist der vorgeschriebene Pfad. Keine Umgehung des kontrollierten Mergepfads.
- Auf beiden Operatorhosts war die Captain-CLI nicht im PATH verfügbar; der Captain-Merge konnte daher nicht ausgelöst werden. main und die produktive Domain gelten bis zu einem neuen erfolgreichen Readback nicht als aktualisiert.
- Legacy-Redirect hallofmemory.de -> memoraevents.de und www-TLS-Fehler bleiben mangels authentifiziertem Cloudflare-Providerzugriff offen.
