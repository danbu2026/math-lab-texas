import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import{PLACE_CHAIN,PLACE_TRACKS,PLACE_DIAGNOSTIC,recommendPlaceTrack,valueOfCounts,standardizeTrade,compareNumbers,formatValue,createBlankPlaceLearner}from'../dist/place-data.js';

test('place-value review path has five connected missions and three depths',()=>{
  assert.equal(PLACE_CHAIN.missions.length,5);
  assert.deepEqual(PLACE_CHAIN.missions.map(x=>x.kind),['diagnostic','learn','learn','learn','delayed-check']);
  assert.equal(Object.keys(PLACE_TRACKS).length,3);
  assert.equal(PLACE_DIAGNOSTIC.length,3);
  assert.deepEqual(createBlankPlaceLearner().sessions,{});
  assert.match(PLACE_CHAIN.releaseStatus,/waiting family review/);
});

test('place-value models preserve amounts and compare exact values',()=>{
  for(const t of Object.values(PLACE_TRACKS)){
    assert.equal(valueOfCounts(t.trade,t.places),valueOfCounts(standardizeTrade(t.trade),t.places));
    assert.ok(standardizeTrade(t.trade).every(x=>x<10));
    assert.equal(compareNumbers(...t.compare),t.compare[0]>t.compare[1]?'left':'right');
  }
  assert.equal(valueOfCounts([3,6,4],PLACE_TRACKS.strategist.places),364);
  assert.equal(valueOfCounts([3,6,4],PLACE_TRACKS.architect.places),3.64);
  assert.equal(formatValue(3.64000001),'3.64');
  assert.equal(compareNumbers(5.8,5.80),'equal');
  assert.equal(recommendPlaceTrack(1),'explorer');
  assert.equal(recommendPlaceTrack(2),'strategist');
  assert.equal(recommendPlaceTrack(3),'architect');
});

test('place-value path is touch friendly, saved, synced, and visibly unpublished',()=>{
  const html=fs.readFileSync('dist/place.html','utf8');
  const js=fs.readFileSync('dist/place.js','utf8');
  const css=fs.readFileSync('dist/pilot.css','utf8');
  assert.match(html,/Built · waiting family review/);
  assert.match(html,/does not award credits yet/);
  assert.match(js,/mathlab-place-v1/);
  assert.match(js,/cloud-sync\.js/);
  assert.match(js,/saveSession/);
  assert.match(js,/Trade ten smaller units/);
  assert.match(css,/\.place-board/);
  assert.match(css,/\.stepper button\{min-height:48px/);
});
