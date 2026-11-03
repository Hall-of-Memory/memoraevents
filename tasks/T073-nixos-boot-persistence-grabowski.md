# T073 – NixOS-Bootpersistenz und automatischer Grabowski-Wiederanlauf

**status:** active  
**Stand:** 2026-11-03, Europe/Berlin  
**Abhängigkeit:** `heimgewebe/heim-pc` PR [#316](https://github.com/heimgewebe/heim-pc/pull/316), eigener freier Boot-/EFI-Operator-Scope, tatsächlich nachgewiesene Freigabe der Zielgeneration.

## Ziel

Die zuletzt real gebootete und freigegebene NixOS-Generation auch nach
normalen Systemprofil- und Bootloader-Aktualisierungen als Bootstandard
erhalten; Gen38 als Recovery behalten; den automatischen Grabowski-Start
einschließlich ChatGPT-MCP nach einem kontrollierten Neustart belegen.

## Aktuelle Live-Evidenz, 03.11.2026

- `bootctl status`: **Current** `nixos-generation-42.conf`,
  **Default** `nixos-generation-38.conf`, **SysFail**
  `nixos-generation-38.conf`; Kernel der tatsächlich gebooteten Gen42:
  `6.18.60`.
- `/run/booted-system`: `/nix/store/1sr7yj37fi167q0hpqc0d7vmjls9nmkw-nixos-system-heim-pc-26.05.20261031.fa13731`.
- `/run/current-system`: abweichende Gen43-Closure `91rlv2vd...`.
  `/nix/var/nix/profiles/system`: abweichende Gen44-Closure
  `44whbb2h...`. Weder Aktivierung noch Systemprofil beweisen den physischen Boot.
- `/boot/loader/loader.conf`: `default nixos-generation-43.conf`.
  EFI-`LoaderEntryDefault` zeigte Gen38, mit Änderungszeit 16:31 CET.
  Der konkrete Auftraggeber des 16:31-Uhr-EFI-Writes ist nicht vollständig nachgewiesen.
- Die Journaleinträge um 17:29 CET zeigen eine weitere
  `install-systemd-boot.sh`-Ausführung auf der Gen44-Closure und
  anschließendes Wiederherstellen von `loader.conf`. Ein eigener
  konkurrierender Bootloader-Install oder Reboot unterbleibt.
- Der systemweite Grabowski-Operator und der Benutzertunnel liefen nach dem
  physischen Gen42-Boot automatisch. Die ChatGPT-MCP-Werkzeuge beantworteten
  Live-Aufrufe mit Release
  `5e136cf3-nixos-lock264e747ad05a-contract23851f3e6dea`.
  Das ist ein aktueller Zugriffsbeleg, kein Post-Reboot-Beleg für die neue
  Bootquellkorrektur.

## Ursachenbefund

Die gepinnte NixOS-26.05-`systemd-boot-builder.py` generiert
`loader.conf default` aus der bei der Bootloader-Aktualisierung
übergebenen Systemgeneration. Gleichzeitig ist auf dem physischen
Heim-PC `boot.loader.efi.canTouchEfiVariables = false`, wodurch die
EFI-`LoaderEntryDefault`-Variable nicht synchron mit der Datei
aktualisiert wird. EFI hat Vorrang vor `loader.conf`. Zusätzlich
kann `configurationLimit = 10` eine nur anhand der alten
Generationsnummer gepinnte Closure später aus dem Bootmenü entfernen.

## Quellkorrektur und Prüfungen

- `heimgewebe/heim-pc` PR
  [#316](https://github.com/heimgewebe/heim-pc/pull/316),
  Head `34c3b05e1990537b986b697213797d51d7733d11`
  (noch **nicht** als integriert/aktiviert belegt).
- Ausschließlich der bestehende physische `storage-layout.nix`-
  Bootloader-Hook wurde erweitert. Die **nativen** Nix-Profile
  `heim-pc-approved` und `heim-pc-recovery` halten geprüfte
  Closures, Kernel und Initrd über die normale
  Generationenrotation hinweg. Der Hook validiert genau die
  init-Closures und Einträge, setzt EFI-Default/SysFail sowie
  `loader.conf` und prüft den Readback.
- Fünf lokale `unittest`-Regressionen bestanden, einschließlich
  Bash-`-n`-Syntax, Profilbindung, LUKS-Patch-Reihenfolge und
  EFI-/SysFail-Auswahl.
- Nixer hat die `heim-pc-storage-target`-Option
  `boot.loader.systemd-boot.extraInstallCommands` am geänderten
  Source-Worktree erfolgreich ausgewertet. Kein vollständiger
  Bootloader-/Runtime-Effekt oder Reboot damit bewiesen.

## Nachtrag: CI und Netzblocker (03.11.2026)

- Für den zunächst publizierten PR-Head `34c3b05e1990537b986b697213797d51d7733d11`
  bestand der volle GitHub-CI-Schritt `live-system` (einschließlich Build und
  systemd-VM-Proofs). Der Schritt `validate` schlug ausschließlich wegen des
  statischen `SOURCE_SNAPSHOT_SHA256` fehl:
  tatsächlich `93f6caf5b13a3c0373f28ff2e5e40654befdcba9e796910558814c2a13013930`
  statt `d191d40d0f814fa10541ae0fefca3207c104969c7e25c717970eb1665fc90ce4`.
- Der Hash wurde im **isolierten** Heim-PC-Bootfix-Worktree
  exakt nachgeführt und als lokaler Folge-Commit
  `7a97faab79ff83826b8346656e90f6f5e4e7ac74` festgehalten.
  Der originale Hash-Test sowie die fünf neuen Bootprofil-Checks
  bestanden anschließend frisch lokal. **Dieser Folge-Commit ist noch
  NICHT auf GitHub publiziert** und CI dafür noch nicht gelaufen.
- GitHub-SSH-Publikation und GitHub-CLI-API-Aufrufe scheiterten danach an
  `github.com: Name or service not known`; auch die Namensauflösung
  von `example.com` schlug fehl. WAN-IP-Pings funktionierten; Tailscale
  verwaltet DNS über `100.100.100.100` mit lokalem Standardresolver
  `192.168.178.62`. Die genaue Ursache des DNS-Ausfalls ist nicht
  bewiesen; keine unkoordinierte DNS-/Tailscale-Änderung vorgenommen.
- Das T073-Projektjournal liegt in einem **eigenen lokalen**
  MEMORA-Worktree und ist bereits commitfähig mit reparierter
  repo-lokaler Git-Identität. Der Stand kann erst nach erfolgreicher
  GitHub-Publikation als projektweit integriert gelten.
- Frischer Rootbroker-Readback bestätigt unverändert
  `Current=42`, `Default=38`, `SysFail=38`,
  `loader.conf default=43`. Der produktive Bootstandard ist
  somit **noch nicht repariert**.

## Offene Akzeptanzkriterien

1. PR #316 kritisch prüfen, CI/Integration des exakten Heads abschließen.
2. Vor der ersten Bootloader-Aktivierung mit neuem Hook die **tatsächlich**
   gebootete freigegebene Gen42 und die belegte Gen38-Recovery als
   zwei native, GC-geschützte Nix-Systemprofile über den einzigen
   autorisierten Root-Operator initialisieren; alle Store-Pfade frisch prüfen.
3. Unter exklusiver Boot-/EFI-Autorität eine reguläre
   NixOS-Bootloader-Aktualisierung ausführen; vorher/nachher
   `bootctl status`, `bootctl list`, `loader.conf` und beide
   Profile exakt rücklesen. Nach einer weiteren normalen Aktivierung
   muss der Standard stabil bleiben.
4. Kontrollierten Neustart **nur** ohne fremde produktive Arbeiten
   durchführen; die wirkliche Boot-Closure und anschließend
   Grabowski-Operator, Rootbroker, SSH, Tailscale, Benutzertunnel und
   ChatGPT-MCP mit korrekter Release-Identität nachweisen.
5. Bis zum nachgewiesenen Recovery-Nachfolger Gen38 nicht löschen,
   vorhandene ältere Bootmöglichkeiten nicht pauschal bereinigen.

**Ergebnisstatus:** Quellfix veröffentlicht und syntaktisch/evaluiert; echte
Boot-/Aktivierungs-/Post-Boot-Abnahme offen. Kein vollständiger Abschluss.

**MEMORA-Grenzen:** T069 bleibt `active`, T009
`blocked_external`, T072 `done` gemäß bestehender
Produktabnahme. Die 54/54 Konfigurator-Browsertests und der
produktive iPad-Fix werden nicht wiederholt. Stage-1 bleibt
sendefrei; keine Kunden-/Rechts-/Datenschutz-/Versandfreigaben
werden gesetzt oder behauptet.
