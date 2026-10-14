import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {VISUAL_TRACKS,VISUAL_CHAIN,VISUAL_DIAGNOSTIC,applyVisualOps,sameVisual,matchesVisualRule,freshVisualChoiceIndex,createBlankVisualLearner} from '../dist/visualpatterns-data.js';

const html=fs.readFileSync('dist/visualpatterns.html','utf8');
const js=fs.readFileSync('dist/visualpatterns.js','utf8');
const css=fs.readFileSync('dist/pilot.css','utf8');

test('visual reasoning path has five short missions and three depths',()=>{
  assert.equal(VISUAL_CHAIN.missions.length,5);
  assert.deepEqual(VISUAL_CHAIN.missions.map(m=>m.kind),['diagnostic','learn','learn','apply','delayed-check']);
  assert.equal(VISUAL_DIAGNOSTIC.length,3);
  assert.deepEqual(Object.keys(VISUAL_TRACKS),['explorer','strategist','architect']);
  for(const mission of VISUAL_CHAIN.missions)assert.ok(mission.minutes<=10);
});

test('every group, transformation, and two-direction grid is internally exact',()=>{
  for(const track of Object.values(VISUAL_TRACKS)){
    assert.ok(track.classify.examples.every(x=>matchesVisualRule(x,track.classify.criteria)));
    assert.ok(matchesVisualRule(track.classify.choices[track.classify.answer],track.classify.criteria));
    assert.equal(track.classify.choices.filter(x=>matchesVisualRule(x,track.classify.criteria)).length,1);
    assert.ok(sameVisual(applyVisualOps(track.transform.start,track.transform.ops),track.transform.result));
    for(const grid of [track.matrix,track.fresh.preview,track.fresh.challenge]){
      assert.ok(sameVisual(applyVisualOps(grid.c,grid.rowOps),grid.answer),`${track.id} row route`);
      assert.ok(sameVisual(applyVisualOps(grid.b,grid.colOps),grid.answer),`${track.id} column route`);
      assert.ok(sameVisual(grid.choices[grid.answerIndex],grid.answer));
      assert.equal(grid.choices.filter(x=>sameVisual(x,grid.answer)).length,1);
    }
  }
});

test('fresh preview and challenge cannot teach answer positions',()=>{
  for(const track of Object.values(VISUAL_TRACKS))for(const kind of ['tile','proof'])assert.notEqual(freshVisualChoiceIndex(track.id,kind,false,3),freshVisualChoiceIndex(track.id,kind,true,3));
});

test('visual path preserves honest evidence, learners, sync, iPad visuals, and gray status',()=>{
  assert.deepEqual(Object.keys(createBlankVisualLearner().evidence),['classify','transform','matrix','transfer']);
  assert.match(html,/PATH 12/);assert.match(html,/stays gray and does not award credits yet/);assert.match(html,/Ella/);assert.match(html,/Mila/);
  assert.match(js,/complete\(1,\['classify'\]\)/);assert.match(js,/complete\(2,\['transform'\]\)/);assert.match(js,/complete\(3,\['matrix'\],true\)/);assert.match(js,/complete\(4,\['matrix','transfer'\],false,!ready\)/);
  assert.match(js,/sessionKey=i===4\?`\$\{m\.id\}:\$\{freshReady\?'challenge':'preview'\}`:m\.id/);
  assert.match(js,/saveLearnerChoice/);assert.match(js,/mathlab-visualpatterns-v1/);
  assert.match(css,/\.visual-matrix/);assert.match(css,/\.visual-choice/);assert.match(css,/@media\(max-width:760px\)/);
});
