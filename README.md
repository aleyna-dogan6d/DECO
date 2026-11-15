# DECO

**Crop rotation decisions with NASA data.** (DECO: from crop rotation DECisiOn.)
NASA Space Apps Challenge 2026 · Field Shift challenge. *(Türkçe: [README.tr.md](README.tr.md))*

**Live site:** _link will be added here after publishing_

DECO lets a farmer pick their field anywhere in the world, see 25 years of NASA satellite and climate
data for that area, describe what they grow today, and compare their current rotation with two alternatives.
Every option shows why it was produced, the evidence behind it, its benefits, what we do not know, and its risks.

The tool supports the farmer's decision; it does not replace it. Every card tells the farmer to talk to a
local agricultural adviser before changing what they plant.

**What this is not.** The comparison is rule-based. It is not artificial intelligence, not a forecast and not a
crop growth model. Satellite and reanalysis data describe the region around a field, not the single field.

## How it answers the challenge

- **At least three rotations, including the current one:** the farmer's own rotation plus up to two alternatives.
  If the rules cannot produce two alternatives, the page says so and explains why.
- **For each rotation:** a one-sentence plain summary, six scores, "Why this option?", "Compared with yours",
  "Evidence" (with the data source), "Information gaps" and "Risks".
- **Plain language first:** every number has an "In other words" sentence; technical terms, sources and years
  are in a collapsible "Science details" box. The site is available in English and Turkish.
- **Works worldwide:** no region is hard-coded. We tested with Konya (Türkiye), Kingston (Jamaica),
  Seville (Spain), Ludhiana (India), Nakuru (Kenya) and Ames (Iowa, USA).

## How to use it

The site has four pages: Home, Plan my field (the tool itself), From the Field (farmers' comments; no comments
yet and no invented ones; the comment form is not open yet) and About us. There is also a **prototype** "My field"
profile page (see below). The steps below happen on "Plan my field".

1. **Choose your field:** search for a place, press "Use my location", or click on the map.
2. **Play the past:** pick a NASA layer (plants, soil moisture, rain, temperature, groundwater) and press play to
   watch 2001–2026.
3. **Describe your field:** your current rotation (crop, sowing month, harvest month; fallow is allowed), soil
   type, water (irrigated / limited / rain-fed), slope, your priorities, and the crops you can sell easily.
4. **Compare three rotations:** your rotation and up to two alternatives, each with scores, evidence,
   information gaps and risks.
5. **Ask "What if the climate changes?":** move the temperature (0 to +3°C) and rain (−30% to +10%) sliders. The
   same three cards are re-scored; changed scores and new risks are marked.
6. **Look into an option:** every card has a "Look into this option" button. It opens a panel with, for each of
   the six criteria, the score, the rule and the data behind it (only numbers the engine really calculates; no
   yield, fertiliser or seed amounts), a year-by-year transition calendar from the current rotation, the risks
   and information gaps, and a "Want help?" box with links to FAO and NASA pages and the advice to ask a local
   adviser about variety, seed rate and soil analysis.

**"My field" profile (prototype).** A farmer can save the selected field and the current rotation, see the
highest-scoring card for the saved field ("Our suggestion for this year": the same rule-based engine run again,
not a forecast), and keep a short monthly field note (date, how the soil feels: dry / normal / wet, free text).
There is no account, no password and no e-mail. Everything stays in the browser and can be deleted with one button.
The notes are not used in any calculation yet. **To look at it quickly, open "My field" and press "Try a demo
profile":** one click loads a ready-made example (Konya, wheat + fallow, three notes marked "Sample"); the demo data
are examples and do not belong to a real farmer.

Answers and the profile are stored only in the browser (localStorage). Nothing the farmer enters is sent to a server.

## NASA data used

### NASA GIBS map layers (Global Imagery Browse Services)

| Layer on the site | GIBS layer identifier | Period shown | Used for |
| --- | --- | --- | --- |
| Plants | `MODIS_Terra_L3_NDVI_Monthly` | 2001–2026 | How green the land is, month by month |
| Soil moisture | `GLDAS_Underground_Soil_Moisture_Monthly` | 2001–2026 | Long-term soil moisture (model-assisted) |
| Root-zone moisture | `SMAP_L4_Analyzed_Root_Zone_Soil_Moisture` | 2015–2026 | Moisture where roots are (model-assisted) |
| Rain | `MERRA2_Precipitation_Bias_Corrected_Monthly` | 2001–2026 | Monthly rain |
| Temperature | `MERRA2_2m_Air_Temperature_Monthly` | 2001–2026 | Monthly air temperature |
| Groundwater | `GRACE_Tellus_Liquid_Water_Equivalent_Thickness_Mascon_CRI` | 2002–2022 | Water stored on and under the ground, compared with normal |
| Base map | `OSM_Land_Water_Map`, `Reference_Features`, `Reference_Labels` | – | Land/water background, borders, place names |

