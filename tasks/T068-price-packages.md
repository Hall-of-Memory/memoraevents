---
id: T068
status: active
priority: P1
dependencies: [T010, T056]
---
# Kundenpreise — 10.10.2026

Kundenauftrag: „1 zu 1 https://melody-fotobox.de/preise — Die Preise“. Sechs Preisstufen Digital/Starter/Classic/Premium/Party/Flatrate für die vorhandenen Angebote Fotobox und Fotospiegel mit Druckmengen übernehmen. Fotobox: 249/299/349/399/449/549 Euro; Fotospiegel: 299/349/399/449/499/599 Euro, je Event. Digital ohne Druck, weitere Stufen 150/300/450/700/unbegrenzte Ausdrucke.

Ausschließlich vom Kunden gewählte Preise und Druckstaffel übernehmen. Kein Kopieren fremder Werbetexte und keine Behauptungen über integrierten Akku, Beauty-Blitz, Lieferung, Galerie, Reservierungs-, Kautions- oder Stornobedingungen. Diese Eigenschaften sind für MEMORA nicht belegt. KI-Produkte und Gästebücher sind nicht im vorhandenen Katalog. Magazinbox-Preis fehlt auf der Referenzseite und bleibt offen. Zubehörpreise noch nicht eingebaut; Bestand/Leistungen gesondert abgleichen.

Bestehendes validiertes Contentmodell und Produktseiten verwenden. Eigene /preise/-Seite zeigt kompakte responsive Tabellen; Landingpage verlinkt die Übersicht mit Einstiegspreisen. Produktseiten zeigen vollständige Paketkarten. Shared-Allowlist synchronisiert die Paket-IDs; Anfrage-/Buchungsfreigaben unverändert und fail-closed. Domain, Infrastruktur, Legal- und Releasefreigaben unverändert.

Verifikation folgt; eigener PR für Review, kein Merge ohne Freigabe.

## Verifikation

npm ci unter Node 22.23.3 bestanden. Demo und Quality bestanden; Produktion 32.586 Byte HTML (unter 32 KiB), 24.930 Byte CSS; 18.758 Byte initialer Gzip-Transfer. Inquiry-Contract bestanden, zwölf Paket-IDs korrekt an Fotobox/Fotospiegel gebunden. Die vorhandene Demo-Prüfung verifiziert jede freigegebene Preisstufe auf der neuen echten /preise/-Route. Zur Einhaltung des unveränderten HTML-Budgets gemeinsame Stroke-Attribute der Inline-Illustrationen in deren bestehende CSS-Regel gezogen; Original-Logo bleibt unverändert.

Kanonischer Verify lokal gestartet, nach 90 Sekunden beim Wrangler/D1-Migrationsstart abgebrochen. CI bleibt vor Merge erforderlich.

10.10.2026: Kunde autorisiert Aktivierung und Merge der zugehörigen Änderungen. Erster CI-Run: 22 PASS, ein veralteter Preview-Base-Platzhaltertest FAIL. Assertion auf den tatsächlichen Preisübersichtslink und dessen Produktlinks unter Preview-Base aktualisiert. Produktive Formularaktivierung weiterhin technisch blockiert: keine produktiven D1-/Turnstile-/Email-Bindings in der statischen Worker-Konfiguration; Datenpolicy blocked_external. Keine Dummy-Konfiguration oder unbelegte Empfangsbestätigung eingebaut.
