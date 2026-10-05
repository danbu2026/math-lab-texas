import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {TEKS_META,TEKS_ROWS} from '../dist/teks-k5.js';

const html=fs.readFileSync('dist/steam.html','utf8');
const js=fs.readFileSync('dist/steam.js','utf8');
const css=fs.readFileSync('dist/steam.css','utf8');

test('complete framework exposes every required system view',()=>{
  for(const view of ['overview','curriculum','sessions','path','evidence','parents','status']){
    assert.match(html,new RegExp(`data-page="${view}"`));
    assert.match(html,new RegExp(`data-view="${view}"`));
  }
  for(const phrase of ['K–5 Curriculum','Session Library','Personal Paths','Evidence &amp; Review','Parent &amp; Rewards','Build Status']) assert.match(html,new RegExp(phrase));
});

test('official K-5 TEKS index is complete, unique, and transparent',()=>{
  assert.equal(TEKS_META.total,287);
  assert.equal(TEKS_ROWS.length,287);
  assert.equal(new Set(TEKS_ROWS.map(r=>r.id)).size,287);
  for(const id of ['K.4','K.5','5.5','5.7'])assert.ok(TEKS_ROWS.some(r=>r.id===id),`missing unlettered TEKS ${id}`);
  assert.deepEqual(Object.fromEntries(['K','1','2','3','4','5'].map(g=>[g,TEKS_ROWS.filter(r=>r.grade===g).length])),{K:36,1:50,2:50,3:53,4:52,5:46});
  assert.equal(TEKS_ROWS.filter(r=>r.coverageStatus==='pilot planned').length,12);
  assert.equal(TEKS_ROWS.filter(r=>r.coverageStatus==='unmapped').length,275);
  assert.ok(TEKS_ROWS.every(r=>r.sourceUrl.includes('tea.texas.gov')));
  assert.ok(TEKS_ROWS.every(r=>r.studentExpectation.length>10));
  assert.ok(TEKS_ROWS.every(r=>!/(acquir e|\bone-and\b|\btwo-and\b)/.test(`${r.knowledgeAndSkills} ${r.studentExpectation}`)));
});

test('planned content is visibly gray and never presented as published',()=>{
  assert.match(html,/Gray means planned and not published/);
  assert.match(html,/Most formal sessions are gray/);
  assert.match(css,/\.state\.planned\{background:var\(--gray\)/);
  assert.match(js,/Planned · not published/);
  assert.match(js,/not published/);
  assert.match(js,/PILOT_PIECES/);
  assert.match(js,/const exists=/);
  assert.doesNotMatch(html,/2,160/);
});

test('framework distinguishes learning, evidence, and release status',()=>{
  for(const word of ['Check','Understand','Apply','Explain','Fresh check']) assert.match(html,new RegExp(word));
  for(const word of ['Concept','Procedure','Application','Explain &amp; transfer']) assert.match(html,new RegExp(word));
  for(const word of ['Planned','Prototype','Content reviewed','Ready for family test','Family validated']) assert.match(html,new RegExp(word));
  assert.match(html,/does not mean child-ready/);
});

test('family framework stays English-only and iPad responsive',()=>{
  assert.match(html,/<html lang="en">/);
  assert.doesNotMatch(html,/[㐀-鿿]/);
  assert.match(css,/@media\(max-width:1100px\)/);
  assert.match(css,/@media\(max-width:760px\)/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(js,/localStorage/);
  assert.match(js,/navigator\.serviceWorker\.register/);
});