Layer names and dates were checked against the GIBS catalogue on 14 November 2026. Legend colours are sampled
from the official GIBS colour-map files.

### NASA POWER (point climate data)

Monthly values for the selected point, 2001–2024, from the NASA POWER API (community `AG`):

| Parameter | Meaning | Used for |
| --- | --- | --- |
| `T2M` | Mean air temperature at 2 m | Field calendar, month suitability for each crop |
| `T2M_MIN` | Lowest temperature of the month | Frost-risk months |
| `PRECTOTCORR` | Rain (bias-corrected precipitation) | Yearly and monthly rain, water score, soil-cover score |
| `T2M_RANGE` | Monthly mean of the daily temperature range | Reference evapotranspiration (climate sliders) |
| `TOA_SW_DWN` | Radiation at the top of the atmosphere | Reference evapotranspiration (climate sliders) |

## Method

**Crop data.** 20 annual crops. Temperature and rain ranges and killing temperatures come from FAO ECOCROP
(through the table shipped with the Recocrop R package). `js/crops.js` is generated by `tools/build_crops.py`;
numbers are copied from the table without changes. Where the team supplied information instead (frost hardiness
for some crops, which crops can be sown before winter, how long some crops stay in the field), the site says so.

**Crops that are not on the list.** A farmer can enter such a crop as "Other" with its name and months. It counts
in the calendar, in the months without a crop and in the soil-cover score, and as a different plant family in
the pest cycle. Because we have no data for it, climate fit and water are not scored for that crop, and the card
says so. The rules never suggest an "Other" crop.

**Month suitability.** A month is "suitable" if the 2001–2024 mean temperature is inside the crop's optimal
range, "borderline" if inside its tolerated range, otherwise "not suitable". A month is a frost-risk month if
it dropped below 0°C in at least 20% of the years. Winter-sown crops "wait" through cold, non-lethal months.

