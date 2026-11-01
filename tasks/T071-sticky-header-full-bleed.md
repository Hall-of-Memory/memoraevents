---
id: T071
status: active
priority: P1
dependencies: [T064, T065]
---
# Navigationsheader: dunkle Seitenränder nach Ankerauswahl entfernen

## Kundenbefund (01.11.2026)

Auf memoraevents.de zeigt der klebende cremefarbene Header nach einem Klick auf „Produkte“, „Pakete & Preise“ usw. links und rechts dunkle Randstreifen. Sichtbar im vom Kunden bereitgestellten Safari-iPad-Screenshot.

## Ursache und minimaler Fix

Der sticky Header ist zugleich eine zentrierte Shell mit begrenzter Breite. Außerhalb dieser schmalen Box scheint beim Scrollen der dunkle Hero durch. Der Header soll als vollbreiter cremefarbener Sticky-Hintergrund bleiben; ausschließlich seine Inhalte werden in einer inneren Shell zentriert. Keine Änderung des Logos, Farbschemas oder der Ankerziele.

## Akzeptanz

- Auf Desktop, Tablet und Mobilgerät reicht der Header vor und nach allen fünf Nav-Ankerklicks bis an beide Viewportränder.
- Der Header bleibt sticky; Logo, Navigation, mobiles Menü und Inhalte behalten ihre bestehenden Innenabstände.
- Kein horizontaler Überlauf; an Ankerzielen keine dunklen Randstreifen.
- npm ci, npm run verify, gezielter Browser-/Live-Readback und PR-Integration gemäß AGENTS.md.

## Journal

- 01.11.2026: Ausgangs-main 92248dc19733b1c50fd69aee13d37e6b6173b1ec, Worklane fix/t071-header-fullbleed-20261101. Screenshot des Kunden als visueller Befund (nicht ins Repository übernommen).
- Umsetzung: Full-bleed Sticky-Header mit zentriertem Innencontainer; responsive Regeln angepasst; Browser-Regression für fünf Anker ergänzt.
- Lokaler npm-ci-/Verify-Lauf unter Node 24.21.0: 21 PASS, 2 FAIL. Inquiry-Spike liefert weiterhin human-verification-unavailable; Visual-Test fand standardmäßig keinen Browser.
- Fokussierter Visual-Lauf mit Node 22.23.4 und Chrome 156: Browserstart und Build funktionieren, die bestehende CDP-Testanbindung läuft in Page.navigate-Timeout. Kein Ursachebeleg für ein Header-Layoutproblem. GitHub-CI und revisionsgebundener Live-Readback bleiben erforderlich.
- Tests, PR, Merge und Produktionsnachweis: erst nach Ergebnis fortschreiben.
