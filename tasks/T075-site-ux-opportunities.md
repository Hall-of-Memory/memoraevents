---
id: T075
status: planned
priority: P1
dependencies: []
---
# MEMORA EVENT – Website-UX, Conversion und Release-SEO verbessern

## Ziel und Geltung

Verbesserungen aus der Live-/Quellprüfung am **05.11.2026** auf `main@d28771a01a07688b24e151f82981a5ff96f7da33` priorisieren. Dies ist eine **Befundsammlung, keine implementierte Änderung**. Die sendefreie Preview, die Launch-/Datenschutz-Gates und die bestehende creme-/goldfarbene Gestaltung bleiben unverändert. Bereits zuständige Aufgaben T008 (SEO/A11y/Datenschutz), T010 (Medien/Betreiberangaben), T064 (Relaunch), T069 (Konfigurator) und T070 (Legacy-Domain) bleiben fachliche Bezugspunkte; keine parallele Aufgabenwahrheit anlegen.

## P0 – klar belegte und ohne Aram vorbereitbare Fehler

1. **Homepage-Produkt-CTAs führen zum deaktivierten Formular statt zur funktionierenden Auswahl.** `src/components/landing/LandingShowcase.astro:84`: Alle drei Links „Unverbindlich anfragen“ verwenden `href="#anfrage"`. Der Live-Anfrageabschnitt unter `/demo/` ist ein deaktiviertes Formular. Stattdessen bei `launchStatus=draft` nach `/demo/konfigurator/?produkt=<id>`, nach freigegebenem Launch nach `/anfrage/?produkt=<id>` führen; eindeutig als Auswahlvorschau beschriften. Drei echte Klicks in Desktop, Tablet und Mobil prüfen. Keine Anfrage senden. Zugehöriger Kundenweg: T069.
2. **Preisroute wäre auch im Produktionsbetrieb nicht indexierbar.** `src/pages/preise.astro:13` übergibt fest `noIndex={true}`. Draft muss `noindex` behalten, freigegebener Produktionsbuild darf unter gültiger HTTPS-Origin indexierbar werden; mit synthetischen Production-/Draft-Regressionsbelegen prüfen. Bezug: T008.
3. **Produkt-/Preisnavigation führt nach Launch weiter zur Demo.** `src/pages/produkte/[slug].astro:15` und `src/pages/preise.astro:9` setzen `home` dauerhaft auf `/demo/`; `MemoraHeader` verwendet den Wert für Logo und Navigation. Homepageziel passend zu `launchStatus` bestimmen und für beide Modi testen. Bezug: T064/T069.

## P1 – hohe Verbesserung der Verständlichkeit und Auffindbarkeit

4. **FAQ widerspricht bereits vorhandenen Paketen.** Live-`/demo/` → „Kann ich direkt ein Paket auswählen?“ verspricht Paketvarianten erst „nach Freigabe“; gleichzeitig zeigt `/preise/` zwölf Preise (Fotobox ab 249 €, Fotospiegel ab 299 €) und der vierstufige Wizard erlaubt Vorbelegung. `src/content/faqs.json` an realen Stand anpassen: Paketwahl bereits möglich; tatsächliche Übermittlung aktuell noch nicht. Keine erfundenen Produkte oder Zusagen. Bezug: T068/T069.
5. **Launch-SEO unvollständig jenseits der Startseite.** `src/lib/seo.ts:renderSitemapXml` erzeugt bei Indexierbarkeit nur eine URL; `src/pages/produkte/[slug].astro` übergibt keinen `canonicalUrl` und `src/pages/preise.astro` ebenfalls nicht. Freigegebene drei Produktseiten + Preisseite in Sitemap/Canonical einbeziehen und OG-Vorschau mit freigegebenem Bild ergänzen, wenn ein autorisiertes Asset vorhanden ist. Alle Entwurfsrouten unverändert sperren. Bezug: T008.
6. **Paketvergleich beantwortet nicht die tatsächlichen Leistungsfragen.** `src/content/packages.json` enthält für zwölf Pakete als Leistung weitgehend nur die Druckanzahl; öffentlich bleibt unklar, welche Dauer, Lieferung, Aufbau/Abbau, Betreuung, Layout, Dateizugriff, Anfahrt oder eventuellen Zusatzkosten gelten. Keine Leistungen mutmaßen: Nach Betreiberfreigabe die Informationen im gleichen Datenmodell ergänzen; unbestätigte Punkte als „auf Anfrage“ behandeln. Bezug: T010/T068.
7. **Vertrauen durch echte Produkt-/Eventbilder.** `src/content/gallery.json=[]`, bislang ausschließlich illustrativer Galerieersatz; konkrete Gerätedarstellung und glaubwürdige Eventbeispiele fehlen. Nach geklärten Nutzungsrechten ausgewählte Fotos der drei Produkte, echte Aufbau-/Eventbeispiele und ggf. autorisierte Kundenstimmen liefern. Keine Stockbilder, erfundenen Bewertungen oder unfreigegebenen Personenfotos. Bezug: T010/T064.

