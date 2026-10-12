# Test Results · Updated October 12, 2026

## Automated checks

- JavaScript syntax, local links, install icons, and the PWA manifest: PASS.
- Math content generation, fraction input, invalid input, make-ten conservation, and cube counting: PASS.
- iPad install metadata and offline asset coverage: PASS.
- Seven complete-system views, all 287 indexed K–5 TEKS expectations, gray unpublished states, 12 editable reward ideas, local persistence, and iPad navigation reachability: PASS.
- Pilot Path 01 structure checks: five-mission order, three depth choices, separated evidence, distinct preview/fresh numbers, persisted attempt state, and two local learner records: PASS.
- Fraction Path 02 structure checks: five-mission order, three depth choices, exact fraction equivalence, equal-share bounds, persisted attempt and hint state, delayed transfer, and two learner records: PASS.
- Place Value Path 03 structure checks: five-mission order, three depth choices, exact base-ten and decimal values, amount-preserving trades, comparison rules, persisted work state, delayed transfer, and two learner records: PASS.
- Addition Path 04 structure checks: five-mission Check–Learn–Apply–Fresh sequence, three depth choices, exact friendly-number transformations, balanced subtraction adjustments, number-specific strategy explanations, inverse checks, persisted session evidence, and two learner records: PASS.
- Patterns Path 05 structure checks: diagnostic–balance–reverse–apply–Fresh sequence, three depth choices, exact equation solutions, constant and changing-difference patterns, number-specific combined proofs, persisted session evidence, and two learner records: PASS.
- Geometry Path 06 structure checks: diagnostic–attributes–rotation–hidden structure–Fresh sequence, three depth choices, exact quarter-turn coordinates, rotation-invariant shape properties, derived cube totals and front/side views, persisted session evidence, and two learner records: PASS.
- Measurement Path 07 structure checks: diagnostic–unit sense–conversion–boundary/surface–Fresh sequence, three depth choices, exact metric and customary conversions, derived perimeter and area, scale drawings, persisted session evidence, and two learner records: PASS.
- Data Path 08 structure checks: diagnostic–scaled graph–mode/range/median–fair claim–Fresh sequence, three depth choices, derived differences and summaries, sample/association limits, persisted hints and work, strict delayed-transfer evidence, and two learner records: PASS.
- Family cloud merge checks: newer cloud data downloads, newer device data uploads, blank devices do not replace meaningful records, all review-path records are included, and simultaneous updates for Ella and Mila merge without losing either child: PASS.
- English-only shell, static fallback, old guide redirect, query-safe offline navigation, and modal background focus protection: PASS.
- Unified child portal: one entry, six learning worlds, 41 branches, current path, complete 287-ability math map, two learner records, evidence-linked credits, editable reward ladder, gray unpublished states, and offline portal assets: PASS.
- Automated test suite: **51/51 PASS**.

## Actual browser checks

