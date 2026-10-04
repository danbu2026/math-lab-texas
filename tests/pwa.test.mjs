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
  for(const name of ['ipad.css','pwa.js','pilot.html','pilot.css','pilot-data.js','pilot.js','teks-k5.js','apple-touch-icon.png','icon-192.png','icon-512.png','icon-maskable-512.png']) assert.match(sw,new RegExp(name.replace('.','\\.')));
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
  assert.match(html,/id="language"[^>]+hidden/);
  assert.equal(manifest.lang,'en');
  assert.match(pwa,/Put Math Lab on the Home Screen/);
  assert.doesNotMatch(pwa,/requested === 'en'/);
});
