import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html=fs.readFileSync('dist/steam.html','utf8');
const js=fs.readFileSync('dist/steam.js','utf8');
const css=fs.readFileSync('dist/steam.css','utf8');

test('STEAM blueprint exposes all seven working views',()=>{
  for(const view of ['today','journey','labs','rewards','map','parents','status']){
    assert.match(html,new RegExp(`data-page="${view}"`));
    assert.match(html,new RegExp(`data-view="${view}"`));
  }
});

test('annual plan is 12 stages of 30 distinct missions',()=>{
  assert.match(js,/const journeys=\[/);
  assert.equal((js.match(/\],\['/g)||[]).length >= 11,true);
  assert.match(js,/Array\(12\)\.fill\('discovery'\)/);
  assert.match(js,/Array\(6\)\.fill\('transfer'\)/);
  assert.match(js,/Array\(4\)\.fill\('inquiry'\)/);
  assert.match(js,/Array\(3\)\.fill\('engineering'\)/);
  assert.match(js,/Array\(2\)\.fill\('creative'\)/);
  assert.match(js,/Array\(2\)\.fill\('review'\)/);
  assert.match(js,/'capstone'/);
});

test('reward plan has twelve editable stages and device persistence',()=>{
  assert.match(html,/id="rewardGrid"/);
  assert.match(html,/id="saveRewards"/);
  assert.match(js,/steam-rewards-v1/);
  assert.match(js,/journeys\.map\(\(j,i\)=>`<article class="reward-card"/);
  assert.match(js,/writeLocal\('steam-rewards-v1'/);
});

test('iPad navigation keeps every blueprint view reachable',()=>{
  assert.doesNotMatch(css,/nav:nth-of-type\(2\)\{display:none\}/);
  assert.doesNotMatch(css,/button\[data-view="map"\]\{display:none\}/);
  assert.match(css,/\.sidebar nav\{display:flex;overflow-x:auto/);
});

test('offline cache contains the complete STEAM shell',()=>{
  const sw=fs.readFileSync('dist/sw.js','utf8');
  for(const file of ['steam.html','steam.css','steam-rewards.css','steam.js']) assert.match(sw,new RegExp(file.replace('.','\\.')));
});

test('explicit URL language wins and STEAM can prepare offline on first visit',()=>{
  assert.match(js,/requestedLang==='en'\|\|requestedLang==='zh'/);
  assert.match(js,/navigator\.serviceWorker\.register\('sw\.js'\)/);
  assert.match(js,/function readLocal\(key,fallback\)/);
});

test('reward drafts save while editing and copy counts the showcase inside thirty',()=>{
  assert.match(js,/rewardGrid'\)\.addEventListener\('input'/);
  assert.match(js,/rewardGrid'\)\.addEventListener\('change'/);
  assert.match(js,/完成30个独特任务（其中包含阶段展示）/);
  assert.match(js,/including the stage showcase/);
});

test('storage failure is reported honestly and keeps an in-page fallback',()=>{
  assert.match(js,/const memoryStore=\{\}/);
  assert.match(js,/hasOwnProperty\.call\(memoryStore,key\)/);
  assert.match(js,/function writeLocal\(key,value\).*return true.*return false/);
  assert.match(js,/Device storage is unavailable/);
  assert.match(js,/设备存储暂不可用/);
});
