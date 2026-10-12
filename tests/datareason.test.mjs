import test from'node:test';
import assert from'node:assert/strict';
import fs from'node:fs';
import{DATA_TRACKS,DATA_CHAIN,DATA_DIAGNOSTIC,recommendDataTrack,graphDifference,dataSummary,createBlankDataLearner}from'../dist/datareason-data.js';

test('data review path has a complete check-learn-apply-fresh sequence',()=>{
  assert.equal(DATA_CHAIN.missions.length,5);
  assert.deepEqual(DATA_CHAIN.missions.map(x=>x.kind),['diagnostic','learn','learn','apply','delayed-check']);
  assert.equal(Object.keys(DATA_TRACKS).length,3);
  assert.equal(DATA_DIAGNOSTIC.length,3);
  assert.deepEqual(createBlankDataLearner().sessions,{});
  assert.match(DATA_CHAIN.releaseStatus,/waiting family review/);
});

test('every graph difference and data summary is derived from source data',()=>{
  for(const t of Object.values(DATA_TRACKS)){
    assert.equal(graphDifference(t.graph),t.graph.answer);
    assert.equal(dataSummary(t.summary.data,t.summary.kind),t.summary.answer);
    for(const fresh of [t.fresh.preview,t.fresh.challenge]){
      assert.equal(graphDifference(fresh.graph),fresh.graph.answer);
      assert.equal(dataSummary(fresh.summary.data,fresh.summary.kind),fresh.summary.answer);
      assert.ok(fresh.proof.includes(String(fresh.graph.answer)));
      assert.ok(fresh.proof.includes(String(fresh.summary.answer)));
    }
  }
  assert.equal(recommendDataTrack(1),'explorer');
  assert.equal(recommendDataTrack(2),'strategist');
  assert.equal(recommendDataTrack(3),'architect');
});

test('data path is interactive, persisted, synced, touch friendly, and visibly unpublished',()=>{
  const html=fs.readFileSync('dist/datareason.html','utf8');
  const js=fs.readFileSync('dist/datareason.js','utf8');
  const css=fs.readFileSync('dist/pilot.css','utf8');
  assert.match(html,/Built for Ella · waiting family review/);
  assert.match(html,/does not award credits yet/);
  assert.match(js,/mathlab-datareason-v1/);
  assert.match(js,/cloud-sync\.js/);
  assert.match(js,/saveSession/);
  assert.match(js,/data-action="show-values"/);
  assert.match(js,/if\(!work\.reveal\)hintLevel\+\+/);
  assert.match(js,/data-action="sort-data"/);
  assert.match(js,/data-fresh-proof/);
  assert.match(js,/complete\(1,\['scale'\]\)/);
  assert.match(js,/complete\(2,\['summary'\]\)/);
  assert.match(js,/complete\(3,\['claim'\],true\)/);
  assert.match(js,/complete\(4,\['scale','summary','transfer'\],false,!ready\)/);
  assert.match(js,/state\.evidence\.transfer/);
  assert.match(js,/evidenceTitle/);
  assert.match(js,/learner==='a'\?'Ella':'Mila'/);
  assert.match(js,/aria-label="Learning depth"/);
  assert.match(css,/\.bar-chart/);
  assert.match(css,/\.data-row/);
  assert.match(css,/@media\(max-width:760px\)/);
});
