# Soltide reliability audit (2026-07-09)

Goal: before charging money, make sure paying users reliably get accurate light data and working reminders. Severity: 🔴 must-fix before charging · 🟠 important · 🟡 polish.

## The backbone is solid
Sunrise, sunset, solar elevation, the vitamin D window, and the whole recommendation engine are computed on-device with NOAA solar math (accurate to ~1 min). They work with no network, no API, offline, forever. That is the right foundation and it means the app is never fully "down."

## 🔴 1. Open-Meteo is non-commercial on the free tier
UV, weather, and city search all come from Open-Meteo's free endpoints, which are licensed for non-commercial use and rate-limited. A paid app on the free tier risks throttling or a cease-and-use, which would silently break UV/weather for paying users.
- Fix options: Open-Meteo commercial plan (cheap, keeps our code), or Apple WeatherKit (500k calls/mo included with the $99 dev account, first-party iOS data, but iOS-tied). Recommendation: WeatherKit for the iOS app since we're wrapping anyway; keep Open-Meteo for the web version under a commercial key.
- This is the #1 item. Everything else is code; this is licensing + supply.

## 🔴 2. Reminders must be on-device local notifications, not web push
Web Notifications don't fire when the app is closed and are unreliable on iOS. If reminders are a paid feature, they have to work. In the wrapper, schedule iOS local notifications on-device (reliable, no server, fire even when the app is closed). Never sell a reminder that doesn't ring.
- Today's `.ics` calendar export is a decent web stopgap and can stay for the web/PWA version.

## 🔴 3. No network timeout on the weather fetch
`fetchWeather` awaits `fetch()` with no timeout. A clean failure falls back to cache, but a *hanging* connection (common on flaky mobile networks) never rejects, so the fallback never runs and the load can stall. Add an AbortController (~8s) so it fails fast to cached data.

## 🟠 4. Cached weather has no freshness guard
On fetch failure we show the last `wxCache` with no age check, so a paying user could see days-old UV presented as current. UV changes hour to hour. Add a `fetchedAt` age check: if stale (> ~2-3h), drop the UV "now" value to "Unavailable" and/or label conditions "as of Xh ago" rather than implying live data.

## 🟠 5. Timezone mismatch for manually-searched cities
Open-Meteo `timezone=auto` returns location-local timestamps with no offset; `new Date(str)` parses them in the *device's* timezone. Fine when you're physically at the location (the usual case), but for a city searched in another timezone the UV hourly/peak and vitamin D window can be off by the offset. Fix: request `&timeformat=unixtime` and build Dates from epoch seconds (unambiguous), or read `utc_offset_seconds` and apply it.

## 🟠 6. No retry on transient failures
One network blip leaves stale data until the next 30-min refresh. Add a short retry/backoff (e.g. 2 quick retries) on fetch, and refetch on `online` and on `visibilitychange` when the last fetch is old.

## 🟡 7. No service worker (true offline shell)
The app relies on browser HTTP cache + localStorage. Add a service worker to cache the shell so an installed PWA opens reliably offline. Important for "works every time," and required to feel app-grade.

## 🟡 8. Null UV handling
Open-Meteo can return null `uv_index` (night, gaps). Already degrades to "Unavailable" in most spots; audit the vitamin D window + glance line for null-safety so a gap never renders "NaN" or a wrong window.

## 🟡 9. Debug `?sim=` param in production
The time-travel override ships in prod. Harmless and useful, but a curious user could confuse themselves. Consider gating it behind a build flag, or leave it (low risk).

## Suggested order
1. Decide the data supply (WeatherKit vs Open-Meteo commercial) — gates the wrapper.
2. Quick code hardening batch: fetch timeout (#3), cache freshness (#4), unixtime timezone (#5), retry + refetch-on-online (#6), null-safety (#8).
3. Service worker for offline shell (#7).
4. In the wrapper: on-device local notifications for reminders (#2).

The value promise ("we tell you the right thing about light, reliably") rests on #1, #2, #3, #4. Those four are the difference between a paid app people trust and a refund magnet.
