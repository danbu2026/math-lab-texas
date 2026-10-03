# Little STEAM Lab · Texas

An original, dependency-free, installable web app for hands-on K–5 learning. The current product is English-only.

## Working experiences

- **Little Math Lab** at `/`: six math themes and 18 interactive activity prototypes.
- **Little STEAM Lab Roadmap** at `/steam.html`: the K–5 product framework, six learning labs, 360 annual mission slots per grade, parent support, transparent build status, and family-set stage rewards.

## Try it locally

Run `npm start`, then open `http://localhost:4185/`. Core pages are cached after the first online visit.

## Install on iPad

1. Open the live site in Safari.
2. Tap Safari’s **Share** button.
3. Choose **Add to Home Screen**, then tap **Add**.
4. Open the Little Math Lab icon like any other app.

## Learning design

Each K–5 grade is planned as 12 journeys with 30 distinct ten-minute mission slots per journey. A journey combines discovery, transfer, inquiry, engineering, creative expression, useful review, and one showcase. The roadmap shows the product structure; it does not claim that all 2,160 formal missions are complete.

Children and parents can choose a meaningful reward for each journey. Reward plans stay on the device, are separate by grade, and do not use rankings or streak pressure.

## Current scope

The 18 Little Math Lab activities are working prototypes. The full K–5 STEAM curriculum still requires detailed TEKS mapping, content review, child testing, and technical testing. This is not an official curriculum or STAAR simulator, and it does not promise score gains by itself.

## Validation

- `node validate.mjs`
- `npm test`

## Known limits

The current build has not yet been tested on a physical iPad with Safari or in a formal child learning study. Rewards and progress are local to one device. Membership, accounts, payments, and the parent dashboard are future work.
