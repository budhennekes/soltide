# Circadian App MVP — Build Plan

Source: [circadian-rhythm-app-prd.md](../circadian-rhythm-app-prd.md)
Target: Web app, iPhone-first (installable PWA), minimal, tracking + gentle gamification.

## What we're building

A single-page web app that looks and feels like a native iPhone app. One screen answers "what should I do for my light right now," with today's light timeline, compact UV/vitamin D/weather context, one-tap tracking, and a gentle streak. No account, no backend, no build tools.

## Key decisions (need your sign-off)

1. **Stack: one HTML file, inline CSS/JS.** Matches your simplicity rule. Open-Meteo for weather/UV (free, no API key), sunrise/sunset and sun angle calculated locally in JS. Settings and tracking history stored on-device (localStorage). Zero backend, zero cost.
2. **iPhone-first as a PWA.** Designed at iPhone width, "Add to Home Screen" makes it full-screen and app-like. Tradeoff, stated plainly: web apps on iPhone can't send push notifications without a server, so MVP reminders are in-app only (the hero card tells you the next window). Real push can come later if the app earns it.
3. **Gamification, but gentle.** The PRD explicitly says "avoid streak language" and "no guilt." Your ask says gamification. Reconciliation: a "Sun Streak" arc that fills each day you tap "I got light" — it celebrates but never punishes. Missing a day shows "fresh start," not a broken chain. One tap per day, no timers, no session logging.
4. **Name: using "Sol"** (the PRD's working title) until you pick otherwise.

## Tasks

### Phase 1 — Core engine
- [x] Project scaffold: `index.html` in this folder, dark-mode-first, iPhone viewport
- [x] Location: browser geolocation with manual city fallback (Open-Meteo geocoding)
- [x] Local solar math: sunrise, sunset, solar elevation, solar noon
- [x] Open-Meteo fetch: current temp, condition, cloud cover, UV now, UV max + peak time
- [x] Recommendation engine: the 8 states from the PRD (Prepare for morning light → Protect sleep), driven by time + sun + UV + weather

### Phase 2 — The Today screen
- [x] Hero card: current state, plain-English action, time remaining in window
- [x] Light timeline: sunrise → morning light → vitamin D window → sunset → dim down, with a slow sun-arc showing "now"
- [x] Context row: UV (color-coded), weather, vitamin D status — three compact chips, nothing more
- [x] Sun-gradient theming that shifts with time of day (dawn blue → golden → amber → indigo)

### Phase 3 — Tracking + gamification
- [x] One-tap check-in on the hero card: "I got outside ☀️"
- [x] Sun Streak: filling arc + day count, "fresh start" language on misses
- [x] Last-7-days dots strip (tiny, glanceable, no charts)

### Phase 4 — Settings + polish
- [x] Settings sheet: manual city, wake time, bedtime, skin type (burns easily / medium / rarely burns), °F/°C
- [x] Wake/bed times personalize the morning and dim-down windows
- [x] Graceful states: no location, API down, offline (show last-known data)
- [x] Wellness disclaimer (PRD section 14 language)
- [x] PWA bits: manifest, icon, add-to-home-screen full-screen mode

### Phase 5 — Verify
- [x] Test in browser at iPhone size: morning/midday/evening/night states (time-travel via `?sim=HH:MM`)
- [x] Test edge cases: polar night (Tromsø Dec 21), city search, check-in + streak persistence
- [x] Screenshot proof of key states

## Review (2026-07-02)

Shipped as a single `index.html` (no build step, no backend). Verified in a live iPhone-size browser preview with real Open-Meteo data for San Antonio (sunrise 6:37 AM, sunset 8:37 PM, UV 6.3 — all correct for today):

- All 8 recommendation states render correctly across simulated times (pre-dawn, morning, vitamin D, golden hour, dusk, night, plus polar day/night for extreme latitudes).
- Check-in tap → streak ring fills, 7-day dot lights, gentle toast. Persists across reloads.
- City search (Open-Meteo geocoding) and all settings save and re-render.
- Zero console errors, zero failed requests.

One bug found and fixed during verification: the sun-arc SVG viewBox was too short, clipping the sun dot near midday. Fixed by extending the arc geometry.

Testing note: append `?sim=13:00` (or a full date like `?sim=2026-12-21T12:00`) to the URL to preview any time of day.

Deferred (by design): push notifications (need a server or native wrapper on iPhone), Learn tab, Apple Health.

## Round 2 (2026-07-02, after Bud's feedback: "slightly overwhelming, suggested times")

- Every hero state now shows a concrete suggested time in a highlighted pill ("☀️ Step outside 6:37–7:07 AM", "☀️ Next light: tomorrow 6:38–7:08 AM").
- Streak card removed; streak is now a single line inside the hero (7 dots + "Day 1 ✓"), with a pop animation on check-in.
- Timeline trimmed to 3 rows (golden hour row cut; still exists as an hour-of-day state).
- UV chip subtext fixed (was truncating): now "High · peak 2PM".
- Added icon.png (180px, generated) + apple-touch-icon link so Add to Home Screen looks right on iPhone.
- Screen is now: hero → timeline card → 3 chips → one explanation line → disclaimer. Re-verified all states, check-in, zero console errors.

## Round 3 (2026-07-02, UX pass: onboarding + tracker overview)

- 3-step onboarding for new users: (1) "Meet Sol" with the three things it does, (2) location, (3) optional wake/bed times with skip. Runs once (`sol_onboarded` flag); returning users go straight to Today.
- Location success during onboarding routes to step 3, not the main screen; weather loads in the background so the reveal is instant.
- Day glance line for trackers at the bottom of the timeline card: "14h of daylight · solar noon 1:37 PM".
- Em dashes stripped from all product copy (toasts, onboarding, hero subs, title) per Bud's global rule.
- Verified full first-run flow (welcome → city search → wake 7:00/bed 22:30 → Today) and that the windows personalized (morning 7:00–8:30 AM, dim down after 8:30 PM). Zero console errors.

## Round 4 (2026-07-02, "still a bit crowded")

- Sun arc moved INTO the hero: one overview card now shows where the sun is, the current state, one short sentence, the best-time line, and a compact action row. Overview-first, action-second.
- Check-in shrunk from full-width banner to a compact pill; streak dots + label sit beside it on one row.
- "Best time" line unboxed (plain accented text, less chrome). Headline 34px → 27px.
- All hero subs cut to one sentence. Bottom "why" line removed (redundant with subs).
- Page is now 3 blocks: hero/overview → windows + day stats → chips. Chip truncation fixed.
- Re-verified morning/vitD/night states, sun stays inside the smaller arc, zero console errors.

## Round 5 (2026-07-02, gamification rethink)

- Replaced the single "I got outside" streak with **three daily light moments**: Morning light 🌅, Daylight 🌞, Wind-down 🌙. Apple-rings model: the day is the goal and it resets on its own; no chains, no guilt.
- The check-in button is contextual to the hour ("I got my morning light" / "I got some daylight" / "I'm winding down"), so evening states finally have an action.
- Progress shows twice without new space: three moment icons in the hero light up, and the matching timeline rows get a ✓.
- Label copy: "Three light moments a day" → "2 of 3 today" → "A full light day". Full-day toast celebrates.
- Old check-in history migrates to the new format (counts as morning light).
- Structure: kept now → schedule → conditions order (matches Apple Weather hierarchy + PRD's 3 layers); state pill moved above the arc as the card header.
- UV peak moved from the chip to the day-stats line ("14h daylight · noon 1:37 PM · UV peak 9 at 2PM"); chip subs shortened, no more truncation.
- Verified: all 3 moments logged across a simulated day (7:30 AM → 1 PM → 10 PM), dots + row checkmarks + "A full light day" + celebration toast, zero console errors.

## Round 6 (2026-07-02, reminders + app-polish pass)

- Settings gains a Reminders section: three toggles (morning light / vitamin D / evening wind-down), all off by default, PRD's max-3-per-day rule built in (one fire per type per day, never during sleep since windows are daytime-anchored).
- Where the platform allows web notifications (desktop/Android), Sol notifies when a window opens while the app is running. Permission requested only on first toggle-on.
- iPhone path (honest, serverless): "Add reminders to my calendar" generates a 2-week .ics with per-day computed times (sunrise/wake-based mornings, sun-elevation vitamin D, bedtime-based wind-down) with display alarms. Validated: 28 events for 2 toggles, correct times, valid VCALENDAR.
- Polish: prefers-reduced-motion support (animations off for users who ask), gear tap target enlarged to ~44px, aria-pressed/labels on toggles.
- Verified toggles persist, note text adapts to platform/permission state, sheet flow intact, zero console errors.

## Round 7 (2026-07-04, rebrand)

- Renamed Sol to Soltide everywhere: app title, PWA name, wordmark (accent-colored "tide"), onboarding, disclaimer, notification titles, calendar export IDs, README, landing copy doc.
- Repo renamed to budhennekes/soltide; live URL is now https://budhennekes.github.io/soltide/ (old Pages URL 404s; old repo URL redirects).
- localStorage keys keep the sol_ prefix on purpose so nobody loses settings or check-ins.
- Verified: new URL serves the rebranded build, wordmark renders correctly at mobile width.

## Round 8 (2026-07-04, colors + education layer)

- Recolored all six time-of-day themes: each is now a distinct, richer sky (pre-dawn indigo, peach dawn, clear blue morning, luminous midday, amber golden hour, violet dusk, deep night) with a three-stop gradient. Cards switched to dark-tinted glass so they hold definition on both bright and dark skies.
- Added an education layer (progressive disclosure, keeps the glance view calm):
  - Tappable UV and Vit D chips (with an "i" badge) open a Learn sheet expanded to that topic.
  - A "Why light matters" strip and a header ✳ icon open the full Learn sheet.
  - Learn sheet = accordion of 5 topics: Your body clock, Morning light, The UV index (with the official WHO color scale), Vitamin D from sun, Evening and sleep. Each has plain-language guidance + a highlighted "fact" with real numbers.
- All education copy is original, synthesized from primary circadian/photobiology research (Huberman, WHO/EPA UV, Holick vitamin D, Zeitzer/Phillips melatonin, Czeisler PRC). Numbers hedged per confidence; no medical dosing claims; disclaimer in the sheet. Sources captured in docs/science-notes.md.
- Verified: all themes, learn sheet open/close/accordion, chip taps, zero console errors.

Research method note: ran a parallel research sweep across morning light, evening/phase-delay, melatonin suppression, UV index, vitamin D photobiology, vitamin D winter, skin type, and circadian fundamentals. Every load-bearing number is primary-sourced with a confidence rating in docs/science-notes.md.

## Round 9 (2026-07-05, simplify + journey pass)

Feedback: still a bit overwhelming; make AM/PM sunrise/sunset prominent; gamify as a journey (not overnight); highlight education; UI/UX best practices. Web-vs-app split deferred to a later dedicated pass.

- Removed redundancy (root cause of overwhelm): the three daily moments were shown twice (hero dots + timeline checkmarks). Cut the hero dots; the timeline is now the single "Today's light · N of 3" tracker.
- Sunrise/sunset promoted from tiny labels to a prominent pair with ↑/↓ arrows and large bold times, colored by dawn/dusk.
- Journey gamification: a growing-plant line (🌱→🌿→🌳) tied to cumulative light-days with forgiving milestones ("5 days in · finding your rhythm" → "one week strong" → "a month of light"). Grows over time, never resets, no guilt. Sits as one slim line at the base of the hero.
- Collapsed the three big data chips into one slim conditions row (UV · Weather · Vit D); UV and Vit D still tappable into the Learn sheet via a subtle "i".
- Education elevated: the thin link strip became a proper accented card showing a rotating daily light tip (stable per day) with a Learn entry point.
- Verified: all states/themes, check-in updates count + timeline ✓ + journey together, conditions tap opens Learn, zero console errors.

## Round 10 (2026-07-05, live sun timer)

- Added a live countdown in the arc's empty center (turns the arc into a sun clock, no new card, no added clutter).
- Daytime: "Daylight left · Xh Ym" counting to sunset. Night: "Until sunrise · Xh Ym".
- Adaptive: calm "Xh Ym" when far off; ticks to accent-colored "M:SS" in the final hour, when a countdown actually nudges you to catch the light (golden hour) or expect first light.
- Battery/best-practice: 1s tick pauses when the tab is hidden; full resync on visibilitychange when the user returns.
- Verified midday (6h 37m), golden hour (live 27:15→27:12 ticking), night (7h 9m), zero console errors.

## Round 11 (2026-07-09, web-vs-mobile split + strategy)

Decisions locked with Bud:
- App Store path: WRAP the PWA (PWABuilder/Capacitor) + add NATIVE push (sun reminders) — the native capability is what earns Apple approval past guideline 4.2. ~$99/yr dev account. Keeps one codebase.
- Pricing: SUBSCRIPTION, premium-positioned to filter casuals. Recommended ladder = 7-day free trial → $59.99/yr hero (~$5/mo) + $9.99/mo anchor + optional ~$99 lifetime. (Bud wanted higher price / "lose freeloaders"; trial does the filtering without tanking App Store conversion.)
- Meal timing: EDUCATION ONLY. Added a "Meals and your clock" Learn card; home screen stays light-focused.

Built this round:
- Responsive web layout: at >=880px the app becomes a real 2-column dashboard (hero + big sun-clock on the left, Today's schedule / conditions / education stacked right, ~1080px max). Mobile <880px is unchanged single column. No longer a stretched phone.
- Added the meal-timing education card (6 Learn topics now).
- Verified desktop grid + mobile flex, meal card present, zero console errors.

Next steps (not yet built):
- Paywall UI + the pricing ladder; wire to StoreKit/RevenueCat when wrapping.
- App Store wrapper (PWABuilder or Capacitor) + native push notifications; App Store listing assets.
- Deeper education + copy pass; possible dedicated marketing landing page (web) separate from the app.

## Round 11 (2026-07-09, de-purple + declutter + elevate timer)

Feedback: not a fan of purple; crowded/overwhelming again; gear toward insight + action; remove journey "Day 1 begins" copy; sun timer should be an important component.
- Palette de-purpled: evening is now calm deep navy (was saturated purple), night accent shifted purple→soft sky blue, golden top and dawn mid de-purpled, sunset arrow purple→warm dusk. Blue-and-warm system, no purple.
- Hero decluttered to pure insight+action: removed the explanatory sub-paragraph AND the journey line ("Day 1 begins"). Hero is now state pill → arc+timer → sunrise/sunset → title → best-time → check-in.
- Sun timer elevated to the hero's focal point: value 30px→40px (46px desktop), bolder label. It's now the dominant element.
- Verified morning + evening states, check-in updates count, zero console errors.
