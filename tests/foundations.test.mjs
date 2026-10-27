import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {LEVELS,PHASES,blankFoundationsLearner,levelMissionId,shuffledChoices,visualFacts} from '../dist/foundations-data.js';
import {TEKS_ROWS} from '../dist/teks-k5.js';

test('Level 1 and Level 2 form a 24-unit, 120-mission guided review road',()=>{
 assert.deepEqual(LEVELS.map(l=>l.units.length),[11,13]);
 assert.deepEqual(LEVELS.map(l=>l.units.reduce((n,u)=>n+u.cases.length,0)),[55,65]);
 assert.equal(PHASES.length,5);
 for(const l of LEVELS)for(const u of l.units)assert.equal(u.cases.length,5,u.id);
});

test('every Texas Grade 1 and Grade 2 content expectation is mapped once to guided review',()=>{
 for(const l of LEVELS){
  const processPattern=new RegExp('^'+l.number+'\\.1[A-G]$');
  const expected=TEKS_ROWS.filter(r=>r.grade===String(l.number)&&!processPattern.test(r.id)).map(r=>r.id).sort();
  const actual=l.units.flatMap(u=>u.standards).sort();
  assert.deepEqual(actual,expected,'coverage mismatch in '+l.id);
  assert.equal(new Set(actual).size,actual.length,'duplicate standard in '+l.id);
 }
});

test('each quest has a valid answer, model, explanation, and safe distractors',()=>{
 for(const l of LEVELS)for(const u of l.units){
  assert.equal(u.wrongModels.length,2);assert.equal(u.wrongReasons.length,2);
  for(const c of u.cases){
   assert.equal(c.choices.length,3);
   assert.equal(new Set(c.choices).size,3,u.id+' duplicate answer choice');
   assert.equal(c.choices.filter(x=>x===c.answer).length,1);
   assert.ok(c.answer.trim().length>0,u.id+' missing answer');for(const field of ['prompt','model','reason'])assert.ok(c[field].trim().length>3,u.id+' missing '+field);
   assert.ok(!u.wrongModels.includes(c.model));assert.ok(!u.wrongReasons.includes(c.reason));
  }
 }
});

test('required scope gaps are present explicitly',()=>{
 const standards=new Map(LEVELS.flatMap(l=>l.units.flatMap(u=>u.standards.map(s=>[s,u]))));
 for(const id of ['1.3A','1.5C','1.5G','2.3B','2.3C','2.4D','2.5B','2.6A','2.6B','2.8D','2.8E','2.9C','2.9G','2.10B','2.10C','2.11A','2.11B','2.11C','2.11D','2.11E','2.11F'])assert.ok(standards.has(id),id);
 assert.match(standards.get('1.3A').goal,/multiple|tens|ones/i);
 assert.match(standards.get('2.5B').goal,/¢|\$|decimal/i);
 assert.match(standards.get('2.9G').goal,/a\.m\.|p\.m\./i);
 assert.match(standards.get('2.4D').goal,/stor/i);
});

test('separate learner state and stable mission identifiers are available',()=>{
 const a=blankFoundationsLearner(),b=blankFoundationsLearner();a.completed.x={complete:true};
 assert.equal(b.completed.x,undefined);
 assert.equal(levelMissionId('level1','l1-count',0),'level1-l1-count-m1');
 assert.deepEqual([...shuffledChoices(['a','b','c'],2)].sort(),['a','b','c']);
});

test('the unified course is child-readable, review-honest, synced, and offline',()=>{
 const html=fs.readFileSync('dist/foundations.html','utf8');
 const css=fs.readFileSync('dist/foundations.css','utf8');
 const js=fs.readFileSync('dist/foundations.js','utf8');
 const sync=fs.readFileSync('dist/sync-model.js','utf8');
 const sw=fs.readFileSync('dist/sw.js','utf8');
 const home=fs.readFileSync('dist/index.html','utf8');
 const parent=fs.readFileSync('dist/parent.js','utf8');
 assert.match(html,/120/);assert.match(html,/Family review edition/);assert.match(html,/Ella/);assert.match(html,/Mila/);
 assert.match(js,/mathlab-foundations-v1/);assert.match(js,/no credits are awarded/i);assert.match(js,/attempts===0&&hints===0/);
 assert.match(css,/font-size:18px/);assert.match(css,/@media\(max-width:900px\)/);assert.match(css,/min-height:58px/);assert.match(css,/prefers-reduced-motion/);
 for(const f of ['foundations.html','foundations.css','foundations-data.js','foundations.js'])assert.match(sw,new RegExp(f.replace('.','\\.')));
 assert.match(sync,/mathlab-foundations-v1/);assert.match(home,/foundations\.html/);assert.match(parent,/foundations\.html/);
});

