import test from'node:test';
import assert from'node:assert/strict';
import fs from'node:fs';
import{MONEY_TRACKS,MONEY_CHAIN,MONEY_DIAGNOSTIC,recommendMoneyTrack,runMoneyPlan,moneyChoiceIndex,freshMoneyChoiceIndex,createBlankMoneyLearner}from'../dist/money-data.js';

test('money path has a complete check-learn-decide-repair-fresh sequence',()=>{
  assert.equal(MONEY_CHAIN.missions.length,5);
  assert.deepEqual(MONEY_CHAIN.missions.map(x=>x.kind),['diagnostic','learn','learn','apply','delayed-check']);
  assert.equal(Object.keys(MONEY_TRACKS).length,3);
  assert.equal(MONEY_DIAGNOSTIC.length,3);
  assert.deepEqual(createBlankMoneyLearner().sessions,{});
  assert.match(MONEY_CHAIN.releaseStatus,/waiting family review/);
});

test('every budget preserves available income and exact intermediate amounts',()=>{
  const expected={explorer:[18,8],strategist:[110,50],architect:[525,285,135]};
  const preview={explorer:[22,10],strategist:[130,60],architect:[630,350,160]};
  const challenge={explorer:[26,11],strategist:[145,60],architect:[735,420,195]};
  for(const[id,t]of Object.entries(MONEY_TRACKS)){
    assert.deepEqual(runMoneyPlan(t.budget.steps),expected[id]);
    assert.deepEqual(t.fresh.preview.steps,preview[id]);
    assert.deepEqual(t.fresh.challenge.steps,challenge[id]);
    for(const n of expected[id])assert.ok(t.budget.proof.includes(String(n)));
    for(const fresh of[t.fresh.preview,t.fresh.challenge]){
      assert.ok(fresh.model);
      assert.equal(fresh.modelDecoys.length,2);
      for(const n of fresh.steps)assert.ok(fresh.proof.includes(String(n)));
      assert.match(fresh.proof,/=/);
    }
    assert.ok(t.decision.choice);
    assert.equal(t.decision.choiceDecoys.length,2);
    assert.match(t.decision.answer,/tradeoff|delay|delaying/i);
    assert.ok(Number.isFinite(t.repair.gap) && t.repair.gap>0);
    assert.equal(t.repair.gapDecoys.length,2);
    assert.match(t.repair.answer,/\$\d+|income/i);
  }
  assert.equal(recommendMoneyTrack(1),'explorer');
  assert.equal(recommendMoneyTrack(2),'strategist');
  assert.equal(recommendMoneyTrack(3),'architect');
});

test('fresh preview and delayed challenge use different stable answer positions',()=>{
  const positions=[];
  for(const[id,t]of Object.entries(MONEY_TRACKS)){
    assert.notEqual(freshMoneyChoiceIndex(id,'model',0,false,3),freshMoneyChoiceIndex(id,'model',0,true,3));
    assert.notEqual(freshMoneyChoiceIndex(id,'proof',0,false,3),freshMoneyChoiceIndex(id,'proof',0,true,3));
    for(let i=0;i<t.fresh.preview.steps.length;i++)assert.notEqual(freshMoneyChoiceIndex(id,'answer',i,false,3),freshMoneyChoiceIndex(id,'answer',i,true,3));
    positions.push(moneyChoiceIndex(`${id}:budget-answer:0`,3));
  }
  assert.ok(new Set(positions).size>1);
});

test('money path is persisted, synced, touch friendly, and visibly unpublished',()=>{
  const html=fs.readFileSync('dist/money.html','utf8');
  const js=fs.readFileSync('dist/money.js','utf8');
  const css=fs.readFileSync('dist/pilot.css','utf8');
  assert.match(html,/Built for Ella · waiting family review/);
  assert.match(html,/does not award credits yet/);
  assert.match(html,/LEARNING CHAIN 10/);
  assert.match(js,/mathlab-money-v1/);
  assert.match(js,/cloud-sync\.js/);
  assert.match(js,/saveSession/);
  assert.match(js,/complete\(1,\['budget'\]\)/);
  assert.match(js,/complete\(2,\['tradeoff'\]\)/);
  assert.match(js,/complete\(3,\['repair'\],true\)/);
  assert.match(js,/complete\(4,\['budget','transfer'\],false,!ready\)/);
  assert.match(js,/data-fresh-model/);
  assert.match(js,/data-fresh-proof/);
  assert.match(js,/data-decision-choice/);
  assert.match(js,/data-decision-answer/);
  assert.match(js,/data-gap-answer/);
  assert.match(js,/data-repair-answer/);
  assert.doesNotMatch(js,/complete\(4,\[[^\]]*'tradeoff'/);
  assert.doesNotMatch(js,/complete\(4,\[[^\]]*'repair'/);
  const switchLine=js.split('\n').find(line=>line.includes("$('#learnerSelect').onchange"));
  assert.match(switchLine,/saveLearnerChoice\(\)/);
  assert.doesNotMatch(switchLine,/ensureState\(\);save\(\)/);
  assert.match(js,/aria-label="Learning depth"/);
  assert.match(css,/@media\(max-width:760px\)/);
  assert.match(css,/\.mission-label\{font-size:15px/);
  assert.match(css,/\.track-card span\{font-size:15px/);
});
