# Soltide monetization plan (2026-07-09)

## UPDATED RECOMMENDATION (after onboarding + free-tier research)
The no-trial hard paywall is the ONE model the evidence most consistently penalizes for a daily-habit app, because people pay to *sustain* a habit they've already formed, and a locked door stops the habit forming at all. Recommended instead: **reverse trial → thin free floor.**

- **Reverse trial:** full premium free for 7 days, no credit card. On expiry, it does NOT lock out — it downgrades to a deliberately thin free floor. Mechanism = loss aversion (losing premium hurts ~2-2.5x more than gaining it).
- **Filtering comes from the effortful onboarding + the premium price, not a locked door.** That's how RISE/Fabulous stay premium while still using trials.
- **Proof point (Opal, focus app):** hard paywall → $5M ARR at 20% conversion, then growth PLATEAUED. Switched to freemium (3 free blocks/day); conversion fell to 9% but ARR hit ~$10M and 1M DAU. CEO's litmus test: "would a non-paying user recommend this to a friend? If not, the free floor is too thin."
- Data caveat: RevenueCat says hard paywall earns more per install (~5x conversion, ~11x revenue/install); Adapty finds soft paywalls convert better; the datasets disagree, so the model must be A/B-tested. Reverse trial is the defensible, testable middle.

### Free floor vs Premium (the split that answers "lose the freeloaders")
The free floor is a demo that keeps the streak alive, NOT a usable free product. Freeloaders get a daily hint and none of the compounding value.
- **FREE forever:** today's core schedule (morning-light window, wind-down time, basic UV / vitamin-D window), ONE daily reminder, current streak + today's single action, today's readout only (no history).
- **PREMIUM:** full history + trends + insights, chronotype-adaptive schedule, multiple/smart reminders, detailed UV + vitamin-D depth, the full multi-week journey/courses, travel/jet-lag mode, widgets, deeper Apple Health.

### Onboarding = the "get invested" engine (~15-25 screens, paywall at the END of session 1)
1. Problem-framing ("sunlight sets your energy and sleep"). 2-9. Personalization survey (wake time/chronotype, struggles, vitamin-D concern, location) — each answer is IKEA-effect investment (+8.5% trials, +17% conversions, +22% ARPU in Adapty tests). 10. "Building your circadian plan…" loader + social proof. 11. AHA: reveal *their* sunrise, morning-light, vitamin-D, wind-down times. 12. Commitment screen (streak goal + affirmation). 13. Notification/location pre-permission primers tied to the value. 14. Seed Day 1 (streak starts). 15. PAYWALL: 7-day trial → annual, comparison table, social proof by the button. 16. On trial expiry: downgrade to free floor, not lockout.

Pricing unchanged: **$59.99/yr default, $9.99/mo anchor**, 7-day trial, monthly de-emphasized. (Lifetime optional/promo.)

---
### (Earlier draft below — superseded by the block above)

Researched against live App Store listings + RevenueCat State of Subscription Apps 2025. Full sourcing at the bottom of this file's companion research. Prices US.

## The positioning insight
The *direct* sun/circadian apps price like disposable utilities: MyCircadianApp $36/yr, Sola $12.99/yr, D Minder $9.99/yr. Premium wellness that deliberately filters casual users prices 2-3x that: RISE $69.99/yr, Oura $69.99/yr, Opal $99.99/yr, Waking Up $119.99/yr. Competing on price would drop Soltide in the widget bin. The move is to price with the premium cohort while the category prices like a utility. That gap is the lever.

## Recommended price ladder (NO TRIAL — Bud's call, 2026-07-09)
No free trial, no free tier. Hard paywall, pay to use. Personalized preview (onboarding) shown BEFORE the wall so users see value first.
| Plan | Price | Role |
|---|---|---|
| Monthly | **$9.99/mo** | The "scary anchor." Exists to make annual obvious, not to be bought |
| Annual | **$59.99/yr (~$5/mo), pre-selected default** | Premium vs the sun-app pack, still under RISE/Oura so it doesn't look greedy |
| Lifetime | **$149 one-time, surfaced a bit more than usual** | With no trial, this captures buyers who'll pay once but won't start a recurring charge on an unproven app |

