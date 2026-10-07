# MEMORA EVENT — Referenzdesign Review

07.10.2026. Kundenreferenz: https://melody-fotobox.de/; visuell und strukturell geprüft. Ausgangsrevision `3fd8ff446ff5199d7b8acb4ac1dfd57eb0d503dd`. Kanonischer Task T065.

## Umsetzung

Bildfüllender Einstiegsbereich mit zentrierter Serifentypografie und zwei abgerundeten CTAs; originales MEMORA-Logo und Creme-/Goldpalette. Feste Navigation, kompakter Mobile-Menüschalter mit aria-expanded/aria-controls, Escape und Fokus-Rückgabe. Ohne JavaScript bleiben die Links sichtbar. Navigation ist eine lokale externe Datei, damit die unveränderte CSP keine Inline-Script-Ausnahme benötigt.

Abgerundete Produkt-/Vorteils-/Erweiterungs-/Anlasskarten, ruhige Abschnittswechsel, nummerierte Ablaufanzeige und FAQ-Disclosures. Drei statische Produktseiten unter `/produkte/fotobox/`, `/produkte/fotospiegel/`, `/produkte/magazinbox/`, jeweils aus dem bestehenden Angebotsmodell mit unveränderten Kundenbeschreibungen, Highlights und Paketprojektion. Interne Links und Assets verwenden Astro BASE_URL.

Keine Bilder, Texte, Logos, Kundenreferenzen, Bewertungen, Preise, Zahlen oder Leistungsversprechen der Referenz übernommen. Keine neuen kostenpflichtigen Dienste, Tracking- oder Cookie-Systeme. Logo-Pixel und vorhandene Angebots-/Paketdaten unverändert. Eigene bestehende Beispiel-Eventaufnahme bleibt gekennzeichnet. Echte Produktbilder fehlen; Detailseiten markieren ihre gestalterische Vorschau ausdrücklich.

## Verifikation

Node 22.23.3, npm ci. Build und Astro check bestanden. Browser: 1440×1000, 834×1112, 390×844; kein horizontaler Overflow, alle vier Bilder nach Lazy-Loading geladen, Produktnavigation funktioniert. Visueller Volltest: drei Viewports, sechs Screenshots, sechs kontrollierte Regressionen und Rahmenvariante 10 bestanden. Mobile Menü öffnet per Button und schließt per Escape mit Fokus-Rückgabe.

Review-PR: https://github.com/Hall-of-Memory/memoraevents/pull/78. Navigation ist jetzt ausdrücklich als einzige Stage-1-Scriptdatei zugelassen; der Vertrag prüft weiterhin, dass sie keine Netzwerk- oder Formularübermittlung enthält. Quality erlaubt neben Astro-Bundles ausschließlich diese konkrete lokale, nicht blockierende Navigation.

Kanonischer Verify wird nach dem abschließenden Menü-Fix erneut ausgeführt. Vorlauf: 21 PASS / 2 FAIL / 0 BLOCKED; lokaler Inquiry-Spike scheitert unverändert umgebungsbedingt an `uv_interface_addresses`; visuelle Prüfung hatte zunächst keinen installierten Browser. Separater finaler visueller Test mit temporärem Chromium 153 bestanden. CI muss den vollständigen kanonischen Lauf bestätigen; kein Testgate abgeschwächt. Der Währungstest verwendet jetzt `\bEUR\b`, damit gewöhnliches „eure“ nicht als Preis erkannt wird; echte EUR-/Euro-/€-Angaben bleiben gesperrt.

## Screenshots

- `review/reference-desktop-hero.jpg`
- `review/reference-mobile-hero.jpg`
- `review/reference-mobile-product.jpg`

## Offene Eingaben

Echte Produkt-/Eventbilder, veröffentlichbare Paketpreise, Kontakt-/WhatsApp-Ziele und finale Rechtstexte fehlen weiterhin. Keine fremden Google-Bewertungen oder Kundenlogos einsetzen. Stage-1-noindex, deaktivierte Anfrage und persönliche Galerie-Vorschau bleiben erhalten. DNS, Mail, Zugangsdaten, Workername und Release-Freigaben unverändert.
