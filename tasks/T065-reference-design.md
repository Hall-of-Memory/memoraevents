---
id: T065
status: done
priority: P0
dependencies: [T064]
---
# MEMORA EVENT — Referenzdesign vom 07.10.2026

Kundenauftrag: Website nach https://melody-fotobox.de gestalten. DESIGN-SENSITIVE: Referenzaufbau mit bildfüllendem Hero, zentrierter Serifentypografie, fester Navigation, runden Buttons/Karten, Produktdetailseiten, Anlassbereich und klaren Kontakt-CTAs ersetzt die bisherige Split-Hero-Gestaltung. Original MEMORA-Logo und Creme-/Goldpalette bleiben. Keine fremden Bilder, Logos, Texte, Bewertungen, Referenzkunden, Zahlen, Preise oder Leistungsversprechen übernehmen. Bestehende Produktbeschreibungen und Paketdaten unverändert. Astro, Base-Path, Security-/Release-Gates, Anfrage-/Adminverträge und Rahmenvarianten erhalten.

Plan: Referenz visuell prüfen; gemeinsamen Landingkern modernisieren; statische Produktseiten aus vorhandenen Inhalten; responsive/Navigation/Details prüfen; npm ci und canonical verify; Desktop-/Mobile-Screenshots und PR. Keine neuen kostenpflichtigen Dienste. Stage-1 bleibt deaktivierte Demo. Fehlende echte Produktbilder, Kontaktdaten, Preise und Rechtstexte sind offene Inputs.

## Abschlussbeleg 03.11.2026

- Referenzorientiertes MEMORA-Layout einschließlich Hero, runder Angebotskarten, Produktdetailseiten und responsive Navigation über PR #78 in `main` integriert: Merge `3ecd56b0a27c2ff9c8505cda12505e36e2385948`.
- Die nachfolgenden Nutzerwege aus Produkt- und Preiskarten wurden über #109 integriert; PR #113 dokumentiert 54/54 echte Firefox-158-Browserprüfungen auf `https://memoraevents.de` einschließlich 390/834/1440 CSS-Pixeln und korrekter CTA-Navigation. Der seitliche Header-Randfehler wurde separat in T071 geschlossen.
- **T065 done für den technischen Referenzdesign-Slice.** Öffentliche Bild-/Rechtstext- und Launchfreigaben verbleiben bei T010/T057/T009. Ohne konkreten neuen Mangel kein Redesign.
