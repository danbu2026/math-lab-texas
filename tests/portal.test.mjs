import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PILOT_PIECES} from '../dist/portal-data.js';

const html=fs.readFileSync('dist/index.html','utf8');
const js=fs.readFileSync('dist/portal.js','utf8');
const css=fs.readFileSync('dist/portal.css','utf8');
const data=fs.readFileSync('dist/portal-data.js','utf8');

test('one child portal contains the full learning journey',()=>{
  for(const id of ['journey','worldmap','missions','rewards','parent']) assert.match(html,new RegExp(`id="${id}"`));
  for(const phrase of ['Your current learning path','All 287 K–5 math abilities','Credits &amp; family rewards','Parent area']) assert.match(html,new RegExp(phrase));
  assert.match(js,/TEKS_ROWS/);
  assert.match(js,/Showing.*Texas K–5 expectations/);
  assert.match(html,/other worlds stay visible in gray/);
});

test('the child adventure map exposes all six worlds and their branches',()=>{
  for(const name of ['Math Expedition','Reasoning Quest','Science Discovery','Engineering Studio','Technology & Coding','Creative Design']) assert.match(data,new RegExp(name.replace('&','&')));
  assert.match(html,/Six worlds\. One connected adventure/);
  assert.match(html,/>41<\/strong><span>major branches/);
  assert.match(js,/LEARNING_WORLDS/);
  assert.match(js,/Planned · not published/);
  assert.match(data,/\['Multiplication & Division'.*'building'\]/s);
  assert.match(data,/\["Equal groups",'ready'\]/);
  assert.match(js,/skill-ready/);
});

test('credits come from unique learning evidence and drive rewards',()=>{
  for(const label of ['Starting Check','Equal Groups','Split an Array','Fact Family','Fresh Challenge']) assert.match(html,new RegExp(label));
  assert.match(js,/creditByMission/);
  assert.match(js,/\.missions\?\.\[id\]\?\.complete/);
  assert.deepEqual([...js.matchAll(/'starting-point':(\d+)|'equal-groups':(\d+)|'split-array':(\d+)|'fact-family':(\d+)|'fresh-transfer':(\d+)/g)].flatMap(m=>m.slice(1).filter(Boolean).map(Number)),[10,20,20,20,30]);
  assert.match(html,/Repeating clicks never creates extra credits/);
  assert.match(js,/localStorage\.setItem\(rewardKey/);
  assert.match(js,/const milestones=\[50,100,200,400,700,1000\]/);
});

test('only the 16 actually built pilot pieces are bright',()=>{
  assert.equal(Object.values(PILOT_PIECES).flat().length,16);
  assert.match(js,/\(PILOT_PIECES\[r\.id\]\|\|\[\]\)\.includes\(piece\)/);
  assert.doesNotMatch(js,/coverageStatus==='pilot planned'.*live/s);
});

test('portal supports two learners, one player, and unpublished states',()=>{
  assert.match(html,/Ella/);assert.match(html,/Mila/);
  assert.match(html,/href="pilot\.html"/);
  assert.match(html,/href="labs\.html"/);
  assert.match(js,/PILOT_PIECES/);
  assert.match(css,/\.world\{[^}]*background:var\(--gray\)/);
  assert.match(css,/@media\(max-width:760px\)/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(css,/\.branch ul\{columns:1;font-size:17px/);
  assert.match(js,/scrollIntoView/);
  assert.match(js,/aria-pressed/);
  assert.match(html,/Adventure Map/);
  assert.match(html,/portal\.css\?v=b531973/);
  assert.match(html,/portal\.js\?v=b531973/);
});
