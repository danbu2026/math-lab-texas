import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {TRACKS,PILOT_CHAIN,DIAGNOSTIC,recommendTrack,product,splitParts,factFamily,nextDayDelayMs,isIndependentEvidence,createBlankLearner} from '../dist/pilot-data.js';
import {TEKS_ROWS} from '../dist/teks-k5.js';

test('pilot has five connected missions and three depths',()=>{
  assert.equal(PILOT_CHAIN.missions.length,5);
  assert.deepEqual(Object.keys(TRACKS),['explorer','strategist','architect']);
  assert.equal(DIAGNOSTIC.length,3);
  assert.equal(recommendTrack(0),'explorer');
  assert.equal(recommendTrack(2),'strategist');
  assert.equal(recommendTrack(3),'architect');
  const missionStandards=new Set(PILOT_CHAIN.missions.flatMap(m=>m.standards));
  const indexedPilot=new Set(TEKS_ROWS.filter(r=>r.coverageStatus==='pilot planned').map(r=>r.id));
  assert.deepEqual(indexedPilot,missionStandards);
});

test('array relationships remain mathematically exact',()=>{
  for(const t of Object.values(TRACKS)){
    const p=splitParts(t.rows,t.cols,t.split);
    assert.equal(p.left+p.right,p.total);
    assert.equal(p.total,product(t.rows,t.cols));
    const f=factFamily(t.rows,t.cols);
    assert.equal(f.multiply/t.rows,f.divideByRows);
    assert.equal(f.multiply/t.cols,f.divideByCols);
  }
  assert.throws(()=>splitParts(3,4,4));
});

test('pilot records separate evidence and delayed check',()=>{
  const learner=createBlankLearner();
  assert.deepEqual(Object.keys(learner.evidence),['concept','procedure','application','explanation']);
  assert.equal(learner.evidence.concept,'unknown');
  assert.ok(nextDayDelayMs()>=20*60*60*1000);
  assert.equal(PILOT_CHAIN.missions.at(-1).kind,'delayed-check');
  assert.equal(isIndependentEvidence(1,0),true);
  assert.equal(isIndependentEvidence(2,0),false);
  assert.equal(isIndependentEvidence(1,1),false);
  assert.deepEqual(learner.sessions,{});
});

test('fresh checks use new numbers after a parent preview',()=>{
  for(const track of Object.values(TRACKS)){
    assert.notDeepEqual(track.transfer.preview,track.transfer.fresh);
    assert.equal(track.transfer.preview.total%track.transfer.preview.groups,0);
    assert.equal(track.transfer.fresh.total%track.transfer.fresh.groups,0);
  }
});

test('pilot page is touch-friendly, accessible, and honest',()=>{
  const html=fs.readFileSync('dist/pilot.html','utf8');
  const css=fs.readFileSync('dist/pilot.css','utf8');
  const js=fs.readFileSync('dist/pilot.js','utf8');
  assert.match(html,/viewport-fit=cover/);
  assert.match(html,/aria-live="polite"/);
  assert.match(html,/Family test notes/);
  assert.match(css,/touch-action:manipulation/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(js,/Preview now for parent testing/);
  assert.match(js,/Preview results will not count as delayed evidence/);
  assert.match(js,/Accidental tap/);
  assert.match(js,/state\.sessions/);
  assert.match(js,/latest\.track!==targetTrack/);
  assert.match(js,/const latest=readStore\(\)\[targetLearner\]/);
  assert.match(js,/state=readStore\(\)\[targetLearner\]/);
  assert.match(js,/Changing depth restarts the learning chain/);
  assert.doesNotMatch(html,/[㐀-鿿]/);
});
