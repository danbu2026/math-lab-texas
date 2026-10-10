import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import{FRACTION_CHAIN,FRACTION_TRACKS,FRACTION_DIAGNOSTIC,sameFraction,fractionValue,recommendFractionTrack,createBlankFractionLearner}from'../dist/fraction-data.js';

test('fraction review path has five connected missions and three depths',()=>{
  assert.equal(FRACTION_CHAIN.missions.length,5);
  assert.deepEqual(FRACTION_CHAIN.missions.map(x=>x.kind),['diagnostic','learn','learn','learn','delayed-check']);
  assert.equal(Object.keys(FRACTION_TRACKS).length,3);
  assert.equal(FRACTION_DIAGNOSTIC.length,3);
  assert.deepEqual(createBlankFractionLearner().sessions,{});
  assert.match(FRACTION_CHAIN.releaseStatus,/waiting family review/);
});

test('fraction relationships are mathematically exact',()=>{
  for(const track of Object.values(FRACTION_TRACKS)){
    const[a,b]=track.equivalent.a,[c,d]=track.equivalent.b;
    assert.equal(sameFraction(a,b,c,d),true);
    assert.ok(fractionValue(track.share.target,track.share.parts)<=1);
    assert.ok(fractionValue(track.line.target,track.line.parts)<=1);
  }
  assert.equal(sameFraction(2,3,3,4),false);
  assert.equal(recommendFractionTrack(0),'explorer');
  assert.equal(recommendFractionTrack(2),'strategist');
  assert.equal(recommendFractionTrack(3),'architect');
});

test('fraction path is touch friendly, saved, and visibly unpublished',()=>{
  const html=fs.readFileSync('dist/fraction.html','utf8');
  const js=fs.readFileSync('dist/fraction.js','utf8');
  const css=fs.readFileSync('dist/pilot.css','utf8');
  assert.match(html,/Built · waiting family review/);
  assert.match(html,/does not award credits yet/);
  assert.match(js,/mathlab-fraction-v1/);
  assert.match(js,/cloud-sync\.js/);
  assert.match(js,/saveSession/);
  assert.match(js,/waiting family review|FRACTION_CHAIN/);
  assert.match(css,/\.share-builder/);
  assert.match(css,/\.fraction-line/);
});
