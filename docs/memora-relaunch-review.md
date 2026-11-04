# MEMORA EVENT Relaunch — Reviewstand

03.10.2026 Kundenauftrag / 04.10.2026 Verifikation. Basis-main: 09dc4616ce9cef3ece24111a1f8f063661e8e008. T064 ist der kanonische Relaunch-Task.

## Umsetzung

Gemeinsame Astro-Landingpage modernisiert: Cremefläche aus dem Kundenscreenshot (#fbf3de), warmes Gold, kontrastreiche Brauntöne, großzügige Abstände und ruhige Typografie. Neues Logo in Header, Footer, Kontakt und Legal-Seiten; keine Neuzeichnung, Umfärbung, Filter, Blend-Modi oder KI-Ersatz. PNG-Webexport und Monogramm-Favicon aus geliefertem Screenshot. Alte öffentliche Logo-Dateien und experimentelle Goldschriftassets entfernt. Goldletter-Route bleibt als Markenansicht mit dem Original-PNG erreichbar.

Site-Name, Metadaten, Produkttexte (ausschließlich Namensersetzung), Alternativtexte, WhatsApp-Entwurf und Legal-Seiten auf MEMORA EVENT. Offizielle Domain bleibt memoraevents.de; historische Tasks behalten damalige Domainverweise. Worker- und Asset-Fundusnamen sind interne Identitäten.

Drei geplante Bereiche über separate Zod-Collection futureServices: Eventdekoration, Gastgeschenke, Einladungskarten/Papeterie. Keine Aufnahme in den buchbaren Inquiry-Katalog; keine erfundenen Leistungen, Preise oder Paketänderungen. Bestehende drei Angebote, Paketprojektion, Datum/Formular, Galerieprojektion, FAQ und Prozess erhalten.

## Verifikation

Node 22.23.2; npm ci (bereits installiert), canonical npm run verify: **22 PASS / 1 FAIL / 0 BLOCKED**. Astro check, Build, Inquiry-/Admin-Privacy-/Availability-/Gallery-/Form-/DNS-/Release-Contracts, Preview-Unterpfad, Pages-Artefakt und Wrangler-Dry-Runs bestanden. Visual: 1440×1000, 834×1112, 390×844; sechs vollständige Screenshots; kontrollierte Negativtests für versteckte/zu kleine Logos und versteckte Prozessschritte bleiben aktiv.

Offener lokaler Test: inquiry-spike. Wrangler dev scheitert in dieser Ausführungsumgebung mit `uv_interface_addresses returned Unknown system error 1`. Derselbe Fehler bestand vor dem Relaunch. Backend/Smoke-Test wurde nicht verändert und das Gate nicht abgeschwächt. Deshalb Draft-PR und keine Merge-/Produktionsfreigabe; CI muss den Test auf einer geeigneten Umgebung bestätigen.

Alle vier sichtbaren Bilder geladen, fünf Navigationslinks sichtbar, kein horizontaler Overflow bei 390/834/1440 Pixel. Reviewer-Screenshots in review/. CSS-/HTML-/JS-Budgets und Kontrastprüfungen bestanden.

## Offene Eingaben

- Echtes SVG-/hochauflösendes Logo-Original fehlt; aktueller Webexport nutzt unveränderte Screenshot-Pixel.
- Freigegebene Produkt- und Eventfotos fehlen; vorhandene Beispiel-Eventaufnahme bleibt als solche gekennzeichnet, Produktkarten behaupten keine echten Produktbilder.
- Packages und öffentliche Galerie sind leer, bestätigte Preise fehlen.
- Kontakt-/WhatsApp-Businessziel und finale Rechtstexte fehlen.
- Inquiry, geschützter Admin, Echtzeitbuchung und private Galerie sind noch keine vollständigen produktiven Systeme. Bestehende Stage-1-/Release-Sperren bleiben erhalten.
- PR #66 überschneidet sich mit Branding und ist konfliktbehaftet; keine Übernahme seiner historischen Domain-/Task-Konflikte und kein automatisches Schließen.

## Veröffentlichung

Kein Merge, main-Push, Deploy, Cloudflare-/DNS-/DNSSEC-/Nameserver-/Mail-/Secret-Wechsel. Vercel-Git-Autodeploy für `codex/memora-event-relaunch` deaktiviert über vercel.json; offizielle Referenz: https://vercel.com/docs/project-configuration/git-configuration. Bestehendes Pages-Deployment ist ausschließlich main-push-getriggert. Die separat bereitgestellte HTML-Datei ist eine Offline-Designvorschau mit eingebetteten Bildern und CSS; Formulare bleiben disabled, Impressum/Datenschutz-Entwürfe sind lokal verlinkt.