test('evidence is quest-specific and learner switches invalidate delayed UI work',()=>{
 const js=fs.readFileSync('dist/foundations.js','utf8');
 for(const l of LEVELS)for(const u of l.units){for(const c of u.cases){assert.ok(Array.isArray(c.standards)&&c.standards.length>=1,u.id);for(const id of c.standards)assert.ok(u.standards.includes(id),u.id+' '+id)}assert.deepEqual([...new Set(u.cases.flatMap(c=>c.standards))].sort(),[...u.standards].sort(),u.id+' mission evidence must cover the unit standards')}
 assert.match(js,/contentStandards:c\.standards/);assert.doesNotMatch(js,/processStandards:/);assert.match(js,/function invalidateContext\(\)/);assert.match(js,/who!==learner/);assert.match(js,/clearTimeout\(noteTimer\)/);
 for(const action of [/\[data-level\][\s\S]{0,180}invalidateContext\(\)/,/\[data-unit\][\s\S]{0,180}invalidateContext\(\)/,/function advance\(\)[\s\S]{0,80}!completed\(\)/,/resetMission[\s\S]{0,180}invalidateContext\(\)/])assert.match(js,action);
});

test('critical mission evidence matches the exact authored performance',()=>{
 const byId=new Map(LEVELS.flatMap(l=>l.units.map(u=>[u.id,u])));
 assert.deepEqual(byId.get('l1-count').cases.map(c=>c.standards),[['1.2A'],['1.5A'],['1.5B'],['1.5A'],['1.5A']]);
 assert.deepEqual(byId.get('l1-addsub').cases.map(c=>c.standards),[['1.3C'],['1.3D'],['1.3E'],['1.5G'],['1.3D']]);
 assert.deepEqual(byId.get('l1-stories').cases.map(c=>c.standards),[['1.3B','1.5D'],['1.5E'],['1.5F'],['1.3B'],['1.3F']]);
 assert.deepEqual(byId.get('l1-measure').cases[0].standards,['1.7A','1.7D']);
 assert.deepEqual(byId.get('l1-measure').cases[2].standards,['1.7B','1.7D']);
 assert.deepEqual(byId.get('l1-compare').cases.map(c=>c.standards),[['1.2E'],['1.2G'],['1.2F'],['1.5C'],['1.2D']]);
 assert.deepEqual(byId.get('l1-data').cases[4].standards,['1.8A','1.8B']);
 assert.deepEqual(byId.get('l2-compare').cases.map(c=>c.standards),[['2.2D'],['2.2C'],['2.2E'],['2.7B'],['2.2F']]);
 assert.deepEqual(byId.get('l2-facts').cases.map(c=>c.standards),[['2.4A'],['2.4A'],['2.4B'],['2.4B'],['2.4B']]);
 assert.deepEqual(byId.get('l2-fractions').cases[4].standards,['2.3B','2.3D']);
 assert.deepEqual(byId.get('l2-shapes').cases.map(c=>c.standards),[['2.8A'],['2.8C'],['2.8B'],['2.8D'],['2.8E']]);
 assert.deepEqual(byId.get('l2-length').cases.map(c=>c.standards),[['2.9E'],['2.9A','2.9D'],['2.9B'],['2.9F'],['2.9C']]);
});

test('review course includes tappable visual tools and stays visually gray',()=>{
 const js=fs.readFileSync('dist/foundations.js','utf8'),css=fs.readFileSync('dist/foundations.css','utf8'),portal=fs.readFileSync('dist/portal.css','utf8'),parent=fs.readFileSync('dist/parent.js','utf8');
 for(const phrase of ['dot-board','place-board','number-line','coin-board','shape-board','clock','ruler','graph-board','money-board'])assert.match(js,new RegExp(phrase));
 assert.match(js,/activatePieces/);assert.match(css,/REVIEW STATUS/);assert.match(css,/unit-card\.current,.unit-card\.complete/);assert.match(portal,/foundation-road/);assert.match(parent,/foundationProgress/);assert.match(parent,/completed without hints/);
});