## Why no trial fits "lose the freeloaders" (with data + the tradeoff)
- Hard paywall (no free tier) converts ~**31%** of proceeding users vs ~**6%** for freemium, and self-selects committed users. Removing the trial too pushes the filter further: fewer refunds, only genuinely-wanted-in users.
- The tradeoff: no-trial paywalls convert a smaller share of *installs* than trial-gated ones, because people pay sight-unseen. Mitigation baked in: let users complete onboarding and see THEIR sunrise / UV / vitamin D window before the wall ("try the value, buy to keep it"), and lean on the App Store product page (screenshots of the personalized day) to pre-sell.
- Health & Fitness is one of the highest-converting categories: median trial-to-paid **39.9%**, top 10% **68.3%**. The median-to-top gap is almost all execution (onboarding, paywall timing), not the price number.
- ~68% of health subs sold are annual; annual year-1 retention 48-54% vs 12-22% monthly. Sell annual.
- Realized year-1 LTV per payer in the category ~**$16.44**. Model conservatively.

## Apple economics (model these)
- **Enroll in the Small Business Program before launch** → **15%** commission from day one (you're under the $1M/yr threshold), not the standard 30%.
- External-link web checkout (post-Epic): as of Dec 2025 the courts let Apple charge some "reasonable" commission on external links, and the exact fee is unresolved mid-2026. Treat web checkout as possible margin upside, NOT the base case.

## Stack
- **RevenueCat**, alone, to start. Free under **$2,500/mo tracked revenue**, then ~1% of tracked revenue. Gives paywall builder, trial/intro-offer handling, entitlements, receipt validation, analytics. The boring, bug-prone plumbing done for you.
- Add **Superwall** later only if paywall conversion becomes the main growth lever (it tests *when* to show the paywall). Keep RevenueCat for entitlements.
- Raw StoreKit 2 only if we get engineering help. For a solo non-dev, RevenueCat's 1% is cheap insurance.

## The two things that actually gate launch (both bigger than the price number)
1. **Guideline 4.2 — wrapped-PWA rejection.** This is the #1 rejection reason for WebView apps: "not sufficiently different from a mobile web browsing experience." A wrapper that just loads the site will very likely bounce. To pass we need real native elements: native onboarding + paywall screens, native (Apple system) push, native navigation/offline. This is why the reliability work (on-device local notifications, offline shell) doubles as review-survival.
2. **Guideline 3.1.2 + the category's high refund rate (4.71%, highest of any category).** Refunds come from unclear trial terms and thin value. The paywall must: state price/period/trial plainly, include Restore Purchases, and link Terms + Privacy. And the subscription must deliver *ongoing* value (daily reminders, evolving journey, season/location-updating data) — which is exactly what the reliability audit protects.

## Conversion tips (calm wellness app)
1. Show the paywall **after the aha moment**: onboard → reveal *their* sunrise, today's UV window, their vitamin D window → then the hard paywall. Never on cold launch — the free preview IS the sell now that there's no trial.
2. Annual as the visible default with per-month math ("$4.99/mo billed annually" next to "$9.99/mo").
3. **App Store product page does heavy lifting.** With no trial, the screenshots (a personalized day: their sunrise, UV window, vitamin D window, the journey) pre-sell before download. Invest in these.
4. **Test, don't guess.** Once on RevenueCat, A/B test in order: annual price ($49.99/$59.99/$79.99), paywall copy, and whether surfacing lifetime higher lifts total revenue. Public data on this exact niche is thin; the wins are in tuning.

## The through-line with reliability
The same investment protects both sides: making the iOS build genuinely native (to clear 4.2) and making the data + reminders reliable (WeatherKit, on-device notifications, offline shell, honest stale-data handling) is also what stops refunds and earns the ongoing-value bar Apple requires for subscriptions. Reliability isn't separate from monetization here; it IS the monetization moat.
