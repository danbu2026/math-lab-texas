import {TEKS_META,TEKS_ROWS} from './teks-k5.js';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const gradeNames={K:'Kindergarten',1:'Grade 1',2:'Grade 2',3:'Grade 3',4:'Grade 4',5:'Grade 5'};
const grades=['K','1','2','3','4','5'];
const strands=[...new Set(TEKS_ROWS.map(r=>r.strand))].sort();
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const stateText={
  'unmapped':['planned','Planned · not published'],
  'pilot planned':['pilot','Pilot 01 planned'],
  'prototype':['prototype','Prototype'],
  'content reviewed':['ready','Content reviewed'],
  'ready for family test':['pilot','Ready for family test'],
  'family validated':['validated','Family validated']
};
const rewardStorage='mathlab-framework-rewards-v2';
const pilotPieces={
  '2.6A':['Check','Learn'],'2.6B':['Learn'],
  '3.4D':['Check','Learn'],'3.4E':['Check','Learn'],'3.4J':['Learn'],'3.4K':['Fresh check'],
  '3.5B':['Fresh check'],'3.5D':['Learn'],
  '4.4B':['Learn'],'4.4C':['Check','Learn'],'4.4H':['Fresh check'],
  '5.4B':['Fresh check']
};

function showView(name){$$('.view').forEach(v=>v.classList.toggle('active',v.dataset.page===name));$$('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===name));window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});history.replaceState(null,'','#'+name)}
$('#mainNav').addEventListener('click',e=>{const b=e.target.closest('[data-view]');if(b)showView(b.dataset.view)});

function fillFilters(){
  const gradeOptions=grades.map(g=>`<option value="${g}">${gradeNames[g]}</option>`).join('');
  $('#gradeFilter').insertAdjacentHTML('beforeend',gradeOptions);
  $('#sessionGrade').innerHTML=gradeOptions;
  const strandOptions=strands.map(s=>`<option value="${esc(s)}">${esc(s)}</option>`).join('');
  $('#strandFilter').insertAdjacentHTML('beforeend',strandOptions);
  $('#sessionStrand').insertAdjacentHTML('beforeend',strandOptions);
}
function statusBadge(status){const [cls,label]=stateText[status]||['planned',status];return `<span class="state ${cls}">${esc(label)}</span>`}
function filteredRows(prefix){const grade=$(`#${prefix}Grade`)?.value||$('#gradeFilter').value;const strand=$(`#${prefix}Strand`)?.value||$('#strandFilter').value;const search=($(`#${prefix}Search`)?.value||'').trim().toLowerCase();const status=prefix==='curriculum'?$('#statusFilter').value:'all';return TEKS_ROWS.filter(r=>(grade==='all'||r.grade===grade)&&(strand==='all'||r.strand===strand)&&(status==='all'||r.coverageStatus===status)&&(!search||`${r.id} ${r.strand} ${r.studentExpectation}`.toLowerCase().includes(search)))}
function renderCurriculum(){const rows=filteredRows('curriculum');const pilot=rows.filter(r=>r.coverageStatus==='pilot planned').length;$('#coverageStrip').innerHTML=`<span class="coverage-chip"><strong>${rows.length}</strong> visible expectations</span><span class="coverage-chip"><strong>${pilot}</strong> connected to Pilot 01</span><span class="coverage-chip"><strong>${rows.length-pilot}</strong> gray · not published</span><span class="coverage-chip">Official source checked ${TEKS_META.sourceCheckedAt}</span>`;$('#curriculumList').innerHTML=rows.length?rows.map(r=>`<details class="standard-card ${r.coverageStatus==='pilot planned'?'pilot-row':''}"><summary><span class="standard-id">${esc(r.id)}</span><span class="standard-summary">${esc(r.studentExpectation)}</span>${statusBadge(r.coverageStatus)}</summary><div class="standard-details"><p><strong>${esc(r.strand)}</strong> · ${esc(r.gradeName)}</p><p>${esc(r.knowledgeAndSkills)}</p><div class="standard-meta"><span class="state planned">Check</span><span class="state planned">Learn</span><span class="state planned">Apply</span><span class="state planned">Fresh check</span>${r.moduleId?`<span class="state pilot">${esc(r.moduleId)}</span>`:''}</div><p><a class="source-link" href="${esc(r.sourceUrl)}" target="_blank" rel="noopener">Open official TEKS source ↗</a></p></div></details>`).join(''):'<div class="empty-state">No standards match these filters.</div>'}
function renderSessions(){const rows=filteredRows('session');$('#sessionCount').textContent=`${rows.length} abilities shown`;$('#sessionBoard').innerHTML=rows.length?rows.map(r=>{const process=r.strand==='Mathematical process standards';return `<article class="session-row"><div><h3>${esc(r.id)} · ${esc(r.strand)}</h3><p>${esc(r.studentExpectation)}</p></div><div class="session-pieces">${process?'<span class="piece integrated">Woven into content missions · formal implementation not published</span>':['Check','Learn','Apply','Fresh check'].map(x=>{const exists=(pilotPieces[r.id]||[]).includes(x);return `<span class="piece ${exists?'pilot':''}">${x}<small>${exists?' · Pilot 01':' · not published'}</small></span>`}).join('')}</div></article>`}).join(''):'<div class="empty-state">No production rows match these filters.</div>'}

const components=[
  ['Product and curriculum blueprint','Learning promise, scope, evidence rules, release gates','ready','Approved for the next build stage'],
  ['Official K–5 TEKS index',`${TEKS_META.total} student expectations with source wording`,'ready','Indexed · item review continues'],
  ['Carroll ISD teaching order','Year-at-a-Glance sequence layered over TEKS','planned','Not yet mapped'],
  ['Prerequisite dependency graph','What must be understood before each ability','planned','Not yet published'],
  ['18 interactive math activities','Existing manipulatives and question prototypes','prototype','Prototype only'],
  ['Pilot Path 01','Multiplication Relationships · five connected missions','pilot','Ready for family test after QA'],
  ['Personal diagnostic engine','Start near current ability and look back only with evidence','pilot','Rule set in Pilot 01'],
  ['Daily mission selector','Chooses gap, fresh check, new idea, or transfer','planned','Not yet published'],
  ['Four-part evidence record','Concept, procedure, application, explanation/transfer','pilot','Pilot implementation'],
  ['Delayed fresh checks','Wait before claiming stable evidence','pilot','Pilot implementation'],
  ['Parent learning report','What changed, what help was used, and why next','planned','Framework visible'],
  ['Family rewards','Rewards tied to meaningful milestones, not task count','prototype','Local editable ideas'],
  ['Offline iPad PWA','Installable shell and cached core pages','ready','Physical iPad validation still required'],
  ['Child experience testing','Family observations and revision record','planned','Begins with Pilot 01'],
  ['Accounts, sync, membership','Profiles across devices and future paid access','later','Later phase'],
  ['Science, engineering, technology, arts','Future STEAM extensions after math system is stable','later','Later phase']
];
function renderComponents(){$('#componentBoard').innerHTML=components.map(([name,desc,status,note])=>`<article class="component-row"><h3>${esc(name)}</h3><p>${esc(desc)}<br><small>${esc(note)}</small></p><span class="state ${status}">${status==='ready'?'Ready framework':status==='pilot'?'Pilot':status==='prototype'?'Prototype':status==='later'?'Later phase':'Planned · unpublished'}</span></article>`).join('')}
function readRewards(){try{return JSON.parse(localStorage.getItem(rewardStorage))||[]}catch{return[]}}
function renderRewards(){const saved=readRewards();$('#rewardGrid').innerHTML=Array.from({length:12},(_,i)=>`<article class="reward-card"><label>Milestone ${String(i+1).padStart(2,'0')}<input maxlength="80" data-reward="${i}" value="${esc(saved[i]||'')}" placeholder="Choose together later"></label></article>`).join('')}
function saveRewards(){const values=$$('[data-reward]').map(x=>x.value.trim());try{localStorage.setItem(rewardStorage,JSON.stringify(values));$('#rewardSaved').textContent='Reward ideas saved on this device.'}catch{$('#rewardSaved').textContent='Device storage is unavailable. These ideas may not remain after closing.'}}
$('#saveRewards').onclick=saveRewards;$('#rewardGrid').addEventListener('input',()=>{$('#rewardSaved').textContent='Unsaved changes'});

fillFilters();$('#totalStandards').textContent=TEKS_META.total;renderCurriculum();renderSessions();renderComponents();renderRewards();
for(const id of ['gradeFilter','strandFilter','statusFilter'])$('#'+id).addEventListener('change',renderCurriculum);$('#curriculumSearch').addEventListener('input',renderCurriculum);for(const id of ['sessionGrade','sessionStrand'])$('#'+id).addEventListener('change',renderSessions);$('#sessionSearch').addEventListener('input',renderSessions);
const requested=location.hash.slice(1);if($(`[data-page="${requested}"]`))showView(requested);
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js'));