test('explicit performance repairs are authored',()=>{
 const text=fs.readFileSync('dist/foundations-data.js','utf8');
 for(const phrase of ['Quick look','skip-counting','quarter','same pencil measures 8 small cubes','correctly displays the organized data','Generate a number greater','open number line','halves and eighths','four two-digit numbers','Create a joining story','Create an equal-sharing situation','regular hexagon, irregular pentagon','rhombus','triangular prism','one straight cut to partition','starts at 23 and ends at 41','saving as an alternative to spending','responsible borrowing','lending benefit','production cost'])assert.match(text,new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i'));
});

test('authored visual models preserve their exact mathematical quantities',()=>{
 const byId=new Map(LEVELS.flatMap(l=>l.units.map(u=>[u.id,u])));
 assert.deepEqual(visualFacts(byId.get('l1-count').cases[0].visual),{type:'dots',total:7});
 assert.deepEqual(visualFacts(byId.get('l1-count').cases[2].visual),{type:'groupSets',totals:[12,20,30]});
 assert.deepEqual(visualFacts(byId.get('l1-build').cases[4].visual),{type:'place',value:114});
 assert.deepEqual(visualFacts(byId.get('l2-place').cases[1].visual),{type:'place',value:1062});
 assert.deepEqual(visualFacts(byId.get('l2-place').cases[3].visual),{type:'place',value:450});
 assert.deepEqual(visualFacts(byId.get('l2-compare').cases[2].visual),{type:'numberLine',min:700,max:800,points:[{value:720,percent:20}]});
 const l1Line=visualFacts(byId.get('l1-compare').cases[2].visual);
 assert.equal(l1Line.points.find(x=>x.value===39).percent,(39-l1Line.min)/(l1Line.max-l1Line.min)*100);
 assert.equal(l1Line.points.find(x=>x.value===59).percent,(59-l1Line.min)/(l1Line.max-l1Line.min)*100);
 assert.equal(l1Line.points.find(x=>x.value===93).percent,(93-l1Line.min)/(l1Line.max-l1Line.min)*100);
 assert.deepEqual(visualFacts(byId.get('l2-data').cases[0].visual),{type:'graph',categories:[{label:'red',value:8},{label:'blue',value:6},{label:'green',value:4},{label:'yellow',value:2}]});
});

test('number lines use proportional positions and shapes are diagrams rather than label-only buttons',()=>{
 const js=fs.readFileSync('dist/foundations.js','utf8'),css=fs.readFileSync('dist/foundations.css','utf8');
 assert.match(js,/data-position/);assert.match(js,/\(value-v\.min\)\/\(v\.max-v\.min\)\*100/);
 assert.match(css,/number-line\.proportional/);assert.match(css,/position:absolute/);
 assert.match(js,/function shapeGraphic/);assert.match(js,/<svg viewBox/);assert.match(css,/diagram-piece svg/);
});

test('review language does not overclaim independent performance',()=>{
 const home=fs.readFileSync('dist/index.html','utf8'),html=fs.readFileSync('dist/foundations.html','utf8'),parent=fs.readFileSync('dist/parent.js','utf8'),readme=fs.readFileSync('README.md','utf8');
 for(const text of [home,html,parent,readme])assert.match(text,/guided review/i);
 assert.match(home,/Independent creation and performance tasks remain under family review/i);
 assert.match(parent,/do not yet prove independent creation, construction, or spoken explanation/i);
});

test('board taps are practice only and cannot be stored as mastery evidence',()=>{
 const js=fs.readFileSync('dist/foundations.js','utf8'),parent=fs.readFileSync('dist/parent.js','utf8');
 assert.doesNotMatch(js,/pieceTouched|modelEvidence|independent:/);assert.match(js,/evidence:'selected-model-answer-explanation'/);assert.match(js,/not recorded as mastery evidence/i);assert.match(parent,/do not yet prove independent creation/i);
});

test('parent notes are escaped before they are shown',()=>{
 const parent=fs.readFileSync('dist/parent.js','utf8');
 assert.match(parent,/function esc\(/);assert.match(parent,/esc\(foundation\.familyNotes/);
});
