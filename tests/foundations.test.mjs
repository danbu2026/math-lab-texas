import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {LEVELS,PHASES,blankFoundationsLearner,levelMissionId,shuffledChoices,visualFacts} from '../dist/foundations-data.js';
import {TEKS_ROWS} from '../dist/teks-k5.js';

test('Levels 1 through 3 form a 37-unit, 185-mission guided review road',()=>{
 assert.deepEqual(LEVELS.map(l=>l.units.length),[11,13,13]);
 assert.deepEqual(LEVELS.map(l=>l.units.reduce((n,u)=>n+u.cases.length,0)),[55,65,65]);
 assert.equal(PHASES.length,5);
 for(const l of LEVELS)for(const u of l.units)assert.equal(u.cases.length,5,u.id);
});

test('every Texas Grade 1, Grade 2, and Grade 3 content expectation is mapped once to guided review',()=>{
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
 assert.match(html,/185/);assert.match(html,/Family review edition/);assert.match(html,/Ella/);assert.match(html,/Mila/);
 assert.match(js,/mathlab-foundations-v1/);assert.match(js,/no credits are awarded/i);assert.match(js,/attempts===0&&hints===0/);
 assert.match(css,/font-size:18px/);assert.match(css,/@media\(max-width:900px\)/);assert.match(css,/min-height:58px/);assert.match(css,/prefers-reduced-motion/);
 for(const f of ['foundations.html','foundations.css','foundations-data.js','foundations-level3-data.js','foundations.js'])assert.match(sw,new RegExp(f.replace('.','\\.')));
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
 assert.deepEqual(byId.get('l3-place').cases.map(c=>c.standards),[['3.2A'],['3.2B'],['3.2C'],['3.2D'],['3.2A','3.2B']]);
 assert.deepEqual(byId.get('l3-fraction-meaning').cases.map(c=>c.standards),[['3.3A'],['3.3B'],['3.3C'],['3.3D'],['3.7A']]);
 assert.deepEqual(byId.get('l3-facts-division').cases.map(c=>c.standards),[['3.4F','3.4J'],['3.4H'],['3.4K','3.5B'],['3.5D'],['3.4J','3.5B']]);
 assert.deepEqual(byId.get('l3-finance').cases.map(c=>c.standards),[['3.9A'],['3.9B'],['3.9C'],['3.9D'],['3.9E','3.9F']]);
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
 assert.deepEqual(visualFacts(byId.get('l3-place').cases[0].visual),{type:'place',value:48305});
 assert.deepEqual(visualFacts(byId.get('l3-fraction-meaning').cases[0].visual),{type:'fractionBar',total:8,shaded:3,value:3/8});
 assert.deepEqual(visualFacts(byId.get('l3-fraction-meaning').cases[1].visual),{type:'fractionLine',denominator:6,numerator:4,value:4/6});
 assert.deepEqual(visualFacts(byId.get('l3-multiply-meaning').cases[0].visual),{type:'array',rows:7,cols:8,total:56});
 assert.deepEqual(visualFacts(byId.get('l3-area').cases[2].visual),{type:'areaRects',areas:[18,4],total:22});
 assert.deepEqual(visualFacts(byId.get('l3-multiply-strategy').cases[2].visual),{type:'pairs',pairs:[[1,3],[2,6],[3,9],[5,15]]});
 assert.deepEqual(visualFacts(byId.get('l3-money-value').cases[0].visual),{type:'money',totalCents:99});
 assert.deepEqual(visualFacts(byId.get('l3-money-value').cases[4].visual),{type:'money',totalCents:635});
 assert.deepEqual(visualFacts(byId.get('l3-measure').cases[2].visual),{type:'timeIntervals',totalMinutes:60});
 assert.deepEqual(visualFacts(byId.get('l3-measure').cases[3].visual),{type:'scaleRead',value:4,unit:'kg'});
 assert.deepEqual(visualFacts(byId.get('l3-measure').cases[4].visual),{type:'capacityRead',value:2,unit:'L'});
 assert.deepEqual(visualFacts(byId.get('l3-data').cases[0].visual),{type:'graph',categories:[{label:'red',value:12},{label:'blue',value:8},{label:'green',value:4},{label:'yellow',value:6}],scale:2});
});

