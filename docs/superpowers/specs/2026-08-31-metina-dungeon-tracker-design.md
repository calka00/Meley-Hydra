# Metin2 Dungeon Tracker

## Cel

Jednostronicowy, minimalistyczny dashboard do śledzenia cooldownów Hydry i Meley oraz statystyk skrzyń z runów Hydry. Aplikacja działa bez konta i serwera, a dane przechowuje lokalnie w przeglądarce.

## Zakres funkcjonalny

### Hydra

- Przycisk `Rozpocznij run` uruchamia 20-minutowy cooldown i zapisuje moment wejścia.
- Aktywny run ma pole liczby skrzyń oraz przycisk `Zapisz run`.
- Zapisany run trafia do historii z datą, godziną i liczbą skrzyń.
- Po upływie 20 minut karta pokazuje stan `Gotowa`.
- Statystyki pokazują liczbę runów, sumę skrzyń, średnią skrzyń na run oraz sumę z bieżącego dnia.
- Historia pozwala edytować i usuwać wpisy.

### Meley

Cykl ma jawne stany:

1. `Gotowa do rejestracji` z przyciskiem `Zarejestruj`.
2. `Zarejestrowana` z odliczaniem 4 godzin.
3. `Gotowa do wejścia` z przyciskiem `Wejdź`.
4. `Ukończona` z odliczaniem 4 godzin do następnej rejestracji.

Każdy aktywny timer pokazuje czas zakończenia i ma kontrolkę resetu wymagającą potwierdzenia.

## Interfejs

- Ciemny, kompaktowy dashboard bez dużych, pustych paneli.
- Dwie karty dungeonów obok siebie na desktopie i w jednej kolumnie na mobile.
- Hydra używa stonowanego turkusu, Meley stonowanego bursztynu.
- Duża typografia jest używana tylko dla odliczania; pozostałe elementy pozostają zwarte.
- Historia jest tabelą na desktopie i zwartymi wierszami na mobile.
- Nagłówek zawiera lokalny zegar i status zapisu lokalnego.

## Architektura danych

- React + Vite.
- `localStorage` jako jedyne miejsce trwałego zapisu.
- Timery przechowują timestamp końca, nie pozostałą liczbę sekund. Po odświeżeniu i wznowieniu karty czas jest wyliczany ponownie.
- Stan Hydry obejmuje aktywny cooldown i opcjonalny draft wyniku.
- Stan Meley obejmuje etap cyklu i timestamp końca bieżącego oczekiwania.
- Historia Hydry jest listą wpisów z identyfikatorem, timestampem utworzenia oraz liczbą skrzyń.

## Walidacja i błędy

- Liczba skrzyń musi być nieujemną liczbą całkowitą.
- Import JSON jest odrzucany, gdy struktura lub typy danych są nieprawidłowe; użytkownik dostaje komunikat zamiast nadpisania danych.
- Eksport JSON umożliwia wykonanie kopii zapasowej.
- Reset timerów wymaga potwierdzenia.
- Brak historii ma osobny pusty stan z instrukcją.

## Testy

- Przejścia wszystkich stanów cyklu Meley.
- Wyliczanie sumy, średniej i sumy dziennej Hydry.
- Walidacja liczby skrzyń oraz importu/eksportu.
- Odtwarzanie timerów z timestampów po odświeżeniu.
- Podstawowa responsywność i brak poziomego przepełnienia na małych ekranach.

## Poza zakresem

- Logowanie, konta i synchronizacja między urządzeniami.
- Backend i baza danych.
- Automatyczne pobieranie danych z gry.
- Powiadomienia systemowe; dashboard pokazuje stan po otwarciu lub powrocie do karty.

## Rozszerzenie: cena i sprzedaż skrzyń

- Cena skrzyni jest wpisywana ręcznie przez użytkownika dla serwera `[RUBY] Kirin`.
- Panel pod historią runów pokazuje wyłącznie cenę skrzyni, liczbę skrzyń do sprzedania i ich bieżącą wartość.
- Cena jest przechowywana jako liczba milionów yang i wyświetlana skrótowo, np. `37,5kk`.
- Licznik skrzyń do sprzedania zwiększa się przy zapisie każdego runa Hydry.
- Wartość bieżącego zarobku to `niesprzedane skrzynie × cena skrzyni`.
- Po osiągnięciu 40 skrzyń panel pokazuje wyróżniony komunikat o gotowości do sprzedaży.
- Przycisk `Sprzedane / wyzeruj` zeruje wyłącznie licznik niesprzedanych skrzyń; historia runów pozostaje bez zmian.
- Cena jest przechowywana lokalnie i można ją zmienić w dowolnym momencie.