## P2 – optionale UX-Hypothesen, nicht als Fehler belegt

8. Auf der Startseite stehen drei als „In Planung“ ausgewiesene Erweiterungsbereiche vor dem Paketteil. Reihenfolge testweise auf „Produkte → Pakete → Beispiele → Ablauf → geplante Services“ umstellen, falls der Betreiber Conversion vor Zukunftsangeboten priorisiert. Bestehende Kundenentscheidung, geplante Services klar zu zeigen, bleibt gültig.
9. Für die sendefreie Vorschau ggf. „Auswahl kopieren“ anbieten (Produkt/Paket/Event, ohne Kontaktdaten), wenn sonst kein sinnvoller Übergang besteht; dieses Hilfsmittel ersetzt ausdrücklich keinen echten Anfrage-Eingang. Erst nach P0 priorisieren.

## Live-Kontrollen und keine unbelegten Performance-Behauptungen

- Öffentliche Seiten `/demo/`, `/preise/`, `/produkte/{fotobox,fotospiegel,magazinbox}/`, `/demo/konfigurator/`, `/anfrage/` und Rechtstextentwürfe liefern HTTP 200; aktuelle Vorschau bleibt `noindex,nofollow` und sendefrei.
- BrowserStack WCAG 2.1 AA Site-Scans am 05.11.2026: **0 bestätigte automatische Befunde** auf `/preise/` (Scan 4309154/2429579) und `/demo/konfigurator/` (Scan 4309152/2429577). Das ersetzt keine manuelle Tastatur-/Screenreaderprüfung.
- Vom prüfenden Operator gemessen (komprimierte Transfers, kein Feld-Core-Web-Vitals-Test): `/demo/` HTML ca. 8,8 KB, Hero-WebP ca. 126,5 KB, BaseLayout-CSS ca. 1,8 KB, Demo-CSS ca. 5,3 KB, Navigation-JS ca. 0,6 KB. **Kein nachgewiesener Performance-Engpass**; keinen pauschalen CSS-/Architektur-Umbau beginnen.

## Umsetzung und Akzeptanz

P0 in kleinen reversiblen Tests/PRs, möglichst beim bestehenden T069/T008-Codepfad; danach P1-Inhaltskorrektur und produktionsfähige SEO-Regressionsprüfung. Bei jeder Änderung `npm ci`, `npm run verify` und reale 390/834/1440-px-Interaktionen, GitHub-/Cloudflare-Checks sowie revisionsgebundener Domain-Readback. F1–F12/Content-/Media-/Mailfreigaben sind weiterhin separat offen. **Nichts an `launchStatus=draft`, `noindex`, Inquiry-Sendesperre, D1, Access, Turnstile oder E-Mail-Zielen ohne Betreiberfreigabe ändern.**