test('number lines use proportional positions and shapes are diagrams rather than label-only buttons',()=>{
 const js=fs.readFileSync('dist/foundations.js','utf8'),css=fs.readFileSync('dist/foundations.css','utf8');
 assert.match(js,/data-position/);assert.match(js,/\(value-v\.min\)\/\(v\.max-v\.min\)\*100/);
 assert.match(css,/number-line\.proportional/);assert.match(css,/position:absolute/);
 assert.match(js,/function shapeGraphic/);assert.match(js,/<svg viewBox/);assert.match(css,/diagram-piece svg/);
});

test('Level 3 scaled graphs, composite areas, money, and measurement use truthful visuals',()=>{
 const js=fs.readFileSync('dist/foundations.js','utf8'),css=fs.readFileSync('dist/foundations.css','utf8');
 assert.match(js,/value\/max\*100/);assert.doesNotMatch(js,/Math\.min\(100,value\*10\)/);
 for(const phrase of ['compositeAreaGraphic','pointGridGraphic','moneyGraphic','timeIntervals','scaleRead','capacityRead'])assert.match(js,new RegExp(phrase));
 assert.match(css,/composite-area line/);assert.match(css,/graph-board\.scaled/);assert.match(css,/measurement-read/);
});

test('review language does not overclaim independent performance',()=>{
 const home=fs.readFileSync('dist/index.html','utf8'),html=fs.readFileSync('dist/foundations.html','utf8'),parent=fs.readFileSync('dist/parent.js','utf8'),readme=fs.readFileSync('README.md','utf8');
 for(const text of [home,html,parent,readme])assert.match(text,/guided review/i);
 assert.match(home,/Independent creation and performance tasks remain under family review/i);
 assert.match(parent,/do not yet prove independent creation, construction, or spoken explanation/i);
});

test('Level 3 authored answers preserve the intended mathematics and decisions',()=>{
 const byId=new Map(LEVELS.find(l=>l.id==='level3').units.map(u=>[u.id,u.cases.map(c=>c.answer)]));
 const expected={
  'l3-place':['40,000 + 8,000 + 300 + 5','It is 10 times as great','4,700','70,999 < 72,405 < 72,450','92,614'],
  'l3-fraction-meaning':['3/8','4/6','One equal part when a whole is split into 6 equal parts','1/8 + 1/8 + 1/8 + 1/8 + 1/8','Three one-fourth intervals'],
  'l3-fraction-reason':['1/3 of the set, or 6 counters','1/2','They name the same point on the number line','3/4 > 3/8','5/6 > 3/6'],
  'l3-addsub':['725','500','600','230 + 145 - 90 = n','428'],
  'l3-money-value':['$0.99','$7.75','Two $1 bills and 4 dimes','$18.50','$6.35'],
  'l3-multiply-meaning':['56','Six equal groups of 4','Even','3 times as much as 24','45'],
  'l3-facts-division':['8 × 7 = 56 and 56 ÷ 8 = 7','7','10','7','72 ÷ 8 = 9'],
  'l3-multiply-strategy':['92','108','$15','Output is 6 times the input','96'],
  'l3-shapes':['cylinder','triangular prism','It is also a rectangle and a rhombus','A(1,1) → B(4,1) → C(3,3) → D(1,4) → A','Figures with flat faces versus figures with curved surfaces'],
  'l3-area':['28 square units','9','22 square units','Each part is still 1/4 of its whole','26 square units'],
  'l3-measure':['24 units','8 m','60 minutes','4 kilograms measured with a scale','2 liters using a marked measuring container'],
  'l3-data':['Bars at 12, 8, 4, and 6','16','20','2→2, 3→1, 4→3','30 total; 24 more than fish'],
  'l3-finance':['Skills and knowledge can make labor more valuable','The price may rise','Enjoy it now, but have less money for a planned goal','The borrower must repay the lender, usually with interest','Earn $20, spend $6, save $8 for college, repay $4 of credit, and give $2']
 };
 for(const [id,answers] of Object.entries(expected))assert.deepEqual(byId.get(id),answers,id);
});

test('board taps are practice only and cannot be stored as mastery evidence',()=>{
 const js=fs.readFileSync('dist/foundations.js','utf8'),parent=fs.readFileSync('dist/parent.js','utf8');
 assert.doesNotMatch(js,/pieceTouched|modelEvidence|independent:/);assert.match(js,/evidence:'selected-model-answer-explanation'/);assert.match(js,/not recorded as mastery evidence/i);assert.match(parent,/do not yet prove independent creation/i);
});

test('parent notes are escaped before they are shown',()=>{
 const parent=fs.readFileSync('dist/parent.js','utf8');
 assert.match(parent,/function esc\(/);assert.match(parent,/esc\(foundation\.familyNotes/);
});
