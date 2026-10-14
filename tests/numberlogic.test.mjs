import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {NUMBER_TRACKS,NUMBER_CHAIN,NUMBER_DIAGNOSTIC,applyRule,freshNumberChoiceIndex,createBlankNumberLearner} from '../dist/numberlogic-data.js';

const html=fs.readFileSync('dist/numberlogic.html','utf8');
const js=fs.readFileSync('dist/numberlogic.js','utf8');
const css=fs.readFileSync('dist/pilot.css','utf8');

test('number reasoning path has five short connected missions and three depths',()=>{
  assert.equal(NUMBER_CHAIN.missions.length,5);
  assert.deepEqual(NUMBER_CHAIN.missions.map(m=>m.kind),['diagnostic','learn','learn','apply','delayed-check']);
  assert.deepEqual(Object.keys(NUMBER_TRACKS),['explorer','strategist','architect']);
  assert.equal(NUMBER_DIAGNOSTIC.length,3);
  assert.match(NUMBER_CHAIN.releaseStatus,/waiting family review/);
  for(const mission of NUMBER_CHAIN.missions) assert.ok(mission.minutes<=10);
});

test('every published clue, forward answer, and reverse answer is mathematically consistent',()=>{
  for(const track of Object.values(NUMBER_TRACKS)){
    for(const [input,output] of track.learn.clues) assert.equal(applyRule(track.learn.rule,input),output,`${track.id} learn clue`);
    assert.equal(applyRule(track.apply.rule,track.apply.forward.input),track.apply.forward.answer,`${track.id} forward`);
    assert.equal(applyRule(track.apply.rule,track.apply.reverse.answer),track.apply.reverse.output,`${track.id} reverse`);
    for(const fresh of [track.fresh.preview,track.fresh.challenge]){
      for(const [input,output] of fresh.clues) assert.equal(applyRule(fresh.rule,input),output,`${track.id} fresh clue`);
      assert.equal(applyRule(fresh.rule,fresh.forward.input),fresh.forward.answer,`${track.id} fresh forward`);
      assert.equal(applyRule(fresh.rule,fresh.reverse.answer),fresh.reverse.output,`${track.id} fresh reverse`);
    }
  }
  assert.deepEqual(Object.values(NUMBER_TRACKS).map(t=>t.critique.claimResult),[13,10,11]);
});

test('fresh preview cannot teach answer positions for the delayed challenge',()=>{
  for(const track of Object.values(NUMBER_TRACKS)) for(const kind of ['rule','forward','reverse','proof']){
    assert.notEqual(freshNumberChoiceIndex(track.id,kind,0,false,3),freshNumberChoiceIndex(track.id,kind,0,true,3),`${track.id} ${kind}`);
  }
});

test('number reasoning path preserves evidence rules, two learners, iPad readability, and gray review state',()=>{
  const blank=createBlankNumberLearner();
  assert.deepEqual(Object.keys(blank.evidence),['rule','apply','critique','transfer']);
  assert.match(html,/PATH 11/);
  assert.match(html,/stays gray and does not award credits yet/);
  assert.match(html,/Ella/);assert.match(html,/Mila/);
  assert.match(js,/complete\(1,\['rule'\]\)/);
  assert.match(js,/complete\(2,\['apply'\]\)/);
  assert.match(js,/complete\(3,\['critique'\],true\)/);
  assert.match(js,/complete\(4,\['apply','transfer'\],false,!ready\)/);
  assert.match(js,/sessionKey=i===4\?`\$\{m\.id\}:\$\{freshReady\?'challenge':'preview'\}`:m\.id/);
  assert.match(js,/completedSession=sessionMissionId/);
  assert.match(js,/errors===0&&hintLevel===0&&!preview/);
  assert.match(js,/Date\.now\(\)\+20\*60\*60\*1000/);
  assert.match(js,/saveLearnerChoice\(\)/);
  assert.match(js,/mathlab-numberlogic-v1/);
  assert.match(css,/\.rule-board/);
  assert.match(css,/\.mission-label\{font-size:15px/);
  assert.match(css,/@media\(max-width:1120px\) and \(min-width:761px\)/);
});
