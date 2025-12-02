Dust & Glory - Vadnyugati Böngészős RPG Játékterv

(Inspiráció: The-West)

1. Koncepció

Egy perzisztens világú, böngészőből játszható MMORPG, ahol a játékosok a Vadnyugat hőskorában próbálnak szerencsét. A játék alapja az időmenedzsment (munkák végzése), a karakterfejlesztés, a párbajok és a városépítés közösségi élménye.

2. Játékmenet (Gameplay)

A. Karakteralkotás és Kasztok

A játék kezdetén a játékos egy "Zöldfülű" (Greenhorn), majd a 10. szinttől választhat kasztot, amely meghatározza a későbbi bónuszokat:

Kalandor (Adventurer): Jobb esély tárgyak találására, ingyenes pihenés hotelekben, kevesebb sérülés munkák során.

Párbajhős (Duelist): Gyorsabb regenerálódás, nagyobb kritikus sebzés párbajban, párbaj távolság bónusz.

Munkás (Worker): Több tapasztalati pont (XP) a munkákból, gyorsabb városépítés, nagyobb teherbírás.

Katona (Soldier): Nagyobb életerő (HP), taktikai bónusz védéskor, fegyverhasználati szintkövetelmény csökkentése.

B. Tulajdonságok és Képességek (Stats & Skills)

A karakterfejlesztés alapja. Minden szintlépéskor elosztható pontok:

Fő tulajdonságok (Attributes): Erő, Mozgékonyság, Ügyesség, Karizma.

Képességek (Skills): Életerő, Ütőerő, Kitérés, Rejtőzködés, Célzás, Lövés, Csapdázás, Kereskedelem, stb.

Mechanika: Minden munkának van egy nehézségi szintje, amit bizonyos képességek összegével kell elérni a sikeres elvégzéshez.

C. Munkarendszer (Core Loop)

Energia: Minden cselekvés energiába kerül (pl. 100 pont max). Idővel vagy fogyóeszközökkel (kávé, bab) töltődik vissza.

Motiváció: Ha sokat végzed ugyanazt a munkát, csökken a motiváció, így a jutalom is (XP és $).

Időzítés: A játékos választhat időtartamot (10 perc, 1 óra, 4 óra).

Loot: Pénz ($), XP, Tárgyak (szerencse alapú drop), Termékek (fix drop, pl. gyapot, szén).

D. Harcrendszer

Párbaj (PvP/PvE):

Aszinkron harc.

Taktikai beállítás: A játékos előre beállítja, hova céloz (fej, váll, kéz) és merre hajol el.

Kiszámítás: A szerver összeveti a támadó célzását és a védő kitérését + a felszerelést.

Erődharc (GvG - Guild vs Guild):

Valós idejű, körökre osztott stratégia.

A városok szövetségei harcolnak a térkép stratégiai pontjaiért.

Helyezkedés és kasztbónuszok döntenek.

E. Városok és Gazdaság

A játékosok városokat alapíthatnak a térkép adott pontjain.

Épületek:

Városháza: Építési menedzsment.

Bank: Pénz biztonságba helyezése (hogy párbajnál ne vesszen el).

Hotel: Energia visszatöltés.

Boltok (Vegyesbolt, Fegyverkovács, Szabó): Felszerelések vásárlása (várostagoknak olcsóbb).

Piac: Játékosok közötti kereskedelem (aukciós ház).

3. Dizájn és Felhasználófelület (UI/UX)

Stílusirányzat

Színek: Barna, bézs, pergamen textúrák, kopott arany, vérvörös kiemelések. "Sépia" filter hatás.

Betűtípus: Western stílusú címsorok (pl. 'Rye' vagy 'Playbill'), de jól olvasható sans-serif a törzsszövegnek.

Ikonok: Realisztikus vagy kézzel rajzolt hatású ikonok (revolverek, kalapok, lovak).

Oldalszerkezet (Layout)

Fejléc (Header):

Karakter avatar és név.

Szint és XP csík.

Életerő (HP) és Energia (Energy) sávok.

Pénz ($) és Prémium valuta (Aranyrög).

Bal Oldalsáv (Navigáció):

Karakter (Felszerelés, Statisztika).

Táska (Inventory).

Város (Ha tagja vagy).

Feladatok (Quest log).

Ranglista.

Prémium bolt.

Központi Nézet (Main Viewport):

Térkép: Izometrikus, csempés (tile-based) térkép. Húzható (drag & drop), nagyítható.

A térképen ikonok jelölik a munkákat, városokat és küldetésadókat.

Kattintásra felugró ablakok (Modals) nyílnak meg a munka részleteivel.

Jobb Oldalsáv (Értesítések/Chat):

Aktuális tevékenység (visszaszámláló: "Kukoricatörés: 04:32").

Városi chat / Szövetségi chat.

Rendszerüzenetek (Jelentések párbajról, munka befejezéséről).

Alsó Sáv:

Barátlista.

Gyorsgombok.

Reszponzivitás

Mivel modern játékról van szó, a felületnek mobilbarátnak kell lennie.

Desktop: Teljes térkép nézet, fix oldalsávok.

Mobil: A térkép teljes képernyős, a menük "hamburger" ikon mögé vagy alsó navigációs sávba (tab bar) kerülnek. Az inventory "grid" nézete alkalmazkodik a képernyő szélességéhez.