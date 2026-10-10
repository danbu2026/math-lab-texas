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

test('existing pilot and lab records receive migration timestamps',()=>{
  assert.equal(inferTimestamp('mathlab-pilot-v1',JSON.stringify({a:{updatedAt:'2026-01-02T00:00:00Z'}})),Date.parse('2026-01-02T00:00:00Z'));
  assert.ok(inferTimestamp('texas-math-lab-v1',JSON.stringify({profiles:{a:{'number-0':{attempts:1,last:'2026-01-03T00:00:00Z'}}}}))>0);
  assert.equal(inferTimestamp('mathlab-portal-rewards',JSON.stringify({50:'Family game'})),1);
});

test('blank starter records are not mistaken for progress',()=>{
  assert.ok(TRACKED_KEYS.includes('mathlab-place-v1'));
  assert.equal(inferTimestamp('mathlab-pilot-v1',JSON.stringify({a:{},b:{}})),0);
  assert.equal(inferTimestamp('mathlab-fraction-v1',JSON.stringify({a:{},b:{}})),0);
  assert.equal(inferTimestamp('mathlab-place-v1',JSON.stringify({a:{},b:{}})),0);
  assert.equal(inferTimestamp('texas-math-lab-v1',JSON.stringify({profiles:{a:{},b:{}}})),0);
});
