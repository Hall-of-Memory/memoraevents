---
id: T006
status: blocked_external
priority: P1
dependencies: [T003, T004, T011]
---
# Geschützter Adminbereich

## Akzeptanz
- authentifizierter Zugriff
- Inhalte/Preise/Bilder/Angebote pflegbar
- Anfragen einsehbar und statusfähig
- keine Abhängigkeit von einem kostenpflichtigen Website-Baukasten

## Technische Evidenz — 2026-08-11

- Cloudflare-Access-kompatible JWT-Validierung lokal praktisch umgesetzt: RS256-Signatur, Issuer und Audience werden geprüft; fehlendes oder falsches Token wird abgewiesen.
- Geschützte `/admin`-Oberfläche sowie `/api/admin/inquiries` umgesetzt.
- Gespeicherte Anfragen sind einsehbar; Statusänderung (`new` → `contacted` etc.) ist lokal end-to-end getestet.
- Der lokale Test erzeugt sein RSA-Schlüsselpaar flüchtig; kein privater Schlüssel wird committed.
- Inhalte/Preise/Bilder bleiben bewusst noch nicht schreibbar. Der Admin meldet `cms-path-pending-t011`, bis Git-CMS vs. eigener D1/R2-Admin entschieden ist.
- Keine Cloudflare-Access-App, Remote-D1, Domain oder produktiven Secrets angelegt.

## Bestätigter Kundenwunsch — 2026-08-12

Der Kunde möchte Preise, Bilder und Angebote später selbst ändern können. Damit sind Betreiber und Kernumfang der Selbstpflege geklärt; auch Texte bleiben Bestandteil des strukturierten Inhaltsmodells.

## Externe Blockade

Für den letzten Akzeptanzpunkt fehlen weiterhin die Bedien- und Betriebsdetails aus T011: Wie häufig wird geändert, sind Browser-Uploads erforderlich, soll es Vorschau/Freigabe geben und welche Bedienoberfläche ist gewünscht? Erst danach kann Git-basiertes CMS gegen eigenen D1/R2-Admin entschieden werden. Ohne diese Angaben wäre ein eigener CMS-Editor vorzeitige Produktarchitektur.

Zusätzlich braucht der produktive Admin kundeneigene Access-/D1-/Worker-Ressourcen, berechtigte Identitäten und eine produktiv verifizierte Access-/Inquiry-Routenbindung. Bis diese Inputs vorliegen, ist T006 `blocked_external`; Inquiry-Admin und Authentifizierung sind technisch belegt, Content-Pflege bleibt absichtlich unimplementiert.

## Stage-2-Abgrenzung 03.11.2026

Die öffentliche Domain `memoraevents.de` ist seit T061 aktiv; das Fehlen einer „realen Domain“ ist kein aktueller Blocker. Der Inquiry-Adminvertrag ist lokal bereits sicherheits- und funktionsgetestet, `scripts/test-admin-data-minimization.mjs` und `scripts/test-admin-page-security.mjs` am 03.11.2026 erneut PASS. Fehlend sind echte kundeneigene Access-App-/D1-/Worker-Bindings und freigegebene Adminidentitäten; siehe F3/F7 in `docs/business-legal-ground-truth.md`. Produktive Admin-Authentifizierung erst nach diesen Belegen abnehmen. Browserbasierte Content-Pflege ist kein zwingender Bestandteil des V1-Inquiry-Launches; Git/Codex bleibt der einfache Pfad, bis realer Bedienbedarf einen Editor rechtfertigt.