**Six scores (1–5).** Climate fit; water (where yearly rain falls in the crop's ECOCROP rain range); nitrogen
(share of legumes); soil cover (share of rain that falls on bare soil, adjusted for slope); pest cycle (how
often a crop is followed by a different plant family); sellability (share of crops the farmer says sell easily).

**Total.** A weighted average: climate fit has a fixed weight of 3; water, soil (the average of nitrogen, soil
cover and pest cycle) and sellability are weighted by the farmer's three priority sliders.

**Alternatives.** Three simple strategies (soil health, water saving, market focused) each make a single change
to the farmer's rotation: fill an empty period or fallow, or replace one crop. The two different rotations with
the highest totals are shown. If the strategies find fewer than two, the best remaining single-change rotations
are shown as "Another possibility" and labelled as a comparison, not a suggestion.

**More ideas.** Below the cards, a section that is closed at first lists up to three two-crop rotations that do
not depend on what the farmer grows: the first crop takes its best months, the second is placed in the time the
first leaves free. They are scored with the same rules and weights, shown with their scores even when lower than
the farmer's rotation, and labelled as ideas: we do not know whether these crops are actually grown in the region.

**Thresholds chosen by the team** (not taken from a source, and stated as such on the site): rain while the crop
is in the field must reach one third of the crop's minimum yearly need; at least 30 mm of rain in the first two
months after sowing (rain-fed only); winter sowing starts 2 to 4 months before the coldest month (not in the month just before it); a place
whose coldest month averages above 15°C is treated as having no winter; a 10-point difference in the share of
rain on bare soil changes the erosion direction.

**Climate sliders.** No new model: the same rules are re-run with a shifted climate. The temperature slider adds
the same number of degrees to every month; the rain slider changes every month by the same percentage. When
the temperature slider is not zero, rain is divided by the ratio by which yearly reference evapotranspiration
rises, calculated with the Hargreaves equation of FAO-56 (equation 52). The cards stay the same; only scores and
risks change. The page states on screen that this is not a forecast.

**Soil directions.** Each card states the direction (not an amount) of three long-term effects: erosion risk,
soil nitrogen and organic matter. They compare rotations and do not react to the climate sliders.

## Known limits

- NASA POWER works on cells of roughly 50 km; GRACE on roughly 300 km. The data describe the region, not one field.
- GLDAS and SMAP L4 are model-assisted products, not direct measurements. GRACE has no data from 2017-06 to 2018-05.
- On the groundwater layer the colours are deliberately swapped (red = less water than normal, blue = more) so
  that "blue = wet" holds on every layer. NASA's original scale, and NASA Worldview, show the opposite.
- ECOCROP values are expert estimates in an older copy of the FAO database. Some values look doubtful and are
  flagged in `tools/urunler.json`; they have not all been checked against the FAO site yet.
- ECOCROP does not know varieties. For example, maize looks "borderline" all year in the cool highlands of Nakuru.
- The water score uses yearly rain. Water stored in the soil, stubble cover, prices and yields are not modelled.
- The model does not show late spring frosts or very hard winters for winter-sown crops.
- The "same family" pest rule is rough: paddy rice and wheat count as the same family.
- A rotation is entered by month; a crop that stays longer than 12 months and two crops in the field at the
  same time cannot be described.
- The "My field" profile is a prototype: it lives in one browser only and the monthly notes are not used in any
  calculation yet.
- How long crops stay in the field comes from an FAO irrigation manual for 13 crops and from the team for 7 crops
  and for all winter-sowing durations.
- The climate sliders are not a climate projection: real change is not spread evenly over the months. Heat
  waves, drought years, the effect of carbon dioxide on plants and shrinking irrigation water are not included.
  In cold or cool places warming can raise the score; that is a result of the rules, not a claim that warming is good.
- The team's thresholds were tried in only six places.
- Tested in Microsoft Edge on desktop and at a 390 px phone width; not yet tested on a real phone, Safari or Firefox.

## Future plans

None of these is done yet (the same list is on the About page):

- real accounts, so that a profile can be opened from other devices (today the profile is a browser-only prototype);
- improving the rules with farmers' notes and comments;
- training modules: short, plain explanations of crop rotation and soil health;
- taking the slope automatically from SRTM and the soil type from SoilGrids (we have not tried these two sources yet);
- more crops;
- sowing-time alerts based on short-term weather forecasts (Meteomatics);
- our own domain name.

## Sources and attributions

**NASA**

- **NASA GIBS – Global Imagery Browse Services** (NASA EOSDIS): https://earthdata.nasa.gov/gibs —
  all map tiles. Catalogue used to check layers:
  https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/1.0.0/WMTSCapabilities.xml — colour maps used for the
  legends: `https://gibs.earthdata.nasa.gov/colormaps/v1.3/<name>.xml`. Layers:
  - `MODIS_Terra_L3_NDVI_Monthly` (MODIS/Terra vegetation index) – "Plants" layer.
  - `GLDAS_Underground_Soil_Moisture_Monthly` (GLDAS) – "Soil moisture" layer.
  - `SMAP_L4_Analyzed_Root_Zone_Soil_Moisture` (SMAP Level 4) – "Root-zone moisture" layer.
  - `MERRA2_Precipitation_Bias_Corrected_Monthly` (MERRA-2) – "Rain" layer.
  - `MERRA2_2m_Air_Temperature_Monthly` (MERRA-2) – "Temperature" layer.
  - `GRACE_Tellus_Liquid_Water_Equivalent_Thickness_Mascon_CRI` (GRACE Tellus) – "Groundwater" layer.
  - `OSM_Land_Water_Map`, `Reference_Features`, `Reference_Labels` – base map, borders and place names
    (served by GIBS; the underlying map data are © OpenStreetMap contributors).
- **NASA POWER – Prediction Of Worldwide Energy Resources** (NASA Langley Research Center):
  https://power.larc.nasa.gov/ — monthly point climate data, 2001–2024; parameters `T2M`, `T2M_MIN`,
  `PRECTOTCORR`, `T2M_RANGE`, `TOA_SW_DWN` (see the table above for what each is used for).

**FAO**

- **FAO ECOCROP** database: https://ecocrop.apps.fao.org — crop temperature and rain ranges, killing
  temperatures, growing-period lengths and plant families. Read through the parameter table of the
  **Recocrop** R package (https://github.com/cropmodels/Recocrop, GPL-3). The table itself is not in this
  repository; `tools/build_crops.py` downloads it when needed.
- **FAO Irrigation Water Management Training Manual No. 3 (1986):**
  https://www.fao.org/4/s2022e/s2022e07.htm — crop water needs shown in the "Evidence" lines and typical
  growing-period lengths for 13 crops.
- **FAO Irrigation Water Management Training Manual No. 1, chapter "Soil and water":**
  https://www.fao.org/4/r4082e/r4082e03.htm — the soil sentences (sandy soil holds little water; clay soil is
  heavy and hard to work).
- **FAO Irrigation and Drainage Paper 56, "Crop evapotranspiration" (FAO-56):**
  https://www.fao.org/4/x0490e/x0490e07.htm — the Hargreaves equation (equation 52) used by the climate sliders.
- **FAO Crop Calendar:** https://cropcalendar.apps.fao.org/ — used only to cross-check how long crops stay in the
  field. It does not cover Türkiye; in Jamaica only potato and sweet potato could be checked. No data from it is
  shown on the site.
- **FAO Conservation Agriculture principles:** https://www.fao.org/conservation-agriculture/en/ — permanent soil
  cover and diversification with at least three crops (soil-cover score, pest-cycle cap, organic-matter direction).

**OpenStreetMap**

- **OpenStreetMap** (© OpenStreetMap contributors, ODbL): https://www.openstreetmap.org/copyright — map data
  behind the GIBS base map layers.
- **Nominatim** (OpenStreetMap search service): https://nominatim.openstreetmap.org — place search and the name
  of the selected point. The site waits 450 ms after typing to respect the one-request-per-second rule.

**Software libraries**

- **Leaflet 1.9.4** (BSD-2-Clause): https://leafletjs.com/ — the interactive map.
- **Chart.js 4.4.1** (MIT): https://www.chartjs.org — the rain and temperature chart on the field card.
- **GSAP 3.15.1** with its ScrollTrigger plugin: https://gsap.com — scroll animations on the Home, From the Field
  and About pages only (not on the map and plan page). GSAP is **not open source**: it is used under GSAP's own
  "Standard no charge license" (https://gsap.com/standard-license). It is loaded from a CDN (jsDelivr) and is not
  copied into this repository. If it cannot be loaded, or the browser asks for reduced motion, the site works
  without animations. Three effects were inspired by the React Bits collection (SplitText, FadeContent, CountUp)
  and rewritten with GSAP; no React Bits code and no React is used.

No other data source, library, font or image is used. No NASA logo is used. No AI model runs in the site.

## Run it locally

Open the folder in VS Code and start `index.html` with the Live Server extension, or run
`python -m http.server 8080` in this folder and open http://localhost:8080. An internet connection is needed
(NASA and OpenStreetMap services, two libraries from a CDN). "Use my location" works only on `https` or `localhost`.

```
index.html        single page
css/style.css     styles (mobile below 860 px)
js/i18n.js        English and Turkish texts
js/layers.js      NASA GIBS layers: identifiers, dates, plain-language texts, legends
js/map.js         Leaflet map
js/field.js       selected field: NASA POWER climate summary, chart, place search
js/crops.js       crop data, GENERATED by tools/build_crops.py (do not edit by hand)
js/calendar.js    field calendar and month suitability per crop
js/rotation.js    rotation timeline, six scores, alternatives (rule-based)
js/future.js      climate sliders: shifted climate, Hargreaves reference evapotranspiration
js/cards.js       rotation cards, the "Look into this option" panel and the "What if the climate changes?" box
js/pages.js       pages and menu (#home, #plan, #farmers, #about, #profile), home-page story and animations
js/plan.js        field plan form; answers stay in the browser
js/profile.js     "My field" profile prototype: saved field, rotation and monthly notes, browser storage only
js/app.js         app flow, layers, playback, language
tools/            build_crops.py and the team's crop list (urunler.json)
```

To add or change a crop, edit `tools/urunler.json` and run `python tools/build_crops.py` in this folder.
Details (in Turkish) are in [README.tr.md](README.tr.md).

## Licence

The **code** in this repository is released under the MIT License (see [LICENSE](LICENSE)).
The licence covers our code only. Libraries loaded from CDNs keep their own licences (Leaflet BSD-2-Clause,
Chart.js MIT, GSAP "Standard no charge license", which is not an open-source licence). The **data** shown by the site are not ours and are used under their own
terms: NASA GIBS and NASA POWER data, FAO ECOCROP and other FAO material, and OpenStreetMap data (ODbL) remain
subject to the conditions of their providers, listed under "Sources and attributions".

## Team

DECO Team — NASA Space Apps Challenge 2026 · Field Shift challenge.