- Complete System Blueprint opened successfully in a narrow iPad-like viewport.
- K–5 Curriculum displayed all 287 expectations and clearly separated 12 pilot-connected rows from 275 gray unpublished rows.
- Curriculum filters, production-board views, personal paths, evidence rules, parent rewards, and build-status navigation opened successfully.
- Pilot Path 01 opened and completed its three-question starting diagnostic.
- A rapid second tap was blocked instead of skipping a diagnostic question.
- A used hint remained visible after page refresh, so helped work could not return as independent work.
- A used hint and a wrong attempt remained attached to Mission 3 after navigating to Mission 2 and back; the accidental-tap correction worked once and could not be repeated.
- Switching learners during the short completion animation saved the result to the original learner and did not move the other learner.
- Rapidly switching away and back during the completion animation still reloaded the latest saved learner state and advanced the correct learner exactly once.
- Changing learning depth clearly restarts the full learning chain while preserving the completed starting diagnostic, so evidence from different depths cannot mix.
- The production board colors only the specific Pilot 01 pieces that exist; every other Check, Learn, Apply, or Fresh Check piece remains gray and labeled not published.
- The unified child home opened successfully in a narrow iPad-like viewport. My Journey, Adventure Map, All Missions, Credits & Rewards, and Parent Area switched without leaving the site.
- A family reward was edited, saved, and still appeared after a full page refresh.
- Grade 3 plus “fractions” filtering reduced the complete math map from 287 entries to the six matching expectations.
- Fraction Path 02 rendered successfully at a 1024 × 768 iPad-like viewport. The gray review banner, child-sized controls, first diagnostic, all five mission controls, and parent sign-in control were present.
- Place Value Path 03 rendered successfully at a 1024 × 768 iPad-like viewport. The gray review banner, three-column learning layout, child-sized choices, first diagnostic, all five mission controls, and learner selector were present.
- Addition Path 04 rendered successfully at a 1024 × 768 iPad-like viewport. The diagnostic and all child controls were readable without overlap.
- Addition Path 04 completed a real Chromium interaction flow: three diagnostic answers selected Architect depth, Mission 2 advanced after its two number-specific steps, a Mission 3 hint survived a full refresh, and switching to Mila opened a separate untouched record.
- Patterns Path 05 rendered successfully at a 1024 × 768 iPad-like viewport with readable controls, no overlap, a gray review banner, all five missions, and the Ella/Mila selector.
- Patterns Path 05 completed a real Chromium interaction flow: three diagnostic answers selected Architect depth, the balance mission advanced only after an exact proof, a Mission 3 hint survived a full refresh, and switching to Mila opened a separate untouched record.
- Geometry Path 06 rendered successfully at a 1024 × 768 iPad-like viewport with large readable controls, no overlap, a gray review banner, all five missions, and Ella selected.
- Geometry Path 06 completed a real Chromium interaction flow: the diagnostic selected Architect depth, the shape rotated on command, using the rotation demonstration remained recorded as a hint after refresh, the cube model changed view without changing total, the front/side proof returned explicitly to the starting direction, the Fresh gate appeared, and Mila remained a separate untouched record.
- Measurement Path 07 rendered successfully at a 1024 × 768 iPad-like viewport with large readable controls, no overlap, a gray Ella review banner, all five missions, and Ella selected.
- Measurement Path 07 completed a real Chromium interaction flow: the diagnostic selected Architect depth, the unit justification advanced, a conversion hint survived refresh, the perimeter control drew four labeled outer edges, the area control covered all unit squares, the scale-drawing proof advanced, the Fresh gate appeared, and the second learner record remained separate.
- Data Path 08 rendered successfully at a 1024 × 768 iPad-like viewport with readable scaled bars, large controls, a gray zero-credit banner, and no overlap.
- Data Path 08 completed an extended Chromium flow: the diagnostic selected Architect depth; exact-value help survived refresh and remained a hint; difference 9, median 7, and the evidence-limited claim advanced correctly; family preview did not count as completion or independent evidence; an unhinted delayed challenge became independent; a hinted delayed challenge remained learning; Ella and Mila kept separate records and correct dynamic names.

## Independent review

An independent agent previously reviewed the complete framework, unified child portal, standards extraction, piece-level publication states, Pilot Path 01 evidence behavior, credits, rewards, documentation, and automated checks. After the required fixes, that review result was **PASS**. Addition Path 04 received a separate independent review of mathematics, learning evidence, cloud merge behavior, accessibility, offline coverage, and release status. Five issues were corrected, and the final re-review result was **PASS**. Patterns Path 05 received a separate independent review of every problem, the teaching sequence, exact Fresh proof, two-learner persistence, cloud integration, accessibility, offline coverage, and gray zero-credit status; the result was **PASS** with no publication blocker. Geometry Path 06 received a separate independent review of all shape, coordinate, and cube relationships, learning evidence, demonstration handling, Fresh transfer, two-learner persistence, cloud/offline integration, and iPad usability. The review found one possible viewpoint ambiguity; the course now explicitly returns to the starting direction before front/side proof, and the final re-review result was **PASS**. Measurement Path 07 received a separate independent review of all conversions, unit choices, perimeter, area, scale drawings, Fresh evidence, sync/offline integration, and iPad usability. The review blocked the first boundary visualization because highlighted edge cells could be mistaken for perimeter; it now draws and labels the four outer edges while reserving filled unit squares for area, and the final re-review result was **PASS**. Data Path 08 received a separate independent review of every graph and summary, evidence-limited claims, prompt accounting, delayed transfer, dynamic learner names, iPad usability, sync, and offline coverage. The first review found premature independent-transfer evidence and Ella labels after switching to Mila; transfer is now separate from same-session learning, only an unhinted delayed Fresh challenge can mark it independent, and every learner-facing name follows the selected child. The final re-review result was **PASS** with no remaining findings. Fraction Path 02, Place Value Path 03, Addition Path 04, Patterns Path 05, Geometry Path 06, Measurement Path 07, and Data Path 08 still await family review.

## Current limits

- Browser checks used Chromium; a physical iPad/Safari test is still required.
- The current 18 math activities remain prototypes. They are not complete learning chains by themselves.
- Of 287 official K–5 expectations, 12 are connected to the first pilot plan and 275 remain gray and unpublished.
- The framework is complete enough to show scope, but most ten-minute sessions still need authoring, review, and family testing.
- Cloud sync code, security rules, and the public login domain are deployed. A real parent login followed by a second-device recovery test remains outstanding.
- Learning outcomes have not been established through a child study.
