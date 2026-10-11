import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import{PATTERN_CHAIN,PATTERN_TRACKS,PATTERN_DIAGNOSTIC,recommendPatternTrack,balanceMissing,solveUnknown,predictPattern,createBlankPatternLearner}from'../dist/patterns-data.js';

test('patterns review path has a complete check-learn-apply-fresh sequence',()=>{
  assert.equal(PATTERN_CHAIN.missions.length,5);
  assert.deepEqual(PATTERN_CHAIN.missions.map(x=>x.kind),['diagnostic','learn','learn','apply','delayed-check']);
  assert.equal(Object.keys(PATTERN_TRACKS).length,3);
  assert.equal(PATTERN_DIAGNOSTIC.length,3);
  assert.deepEqual(createBlankPatternLearner().sessions,{});
  assert.match(PATTERN_CHAIN.releaseStatus,/waiting family review/);
});

test('every balance, unknown, and pattern result is derived from its data',()=>{
  for(const t of Object.values(PATTERN_TRACKS)){
    assert.equal(balanceMissing(t.balance.total,t.balance.known),t.balance.answer);
    assert.equal(solveUnknown(t.unknown),t.unknown.answer);
    assert.equal(predictPattern(t.pattern.sequence),t.pattern.next);
    for(const fresh of [t.fresh.preview,t.fresh.challenge]){
      assert.equal(solveUnknown(fresh.equation),fresh.equation.answer);
      assert.equal(predictPattern(fresh.sequence),fresh.next);
      const proof=fresh.proof.replaceAll(',','');
      assert.ok(proof.includes(String(fresh.equation.answer)));
      assert.ok(proof.includes(String(fresh.next)));
    }
  }
  assert.equal(recommendPatternTrack(1),'explorer');
  assert.equal(recommendPatternTrack(2),'strategist');
  assert.equal(recommendPatternTrack(3),'architect');
});

test('patterns path is touch friendly, persisted, synced, and visibly unpublished',()=>{
  const html=fs.readFileSync('dist/patterns.html','utf8');
  const js=fs.readFileSync('dist/patterns.js','utf8');
  const css=fs.readFileSync('dist/pilot.css','utf8');
  assert.match(html,/Built · waiting family review/);
  assert.match(html,/does not award credits yet/);
  assert.match(js,/mathlab-patterns-v1/);
  assert.match(js,/cloud-sync\.js/);
  assert.match(js,/saveSession/);
  assert.match(js,/data-fresh-proof/);
  assert.match(js,/aria-label="Learning depth"/);
  assert.match(css,/\.balance-model/);
  assert.match(css,/\.pattern-row/);
});
