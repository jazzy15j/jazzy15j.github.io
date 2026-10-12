# Meta Ads SOP Addendum: 2026 Pre-Launch Checks

Added: Oct 12, 2026. Merge into the main Meta Ads SOP in the local JDesigns folder.

Source note: this guidance comes from agency and vendor blogs, not Meta. Re-verify
anything marked [verify] against Meta's Business Help Center before relying on it
for a client.

## A. Account and tracking (before any build)
- [ ] Pixel AND Conversions API (CAPI) are both installed and firing.
- [ ] Events are deduplicated (same event ID from Pixel and CAPI).
- [ ] The primary conversion event matches the client's real goal (purchase/lead, not just clicks).
- [ ] Event match quality / signal health checked in Events Manager. Fix before launching.

## B. Campaign structure (Andromeda era)
- [ ] Keep it consolidated: few campaigns, few ad sets, broad targeting.
- [ ] No stacked lookalike layers or heavy interest-stacking by default.
- [ ] Do not split a small budget across many ad sets (starves learning).
- [ ] Each ad set holds multiple creative concepts, not one ad.

## C. Creative (the creative does the targeting)
- [ ] Concepts differ in angle, hook, and format. Changing colors or fonts does not count as a new concept.
- [ ] Mix of formats: short vertical video for cold, carousel for comparison, static for clear offers and retargeting.
- [ ] Include at least one UGC-style / authentic concept where the client can supply one.
- [ ] Minimum concepts per launch: set by package (see packages note). Sources range from 3-5 new concepts per month per $50k spend up to 10-20+ active creatives. Small accounts: start with what the package allows and say so.
- [ ] First 3 seconds of every video has a clear hook. Track hook rate (share of viewers past 3 seconds) as the leading indicator.

## D. Advantage+ Creative settings
- [ ] Since Feb 2026 new Sales / Leads / App Promotion campaigns launch with all Advantage+ Creative enhancements ON by default [verify].
- [ ] Review the preview of EVERY enhancement before launch: auto-crop, text overlays, added music, generated variations.
- [ ] Turn off anything that changes the client's brand, claims, or look.
- [ ] Re-check previews weekly while the campaign runs.

## E. Platform and compliance
- [ ] Ads made with third-party AI tools may be auto-labeled by Meta. Tell the client.
- [ ] If any automation uses the Marketing API: confirm it is not on a retired version (v24.0 was shut down on the Marketing API on Oct 6, 2026) [verify].
- [ ] Reporting breakdowns: confirm the breakdowns we report on are still available.
- [ ] Clients targeting some European markets: a 2-5% location fee may apply [verify].

## F. Budget and seasonality
- [ ] Check the calendar. Launching or scaling between Oct 15 and Dec 31 means the Q4 cost warning must already be on file (see file 3).
- [ ] Set expected CPM range with the client in writing before launch.
- [ ] Use the client's own prior-year CPMs where available. If none, use the market ranges in the Q4 blog post and label them as estimates.

## G. Weekly check once live
- [ ] Hook rate, CPM trend, frequency, creative fatigue.
- [ ] Advantage+ previews re-checked.
- [ ] Pixel/CAPI still firing.
- [ ] Note CPM changes against the seasonal expectation, so client questions get a documented answer.
