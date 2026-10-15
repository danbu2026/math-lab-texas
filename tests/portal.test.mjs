import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PILOT_PIECES} from '../dist/portal-data.js';

const html=fs.readFileSync('dist/index.html','utf8');
const js=fs.readFileSync('dist/portal.js','utf8');
const css=fs.readFileSync('dist/portal.css','utf8');
const data=fs.readFileSync('dist/portal-data.js','utf8');
const cloud=fs.readFileSync('dist/cloud-sync.js','utf8');
const parent=fs.readFileSync('dist/parent.html','utf8');
const parentJs=fs.readFileSync('dist/parent.js','utf8');

test('one child portal contains the full learning journey',()=>{
  for(const id of ['journey','worldmap','rewards']) assert.match(html,new RegExp(`id="${id}"`));
  for(const phrase of ['Your current learning path','Credits &amp; family rewards']) assert.match(html,new RegExp(phrase));
  for(const id of ['progress','rewards','courses']) assert.match(parent,new RegExp(`id="${id}"`));
  assert.match(js,/TEKS_ROWS/);
  assert.match(parent,/Full Blueprint/);
  assert.match(html,/Unbuilt worlds stay visible in gray/);
});

test('parent sign-in keeps progress available across devices',()=>{
  assert.match(parentJs,/cloud-sync\.js/);
  assert.match(parent,/PARENT VIEW/);
  assert.match(cloud,/signInWithPopup/);
  assert.match(cloud,/families',user\.uid,'state','progress/);
  assert.match(cloud,/Offline · saved here/);
});

test('next path is built for review but is not presented as published',()=>{
  for(const label of ['Fractions','Place Value','Addition & Subtraction','Patterns & Algebra','Geometry & Space','Measurement','Data Reasoning','Mathematical Modeling','Money & Decisions','Number Logic','Visual Patterns','Spatial Thinking','Language & Logic']) assert.match(parentJs,new RegExp(label.replace(/[&]/g,'&')));
  assert.match(data,/Fractions & Decimals[\s\S]*'review'/);
  assert.match(data,/Numbers & Place Value[\s\S]*'review'/);
  assert.match(data,/Addition & Subtraction[\s\S]*'review'/);
  assert.match(data,/Patterns & Algebra[\s\S]*'review'/);
  assert.match(data,/Geometry & Space[\s\S]*'review'/);
  assert.match(data,/Measurement[\s\S]*'review'/);
  assert.match(data,/Data & Probability[\s\S]*'review'/);
  assert.match(data,/Modeling & Word Problems[\s\S]*'review'/);
  assert.match(data,/Money & Decisions[\s\S]*'review'/);
  assert.match(data,/Reasoning Quest[\s\S]*'building'/);
  assert.match(data,/Quantitative Reasoning[\s\S]*'review'/);
  assert.match(data,/Visual Patterns[\s\S]*'review'/);
  assert.match(data,/Spatial Thinking[\s\S]*'review'/);
  assert.match(data,/Language & Logic[\s\S]*'review'/);
  assert.match(js,/Built · waiting family review/);
  assert.match(js,/Open parent preview/);
  assert.match(js,/place\.html/);
  assert.match(js,/addition\.html/);
  assert.match(js,/patterns\.html/);
  assert.match(js,/geometry\.html/);
  assert.match(js,/measurement\.html/);
  assert.match(js,/datareason\.html/);
  assert.match(js,/modeling\.html/);
  assert.match(js,/money\.html/);
  assert.match(js,/numberlogic\.html/);
  assert.match(js,/visualpatterns\.html/);
  assert.match(js,/spatial\.html/);
  assert.match(js,/logic\.html/);
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
  assert.match(parent,/href="labs\.html"/);
  assert.match(js,/PILOT_PIECES/);
  assert.match(css,/\.world\{[^}]*background:var\(--gray\)/);
  assert.match(css,/@media\(max-width:760px\)/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(css,/\.branch ul\{columns:1;font-size:17px/);
  assert.match(js,/scrollIntoView/);
  assert.match(js,/aria-pressed/);
  assert.match(html,/My Map/);
  assert.match(html,/href="parent\.html"/);
  assert.match(html,/portal\.css\?v=cloud1/);
  assert.match(html,/portal\.js\?v=cloud1/);
});
