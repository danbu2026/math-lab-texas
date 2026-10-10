import test from 'node:test';
import assert from 'node:assert/strict';
import {TRACKED_KEYS,inferTimestamp,mergeItems} from '../dist/sync-model.js';

test('newer cloud record downloads to this device',()=>{
  const key='mathlab-pilot-v1';
  const result=mergeItems({[key]:{value:'old',updatedAt:10}},{[key]:{value:'new',updatedAt:20}});
  assert.equal(result.merged[key].value,'new');
  assert.deepEqual(result.download,[key]);
  assert.deepEqual(result.upload,[]);
});

test('newer device record uploads to the family account',()=>{
  const key='mathlab-portal-rewards';
  const result=mergeItems({[key]:{value:'new',updatedAt:30}},{[key]:{value:'old',updatedAt:20}});
  assert.equal(result.merged[key].value,'new');
  assert.deepEqual(result.upload,[key]);
  assert.deepEqual(result.download,[]);
});

test('two devices can update different learners without losing either child',()=>{
  const key='mathlab-addition-v1';
  const localValue=JSON.stringify({a:{updatedAt:'2026-10-10T12:00:00Z',missions:{ella:true}},b:{updatedAt:'2026-10-09T12:00:00Z',missions:{}},learner:'a'});
  const remoteValue=JSON.stringify({a:{updatedAt:'2026-10-09T12:00:00Z',missions:{}},b:{updatedAt:'2026-10-10T13:00:00Z',missions:{mila:true}},learner:'b'});
  const result=mergeItems({[key]:{value:localValue,updatedAt:10}},{[key]:{value:remoteValue,updatedAt:20}});
  const merged=JSON.parse(result.merged[key].value);
  assert.equal(merged.a.missions.ella,true);
  assert.equal(merged.b.missions.mila,true);
  assert.deepEqual(result.download,[key]);
  assert.deepEqual(result.upload,[key]);
});

test('existing pilot and lab records receive migration timestamps',()=>{
  assert.equal(inferTimestamp('mathlab-pilot-v1',JSON.stringify({a:{updatedAt:'2026-01-02T00:00:00Z'}})),Date.parse('2026-01-02T00:00:00Z'));
  assert.ok(inferTimestamp('texas-math-lab-v1',JSON.stringify({profiles:{a:{'number-0':{attempts:1,last:'2026-01-03T00:00:00Z'}}}}))>0);
  assert.equal(inferTimestamp('mathlab-portal-rewards',JSON.stringify({50:'Family game'})),1);
});

test('blank starter records are not mistaken for progress',()=>{
  assert.ok(TRACKED_KEYS.includes('mathlab-place-v1'));
  assert.ok(TRACKED_KEYS.includes('mathlab-addition-v1'));
  assert.equal(inferTimestamp('mathlab-pilot-v1',JSON.stringify({a:{},b:{}})),0);
  assert.equal(inferTimestamp('mathlab-fraction-v1',JSON.stringify({a:{},b:{}})),0);
  assert.equal(inferTimestamp('mathlab-place-v1',JSON.stringify({a:{},b:{}})),0);
  assert.equal(inferTimestamp('mathlab-addition-v1',JSON.stringify({a:{},b:{}})),0);
  assert.equal(inferTimestamp('texas-math-lab-v1',JSON.stringify({profiles:{a:{},b:{}}})),0);
});
