# Design — Kloon

Bron: ontwerp "AI-kloon student" (4 mobiele en 4 desktopschermen: inloggen, uploaden, kennisbank, chat). Licht thema, rustig en leesbaar, met een bosgroen accent en een serif voor koppen en antwoorden.

## Kleur

| Token | Waarde | Gebruik |
|---|---|---|
| `--color-bg` | #F4F5F2 | pagina |
| `--color-surface` | #FFFFFF | kaarten, invoer, navigatie |
| `--color-surface-alt` | #EEF0EC | bestandsbadges, voortgangsspoor |
| `--color-border` | #DCE0DB | randen, scheidingslijnen |
| `--color-border-strong` | #868F8A | invoervelden, outline-knoppen |
| `--color-text` | #1C2321 | tekst |
| `--color-text-soft` | #3F4844 | citaten, navigatie |
| `--color-text-muted` | #56605B | secundaire tekst |
| `--color-accent` | #2F5D50 | knoppen, links, actief |
| `--color-accent-hover` | #1F4238 | hover |
| `--color-accent-tint` | #E3ECE7 | actieve navigatie, bronbadges, melding |
| `--color-accent-line` | #A9C2B8 | citaatlijn |
| `--color-ink` | #1C2321 | bericht van de gebruiker |
| `--color-warning` | #8A5A12 | bezig met verwerken |
| `--color-danger` | #A3352A | mislukt |

## Typografie
- **Newsreader** (serif): koppen (30 px mobiel, 40 px desktop), antwoorden van de kloon (18 px mobiel, 21 px desktop), citaten cursief, cijfers in statistieken.
- **Public Sans**: alle overige tekst, 15–16 px. Gewichten 400, 500, 600. Lokaal geladen via `@fontsource`.

## Vorm en spacing
Spacing in stappen van 4 px. Radius: knoppen en velden 8 px, kaarten 12 px, berichten 16 px (hoek rechtsonder 4 px), pills volledig rond.

## Navigatie
- Mobiel (< 900 px): onderbalk met vier items, icoon boven label, `safe-area-inset-bottom`.
- Desktop (≥ 900 px): zijbalk van 248 px met merk bovenaan, menu, en uitloggen onderaan.
- Items: Kennisbank, Uploaden, Chat, Instellingen. Actief: accentkleur (mobiel) of `accent-tint` achtergrond (desktop).

## Schermen
- **Inloggen:** mobiel één kolom; desktop tweekoloms met een groen merkpaneel links.
- **Uploaden:** stippellijn-dropzone, daaronder de recente uploads met status, voortgangsbalk en stappen.
- **Kennisbank:** drie statistieken, zoekveld, filterpills (Alles, PDF, Word, Presentatie, Tekst) en een lijst met documenten.
- **Chat:** kop met avatar en aantal documenten, melding dat het een AI-kloon is, berichten, invoer met ronde verzendknop. Antwoorden hebben genummerde bronbadges. Brede desktop: bronnen in een zijpaneel (≥ 1200 px), mobiel onder het antwoord.

## Bewust anders dan het ontwerp
- De chat staat achter inloggen (geen publieke bezoekersmodus).
- Geen paginanummers bij bronnen, geen duimpjes en geen voorbeeldvragen; de voortgang toont drie stappen in plaats van een percentage.
- Er is een vierde menu-item Instellingen (systeemprompt, modellen, naam van de kloon).
- Geen donkere modus.
