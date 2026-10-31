import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {LEVELS,PHASES,blankFoundationsLearner,levelMissionId,shuffledChoices,visualFacts} from '../dist/foundations-data.js';
import {TEKS_ROWS} from '../dist/teks-k5.js';

test('Levels 1 through 5 form a 63-unit, 315-mission guided review road',()=>{
 assert.deepEqual(LEVELS.map(l=>l.units.length),[11,13,13,13,13]);
 assert.deepEqual(LEVELS.map(l=>l.units.reduce((n,u)=>n+u.cases.length,0)),[55,65,65,65,65]);
 assert.equal(PHASES.length,5);
 for(const l of LEVELS)for(const u of l.units)assert.equal(u.cases.length,5,u.id);
});

test('every Texas Grade 1 through Grade 5 content expectation is mapped once to guided review',()=>{
 for(const l of LEVELS){
  const expected=TEKS_ROWS.filter(r=>r.grade===String(l.number)&&r.sectionNumber!==1).map(r=>r.id).sort();
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
 assert.match(html,/315/);assert.match(html,/Family review edition/);assert.match(html,/Ella/);assert.match(html,/Mila/);
 assert.match(js,/mathlab-foundations-v1/);assert.match(js,/no credits are awarded/i);assert.match(js,/attempts===0&&hints===0/);
 assert.match(css,/font-size:18px/);assert.match(css,/@media\(max-width:900px\)/);assert.match(css,/min-height:58px/);assert.match(css,/prefers-reduced-motion/);
 for(const f of ['foundations.html','foundations.css','foundations-review-fixes.css','foundations-data.js','foundations-level3-data.js','foundations-level4-data.js','foundations-level5-data.js','foundations.js'])assert.match(sw,new RegExp(f.replace('.','\\.')));
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

test('Level 4 authored answers preserve the intended mathematics and decisions',()=>{
 const byId=new Map(LEVELS.find(l=>l.id==='level4').units.map(u=>[u.id,u.cases.map(c=>c.answer)]));
 const expected={
  'l4-place':['10','400,000,000 + 7,000,000 + 200,000 + 5,000 + 10 + 9','89,765,432 < 98,756,432 < 98,765,432','700000','350,008,002'],
  'l4-decimals':['0.37','0.45 < 0.50 < 0.54','72/100','0.6','0.8'],
  'l4-fraction-meaning':['1/4 + 1/4 + 1/4 + 1/4 + 1/4 + 1/4 + 1/4','3/8 + 2/8 + 1/8','3/4 and 6/8','8','4 × 3 = 6 × 2'],
  'l4-fraction-ops':['5/6 > 3/4','7/8','1','Yes; 5/8 is above 1/2 and adding 1/4 stays below 1','7/10'],
  'l4-addsub':['11285','$33.65','9000','500','$46.45; about $47'],
  'l4-multiply':['4700','20×10, 20×4, 3×10, 3×4','19248','1702','225 square meters'],
  'l4-division':['1,248 ÷ 6 = n','468','4','12 each with 1 sticker left','273 × 8 = 2,184'],
  'l4-algebra':['240 - 85 + 60 = n','40 - (4 × 7) = c','32','3 × position + 1','18 × 24 - 36'],
  'l4-area':['P = 2l + 2w','A = s × s','38 m; 84 square meters','8','169 square centimeters'],
  'l4-geometry':['A point; B line; C line segment; D ray; E angle','vertical and horizontal','obtuse triangle','It has exactly one pair of parallel sides','perpendicular lines'],
  'l4-angles':['1/4','A full turn is divided into 360 equal angle units','68°','Draw one ray, center a protractor at the vertex, mark 125°, then draw the second ray','85°'],
  'l4-measure-data':['1 kilometer is larger than 1 meter','24','3 m + 125 cm = 425 cm; 2 h 15 min + 45 min = 3 h; 2 kg 500 g + 750 g = 3,250 g; $12.50 + $7.75 = $20.25','2 | 1 4 4 and 3 | 0','1'],
  'l4-finance':['Monthly rent','$53','A savings account is accessible and may earn interest; a longer-term option may pay more but restrict access','$6 spending, $10 college saving, $4 sharing','Keep money safe and connect savers with borrowers']
 };
 for(const [id,answers] of Object.entries(expected))assert.deepEqual(byId.get(id),answers,id);
});

test('Level 5 authored answers preserve the intended mathematics and decisions',()=>{
 const byId=new Map(LEVELS.find(l=>l.id==='level5').units.map(u=>[u.id,u.cases.map(c=>c.answer)]));
 const expected={
  'l5-decimals':['6 + 4/10 + 7/1000','3.852','0.506 < 0.509 < 0.560','7.85','2.399 < 2.40'],
  'l5-whole-ops':['about 12,000','15322','144','7,740; about 8,000','119; about 120'],
  'l5-decimal-ops':['(1 × 0.6) + (0.4 × 0.6)','$9.40','Split 63 tenths into 3 equal groups','4.05','$7.35'],
  'l5-fraction-add':['1 5/12','7/12','6.25','4.55','4 5/12 miles'],
  'l5-fraction-multdiv':['12','12','Split one third into 4 equal parts, each 1/12','18','1/20'],
  'l5-prime-model':['29','3 × 17 = 51','(360 - 85) ÷ 5 = s','4 × 48 - 35 = n','37 is prime; 6 × 28 + 12 = 180'],
  'l5-patterns':['(6,24)','19','A is additive; B is multiplicative','y = 5x','8 is greater than 6'],
  'l5-expressions':['Find 8 - 3 before multiplying by 6','7 + 2','17','30','6 + [3 × (14 - 2)]'],
  'l5-volume':['V = l × w × h, V = Bh, and for a cube V = s × s × s','The volume of a 1 by 1 by 1 cube','120 cubic units','40 square units; 240 cubic units','Floor area 108 square units; box volume 24 cubic units'],
  'l5-hierarchy':['Every square is a rectangle, but not every rectangle is a square','Quadrilaterals → parallelograms → rhombuses','square','trapezoid','Squares inside rectangles and rhombuses, both inside parallelograms'],
  'l5-coordinate':['84','(0,0)','Move 4 units along x, then 7 units parallel to y','(3,7)','8 miles'],
  'l5-data':['A dot plot with two dots at 1.5 and one each at 2.0 and 2.5','31, 34, 38','All five points (1,2), (3,4), (5,5), (7,8), (9,9)','16','The variables have a positive association in this sample'],
  'l5-finance':['Income tax is based on earnings; payroll tax is withheld from wages for programs; sales tax is charged on purchases; property tax is based on owned property','$415','Check: written record but slower; credit: buyer protection but borrowed debt; debit: direct account use but overdraft risk; electronic payment: fast but needs security','Columns for date, description, payment method, money in, money out, and running balance','$650 needs, $250 saving, $200 wants, $100 giving']
 };
 for(const [id,answers] of Object.entries(expected))assert.deepEqual(byId.get(id),answers,id);
});

test('Level 4 and 5 visual models preserve exact authored quantities',()=>{
 const byId=new Map(LEVELS.flatMap(l=>l.units.map(u=>[u.id,u])));
 assert.deepEqual(visualFacts(byId.get('l4-decimals').cases[0].visual),{type:'decimalGrid',hundredths:37,value:.37});
 assert.deepEqual(visualFacts(byId.get('l4-angles').cases[4].visual),{type:'angle',degrees:140,split:55});
 assert.deepEqual(visualFacts(byId.get('l4-finance').cases[3].visual),{type:'budget',income:20,total:20});
 assert.deepEqual(visualFacts(byId.get('l5-decimal-ops').cases[0].visual),{type:'decimalArea',width:1.4,height:.6,product:.84});
 assert.deepEqual(visualFacts(byId.get('l5-decimal-ops').cases[2].visual),{type:'decimalShare',tenths:63,groups:3,each:21});
 assert.ok(byId.get('l5-fraction-add').cases.every(c=>c.visual),'every unlike-fraction quest needs a matching visual');
 assert.ok(byId.get('l5-fraction-multdiv').cases.every(c=>c.visual),'every fraction multiplication/division quest needs a matching visual');
 assert.deepEqual(visualFacts(byId.get('l5-fraction-multdiv').cases[0].visual),{type:'fractionOfSet',total:20,groups:5,take:3,taken:12});
 assert.deepEqual(visualFacts(byId.get('l5-fraction-multdiv').cases[2].visual),{type:'fractionDivision',wholeParts:3,activeParts:1,splitEach:4,totalPieces:12});
 assert.deepEqual(visualFacts(byId.get('l5-volume').cases[2].visual),{type:'volume',length:8,width:5,height:3,total:120});
 assert.deepEqual(visualFacts(byId.get('l5-coordinate').cases[3].visual),{type:'coordinate',points:[[3,7,'A']]});
 assert.deepEqual(visualFacts(byId.get('l5-hierarchy').cases[4].visual),{type:'hierarchy',groups:['Quadrilaterals','Parallelograms','Rectangles + Rhombuses','Squares']});
 assert.deepEqual(visualFacts(byId.get('l5-finance').cases[4].visual),{type:'budget',income:1200,total:1200});
});

test('Level 4 reviewer repairs provide the visual evidence named by the standards',()=>{
 const level=LEVELS.find(l=>l.id==='level4'),byId=new Map(level.units.map(u=>[u.id,u])),js=fs.readFileSync('dist/foundations.js','utf8'),fixes=fs.readFileSync('dist/foundations-review-fixes.css','utf8');
 const decimalLine=visualFacts(byId.get('l4-decimals').cases[1].visual);assert.deepEqual(decimalLine.points.map(p=>p.value),[.45,.5,.54]);assert.ok(decimalLine.points.every((p,i)=>Math.abs(p.percent-[25,50,70][i])<1e-9));
 assert.equal(byId.get('l4-fraction-meaning').cases[1].visual.type,'fractionDecompose');
 assert.ok(byId.get('l4-area').cases.slice(0,2).every(c=>c.visual?.type==='rectangleFormula'));
 assert.equal(byId.get('l4-geometry').cases[0].visual.type,'geometryTerms');assert.equal(byId.get('l4-geometry').cases[1].visual.type,'symmetry');
 assert.deepEqual(byId.get('l4-angles').cases.slice(0,4).map(c=>c.visual.mode),['sector','degreeCircle','protractor','draw']);
 assert.deepEqual(byId.get('l4-measure-data').cases[2].visual.items.map(x=>x[0]),['Length','Time','Mass','Money']);
 assert.equal(byId.get('l4-measure-data').cases[3].visual.type,'rawData');
 for(const name of ['fractionDecomposeGraphic','rectangleFormulaGraphic','geometryTermsGraphic','symmetryGraphic','measurementSetGraphic','rawDataGraphic','angle-protractor','hierarchy-overlap'])assert.match(js+fixes,new RegExp(name));
 assert.match(js,/length:181/);assert.match(js,/angle-draw-range/);assert.match(js,/draw-ray/);assert.doesNotMatch(js,/125° target/);
});

test('Level 5 reviewer repairs use truthful coordinate, fraction, hierarchy, volume, data, and finance models',()=>{
 const js=fs.readFileSync('dist/foundations.js','utf8'),data=fs.readFileSync('dist/foundations-level5-data.js','utf8'),css=fs.readFileSync('dist/foundations.css','utf8'),fixes=fs.readFileSync('dist/foundations-review-fixes.css','utf8');
 for(const phrase of ['coordinateGraphic','grid-line','tick-label','fractionOperationGraphic','fractionOfSetGraphic','fractionDivisionGraphic','decimalShareGraphic','hierarchyGraphic','volume-layers'])assert.match(js+css,new RegExp(phrase));
 assert.doesNotMatch(data,/parallelogram is a trapezoid/i);
 for(const phrase of ['Income tax is based on earnings','payroll tax is withheld','Check: written record','electronic payment: fast','Columns for date, description, payment method','V = Bh','V = s × s × s'])assert.match(data,new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i'));
 assert.deepEqual(LEVELS.find(l=>l.id==='level5').units.find(u=>u.id==='l5-data').cases[4].standards,['5.9C']);
 assert.match(fixes,/\.coordinate-model\{[\s\S]*background-image:none/);
 assert.match(js,/hierarchy-overlap/);assert.match(js,/rectangle-set/);assert.match(js,/rhombus-set/);assert.match(js,/hierarchy-intersection/);
});

test('board taps are practice only and cannot be stored as mastery evidence',()=>{
 const js=fs.readFileSync('dist/foundations.js','utf8'),parent=fs.readFileSync('dist/parent.js','utf8');
 assert.doesNotMatch(js,/pieceTouched|modelEvidence|independent:/);assert.match(js,/evidence:'selected-model-answer-explanation'/);assert.match(js,/not recorded as mastery evidence/i);assert.match(parent,/do not yet prove independent creation/i);
});

test('parent notes are escaped before they are shown',()=>{
 const parent=fs.readFileSync('dist/parent.js','utf8');
 assert.match(parent,/function esc\(/);assert.match(parent,/esc\(foundation\.familyNotes/);
});
