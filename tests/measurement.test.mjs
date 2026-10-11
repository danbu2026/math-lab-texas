import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import{MEASUREMENT_TRACKS,MEASUREMENT_CHAIN,MEASUREMENT_DIAGNOSTIC,recommendMeasurementTrack,convertMeasure,rectangleMeasures,createBlankMeasurementLearner}from'../dist/measurement-data.js';

test('measurement review path has a complete check-learn-apply-fresh sequence',()=>{
  assert.equal(MEASUREMENT_CHAIN.missions.length,5);
  assert.deepEqual(MEASUREMENT_CHAIN.missions.map(x=>x.kind),['diagnostic','learn','learn','apply','delayed-check']);
  assert.equal(Object.keys(MEASUREMENT_TRACKS).length,3);
  assert.equal(MEASUREMENT_DIAGNOSTIC.length,3);
  assert.deepEqual(createBlankMeasurementLearner().sessions,{});
  assert.match(MEASUREMENT_CHAIN.releaseStatus,/waiting family review/);
});

test('every conversion, perimeter, area, and scale result is derived from source data',()=>{
  for(const t of Object.values(MEASUREMENT_TRACKS)){
    assert.equal(convertMeasure(t.conversion.amount,t.conversion.factor),t.conversion.answer);
    const measure=rectangleMeasures(t.measure.drawingL,t.measure.drawingW,t.measure.scale);
    assert.equal(measure.perimeter,t.measure.perimeter);
    assert.equal(measure.area,t.measure.area);
    for(const fresh of [t.fresh.preview,t.fresh.challenge]){
      assert.equal(convertMeasure(fresh.conversion.amount,fresh.conversion.factor),fresh.conversion.answer);
      const r=rectangleMeasures(fresh.measure.drawingL,fresh.measure.drawingW,fresh.measure.scale);
      assert.ok(fresh.proof.includes(String(fresh.conversion.answer)));
      assert.ok(fresh.proof.includes(String(r.perimeter)));
      assert.ok(fresh.proof.includes(String(r.area)));
    }
  }
  assert.equal(recommendMeasurementTrack(1),'explorer');
  assert.equal(recommendMeasurementTrack(2),'strategist');
  assert.equal(recommendMeasurementTrack(3),'architect');
});

test('measurement path is interactive, persisted, synced, touch friendly, and visibly unpublished',()=>{
  const html=fs.readFileSync('dist/measurement.html','utf8');
  const js=fs.readFileSync('dist/measurement.js','utf8');
  const css=fs.readFileSync('dist/pilot.css','utf8');
  assert.match(html,/Built for Ella · waiting family review/);
  assert.match(html,/does not award credits yet/);
  assert.match(js,/mathlab-measurement-v1/);
  assert.match(js,/cloud-sync\.js/);
  assert.match(js,/saveSession/);
  assert.match(js,/data-action="trace-boundary"/);
  assert.match(js,/data-action="cover-surface"/);
  assert.match(js,/class="perimeter-path"/);
  assert.match(js,/class="perimeter-edge edge-top"/);
  assert.doesNotMatch(js,/mode==='boundary'&&boundary/);
  assert.match(js,/data-fresh-proof/);
  assert.match(js,/aria-label="Learning depth"/);
  assert.match(css,/\.conversion-model/);
  assert.match(css,/\.measure-grid/);
  assert.match(css,/@media\(max-width:760px\)/);
});
