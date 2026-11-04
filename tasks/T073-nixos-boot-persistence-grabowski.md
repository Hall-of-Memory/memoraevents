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
kann das Seagate-`configurationLimit = 8` (Zukunfts-Storage: 10) eine nur anhand der alten
Generationsnummer gepinnte Closure später aus dem Bootmenü entfernen.

## Quellkorrektur und Prüfungen

- `heimgewebe/heim-pc` PR
  [#316](https://github.com/heimgewebe/heim-pc/pull/316),
  Aktueller Head `a32577f5bd0ea1fd2d00bc688a8442a442d170f1`
  (noch **nicht** als integriert oder am produktiven Bootloader aktiviert belegt).
- Der anfängliche Hook griff nur im zukünftigen Storage-Profil; Großer Adler
  beanstandete dies revisionsgebunden und die voreilige Gen42-Promotion.
  Der nachgebesserte gemeinsame Hook in `boot-approved-profiles.nix` wird
  vom realen `seagate-primary-candidate.nix` importiert und nach privatem
  LUKS-Entry-Patching auch im Zukunfts-Storage eingebunden. Die **nativen** Nix-Profile
  `heim-pc-approved` und `heim-pc-recovery` halten geprüfte
  Closures, Kernel und Initrd über die normale
  Generationenrotation hinweg. Der Hook validiert genau die
  init-Closures und Einträge, setzt EFI-Default/SysFail sowie
  `loader.conf` und prüft den Readback.
- Sieben lokale `unittest`-Regressionen bestanden, einschließlich
  Bash-`-n`-Syntax, Profilbindung, LUKS-Patch-Reihenfolge und
  EFI-/SysFail-Auswahl.
- Nixer hat am exakten neuen Worktree sowohl
  `heim-pc-seagate-grabowski-headless-candidate` (realer physischer
  Seagate-Host) als auch `heim-pc-storage-target` ausgewertet: der gemeinsame
  Hook ist bei beiden vorhanden; der Zukunfts-Storage-Patch steht davor.
  Der NixOS-Snapshot-Hash-Test für 50 Quelldateien bestand lokal.
  Kein vollständiger Bootloader-/Runtime-Effekt oder Reboot damit bewiesen.

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
  Der originale Hash-Test und die damals fünf neuen Bootprofil-Checks
  bestanden lokal. Dieser Folge-Commit wurde danach auf GitHub publiziert.
  Die erneuten Validate-/Guard-/Smoke-/CodeQL-Checks waren für `7a97faab`
  erfolgreich; ein neuerer Realhost-Fix supersediert diesen Stand.
- GitHub-SSH-Publikation und GitHub-CLI-API-Aufrufe scheiterten danach an
  `github.com: Name or service not known`; auch die Namensauflösung
  von `example.com` schlug fehl. WAN-IP-Pings funktionierten; Tailscale
  verwaltet DNS über `100.100.100.100` mit lokalem Standardresolver
  `192.168.178.62`. Die genaue Ursache des DNS-Ausfalls ist nicht
  bewiesen; keine unkoordinierte DNS-/Tailscale-Änderung vorgenommen.
  Spätere frische GitHub-DNS- und SSH-Readbacks waren wieder erfolgreich.
- Das T073-Projektjournal ist im eigenen MEMORA-Worktree revisionsgebunden
  unter PR [#117](https://github.com/Hall-of-Memory/memoraevents/pull/117)
  veröffentlicht; `main`-Integration ist separat zu prüfen.
- Frischer Rootbroker-Readback bestätigt unverändert
  `Current=42`, `Default=38`, `SysFail=38`,
  `loader.conf default=43`. Der produktive Bootstandard ist
  somit **noch nicht repariert**.

## Revisionsnachtrag: physischer Seagate-Hook (03.11.2026)

- Nach unabhängiger Großer-Adler-Gegenprüfung (zwei High-Findings
  am vorherigen Head `7a97faab`) wurde die wirkungslose reine
  `storage-layout.nix`-Einbindung im Bootfix korrigiert.
- Neue physische Quellimplementierung:
  `heimgewebe/heim-pc` PR #316, Commit
  `a32577f5bd0ea1fd2d00bc688a8442a442d170f1`.
  `boot-approved-profiles.nix` wird vom tatsächlichen
  Seagate-Grabowski-Host importiert, ohne WD-ESP oder Storage-LUKS-Ziele
  umzubauen. Der separate Future-Storage-Host nutzt denselben Hook
  nach seinem privaten Entry-Patch.
- Explizite Entscheidung: **Gen38 bleibt vorerst EFI-Standard und
  Recovery**, weil Gen42 zwar gebootet, aber iPad-KRDP-Bild-/Eingabeweg
  noch nicht vollständig produktiv abgenommen ist. Eine spätere
  Freigabe ist ein eigener genau gebundener Operator-Schritt.
- Sieben neue Boot-Hook-Regressionen, Bash-Syntax und der angepasste
  50-Dateien-NixOS-Snapshottest: PASS. Nixer wertete den
  Realhost-`extraInstallCommands` und die Future-Storage-Reihenfolge
  erfolgreich aus. Der exakte PR-Head ist veröffentlicht; CI/Integration
  und insbesondere der echte Bootloader-Lauf sind gesonderte Gates.
- Das Rootbroker-/MCP-Readback der aktuell gebooteten Gen42 ist
  kein Post-Boot-Beweis der Quellkorrektur. Es wurde kein neuer
  Neustart und kein neuer EFI-Default-Schreibvorgang ausgeführt.

## Offene Akzeptanzkriterien

1. PR #316 kritisch prüfen, CI/Integration des exakten Heads abschließen.
2. Vor der ersten Bootloader-Aktivierung mit neuem Hook die bewährte
   **Gen38 als beide Profile** (`heim-pc-approved` und `heim-pc-recovery`)
   über den alleinigen autorisierten Root-Operator initialisieren;
   alle Store- und Bootpfade frisch prüfen. Gen42 bleibt bis zur realen
   iPad-KRDP-Bild-/Eingabe-Ende-zu-Ende-Abnahme **nicht freigegeben**.
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

## Nachtrag: produktive Gen38-GC-Profile und vollständiger PR316-Teststand

**Beobachtungszeitraum 03.11.2026, ca. 20:12–20:25 MEZ.**

- Per ChatGPT → Grabowski-MCP → kanonischem Rootbroker wurde ausschließlich
  die **reversible Nix-Systemprofilinitialisierung** ausgeführt. Weil
  `grabowski-privileged-broker@.service` bewusst `ProtectSystem=strict`
  verwendet, lief der schreibende Vorgang in kurzlebigen, vom Rootbroker
  über `systemd-run --system --wait --pipe --collect` gestarteten
  Root-Units. Keine neue dauerhafte Service-Architektur.
- `/nix/var/nix/profiles/system-profiles/heim-pc-approved` → `heim-pc-approved-1-link`
  und `.../heim-pc-recovery` → `heim-pc-recovery-1-link` existieren
  jetzt **beide** und verweisen nach frischem `readlink -f` auf die exakt
  gleiche bereits funktionsfähige Gen38-Closure
  `/nix/store/2xy6inggq55kq8zzkhvppivm8yz0xlqn-nixos-system-heim-pc-26.05.20261025.1f607aa`.
  Die NixOS-Kernel-/Initrd-Rückfallgeneration wurde nicht entfernt.
- Unmittelbarer `bootctl status`-Readback nach den Profileffekten
  zeigte unverändert: **Current=Gen42, EFI-Default=Gen38, SysFail=Gen38**.
  Weder EFI-Standard noch `loader.conf` wurden bei der Profilerstellung
  verändert. Es gab **keinen** Neustart und **keinen** Bootloader-Install.
- Eine vollständige GitHub-PR-Diffprüfung deckte auf, dass in der vorigen
  PR316-Fassung unbeabsichtigt 1.019 Zeilen aus dem bestehenden
  `tests/test_nixos_system_source.py` entfernt waren. Der Writer
  restaurierte die gesamte Datei aus dem **exakten unveränderten
  GitHub-main-Blob `52bb41c571e9113d4d875ea65a89108441912d45`**
  (2.617 Zeilen) und übernahm nur den geänderten Snapshot-SHA und
  die neue Zahl 50 für die NixOS-Quelldateien.
- Aktueller publizierter PR316-Head:
  `a88dfd63cda5ffa91874ea6ec6b61097bfdf9837`.
  GitHub-Diff: **257 hinzugefügte / 2 entfernte Zeilen über 6 Dateien**,
  keine Kürzung der Test-Suite mehr.
  Acht lokale Bootprofil-Tests sowie der NixOS-Snapshot-Test bestanden
  erneut; Validate/Guard/Smoke/CodeQL am aktuellen Head wurden erfolgreich
  gemeldet, der vollständige `live-system`-CI-Job war beim letzten
  Abruf noch **in progress**.
- Der read-only Captain-Preflight bestand am neuen Head alle vorgelegten
  Source-, Scope-, Status-, Review- und Reversibilitätsgates; nur die
  noch nicht abgeschlossene `live-system`-CI verhinderte das
  grüne Merge-Gate. **Kein Merge und kein produktiver Installer-Lauf
  aus dieser Beobachtung ableiten.**

**Weiterhin offen:** Vollständige CI auf exakt `a88dfd6`, danach
autorisierte PR316-Integration, reguläre physische Bootloaderaktivierung
mit Readback von EFI/loader.conf und beiden Profileinträgen, Stabilität
nach späterer Aktivierung und ein koordinierter echter Neustart mit
Grabowski-Rootbroker/SSH/Tailscale/MCP-Ende-zu-Ende-Beweis.
Gen42 bleibt wegen offener iPad-Steuerungs-Abnahme nicht als
Bootstandard freigegeben; Gen38 ist bewusst `approved` und `recovery`.
MEMORA-Stage-1 bleibt sendefrei, T069 active, T009 blocked_external.


## Nachtrag: Codex-Findings und abgesicherter physischer Source-Fix

**Beobachtung vom 03.11.2026, nach Quelle `a88dfd6`.**

- Ein vollständiger Captain-Preflight mit der auf `a88dfd6` grünen
  NixOS-/VM-CI passierte alle allgemeinen Evidenzgates. Der echte
  Captain-Merge wurde jedoch korrekt **vor** GitHub-Mutation durch zwei
  unbearbeitete inline Codex-P2-Reviewthreads blockiert
  (`merge_guard_review_findings_unresolved_threads_present`).
- Thread `PRRT_kwDOQrJ5Vs6zRQup`: Verlust der bestehenden
  Credential-Bootstrap-Regressionen; im genauen Hauptbranch-Testblob
  restauriert (2.617 Zeilen statt 1.600, unveränderte Tests erhalten).
- Thread `PRRT_kwDOQrJ5Vs6zS6lk`: unbedingter Bootprofil-Hook im
  **frischen, separat installierbaren** Future-Storage-Ziel hätte die
  vorhandene `nixos-install`-Bootstrap-Sequenz ohne Profile blockiert.
  Kleinstmögliche Sourcekorrektur: Import aus
  `storage-layout.nix` wieder entfernt. Der verifizierte
  **reale Seagate-/Grabowski-Host** importiert den
  `boot-approved-profiles.nix`-Hook weiterhin. Private LUKS-Entry-
  Generierung im separaten Future-Storage-Ziel ist unverändert.
- Die Korrektur wurde als `heimgewebe/heim-pc` PR #316
  Commit `4e55e16eaf62f4de4e422d741c40a6cfaebc513b`
  veröffentlicht. Nixer lieferte für den realen Seagate-Host
  den Bootprofil-Install-Hook und für das Future-Storage-Ziel
  ausschließlich dessen bisherigen privaten Entry-Patch.
  Acht lokale Bootprofiltests inklusive negativem Fresh-Install-
  Test und der vollständige 50-Dateien-Snapshot-Test bestanden.
- Die zwei **materiell behobenen** Codex-P2-Threads wurden über den
  kanonischen Grabowski-GitHub-Zugriff auf `resolved=true` gestellt.
  GitHub-Readback bestätigte beide Zustände und `outdated=true`.
- Der aktuelle PR-Head ist noch nicht als **gemergt oder produktiv
  installiert** belegt; nach der Sourceänderung wurde neue
  GitHub-CI gestartet. `live-system` (Realhost-Build und VM-Proofs)
  war beim letzten Abruf noch in Arbeit; alle anderen erforderlichen
  Checks waren PASS. Weder ein neues EFI-Default noch ein Neustart
  oder ein Post-Boot-MCP-Erfolg wurde daraus behauptet.
- Die bereits geschützten nativen `heim-pc-approved` und
  `heim-pc-recovery`-Systemprofile bleiben unverändert auf der
  geprüften Generation 38; ein physischer Boot zur Gen42 belegt
  weiterhin keine vollständige iPad-Steuerungsfreigabe.

**Offen:** PR316 auf dem letzten exakten Head CI-grün integrieren,
den neuen Installer unter einziger Boot-/EFI-Autorität kontrolliert
aktivieren und nach **regulärer** Aktualisierung EFI Default,
`loader.conf`, SysFail sowie die generierten benannten Einträge
vergleichen. Neustart nur ohne fremde produktive Unterbrechung;
danach tatsächlichen Grabowski-/Rootbroker-/SSH-/Tailscale-/MCP-
Wiederanlauf belegen. T069 bleibt active, T009 blocked_external,
Stage-1 bleibt sendefrei.
