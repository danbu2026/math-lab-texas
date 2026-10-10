import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import{ADDITION_CHAIN,ADDITION_TRACKS,ADDITION_DIAGNOSTIC,recommendAdditionTrack,bridgeAddition,compensateSubtraction,inverseCheck,solveStory,createBlankAdditionLearner}from'../dist/addition-data.js';

test('addition review path has five connected missions and three depths',()=>{
  assert.equal(ADDITION_CHAIN.missions.length,5);
  assert.deepEqual(ADDITION_CHAIN.missions.map(x=>x.kind),['diagnostic','learn','learn','apply','delayed-check']);
  assert.equal(Object.keys(ADDITION_TRACKS).length,3);
  assert.equal(ADDITION_DIAGNOSTIC.length,3);
  assert.deepEqual(createBlankAdditionLearner().sessions,{});
  assert.match(ADDITION_CHAIN.releaseStatus,/waiting family review/);
});

test('friendly-number transformations preserve every original result',()=>{
  for(const t of Object.values(ADDITION_TRACKS)){
    assert.equal(bridgeAddition(t.addition),t.addition.a+t.addition.b);
    assert.equal(bridgeAddition(t.addition),t.addition.result);
    assert.equal(compensateSubtraction(t.subtraction),t.subtraction.start-t.subtraction.sub);
    assert.equal(compensateSubtraction(t.subtraction),t.subtraction.result);
    assert.equal(inverseCheck(t.check.start,t.check.sub,t.check.wrong),false);
    assert.equal(inverseCheck(t.check.start,t.check.sub,t.check.result),true);
    assert.equal(solveStory(t.fresh.preview),t.fresh.preview.answer);
    assert.equal(solveStory(t.fresh.challenge),t.fresh.challenge.answer);
    assert.ok(t.fresh.preview.strategy.replaceAll(',','').includes(String(t.fresh.preview.answer)));
    assert.ok(t.fresh.challenge.strategy.replaceAll(',','').includes(String(t.fresh.challenge.answer)));
  }
  assert.equal(recommendAdditionTrack(1),'explorer');
  assert.equal(recommendAdditionTrack(2),'strategist');
  assert.equal(recommendAdditionTrack(3),'architect');
  assert.doesNotMatch(ADDITION_TRACKS.explorer.fresh.preview.decoys.join(' '),/7 \+ 1 \+ 5 = 13/);
});

test('addition path is touch friendly, saved, synced, and visibly unpublished',()=>{
  const html=fs.readFileSync('dist/addition.html','utf8');
  const js=fs.readFileSync('dist/addition.js','utf8');
  const css=fs.readFileSync('dist/pilot.css','utf8');
  assert.match(html,/Built · waiting family review/);
  assert.match(html,/does not award credits yet/);
  assert.match(js,/mathlab-addition-v1/);
  assert.match(js,/cloud-sync\.js/);
  assert.match(js,/saveSession/);
  assert.match(js,/inverse check/i);
  assert.match(js,/data-fresh-strategy/);
  assert.match(js,/aria-label="Learning depth"/);
  assert.match(css,/\.jump-model/);
  assert.match(css,/\.jump-node/);
});
