# Little STEAM Lab · Texas

An original, dependency-free, installable web app for hands-on K–5 learning. The current product is English-only.

## Current product surfaces

- **Child Learning Home** at `/`: one unified entry with today's mission, accumulated learning credits, family reward progress, a six-world adventure map, 41 major branches, the complete math ability library, and clear bright/gray publication states.
- **Complete K–5 System Blueprint** at `/steam.html`: the product map, all 287 official K–5 TEKS student expectations, the session production board, personal paths, evidence rules, parent experience, rewards, and transparent build status.
- **Pilot Path 01** at `/pilot.html`: five connected ten-minute missions for multiplication relationships, with three learning depths and separate concept, procedure, application, and explanation evidence.
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

Children and parents can choose meaningful milestone rewards. Reward ideas stay on the device and do not use rankings or streak pressure.

## Current scope

The complete child-facing architecture is now visible as six learning worlds: Math Expedition, Reasoning Quest, Science Discovery, Engineering Studio, Technology & Coding, and Creative Design. Their 41 major branches and subskills are written into the adventure map. The official math TEKS index and top-to-bottom math framework are built. Pilot Path 01 is the first connected learning chain. Most formal sessions have not yet been authored, reviewed, or family-tested and therefore appear gray. This is not an official curriculum or test simulator, and it does not promise score gains by itself.

## Validation

- `node validate.mjs`
- `npm test`

## Known limits

The current build has not yet been tested on a physical iPad with Safari or in a formal child learning study. Rewards and progress are local to one device. The daily recommendation engine, full parent dashboard, membership, accounts, and payments are future work.
