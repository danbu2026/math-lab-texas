import './cloud-sync.js';
import {LEVELS,PHASES,levelMissionId,blankFoundationsLearner,shuffledChoices} from './foundations-data.js';
const $=s=>document.querySelector(s);
const key='mathlab-foundations-v1';
const names={a:'Ella',b:'Mila'};
const fallback={};
function read(){try{return JSON.parse(localStorage.getItem(key))||{a:blankFoundationsLearner(),b:blankFoundationsLearner(),learner:'a'}}catch{return fallback.data||{a:blankFoundationsLearner(),b:blankFoundationsLearner(),learner:'a'}}}
let store=read(),learner=store.learner||'a',state=store[learner]||blankFoundationsLearner();
let stage=0,attempts=0,hints=0,locked=false,contextToken=0,noteTimer=null;
function invalidateContext(){contextToken++;locked=false}
function normalize(){
 const blank=blankFoundationsLearner();
 state={...blank,...state,completed:{...state.completed},sessions:{...state.sessions}};
 if(!LEVELS.some(x=>x.id===state.level))state.level='level1';
 const max=level().units.length-1;state.unit=Math.max(0,Math.min(max,Number(state.unit)||0));state.mission=Math.max(0,Math.min(4,Number(state.mission)||0));
}
function save(){state.updatedAt=new Date().toISOString();store={...read(),[learner]:state,learner};fallback.data=store;try{localStorage.setItem(key,JSON.stringify(store));$('#saveStatus').textContent='Saved for '+names[learner]}catch{$('#saveStatus').textContent='Progress will last until this page closes'}}
function level(){return LEVELS.find(x=>x.id===state.level)||LEVELS[0]}
function unit(){return level().units[state.unit]}
function missionId(ui=state.unit,mi=state.mission){return levelMissionId(state.level,level().units[ui].id,mi)}
function currentCase(){return unit().cases[state.mission]}
function completed(id=missionId()){return Boolean(state.completed[id]?.complete)}
function loadSession(){const s=state.sessions[missionId()]||{};stage=Number(s.stage)||0;attempts=Number(s.attempts)||0;hints=Number(s.hints)||0}
function saveSession(){state.sessions[missionId()]={stage,attempts,hints,updatedAt:new Date().toISOString()};save()}
function esc(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function feedback(text,type=''){const el=$('#feedback');el.textContent=text;el.className='feedback '+type}
function shapeGraphic(label,solid=false){
 const shapes={circle:'<circle cx="50" cy="50" r="34"/>',triangle:'<polygon points="50,12 88,84 12,84"/>',rectangle:'<rect x="10" y="25" width="80" height="50" rx="3"/>',square:'<rect x="18" y="18" width="64" height="64" rx="3"/>',rhombus:'<polygon points="50,10 88,50 50,90 12,50"/>',hexagon:'<polygon points="25,10 75,10 94,50 75,90 25,90 6,50"/>','regular hexagon':'<polygon points="25,10 75,10 94,50 75,90 25,90 6,50"/>','irregular pentagon':'<polygon points="45,8 90,38 70,90 18,78 8,30"/>','rotated square':'<polygon points="50,10 90,50 50,90 10,50"/>','smaller rectangle':'<rect x="18" y="30" width="64" height="40" rx="3"/>'};
 const solids={sphere:'<circle cx="50" cy="50" r="34"/><ellipse cx="50" cy="50" rx="34" ry="12" class="detail"/>',cone:'<path d="M50 10 L88 80 L12 80 Z"/><ellipse cx="50" cy="80" rx="38" ry="10" class="detail"/>',cylinder:'<rect x="20" y="22" width="60" height="58"/><ellipse cx="50" cy="22" rx="30" ry="10"/><ellipse cx="50" cy="80" rx="30" ry="10" class="detail"/>','rectangular prism':'<path d="M15 30 L62 18 L88 35 L42 49 Z M15 30 L15 72 L42 88 L42 49 M42 49 L88 35 L88 76 L42 88"/>',cube:'<path d="M18 32 L55 16 L84 34 L47 51 Z M18 32 L18 70 L47 87 L47 51 M47 51 L84 34 L84 72 L47 87"/>','triangular prism':'<path d="M18 72 L18 28 L52 50 Z M52 50 L82 30 L82 73 L18 72 M18 28 L48 12 L82 30"/>'};
 const art=(solid?solids:shapes)[label]||shapes[label]||'<rect x="15" y="25" width="70" height="50"/>';return '<button class="math-piece diagram-piece" type="button" aria-label="'+esc(label)+'"><svg viewBox="0 0 100 100" aria-hidden="true">'+art+'</svg><small>'+esc(label)+'</small></button>';
}
function extendedShapeGraphic(label){
 const extra={parallelogram:'<polygon points="28,18 90,18 72,82 10,82"/>',trapezoid:'<polygon points="30,18 70,18 90,82 10,82"/>','irregular quadrilateral':'<polygon points="18,12 88,30 68,90 8,68"/>'};
 const art=extra[label];if(!art)return shapeGraphic(label);
 return '<button class="math-piece diagram-piece" type="button" aria-label="'+esc(label)+'"><svg viewBox="0 0 100 100" aria-hidden="true">'+art+'</svg><small>'+esc(label)+'</small></button>';
}
function placeGraphic(v){
 const places=[['hundred-million',v.hundredMillions,'hundred-millions'],['ten-million',v.tenMillions,'ten-millions'],['million',v.millions,'millions'],['hundred-thousand',v.hundredThousands,'hundred-thousands'],['ten-thousand',v.tenThousands,'ten-thousands'],['thousand',v.thousands,'thousands'],['hundred',v.hundreds,'hundreds'],['ten',v.tens,'tens'],['one',v.ones,'ones']].filter(([,value])=>value!==undefined);
 return '<div class="place-board exact place-'+places.length+'">'+places.map(([cls,value,label])=>'<span class="'+cls+'">'+(value||0)+' '+label+'</span>').join('')+'</div>'+(v.note?'<p class="visual-note">'+esc(v.note)+'</p>':'');
}
function fractionBar(v){return '<div class="fraction-bar" style="--parts:'+v.total+'" aria-label="'+v.shaded+' of '+v.total+' equal parts">'+Array.from({length:v.total},(_,i)=>'<button class="math-piece '+(i<v.shaded?'filled':'')+'" type="button" aria-label="part '+(i+1)+'"></button>').join('')+'</div>'}
function fractionLine(v){return '<div class="fraction-line" aria-label="'+v.numerator+' out of '+v.denominator+' intervals from zero">'+Array.from({length:v.denominator+1},(_,i)=>'<button class="math-piece '+(i===v.numerator?'marked':'')+'" type="button"><i></i><span>'+i+'/'+v.denominator+'</span></button>').join('')+'</div>'}
function arrayGraphic(v){return '<div class="array-board" style="--rows:'+v.rows+';--cols:'+v.cols+'" aria-label="'+v.rows+' rows of '+v.cols+'">'+Array.from({length:v.rows*v.cols},()=>'<button class="math-piece" type="button"></button>').join('')+'</div>'}
function compositeAreaGraphic(v){
 const [[w1,h1],[w2,h2]]=v.rects,scale=18,width=(w1+w2)*scale,height=Math.max(h1,h2)*scale,y2=(Math.max(h1,h2)-h2)*scale;
 return '<svg class="composite-area" viewBox="0 0 '+width+' '+height+'" role="img" aria-label="Connected composite figure split into '+w1+' by '+h1+' and '+w2+' by '+h2+' rectangles"><rect x="0" y="0" width="'+(w1*scale)+'" height="'+(h1*scale)+'"/><rect x="'+(w1*scale)+'" y="'+y2+'" width="'+(w2*scale)+'" height="'+(h2*scale)+'"/><line x1="'+(w1*scale)+'" y1="'+y2+'" x2="'+(w1*scale)+'" y2="'+height+'"/><text x="'+(w1*scale/2)+'" y="'+(height/2)+'">'+w1+' × '+h1+'</text><text x="'+((w1+w2/2)*scale)+'" y="'+(y2+h2*scale/2)+'">'+w2+' × '+h2+'</text></svg>';
}
function pointGridGraphic(v){
 const lookup=new Map(v.points.map(([x,y,label])=>[x+','+y,label]));
 return '<div class="point-grid" aria-label="Tappable four by four point grid">'+Array.from({length:16},(_,i)=>{const x=i%4+1,y=Math.floor(i/4)+1,label=lookup.get(x+','+y)||'';return '<button class="math-piece '+(label?'named':'')+'" type="button" aria-label="point '+x+','+y+(label?' '+label:'')+'">'+label+'</button>'}).join('')+'</div>';
}
function moneyGraphic(v){return '<div class="money-collection">'+v.items.map(([label,count,cents])=>'<button class="math-piece" type="button"><strong>'+count+' × '+esc(label)+'</strong><small>'+cents+'¢ each</small></button>').join('')+'</div>'}
function decimalGridGraphic(v){return '<div class="decimal-grid" aria-label="'+v.hundredths+' hundredths shaded">'+Array.from({length:100},(_,i)=>'<button class="math-piece '+(i<v.hundredths?'filled':'')+'" type="button" aria-label="hundredth '+(i+1)+'"></button>').join('')+'</div><p class="visual-note">'+v.hundredths+' of 100 equal squares</p>'}
function angleGraphic(v){
 if(v.mode==='sector')return '<svg class="angle-model angle-circle" viewBox="0 0 150 150" role="img" aria-label="90 degree sector is one fourth of a full circle"><circle cx="75" cy="75" r="58"/><path class="angle-sector" d="M75 75 L75 17 A58 58 0 0 1 133 75 Z"/><line x1="75" y1="75" x2="75" y2="17"/><line x1="75" y1="75" x2="133" y2="75"/><text x="88" y="57">90°</text><text x="58" y="143">90 of 360</text></svg>';
 if(v.mode==='degreeCircle')return '<svg class="angle-model degree-circle" viewBox="0 0 150 150" role="img" aria-label="full circle divided into equal degree turns"><circle cx="75" cy="75" r="58"/>'+Array.from({length:36},(_,i)=>{const a=i*10*Math.PI/180,x1=75+50*Math.cos(a),y1=75+50*Math.sin(a),x2=75+58*Math.cos(a),y2=75+58*Math.sin(a);return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'"/>'}).join('')+'<text x="47" y="72">360 equal</text><text x="51" y="88">1° turns</text></svg>';
 if(v.mode==='protractor'||v.mode==='draw'){
  const cx=100,cy=105,r=76,ticks=Array.from({length:181},(_,d)=>{const a=-d*Math.PI/180,major=d%10===0,inner=r-(major?9:4),x1=cx+inner*Math.cos(a),y1=cy+inner*Math.sin(a),x2=cx+r*Math.cos(a),y2=cy+r*Math.sin(a),label=major?'<text class="protractor-label" x="'+(cx+(r-18)*Math.cos(a))+'" y="'+(cy+(r-18)*Math.sin(a)+3)+'">'+d+'</text>':'';return '<line class="protractor-tick '+(major?'major':'minor')+'" x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'"/>'+label}).join('');
  if(v.mode==='draw')return '<svg class="angle-model angle-protractor" viewBox="0 0 200 125" role="img" aria-label="protractor for drawing an angle"><path class="protractor-arc" d="M24 105 A76 76 0 0 1 176 105"/><line x1="24" y1="105" x2="176" y2="105"/>'+ticks+'<line class="draw-ray" x1="100" y1="105" x2="176" y2="105"/><circle cx="100" cy="105" r="4"/></svg><div class="angle-draw-control"><label>Drag the second ray to make the target angle.<input class="angle-draw-range" type="range" min="0" max="180" step="1" value="0" aria-label="practice angle in degrees"></label><output>0° practice angle</output></div>';
  const rad=-v.degrees*Math.PI/180,x=cx+r*Math.cos(rad),y=cy+r*Math.sin(rad);return '<svg class="angle-model angle-protractor" viewBox="0 0 200 125" role="img" aria-label="protractor with a ray to measure to the nearest degree"><path class="protractor-arc" d="M24 105 A76 76 0 0 1 176 105"/><line x1="24" y1="105" x2="176" y2="105"/>'+ticks+'<line class="angle-ray" x1="100" y1="105" x2="'+x+'" y2="'+y+'"/><circle cx="100" cy="105" r="4"/></svg>';
 }
 const rad=-v.degrees*Math.PI/180,x=60+52*Math.cos(rad),y=66+52*Math.sin(rad),split=v.split?(()=>{const r=-v.split*Math.PI/180;return '<line class="angle-split" x1="60" y1="66" x2="'+(60+52*Math.cos(r))+'" y2="'+(66+52*Math.sin(r))+'"/>'})():'';return '<svg class="angle-model" viewBox="0 0 130 90" role="img" aria-label="angle of '+v.degrees+' degrees"><line x1="60" y1="66" x2="118" y2="66"/><line x1="60" y1="66" x2="'+x+'" y2="'+y+'"/>'+split+'<circle cx="60" cy="66" r="4"/><text x="62" y="84">'+v.degrees+'°</text></svg>';
}
function coordinateGraphic(v,scatter=false){const maxX=v.maxX||v.max||10,maxY=v.maxY||v.max||10,step=Math.max(maxX,maxY)>10?5:1,scaleX=x=>28+x/maxX*168,scaleY=y=>184-y/maxY*160,gridX=Array.from({length:Math.floor(maxX/step)+1},(_,i)=>i*step),gridY=Array.from({length:Math.floor(maxY/step)+1},(_,i)=>i*step);return '<svg class="coordinate-model '+(scatter?'scatter-model':'')+'" viewBox="0 0 220 215" role="img" aria-label="'+(scatter?'scatterplot':'coordinate plane')+' with labeled axes">'+gridX.map(x=>'<line class="grid-line" x1="'+scaleX(x)+'" y1="24" x2="'+scaleX(x)+'" y2="184"/><text class="tick-label" x="'+scaleX(x)+'" y="202">'+x+'</text>').join('')+gridY.map(y=>'<line class="grid-line" x1="28" y1="'+scaleY(y)+'" x2="196" y2="'+scaleY(y)+'"/><text class="tick-label" x="16" y="'+(scaleY(y)+3)+'">'+y+'</text>').join('')+'<line class="axis-line" x1="28" y1="184" x2="204" y2="184"/><line class="axis-line" x1="28" y1="190" x2="28" y2="16"/><text x="204" y="202">x</text><text x="12" y="16">y</text>'+v.points.map(([x,y,label])=>'<g><circle cx="'+scaleX(x)+'" cy="'+scaleY(y)+'" r="5"/><text x="'+(scaleX(x)+6)+'" y="'+(scaleY(y)-6)+'">'+esc(label||('('+x+','+y+')'))+'</text></g>').join('')+'</svg>'}
function dotPlotGraphic(v){const min=Math.floor(Math.min(...v.values)),max=Math.ceil(Math.max(...v.values)),values=[...new Set(v.values)].sort((a,b)=>a-b);return '<div class="dot-plot" aria-label="dot plot from '+min+' to '+max+'">'+values.map(value=>'<div><span>'+v.values.filter(x=>x===value).map(()=>'<i></i>').join('')+'</span><b>'+value+'</b></div>').join('')+'</div>'}
function budgetGraphic(v){return '<div class="budget-model"><strong>Income $'+v.income+'</strong>'+v.items.map(([label,value])=>'<button class="math-piece" type="button"><span>'+esc(label)+'</span><b>$'+value+'</b></button>').join('')+'<em>Total $'+v.items.reduce((sum,[,value])=>sum+value,0)+'</em></div>'}
function fractionAmount(n,d){const bars=Math.ceil(n/d);return '<div class="fraction-amount">'+Array.from({length:bars},(_,bar)=>'<span class="fraction-mini" style="--parts:'+d+'">'+Array.from({length:d},(_,i)=>'<i class="'+(bar*d+i<n?'filled':'')+'"></i>').join('')+'</span>').join('')+'</div>'}
function fractionOperationGraphic(v){return '<div class="fraction-operation">'+fractionAmount(v.left,v.denominator)+'<strong>'+esc(v.operator)+'</strong>'+fractionAmount(v.right,v.denominator)+'</div><p class="visual-note">Both amounts are shown in '+v.denominator+'ths.</p>'}
function fractionOfSetGraphic(v){const each=v.total/v.groups;return '<div class="fraction-set">'+Array.from({length:v.groups},(_,g)=>'<span class="'+(g<v.take?'taken':'')+'" aria-label="group '+(g+1)+'">'+Array.from({length:each},()=>'<i></i>').join('')+'</span>').join('')+'</div><p class="visual-note">Take '+v.take+' of '+v.groups+' equal groups.</p>'}
function fractionDivisionGraphic(v){const total=v.wholeParts*v.splitEach,active=v.activeParts*v.splitEach;return '<div class="fraction-division" style="--parts:'+total+'">'+Array.from({length:total},(_,i)=>'<button class="math-piece '+(i<active?'active':'')+'" type="button" aria-label="piece '+(i+1)+' of '+total+'"></button>').join('')+'</div><p class="visual-note">The whole is partitioned into '+total+' equal small pieces.</p>'}
function decimalShareGraphic(v){const each=v.tenths/v.groups;return '<div class="decimal-share">'+Array.from({length:v.groups},(_,i)=>'<button class="math-piece" type="button"><small>Group '+(i+1)+'</small><strong>'+each+' tenths = '+(each/10)+'</strong></button>').join('')+'</div>'}
function fractionDecomposeGraphic(v){return '<div class="fraction-decompose">'+v.parts.map(part=>fractionAmount(part,v.denominator)+'<strong>'+part+'/'+v.denominator+'</strong>').join('<b>+</b>')+'<b>=</b>'+fractionAmount(v.total,v.denominator)+'<strong>'+v.total+'/'+v.denominator+'</strong></div>'}
function rectangleFormulaGraphic(v){const cells=Array.from({length:v.length*v.width},()=>'<i></i>').join('');return '<div class="rectangle-formula '+v.mode+'" style="--cols:'+v.length+'" aria-label="'+v.length+' by '+v.width+' rectangle"><span class="top">'+v.length+'</span><span class="right">'+v.width+'</span><div>'+cells+'</div><p>'+(v.mode==='perimeter'?'Boundary: '+v.length+' + '+v.width+' + '+v.length+' + '+v.width:'Area: '+v.width+' rows × '+v.length+' columns')+'</p></div>'}
function geometryTermsGraphic(){return '<svg class="geometry-terms" viewBox="0 0 520 150" role="img" aria-label="A point, B line, C line segment, D ray, and E angle"><g><circle cx="35" cy="70" r="6"/><text x="25" y="120">A point</text></g><g><line x1="105" y1="70" x2="180" y2="70"/><path d="M105 70 l12 -7 v14 z M180 70 l-12 -7 v14 z"/><text x="125" y="120">B line</text></g><g><line x1="220" y1="70" x2="285" y2="70"/><circle cx="220" cy="70" r="5"/><circle cx="285" cy="70" r="5"/><text x="208" y="120">C segment</text></g><g><line x1="330" y1="70" x2="395" y2="70"/><circle cx="330" cy="70" r="5"/><path d="M395 70 l-12 -7 v14 z"/><text x="340" y="120">D ray</text></g><g><line x1="445" y1="90" x2="495" y2="90"/><line x1="445" y1="90" x2="470" y2="43"/><circle cx="445" cy="90" r="5"/><text x="442" y="120">E angle</text></g></svg>'}
function symmetryGraphic(){return '<div class="symmetry-model" aria-label="non-square rectangle with selectable vertical and horizontal folds"><div class="symmetry-rectangle"><button class="math-piece symmetry-line vertical" type="button" aria-label="vertical symmetry line"></button><button class="math-piece symmetry-line horizontal" type="button" aria-label="horizontal symmetry line"></button></div><p>Tap each fold that makes matching halves.</p></div>'}
function measurementSetGraphic(v){return '<div class="measurement-set">'+v.items.map(([label,expression])=>'<button class="math-piece" type="button"><strong>'+esc(label)+'</strong><span>'+esc(expression)+'</span></button>').join('')+'</div>'}
function rawDataGraphic(v){return '<div class="raw-data" aria-label="raw data values">'+v.values.map(value=>'<button class="math-piece" type="button">'+value+'</button>').join('')+'</div><p class="visual-note">Build a display that uses every value exactly once.</p>'}
function hierarchyGraphic(v){const overlap=v.groups.some(label=>/[+∩]/.test(label));if(overlap){return '<div class="hierarchy-model hierarchy-branch" aria-label="shape hierarchy with overlapping rectangle and rhombus sets"><div class="hierarchy-level"><span>Quadrilaterals</span><div class="hierarchy-level"><span>Parallelograms</span><div class="hierarchy-overlap"><div class="hierarchy-set rectangle-set"><span>Rectangles</span></div><div class="hierarchy-set rhombus-set"><span>Rhombuses</span></div><div class="hierarchy-intersection"><span>Squares</span><small>both</small></div></div></div></div></div>'}return '<div class="hierarchy-model" aria-label="nested shape hierarchy">'+v.groups.map((label,i)=>'<div class="hierarchy-level level-'+i+'"><span>'+esc(label)+'</span>').join('')+v.groups.map(()=>'</div>').join('')+'</div>'}
function volumeGraphic(v){const base=v.length*v.width;return '<div class="volume-model"><div class="volume-layers" aria-label="'+v.height+' layers with '+base+' unit cubes in each layer">'+Array.from({length:v.height},(_,layer)=>'<div class="cube-layer" style="--cols:'+v.length+'"><strong>Layer '+(layer+1)+'</strong><span>'+Array.from({length:base},()=>'<i></i>').join('')+'</span></div>').join('')+'</div><strong>Base '+v.length+' × '+v.width+' = '+base+' cubes; '+v.height+' layers → '+(base*v.height)+' cubic units</strong></div>'}
function unitCompleted(ui){return level().units[ui].cases.every((_,mi)=>state.completed[missionId(ui,mi)]?.complete)}
function levelDoneCount(){return level().units.reduce((n,u,ui)=>n+u.cases.filter((_,mi)=>state.completed[missionId(ui,mi)]?.complete).length,0)}
function nextIncompleteInUnit(ui){const index=level().units[ui].cases.findIndex((_,mi)=>!state.completed[missionId(ui,mi)]?.complete);return index<0?4:index}
function rotateTo(value,items,seed){const list=shuffledChoices(items,seed);const i=list.indexOf(value);if(i===seed%list.length)return list;[list[i],list[seed%list.length]]=[list[seed%list.length],list[i]];return list}
function renderTabs(){
 $('#levelTabs').innerHTML=LEVELS.map(l=>{const total=l.units.length*5;const done=l.units.reduce((n,u,ui)=>n+u.cases.filter((_,mi)=>state.completed[levelMissionId(l.id,u.id,mi)]?.complete).length,0);return '<button class="level-tab '+(l.id===state.level?'active':'')+'" data-level="'+l.id+'"><strong>Level '+l.number+' · '+esc(l.title)+'</strong><span>'+done+' of '+total+' quests complete · '+l.units.length+' units</span></button>'}).join('');
 document.querySelectorAll('[data-level]').forEach(b=>b.onclick=()=>{invalidateContext();state.level=b.dataset.level;state.unit=0;state.mission=nextIncompleteInUnit(0);stage=0;feedback('');save();loadSession();render()});
}
function renderMap(){
 const l=level();$('#mapTitle').textContent='Level '+l.number+' · '+l.title;$('#mapSubtitle').textContent=l.subtitle;
 $('#unitMap').innerHTML=l.units.map((u,ui)=>{const done=unitCompleted(ui),count=u.cases.filter((_,mi)=>state.completed[missionId(ui,mi)]?.complete).length;return '<button class="unit-card '+(ui===state.unit?'current ':'')+(done?'complete':'')+'" style="--unit-color:'+u.color+'" data-unit="'+ui+'"><span class="unit-icon">'+u.icon+'</span><span><strong>'+(ui+1)+'. '+esc(u.title)+'</strong><small>'+count+' of 5 quests · review edition</small></span><span class="unit-state">'+(done?'✓':'›')+'</span></button>'}).join('');
 document.querySelectorAll('[data-unit]').forEach(b=>b.onclick=()=>{invalidateContext();state.unit=Number(b.dataset.unit);state.mission=nextIncompleteInUnit(state.unit);stage=0;feedback('');save();loadSession();render()});
}
function renderProgress(){
 const done=levelDoneCount(),total=level().units.length*5;$('#levelProgress').textContent=done+' of '+total+' quests complete';$('#progressFill').style.width=(done/total*100)+'%';
}
function phaseRail(){
 $('#phaseRail').innerHTML=PHASES.map((p,i)=>'<div class="phase '+(i===state.mission?'active':'')+(state.completed[missionId(state.unit,i)]?.complete?' done':'')+'">'+(i+1)+'. '+p.label+'</div>').join('');
}
function visualBoard(id,index,c){
 const v=c.visual||null,piece=(label,cls='')=>'<button class="math-piece '+cls+'" type="button">'+esc(label)+'</button>';let body='';
 if(v?.type==='dots')body='<div class="dot-board grouped">'+v.groups.map((count,g)=>'<span class="dot-group" aria-label="group '+(g+1)+'">'+Array.from({length:count},(_,i)=>'<button class="math-piece dot" type="button" aria-label="dot '+(i+1)+' in group '+(g+1)+'"></button>').join('')+'</span>').join('')+'</div>';
 else if(v?.type==='groupSets')body='<div class="group-sets">'+v.sets.map((set,s)=>'<div><strong>Set '+(s+1)+'</strong>'+set.map((count,g)=>'<span class="mini-group" aria-label="group of '+count+'">'+count+'</span>').join('')+'</div>').join('')+'</div>';
 else if(v?.type==='place')body=placeGraphic(v);
 else if(v?.type==='placeCompare')body='<div class="place-compare">'+v.values.map((value,index)=>'<button class="math-piece" type="button"><small>Number '+(index+1)+'</small><strong>'+Number(value).toLocaleString('en-US')+'</strong></button>').join('<span>↔</span>')+'</div>';
 else if(v?.type==='numberLine'){const values=[...new Set([v.min,...v.points,v.max])].sort((a,b)=>a-b);body='<div class="number-line proportional">'+values.map(value=>{const percent=(value-v.min)/(v.max-v.min)*100;return '<button class="math-piece tick" type="button" style="left:'+percent+'%" data-value="'+value+'" data-position="'+percent+'"><i></i><span>'+value+'</span></button>'}).join('')+'</div>'}
 else if(v?.type==='fractionBar')body=fractionBar(v);
 else if(v?.type==='fractionLine')body=fractionLine(v);
 else if(v?.type==='array')body=arrayGraphic(v);
 else if(v?.type==='pairs')body='<div class="pair-table"><strong>Input</strong><strong>Output</strong>'+v.pairs.map(pair=>'<button class="math-piece" type="button">'+pair[0]+'</button><button class="math-piece" type="button">'+pair[1]+'</button>').join('')+'</div>';
 else if(v?.type==='areaRects')body=compositeAreaGraphic(v);
 else if(v?.type==='pointGrid')body=pointGridGraphic(v);
 else if(v?.type==='money')body=moneyGraphic(v);
 else if(v?.type==='decimalGrid')body=decimalGridGraphic(v);
 else if(v?.type==='decimalArea'){const cols=Math.round(v.width*10),rows=Math.round(v.height*10);body='<div class="decimal-area-model"><strong>'+v.width+' × '+v.height+'</strong><div style="--cols:'+cols+'">'+Array.from({length:cols*rows},()=>'<i></i>').join('')+'</div><b>'+cols+' × '+rows+' hundredths = '+(cols*rows)+' hundredths</b></div>'}
 else if(v?.type==='decimalShare')body=decimalShareGraphic(v);
 else if(v?.type==='fractionOperation')body=fractionOperationGraphic(v);
 else if(v?.type==='fractionOfSet')body=fractionOfSetGraphic(v);
 else if(v?.type==='fractionDivision')body=fractionDivisionGraphic(v);
 else if(v?.type==='fractionDecompose')body=fractionDecomposeGraphic(v);
 else if(v?.type==='rectangleFormula')body=rectangleFormulaGraphic(v);
 else if(v?.type==='geometryTerms')body=geometryTermsGraphic();
 else if(v?.type==='symmetry')body=symmetryGraphic(v);
 else if(v?.type==='measurementSet')body=measurementSetGraphic(v);
 else if(v?.type==='rawData')body=rawDataGraphic(v);
 else if(v?.type==='angle')body=angleGraphic(v);
 else if(v?.type==='stemLeaf')body='<div class="stem-leaf"><strong>Stem</strong><strong>Leaves</strong>'+v.rows.map(([stem,leaves])=>'<button class="math-piece" type="button">'+stem+'</button><button class="math-piece" type="button">'+leaves.join('  ')+'</button>').join('')+'</div>';
 else if(v?.type==='dotPlot')body=dotPlotGraphic(v);
 else if(v?.type==='budget')body=budgetGraphic(v);
 else if(v?.type==='coordinate')body=coordinateGraphic(v,false);
 else if(v?.type==='scatter')body=coordinateGraphic(v,true);
 else if(v?.type==='volume')body=volumeGraphic(v);
 else if(v?.type==='hierarchy')body=hierarchyGraphic(v);
 else if(v?.type==='timeIntervals')body='<div class="time-intervals">'+v.intervals.map(value=>'<button class="math-piece" type="button">'+value+' min</button>').join('<span>+</span>')+'<span>=</span><strong>'+v.intervals.reduce((sum,value)=>sum+value,0)+' min</strong></div>';
 else if(v?.type==='scaleRead')body='<div class="measurement-read scale-read"><div class="dial">'+v.value+' '+esc(v.unit)+'</div><strong>WEIGHT SCALE</strong></div>';
 else if(v?.type==='capacityRead')body='<div class="measurement-read capacity-read" style="--fill:'+(v.value/v.max*100)+'%"><div class="pitcher"><span>'+v.max+' '+esc(v.unit)+'</span><i></i><b>'+v.value+' '+esc(v.unit)+'</b></div><strong>MARKED CONTAINER</strong></div>';
 else if(v?.type==='graph'){const max=Math.max(...v.values);body=(v.scale?'<p class="graph-scale">Scale: each grid step = '+v.scale+'</p>':'')+'<div class="graph-board scaled" style="--steps:'+Math.ceil(max/(v.scale||1))+'">'+v.values.map((value,i)=>'<button class="math-piece graph-bar" type="button" style="height:'+(value/max*100)+'%" data-value="'+value+'"><span>'+esc(v.labels[i])+': '+value+'</span></button>').join('')+'</div>'}
 else if(v?.type==='shapes'||v?.type==='solids')body='<div class="shape-board authored">'+v.items.map(label=>v.type==='solids'?shapeGraphic(label,true):extendedShapeGraphic(label)).join('')+'</div>';
 else if(/count|addsub|stories|groups|facts/.test(id))body='<div class="dot-board" aria-label="scratch counters">'+Array.from({length:10},(_,i)=>'<button class="math-piece dot" type="button" aria-label="scratch counter '+(i+1)+'"></button>').join('')+'</div>';
 else if(/build|place/.test(id))body='<div class="place-board blank"><span class="thousand">thousands</span><span class="hundred">hundreds</span><span class="ten">tens</span><button class="math-piece one">ones</button></div>';
 else if(/compare|length/.test(id))body='<div class="number-line blank"><button class="math-piece tick"><i></i><span>start</span></button><button class="math-piece tick"><i></i><span>mark</span></button><button class="math-piece tick"><i></i><span>end</span></button></div>';
 else if(/coin/.test(id))body='<div class="coin-board"><button class="math-piece coin penny">1¢<small>penny</small></button><button class="math-piece coin nickel">5¢<small>nickel</small></button><button class="math-piece coin dime">10¢<small>dime</small></button><button class="math-piece coin quarter">25¢<small>quarter</small></button></div>';
 else if(/shape|compose|fraction/.test(id))body='<div class="shape-board">'+['triangle','square','rectangle','rhombus','hexagon','circle'].map(label=>shapeGraphic(label)).join('')+'</div>';
 else if(/measure|time/.test(id)){const time=String(c.answer).match(/(\d{1,2}):(\d{2})/);if(time){const hour=Number(time[1]),minute=Number(time[2]);body='<div class="tool-board"><div class="clock math-piece"><b>12</b><b>3</b><b>6</b><b>9</b><i class="hour" style="transform:rotate('+(hour*30+minute/2)+'deg)"></i><i class="minute" style="transform:rotate('+(minute*6)+'deg)"></i></div></div>'}else body='<div class="ruler">'+Array.from({length:11},(_,i)=>'<button class="math-piece" type="button">'+i+'</button>').join('')+'</div>'}
 else if(/data/.test(id))body='<div class="graph-board blank"><button class="math-piece graph-bar" style="height:35%">A</button><button class="math-piece graph-bar" style="height:55%">B</button><button class="math-piece graph-bar" style="height:75%">C</button></div>';
 else if(/money|finance/.test(id))body='<div class="money-board"><button class="math-piece">EARN</button><button class="math-piece">SAVE</button><button class="math-piece">SPEND</button><button class="math-piece">GIVE</button></div>';
 else body='<div class="story-board">What do you know? <span>→</span> What must you find?</div>';
 return '<div class="hands-on"><strong>Hands-on thinking board</strong><p>Use these pieces if they help you think. Board taps are practice and are not recorded as mastery evidence.</p>'+body+'</div>';
}
function activatePieces(){document.querySelectorAll('.math-piece').forEach(piece=>piece.onclick=()=>piece.classList.toggle('selected'));document.querySelectorAll('.angle-draw-range').forEach(range=>range.oninput=()=>{const degrees=Number(range.value),r=76,rad=-degrees*Math.PI/180,board=range.closest('.hands-on'),ray=board.querySelector('.draw-ray'),output=board.querySelector('.angle-draw-control output');ray.setAttribute('x2',100+r*Math.cos(rad));ray.setAttribute('y2',105+r*Math.sin(rad));output.textContent=degrees+'° practice angle'})}
function chooseHtml(items,kind){return '<div class="choice-grid">'+items.map(x=>'<button class="choice" type="button" data-'+kind+'="'+esc(x)+'">'+esc(x)+'</button>').join('')+'</div>'}
function renderActivity(){
 const c=currentCase(),u=unit(),phase=PHASES[state.mission],seed=state.unit*11+state.mission*3;
 if(completed()){renderComplete();return}
 const hint=hints?'<div class="hint"><strong>Hint '+hints+':</strong> '+esc(hints===1?c.model:c.reason)+'</div>':'';
 if(stage===0){
  const options=rotateTo(c.model,[c.model,...u.wrongModels],seed);
  $('#activity').innerHTML='<span class="review-pill">STEP 1 OF 3 · CHOOSE A MODEL</span><h3>'+esc(c.prompt)+'</h3>'+visualBoard(u.id,state.mission,c)+'<p class="stage-copy">Which way of thinking would help you solve this?</p>'+chooseHtml(options,'model')+hint;
  activatePieces();document.querySelectorAll('[data-model]').forEach(b=>b.onclick=()=>answerStage(b.dataset.model===c.model,'That model keeps the important math visible.','Try a model that represents the quantities and their relationship.'));
 }else if(stage===1){
  const options=rotateTo(c.answer,c.choices,seed+1);
  $('#activity').innerHTML='<span class="review-pill">STEP 2 OF 3 · SOLVE IT</span><h3>'+esc(c.prompt)+'</h3><div class="model-card">'+esc(c.model)+'</div><p class="stage-copy">Use the model. Choose the answer you can prove.</p>'+chooseHtml(options,'answer')+hint;
  document.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>answerStage(b.dataset.answer===c.answer,'Your answer fits the model.','That answer does not fit yet. Check each quantity in the model.'));
 }else{
  const options=rotateTo(c.reason,[c.reason,...c.wrongReasons],seed+2);
  $('#activity').innerHTML='<span class="review-pill">STEP 3 OF 3 · EXPLAIN WHY</span><h3>Why is <strong>'+esc(c.answer)+'</strong> correct?</h3><p class="stage-copy">A strong explanation connects the model, the numbers, and the answer.</p>'+chooseHtml(options,'reason')+hint;
  document.querySelectorAll('[data-reason]').forEach(b=>b.onclick=()=>{if(b.dataset.reason===c.reason)finishMission();else wrong('That explanation does not prove this answer. Look for one that connects all the quantities.')});
 }
}
function answerStage(correct,yes,no){if(locked)return;if(correct){locked=true;feedback(yes,'good');stage++;saveSession();const token=contextToken,id=missionId(),who=learner;setTimeout(()=>{if(token!==contextToken||id!==missionId()||who!==learner)return;locked=false;feedback('');renderActivity()},420)}else wrong(no)}
function wrong(message){attempts++;saveSession();feedback(message,'try')}
function finishMission(){
 if(locked)return;locked=true;
 const id=missionId(),u=unit(),c=currentCase();
 state.completed[id]={complete:true,attempts,hints,completedWithoutHints:attempts===0&&hints===0,completedAt:new Date().toISOString(),contentStandards:c.standards,evidence:'selected-model-answer-explanation'};
 delete state.sessions[id];save();feedback('You solved it and explained why. This review result is saved.','good');
 const token=contextToken,finishedId=id,who=learner;setTimeout(()=>{if(token!==contextToken||finishedId!==missionId()||who!==learner)return;locked=false;renderComplete()},520);
}
function renderComplete(){
 if(!completed()){renderActivity();return}
 const completedWithoutHints=state.completed[missionId()]?.completedWithoutHints;
 $('#activity').innerHTML='<div class="complete-box"><div class="big-icon">✓</div><p class="eyebrow">QUEST COMPLETE</p><h3>'+esc(PHASES[state.mission].label)+'</h3><p>'+(completedWithoutHints?'You selected a valid model, answer, and explanation without a hint.':'You finished with useful hints or correction.')+'</p><p class="locked-note">This records guided choice evidence, not independent creation or spoken explanation. Family review edition: no credits are awarded yet.</p><button class="primary" id="nextQuest" type="button">'+(state.mission<4?'Next quest →':'Next unit →')+'</button></div>';
 $('#nextQuest').onclick=advance;renderProgress();renderTabs();renderMap();phaseRail();
}
function advance(){
 if(!completed())return;
 invalidateContext();
 if(state.mission<4)state.mission++;
 else if(state.unit<level().units.length-1){state.unit++;state.mission=nextIncompleteInUnit(state.unit)}
 else{$('#questContent').hidden=true;$('#questEmpty').hidden=false;return}
 stage=0;attempts=0;hints=0;feedback('');save();loadSession();render();
}
function renderQuest(){
 $('#questContent').hidden=false;$('#questEmpty').hidden=true;
 const u=unit(),phase=PHASES[state.mission];
 $('#questNumber').textContent='UNIT '+(state.unit+1)+' · QUEST '+(state.mission+1)+' OF 5 · '+phase.label.toUpperCase();
 $('#questTitle').textContent=u.title;$('#questGoal').textContent=phase.verb+'. '+u.goal;$('#timeBadge').textContent='5–10 MIN';
 phaseRail();renderActivity();
}
function render(){normalize();$('#learner').value=learner;renderTabs();renderProgress();renderMap();renderQuest();$('#familyNotes').value=state.familyNotes||''}
$('#learner').onchange=e=>{invalidateContext();clearTimeout(noteTimer);state.familyNotes=$('#familyNotes').value;save();store=read();learner=e.target.value;state=store[learner]||blankFoundationsLearner();normalize();loadSession();feedback('');save();render()};
$('#hintBtn').onclick=()=>{if(completed())return;hints=Math.min(2,hints+1);saveSession();renderActivity();feedback('A hint is open. Use it, then explain the idea in your own words.','good')};
$('#resetMission').onclick=()=>{if(!confirm('Restart this quest? The saved completion for this quest will be removed.'))return;invalidateContext();delete state.completed[missionId()];delete state.sessions[missionId()];stage=0;attempts=0;hints=0;save();feedback('Quest restarted.');render()};
$('#familyNotes').oninput=e=>{state.familyNotes=e.target.value;clearTimeout(noteTimer);noteTimer=setTimeout(save,300)};
normalize();loadSession();render();
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js'));
