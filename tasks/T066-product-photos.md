---
id: T066
status: active
priority: P1
dependencies: [T065]
---
# Kunden-Gerätefotos integrieren

Kunde liefert zwei Fotos der eigenen Fotobox/Fotospiegel und einen Screenshot einer Magazinbox mit Familie von einer Verlobung. Gerätefotos unverändert als lokale Assets auf Angebotskarten und Produktdetailseiten einbinden; vollständige Bilder ohne Retusche, Lazy-Loading auf Landingpage, Abmessungen/Alt-Texte und BASE_URL erhalten. Beide Geräte sind auf beiden Aufnahmen sichtbar; Alt-Texte benennen links/rechts eindeutig. Keine Preise, Pakete oder Funktionen ändern. Magazinbox-Screenshot mit erkennbarer Familie zunächst nicht veröffentlichen: Kundenantwort „ist aus einer verlobung“ klärt den Anlass, jedoch noch nicht die öffentliche Nutzungsfreigabe. Originaldatei nicht committen.

Plan: Fotos integrieren, npm ci / npm run verify, responsive Browserprüfung, PR; Merge und Deployment nach erfolgreicher CI im bereits freigegebenen Website-Scope. DNS/Mail/Secrets unverändert.

## Evidenz 08.10.2026

npm ci und Build bestanden. Kanonischer lokaler Verify: 21 PASS / 2 FAIL / 0 BLOCKED; Inquiry-Spike scheitert weiterhin an der lokalen Netzwerkumgebung, beim ersten visuellen Lauf war Chromium noch nicht eingerichtet. Custom-Browser-Readback bei 390, 834 und 1440 px: alle Fotos geladen, Start-/Produktseiten ohne Overflow. Separater visueller Volltest folgt; CI ist verbindliches Merge-Gate. Screenshots review/product-photos-desktop.jpg und review/product-photos-mobile.jpg. Gerätefotos byteidentisch zu den Uploads; kein privates Familienbild in der Historie.

Separater visueller Volltest bestanden: drei Viewports, sechs Screenshots, sechs kontrollierte Fehlerfälle und Rahmenvariante 10. Finaler kanonischer Lauf mit Chromium eingerichtet gestartet.
