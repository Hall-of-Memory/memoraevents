# Cloudflare Git Build für MEMORA EVENT

Stand: 07.10.2026 (Europe/Berlin). Der Kunde hat den bestehenden Worker `hall-of-memory` mit `Hall-of-Memory/memoraevents`, Produktionsbranch `main`, verbunden und das Speichern der Build-Konfiguration bestätigt. Veröffentlichung wurde ausdrücklich autorisiert.

## Build-Konfiguration

- Stammverzeichnis: `/`
- Build-Befehl: `npm run build`
- Bereitstellungsbefehl: `npx wrangler deploy --config wrangler.jsonc`
- Build-Variable `PUBLIC_SITE_URL`: `https://memoraevents.de/`
- Build-Variable `NODE_VERSION`: `22`

Der erste main-Push nach der Verbindung startet den Cloudflare Build. Dieser Dokumentationscommit dient diesem Start. Website-Code, Wrangler-Konfiguration, DNS, DNSSEC, Nameserver, E-Mail und Zugangsdaten werden nicht geändert.

## Prüfstand vor dem Start

Relaunch PR #75 ist gemergt (main `6d33a649b3fec8b704a9961918bb5da14e0ab4c0`), Verify und Pages-Runtime waren erfolgreich. Die offizielle Domain lieferte vor dem Start noch den alten Demo-Stand (HTML SHA-256 `27fe8a420e4829880607caa2d665f2a703ff6041997ec401622a1064f58e0ddd`).

Nach dem Merge sind Cloudflare Build-Ergebnis und Live-Domain zu prüfen. Das Dokument behauptet noch keinen erfolgreichen Cloudflare-Deploy. Stage-1-Demo, deaktivierte Anfragefunktionen und bestehende Freigabegates bleiben erhalten. Das produktive `npm run deploy` wird nicht verwendet, da es die separate Stage-2-Freigabe voraussetzt.
