import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import{GEOMETRY_TRACKS,GEOMETRY_CHAIN,GEOMETRY_DIAGNOSTIC,recommendGeometryTrack,rotatePoint,countCubes,frontView,sideView,rotateGridClockwise,createBlankGeometryLearner}from'../dist/geometry-data.js';

test('geometry review path has a complete check-learn-apply-fresh sequence',()=>{
  assert.equal(GEOMETRY_CHAIN.missions.length,5);
  assert.deepEqual(GEOMETRY_CHAIN.missions.map(x=>x.kind),['diagnostic','learn','learn','apply','delayed-check']);
  assert.equal(Object.keys(GEOMETRY_TRACKS).length,3);
  assert.equal(GEOMETRY_DIAGNOSTIC.length,3);
  assert.deepEqual(createBlankGeometryLearner().sessions,{});
  assert.match(GEOMETRY_CHAIN.releaseStatus,/waiting family review/);
});

test('every rotation and cube model is derived from its source data',()=>{
  for(const t of Object.values(GEOMETRY_TRACKS)){
    const turned=rotatePoint(t.rotation.start,t.rotation.size,t.rotation.direction);
    assert.deepEqual(turned,t.rotation.answer);
    let point=t.rotation.start;
    for(let i=0;i<4;i++)point=rotatePoint(point,t.rotation.size,'clockwise');
    assert.deepEqual(point,t.rotation.start);
    assert.ok(countCubes(t.structure.grid)>0);
    assert.equal(frontView(t.structure.grid).length,Math.max(...t.structure.grid.map(r=>r.length)));
    assert.equal(sideView(t.structure.grid).length,t.structure.grid.length);
    assert.equal(countCubes(rotateGridClockwise(t.structure.grid)),countCubes(t.structure.grid));
    for(const fresh of [t.fresh.preview,t.fresh.challenge]){
      const target=rotatePoint(fresh.rotation.start,fresh.rotation.size,fresh.rotation.direction);
      const total=countCubes(fresh.grid);
      assert.ok(fresh.proof.includes(`(${target.x}, ${target.y})`));
      assert.match(fresh.proof,new RegExp(`= ${total} cubes`));
      assert.equal(countCubes(rotateGridClockwise(fresh.grid)),total);
    }
  }
  assert.equal(recommendGeometryTrack(1),'explorer');
  assert.equal(recommendGeometryTrack(2),'strategist');
  assert.equal(recommendGeometryTrack(3),'architect');
});

test('geometry path is touch friendly, interactive, persisted, synced, and visibly unpublished',()=>{
  const html=fs.readFileSync('dist/geometry.html','utf8');
  const js=fs.readFileSync('dist/geometry.js','utf8');
  const css=fs.readFileSync('dist/pilot.css','utf8');
  assert.match(html,/Built · waiting family review/);
  assert.match(html,/does not award credits yet/);
  assert.match(js,/mathlab-geometry-v1/);
  assert.match(js,/cloud-sync\.js/);
  assert.match(js,/saveSession/);
  assert.match(js,/data-action="turn-shape"/);
  assert.match(js,/data-action="rotate-demo"/);
  assert.match(js,/data-action="turn-model"/);
  assert.match(js,/BACK TO THE STARTING VIEW/);
  assert.match(js,/data-fresh-proof/);
  assert.match(js,/aria-label="Learning depth"/);
  assert.match(css,/\.coordinate-board/);
  assert.match(css,/\.cube-world/);
  assert.match(css,/@media\(max-width:760px\)/);
});
