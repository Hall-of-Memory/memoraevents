---
id: T064
status: active
priority: P0
dependencies: [T010]
---
# MEMORA EVENT — autorisierter Website-Relaunch

Kundenauftrag 03.10.2026: Astro und vorhandene Funktionen erhalten, öffentliches Branding auf MEMORA EVENT und ausschließlich memoraevents.de umstellen. Cremeweiß, warmes Gold, Beige; großzügig, minimalistisch, responsive. Keine Preise, Pakete oder Produktbeschreibungen erfinden. Neue Angebotsbereiche als geplante Erweiterungen darstellen. DESIGN-SENSITIVE: alte Schwarz-/Gold-Baselines sind durch diesen Auftrag superseded; Sicherheits-, Formular-, Asset-, Accessibility- und Performance-Invarianten bleiben bindend.

## Eingabe und Plan

Der Kunde lieferte einen Logo-Screenshot und forderte anschließend ausdrücklich die Umsetzung und Ansicht der Website. Ausschließlich verlustfreies Ausschneiden der Logo-Fläche ohne Neuzeichnen, Umfärben oder KI-Ersatz. PNG bleibt PNG; keine vorgetäuschte SVG-Vektorisierung. Favicon ist ein konventionell verkleinerter Ausschnitt des gelieferten Kamera-Monogramms. Ein echtes SVG und Produkt-/Eventbilder fehlen weiterhin.

1. Bestandsaufnahme auf main 09dc4616ce9cef3ece24111a1f8f063661e8e008 abgeschlossen: PR #65 historisch, T061 aktuelle Domainwahrheit, T062 Repository-Rename. PR #66 offener konfliktbehafteter Branding-Vorgänger. Fünf separate Dependency-PRs bleiben unberührt.
2. Neues Branding/PNG und Palette aus Screenshot integrieren.
3. Gemeinsame Astro-Landingpage und Legal-Seiten modernisieren; drei Erweiterungsbereiche getrennt von buchbaren Angeboten modellieren.
4. Canonical verify, Build, Screenshots bei 390/834/1440 Pixel.
5. Draft-PR mit Review-Evidenz; kein Merge oder Deployment. Vercel-Git-Autodeploy für Relaunch-Branch über dokumentiertes vercel.json ausschalten. Pages-Deploy läuft nur bei main-Push, deshalb kein main-Push.

## Grenzen und offene Punkte

Pakete und Galerie leer; Kontaktziele fehlen; Legal/Media/Product-Release-Approvals false. Inquiry bleibt fail-closed, Stage-1-Demo disabled. Verbindliche Buchung und private Kunden-Galerie bleiben separate Tasks. Workername, Cloudflare, DNS, DNSSEC, NS, Mail und Secrets nicht verändern.

## Design-Verträge

Die alte Goldletter-Experimentroute zeigt jetzt nur das bereitgestellte Logo; synthetische Buchstabenassets und alte Markenlogos werden nicht mehr öffentlich ausgeliefert. Tests erhalten ihre BASE_URL-/Asset-/noindex-Invarianten, erwarten dort aber die neue Logoquelle. Der visuelle Produktflächenvertrag prüft die bewusst glatte Cremefläche statt der superseded Gradient-Ausprägung. Headerlogo-Geometrie ist an das breite neue Logo angepasst; Loaded/Visible/Containment- und kontrollierte Negativtests bleiben erhalten.

## Review-Evidenz

Siehe docs/memora-relaunch-review.md. Node 22.23.2, kanonischer Verify: 22 PASS / 1 FAIL / 0 BLOCKED. Einzige offene Prüfung ist der bereits vorher umgebungsbedingt fehlschlagende lokale Inquiry-Spike. Visual, Kontraste, Formulare, Build und sämtliche anderen Gates grün. HTML-Offlinevorschau und Browser-Screenshots erstellt. Status bleibt active bis Kundenreview und technischer Freigabe; kein Merge/Deployment.

## Original-Weblogo — 10.10.2026

Kunde lieferte das Designer-ZIP und beauftragte ausdrücklich den Austausch. Original-SVG byteidentisch übernommen (`e7ec7c3c25905f706eab5c116187ca601d15b89c13d828966b80ab75da3278a4`); Header, Footer, Kontakt, Produktseiten, Legal-Seiten und Logo-Lab auf die SVG umgestellt. Bestehende Größen und autorisierte dunklere CSS-Darstellung bleiben erhalten. Vorläufiges Screenshot-PNG entfernt; Favicon unverändert. SVG-Abhängigkeit erledigt, übrige T010-Eingaben weiterhin offen. Domain, Worker, DNS, Mail, Secrets und Deployment-Architektur unverändert. Verifikation folgt im PR.

Verifikation Original-SVG: `npm ci` unter Node 22.23.3 erfolgreich; `test:demo` und `test:pages-artifact` bestanden (byteidentischer SVG-Hash, drei Logos, korrekte Pages-Unterpfade). SVG ohne Scripts oder externe Ressourcen. Der kanonische `npm run verify` wurde gestartet und nach dem Hängen bei `test:inquiry-migrations` im lokalen Wrangler/D1-Start abgebrochen; die vollständige CI bleibt vor einem Merge erforderlich. Kein lokaler Chrome/Chromium vorhanden, daher noch keine Browser-Layoutfreigabe.

Zusätzlich `test:quality` bestanden; Astro Check: 74 Dateien, 0 Fehler/Warnings/Hints. `git diff --check` sauber.
