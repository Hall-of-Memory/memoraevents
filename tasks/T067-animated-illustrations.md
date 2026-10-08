---
id: T067
status: active
priority: P1
dependencies: [T066]
---
# Kundenwunsch: dunkleres Logo und animierte Zeichnungen

08.10.2026: Kunde möchte Logo etwas dunkler und statt der gemeinsamen Gerätefotos Zeichnungen mit dezenter Animation für Fotobox, Fotospiegel, Magazinbox, Papeterie (Flyer, Karten, Visitenkarten, Hochzeitskarten, Einladungskarten), Gastgeschenke. Eventdekoration erhält ebenfalls eine eigene Illustration. Diese konkrete Kundenfreigabe erlaubt dunklere Logo-Darstellung; Originaldatei bleibt byteidentisch, Darstellung über CSS-Filter/Multiply. Kein Nachzeichnen des Markenlogos.

DESIGN-SENSITIVE: Originale dekorative SVG-Zeichnungen im gemeinsamen Astro-Komponentenmodell ersetzen Foto-/Monogramm-Platzhalter auf Landingpage und Produktdetailseiten. Gold-/Creme-Palette, keine fremden Logos oder private Eventbilder. Animationen enden nach 4,4 Sekunden; prefers-reduced-motion deaktiviert sie vollständig. Keine zusätzliche JS-/Service-Abhängigkeit. Geplante Leistungen bleiben als In Planung markiert. Bestehende Angebotstexte/Preise/Anfragevertrag unverändert. Nicht mehr verwendete Foto-Assets und Mapping entfernen.

Plan: Implementieren; npm ci + npm run verify; Browserprüfung aller sechs Illustrationen, Reduced Motion und dunklerem Original-Logo bei 390/834/1440 px; PR mit Screenshots; nach erfolgreicher CI im bestehenden Veröffentlichungsauftrag mergen/deployen und Live-Readback. DNS/Mail/Secrets unverändert.

## Review-Evidenz

npm ci / Build bestanden. Quality: 31.439 Byte HTML, 25.582 Byte CSS (Demo weiterhin unter 26 KiB), 18.340 Byte initialer HTML/CSS/JS-Gzip-Transfer. Browser-Readback bei 390/834/1440 px: sechs Illustrationen auf der Landingpage, je eine auf den drei Produktseiten, kein Overflow; Reduced Motion schaltet sämtliche Illustrator-Animationen aus. Original-Logo-Bytes unverändert. Erster kanonischer Lauf: 21 PASS / 2 FAIL (lokales Inquiry-Spike-Netzwerk und HTML-Budget); redundante SVG-Verzierungen entfernt, Quality wieder bestanden. Finaler kanonischer Lauf gestartet; CI verbindlich vor Merge. Desktop-/Mobile-Screenshots in review/animated-illustrations-*.jpg und review/animated-services-*.jpg.
