# Little STEAM Lab · Texas

An original, dependency-free, installable web app for hands-on K–5 learning. The current product is English-only.

## Current product surfaces

- **Child Learning Home** at `/`: one clear daily start, accumulated learning credits, family reward progress, a six-world adventure map, and clear bright/gray publication states. Adult production details and the full standards library are kept out of the child view.
- **Parent View** at `/parent.html`: a Start Here project guide, purpose, ten-minute routine, learning benefits and limits, current build status, progress, reward settings, reviewed course links, and the full blueprint in a separate management page.
- **Complete K–5 System Blueprint** at `/steam.html`: the product map, all 287 official K–5 TEKS student expectations, the session production board, personal paths, evidence rules, parent experience, rewards, and transparent build status.
- **Pilot Path 01** at `/pilot.html`: five connected ten-minute missions for multiplication relationships, with three learning depths and separate concept, procedure, application, and explanation evidence.
- **Family Review Path 02** at `/fraction.html`: five connected fraction missions covering equal shares, number-line position, equivalence, and delayed transfer. It is built and testable but remains gray until family review.
- **Family Review Path 03** at `/place.html`: five connected place-value missions covering unit value, building numbers, base-ten trades, comparison, and delayed transfer. It includes whole-number and decimal depths and remains gray until family review.
- **Family Review Path 04** at `/addition.html`: five connected strategy missions covering friendly-number bridges, balanced decomposition, subtraction compensation, inverse checking, and delayed story transfer. It remains gray until family review.
- **Family Review Path 05** at `/patterns.html`: five connected reasoning missions covering equality as balance, unknown values, constant and growing changes, immediate application, and delayed two-part transfer. It remains gray until family review.
- **Family Review Path 06** at `/geometry.html`: five connected spatial missions covering invariant shape properties, clockwise coordinate rotation, cube structures, changing viewpoints, and delayed transfer. It remains gray until family review.
- **Ella Family Review Path 07** at `/measurement.html`: five connected measurement missions covering useful unit choice, value-preserving conversion, perimeter, area, scale drawings, and delayed transfer. It remains gray until family review.
- **Ella Family Review Path 08** at `/datareason.html`: five connected data missions covering graph scales, differences, mode/range/median, evidence-limited conclusions, and delayed transfer. It remains gray until family review.
- **Ella Family Review Path 09** at `/modeling.html`: five connected problem-solving missions covering relevant information, ordered multi-step plans, error diagnosis, reasonableness, and delayed transfer. It remains gray until family review.
- **Ella Family Review Path 10** at `/money.html`: five connected money-decision missions covering needs and wants, balanced budgets, stated priorities and tradeoffs, gross and net income, exact budget repair, and delayed transfer. It remains gray until family review.
- **Ella Family Review Path 11** at `/numberlogic.html`: five connected quantitative-reasoning missions covering multi-clue rule inference, forward and backward application, counterexamples, rule repair, and delayed transfer to a changed relationship. It remains gray until family review.
- **Ella Family Review Path 12** at `/visualpatterns.html`: five connected visual-reasoning missions covering attribute classification, multi-attribute transformations, two-direction figure matrices, explicit proof, and delayed transfer. It remains gray until family review.
- **Ella Family Review Path 13** at `/spatial.html`: five connected spatial-reasoning missions covering mental rotation, ordered front/right-side views, hidden stack constraints, evidence sufficiency, and delayed transfer. It remains gray until family review; paper folding and solid nets remain planned.
- **Ella Family Review Path 14** at `/logic.html`: five connected language-and-logic missions covering precise category language, if-then reasoning, clue combination, elimination with proof, and delayed transfer. It remains gray until family review.
- **Little Math Lab prototypes** at `/labs.html`: six math themes and 18 interactive activity prototypes that can be reused as parts of future learning chains.

## Try it locally

Run `npm start`, then open `http://localhost:4185/`. Core pages are cached after the first online visit.

## Install on iPad

1. Open the live site in Safari.
2. Tap Safari’s **Share** button.
3. Choose **Add to Home Screen**, then tap **Add**.
4. Open the Little Math Lab icon like any other app.

## Learning design

The system is organized by learning ability instead of a fixed number of repeated worksheets. Every content ability must eventually receive four connected production pieces: Check, Learn, Apply, and Fresh Check. Mathematical process standards are woven into those content missions. The website keeps every unfinished piece visible in gray so the family can see the complete scope without mistaking planned work for published curriculum.

Each daily experience is designed for about ten minutes. A learner can begin near the current ability level, move backward only when evidence reveals a prerequisite gap, and move ahead after independent performance returns in a changed problem after time has passed.

Children and parents can choose meaningful milestone rewards. Learning records work offline and sync to one family account after parent Google sign-in. The system does not use rankings or streak pressure. Course pages use a child-focused layout with large answers and one current task; learning evidence, depth controls, and family notes open only through Parent View.

## Current scope

The complete child-facing architecture is now visible as six learning worlds: Math Expedition, Reasoning Quest, Science Discovery, Engineering Studio, Technology & Coding, and Creative Design. Their 41 major branches and subskills are written into the adventure map. The official math TEKS index and top-to-bottom math framework are built. Pilot Path 01 is the first family-test-ready learning chain. Fraction Path 02, Place Value Path 03, Addition Path 04, Patterns Path 05, Geometry Path 06, Measurement Path 07, Data Path 08, Modeling Path 09, Money Path 10, Number Logic Path 11, Visual Patterns Path 12, and Spatial Thinking Path 13, and Language & Logic Path 14 are built and waiting for family review. Most formal sessions have not yet been authored, reviewed, or family-tested and therefore appear gray. This is not an official curriculum or test simulator, and it does not promise score gains by itself.

## Validation

- `node validate.mjs`
- `npm test`

## Known limits

The current build has not yet been tested on a physical iPad with Safari or in a formal child learning study. Google family sign-in and cloud storage are deployed, but the final two-device recovery test still requires completing one real parent sign-in. Family email/password accounts, child PIN profiles, the daily recommendation engine, membership, and payments are future work.
