---
id: T067
status: done
priority: P1
dependencies: [T066]
---
# Kundenwunsch: dunkleres Logo und animierte Zeichnungen

08.10.2026: Kunde möchte Logo etwas dunkler und statt der gemeinsamen Gerätefotos Zeichnungen mit dezenter Animation für Fotobox, Fotospiegel, Magazinbox, Papeterie (Flyer, Karten, Visitenkarten, Hochzeitskarten, Einladungskarten), Gastgeschenke. Eventdekoration erhält ebenfalls eine eigene Illustration. Diese konkrete Kundenfreigabe erlaubt dunklere Logo-Darstellung; Originaldatei bleibt byteidentisch, Darstellung über CSS-Filter/Multiply. Kein Nachzeichnen des Markenlogos.

DESIGN-SENSITIVE: Originale dekorative SVG-Zeichnungen im gemeinsamen Astro-Komponentenmodell ersetzen Foto-/Monogramm-Platzhalter auf Landingpage und Produktdetailseiten. Gold-/Creme-Palette, keine fremden Logos oder private Eventbilder. Animationen enden nach 4,4 Sekunden; prefers-reduced-motion deaktiviert sie vollständig. Keine zusätzliche JS-/Service-Abhängigkeit. Geplante Leistungen bleiben als In Planung markiert. Bestehende Angebotstexte/Preise/Anfragevertrag unverändert. Nicht mehr verwendete Foto-Assets und Mapping entfernen.

Plan: Implementieren; npm ci + npm run verify; Browserprüfung aller sechs Illustrationen, Reduced Motion und dunklerem Original-Logo bei 390/834/1440 px; PR mit Screenshots; nach erfolgreicher CI im bestehenden Veröffentlichungsauftrag mergen/deployen und Live-Readback. DNS/Mail/Secrets unverändert.

## Review-Evidenz

npm ci / Build bestanden. Quality: 31.439 Byte HTML, 25.582 Byte CSS (Demo weiterhin unter 26 KiB), 18.340 Byte initialer HTML/CSS/JS-Gzip-Transfer. Browser-Readback bei 390/834/1440 px: sechs Illustrationen auf der Landingpage, je eine auf den drei Produktseiten, kein Overflow; Reduced Motion schaltet sämtliche Illustrator-Animationen aus. Original-Logo-Bytes unverändert. Erster kanonischer Lauf: 21 PASS / 2 FAIL (lokales Inquiry-Spike-Netzwerk und HTML-Budget); redundante SVG-Verzierungen entfernt, Quality wieder bestanden. Finaler kanonischer Lauf gestartet; CI verbindlich vor Merge. Desktop-/Mobile-Screenshots in review/animated-illustrations-*.jpg und review/animated-services-*.jpg.

Animationsbeginn erst bei Sichtbarkeit: IntersectionObserver im vorhandenen lokalen Navigationsscript setzt pro Illustration einmal die Startklasse. Kein neuer Script-Request; keine Netzwerk-/Formularaktionen. Ohne JS bleiben vollständige statische Illustrationen sichtbar.

## Abschlussbeleg 03.11.2026

- Der kundenseitig angeforderte Wechsel zu dezenter Illustration und dunklerer Logo-Darstellung wurde mit PR #80 in `main` integriert (Merge `54b8d04d64f6939cf2955773f9f2068b1ef84080`); Original-SVG aus Kundenquelle folgt über PR #81 (Merge `41bf800ad086466ea5bfe266928eca16a26e884d`).
- Die heutigen Produkt- und Preisrouten sind in der Live-Stage-1 funktional abgenommen (PR #113, 54/54 Firefox-Checks). Technische Umsetzung dieses Designauftrags **done**. Finale Medien-, Geschäfts- und Launchfreigaben bleiben T010/T057/T009.
