---
id: T071
status: done
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
- 01.11.2026: PR #99 (fix/t071-header-fullbleed-20261101) wurde auf Head 165100eef4daced44fdbd1607918ea711e3efcc9 mit grünem GitHub-Verify (Run 41324169009) und zweiphasigem Self-Review (PASS, keine offenen Befunde) integriert. Captain-Merge-Readback bestätigt main-Commit ed49b687983df3682d070580ac9261c3e6618a0c.
- Main-Verify zum Merge-Commit: GitHub Actions Run 41327179306, abgeschlossen mit SUCCESS; verify und pages-runtime SUCCESS. Cloudflare Workers Builds: hall-of-memory meldete SUCCESS für denselben Commit.
- Frischer HTTP-/Asset-Readback auf https://memoraevents.de/ (Weiterleitung auf /demo/): HTML 200 und neue Struktur mit Headerklasse site-header demo-header und innenliegender shell demo-header-content; alte enge Kombination demo-header shell fehlt. Live-Stylesheet /_astro/demo.Cn3WwUNj.css HTTP 200; enthält demo-header mit cremefarbenem Hintergrund #fbf3de, position:sticky;top:0 sowie demo-header-content mit Flex-Layout und responsiven Regeln. Keine ungetestete Behauptung einer individuellen Safari-Session: Browser-Regression der fünf Anker auf drei Viewports ist im erfolgreichen Main-Verify enthalten.
- T071 abgeschlossen: keine offene Code-, CI- oder Deployment-Arbeit an diesem Header-Fehler; ein zusätzlicher Test am echten Kunden-iPad ist nicht Bestandteil des automatisierten Nachweises.
