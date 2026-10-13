import test from'node:test';
import assert from'node:assert/strict';
import fs from'node:fs';
import{MODELING_TRACKS,MODELING_CHAIN,MODELING_DIAGNOSTIC,recommendModelingTrack,runPlan,choiceIndex,freshChoiceIndex,createBlankModelingLearner}from'../dist/modeling-data.js';

test('modeling path has a complete check-learn-apply-fresh sequence',()=>{
  assert.equal(MODELING_CHAIN.missions.length,5);
  assert.deepEqual(MODELING_CHAIN.missions.map(x=>x.kind),['diagnostic','learn','learn','apply','delayed-check']);
  assert.equal(Object.keys(MODELING_TRACKS).length,3);
  assert.equal(MODELING_DIAGNOSTIC.length,3);
  assert.deepEqual(createBlankModelingLearner().sessions,{});
  assert.match(MODELING_CHAIN.releaseStatus,/waiting family review/);
});

test('every multi-step plan and fresh proof preserves exact intermediate results',()=>{
  const expected={explorer:[30,21],strategist:[384,134],architect:[252,168,28]};
  const preview={explorer:[25,20],strategist:[234,84],architect:[360,288,36]};
  const challenge={explorer:[29,22],strategist:[390,115],architect:[288,216,36]};
  for(const [id,t] of Object.entries(MODELING_TRACKS)){
    assert.deepEqual(runPlan(t.plan.steps),expected[id]);
    assert.deepEqual(t.fresh.preview.steps,preview[id]);
    assert.deepEqual(t.fresh.challenge.steps,challenge[id]);
    for(const n of expected[id])assert.ok(t.plan.proof.includes(String(n)));
    for(const fresh of [t.fresh.preview,t.fresh.challenge]){
      assert.ok(fresh.model);
      assert.equal(fresh.modelDecoys.length,2);
      for(const n of fresh.steps)assert.ok(fresh.proof.includes(String(n)));
    }
  }
  assert.equal(recommendModelingTrack(1),'explorer');
  assert.equal(recommendModelingTrack(2),'strategist');
  assert.equal(recommendModelingTrack(3),'architect');
});

test('choice positions are stable per question but vary across questions',()=>{
  const positions=[];
  for(const [id,t] of Object.entries(MODELING_TRACKS)){
    for(let i=0;i<t.plan.steps.length;i++)positions.push(choiceIndex(`${id}:plan-answer:${i}`,3));
    positions.push(choiceIndex(`${id}:fresh-model`,3));
    assert.equal(choiceIndex(`${id}:fresh-model`,3),choiceIndex(`${id}:fresh-model`,3));
  }
  assert.ok(new Set(positions).size>1);
});

test('fresh preview and delayed challenge use different stable answer positions',()=>{
  for(const [id,t] of Object.entries(MODELING_TRACKS)){
    assert.notEqual(freshChoiceIndex(id,'model',0,false,3),freshChoiceIndex(id,'model',0,true,3));
    assert.notEqual(freshChoiceIndex(id,'proof',0,false,3),freshChoiceIndex(id,'proof',0,true,3));
    for(let i=0;i<t.fresh.preview.steps.length;i++){
      assert.notEqual(freshChoiceIndex(id,'answer',i,false,3),freshChoiceIndex(id,'answer',i,true,3));
      assert.equal(freshChoiceIndex(id,'answer',i,true,3),freshChoiceIndex(id,'answer',i,true,3));
    }
  }
});

test('modeling path is persisted, synced, touch friendly, and visibly unpublished',()=>{
  const html=fs.readFileSync('dist/modeling.html','utf8');
  const js=fs.readFileSync('dist/modeling.js','utf8');
  const css=fs.readFileSync('dist/pilot.css','utf8');
  assert.match(html,/Built for Ella · waiting family review/);
  assert.match(html,/does not award credits yet/);
  assert.match(js,/mathlab-modeling-v1/);
  assert.match(js,/cloud-sync\.js/);
  assert.match(js,/saveSession/);
  assert.match(js,/complete\(1,\['information'\]\)/);
  assert.match(js,/complete\(2,\['plan'\]\)/);
  assert.match(js,/complete\(3,\['revision'\],true\)/);
  assert.match(js,/complete\(4,\['plan','transfer'\],false,!ready\)/);
  assert.doesNotMatch(js,/complete\(4,\['information'/);
  assert.doesNotMatch(js,/complete\(4,\[[^\]]*'revision'/);
  assert.match(js,/data-fresh-proof/);
  assert.match(js,/data-fresh-model/);
  assert.match(js,/function arrange/);
  assert.match(js,/choiceIndex\(seed/);
  const switchLine=js.split('\n').find(line=>line.includes("$('#learnerSelect').onchange"));
  assert.match(switchLine,/saveLearnerChoice\(\)/);
  assert.doesNotMatch(switchLine,/ensureState\(\);save\(\)/);
  assert.match(js,/evidenceTitle/);
  assert.match(js,/aria-label="Learning depth"/);
  assert.match(css,/\.story-card/);
  assert.match(css,/\.plan-flow/);
  assert.match(css,/@media\(max-width:760px\)/);
});
