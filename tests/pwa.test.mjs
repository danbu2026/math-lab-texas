import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('iPad install metadata and icons are complete',()=>{
  const html=fs.readFileSync('dist/index.html','utf8');
  const manifest=JSON.parse(fs.readFileSync('dist/manifest.webmanifest','utf8'));
  assert.match(html,/viewport-fit=cover/);
  assert.match(html,/apple-mobile-web-app-capable/);
  assert.match(html,/apple-touch-icon/);
  assert.match(html,/id="installApp"/);
  assert.equal(manifest.display,'standalone');
  assert.equal(manifest.orientation,'any');
  for(const name of ['apple-touch-icon.png','icon-192.png','icon-512.png','icon-maskable-512.png']){
    const bytes=fs.readFileSync('dist/'+name);
    assert.deepEqual([...bytes.subarray(0,8)],[137,80,78,71,13,10,26,10]);
  }
});
test('offline cache includes iPad assets',()=>{
  const sw=fs.readFileSync('dist/sw.js','utf8');
  for(const name of ['portal.css','portal.js','portal-data.js','parent.html','parent.css','parent.js','ipad.css','pwa.js','pilot.html','pilot.css','pilot-ui.js','pilot-data.js','pilot.js','fraction.html','fraction-data.js','fraction.js','place.html','place-data.js','place.js','addition.html','addition-data.js','addition.js','patterns.html','patterns-data.js','patterns.js','geometry.html','geometry-data.js','geometry.js','measurement.html','measurement-data.js','measurement.js','datareason.html','datareason-data.js','datareason.js','modeling.html','modeling-data.js','modeling.js','money.html','money-data.js','money.js','numberlogic.html','numberlogic-data.js','numberlogic.js','visualpatterns.html','visualpatterns-data.js','visualpatterns.js','spatial.html','spatial-data.js','spatial.js','logic.html','logic-data.js','logic.js','division.html','division-data.js','division.js','multiply.html','multiply-data.js','multiply.js','factors.html','factors-data.js','factors.js','properties.html','properties-data.js','properties.js','teks-k5.js','spark-guide.svg','apple-touch-icon.png','icon-192.png','icon-512.png','icon-maskable-512.png']) assert.match(sw,new RegExp(name.replace('.','\\.')));
  assert.match(sw,/response\.ok/);
  assert.match(sw,/!response\.redirected/);
  assert.match(sw,/cached\|\|response/);
  assert.match(sw,/url\.pathname\.split\('\/'\)\.pop\(\)/);
  assert.match(sw,/caches\.match\(file\)/);
});

test('app metadata and install instructions are English-only',()=>{
  const html=fs.readFileSync('dist/index.html','utf8');
  const manifest=JSON.parse(fs.readFileSync('dist/manifest.webmanifest','utf8'));
  const pwa=fs.readFileSync('dist/pwa.js','utf8');
  assert.match(html,/<html lang="en">/);
  assert.equal(manifest.lang,'en');
  assert.match(pwa,/Put Math Lab on the iPad Home Screen/);
  assert.match(pwa,/How to install on iPad/);
  assert.match(pwa,/Install App/);
  assert.match(pwa,/isAppleTouch \?/);
  assert.doesNotMatch(pwa,/requested === 'en'/);
});
