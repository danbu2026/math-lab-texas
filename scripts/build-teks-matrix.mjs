import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const input=path.join(root,'.research','ch111a.txt');
const outputDir=path.join(root,'curriculum');
const sourceUrl='https://tea.texas.gov/laws-and-rules/sboe-rules-tac/sboe-tac-currently-effect/ch111a.pdf';
const checkedAt='2026-10-03';
const raw=fs.readFileSync(input,'utf8').replace(/\r/g,'');
const cleaned=raw.split('\n').filter(line=>{
  const s=line.trim();
  return s && !/^Page \d+ /.test(s) && !/^December 2014 Update Page/.test(s) && s!=='Elementary §111.A.' && s!=='§111.A. Elementary';
}).join('\n');

const grades=[
  {section:'111.2',grade:'K',name:'Kindergarten'},
  {section:'111.3',grade:'1',name:'Grade 1'},
  {section:'111.4',grade:'2',name:'Grade 2'},
  {section:'111.5',grade:'3',name:'Grade 3'},
  {section:'111.6',grade:'4',name:'Grade 4'},
  {section:'111.7',grade:'5',name:'Grade 5'},
];
const pilotIds=new Set(['2.6A','2.6B','3.4D','3.4E','3.4J','3.4K','3.5B','3.5D','4.4B','4.4C','4.4H','5.4B']);
const rows=[];

function normalize(s){
  return s.replace(/\s+/g,' ').replace(/\s+([,.;:])/g,'$1').replace(/\s*-\s*/g,'-').replace(/([A-Za-z])-\s+([a-z])/g,'$1$2').replace(/\b(one|two)-and\b/g,'$1- and').replace(/\bo f\b/g,'of').replace(/\bf our(?=-|\b)/g,'four').replace(/four \-/g,'four-').replace(/\bte ns\b/g,'tens').replace(/\bacquir e\b/g,'acquire').trim();
}
for(let gi=0;gi<grades.length;gi++){
  const g=grades[gi];
  const start=cleaned.indexOf(`§${g.section}.`);
  const end=gi+1<grades.length?cleaned.indexOf(`§${grades[gi+1].section}.`):cleaned.length;
  if(start<0||end<0)throw new Error(`Missing grade section ${g.section}`);
  let section=cleaned.slice(start,end);
  const marker='(b) Knowledge and skills.';
  const b=section.indexOf(marker);
  if(b<0)throw new Error(`Missing knowledge-and-skills marker for ${g.grade}`);
  section=section.slice(b+marker.length).split('\nSource:')[0];
  const lines=section.split('\n').map(x=>x.trim()).filter(Boolean);
  let group=null;
  let expectation=null;
  const pushRow=(letter,text)=>{
    const id=`${g.grade}.${group.number}${letter}`;
    rows.push({
      id,
      grade:g.grade,
      gradeName:g.name,
      sectionNumber:Number(group.number),
      expectationLetter:letter,
      strand:group.strand,
      knowledgeAndSkills:normalize(group.knowledgeHeader||group.header),
      studentExpectation:normalize(text),
      requiredOrExtension:'TEKS required',
      coverageStatus:pilotIds.has(id)?'pilot planned':'unmapped',
      moduleId:pilotIds.has(id)?'multiplication-relationships':'',
      prerequisiteIds:[],
      independentEvidence:'',
      delayedEvidence:'',
      academicApplicationTags:[],
      reasoningTags:[],
      currentArtifact:'',
      reviewNotes:'',
      sourceUrl,
      sourceCheckedAt:checkedAt,
    });
  };
  const flushExpectation=()=>{
    if(!group||!expectation)return;
    pushRow(expectation.letter,expectation.text);
    expectation=null;
  };
  const flushStandalone=()=>{
    if(!group||group.hasSubitems)return;
    const marker='The student is expected to';
    const at=group.header.indexOf(marker);
    if(at<0)throw new Error(`Missing student expectation in ${g.grade}.${group.number}`);
    group.knowledgeHeader=group.header.slice(0,at).trim();
    const text=group.header.slice(at+marker.length).replace(/^\s*:\s*/,'').trim();
    if(!text)throw new Error(`Empty student expectation in ${g.grade}.${group.number}`);
    pushRow('',text);
  };
  for(const line of lines){
    const gm=line.match(/^\((\d+)\)\s+(.*)$/);
    const em=line.match(/^\(([A-Z])\)\s+(.*)$/);
    if(gm){
      flushExpectation();
      flushStandalone();
      const header=gm[2];
      group={number:gm[1],header,strand:normalize(header.split('.')[0]),hasSubitems:false};
    }else if(em&&group){
      flushExpectation();
      group.hasSubitems=true;
      expectation={letter:em[1],text:em[2]};
    }else if(expectation){
      expectation.text+=' '+line;
    }else if(group){
      group.header+=' '+line;
      group.strand=normalize(group.header.split('.')[0]);
    }
  }
  flushExpectation();
  flushStandalone();
}

const expectedGrades=['K','1','2','3','4','5'];
for(const grade of expectedGrades){
  if(!rows.some(r=>r.grade===grade))throw new Error(`No rows for grade ${grade}`);
}
if(new Set(rows.map(r=>r.id)).size!==rows.length)throw new Error('Duplicate TEKS ids found');
if(rows.some(r=>!r.studentExpectation||!r.strand))throw new Error('Incomplete rows found');

fs.mkdirSync(outputDir,{recursive:true});
fs.writeFileSync(path.join(outputDir,'teks-k5-matrix.json'),JSON.stringify({
  schemaVersion:1,
  title:'Texas K–5 Mathematics Standards Coverage Matrix',
  source:{url:sourceUrl,checkedAt,document:'19 TAC Chapter 111, Subchapter A'},
  statusDefinitions:{
    unmapped:'Official expectation indexed; no product coverage assigned yet.',
    'pilot planned':'Assigned to the first pilot learning chain; not yet reviewed or family tested.',
    prototype:'Interactive prototype exists but has not passed content review.',
    'content reviewed':'Mathematics and standards alignment independently reviewed.',
    'ready for family test':'Content and interaction checks passed; ready for labeled family testing.',
    'family validated':'Tested successfully in this family context; not a general effectiveness claim.'
  },
  rows
},null,2)+'\n');

const csvHeaders=['id','grade','strand','knowledgeAndSkills','studentExpectation','requiredOrExtension','coverageStatus','moduleId','currentArtifact','sourceUrl','sourceCheckedAt'];
const quote=v=>'"'+String(v??'').replaceAll('"','""')+'"';
const csv=[csvHeaders.map(quote).join(','),...rows.map(r=>csvHeaders.map(k=>quote(r[k])).join(','))].join('\n')+'\n';
fs.writeFileSync(path.join(outputDir,'teks-k5-matrix.csv'),csv);
const webRows=rows.map(({id,grade,gradeName,sectionNumber,strand,knowledgeAndSkills,studentExpectation,coverageStatus,moduleId,sourceUrl,sourceCheckedAt})=>({id,grade,gradeName,sectionNumber,strand,knowledgeAndSkills,studentExpectation,coverageStatus,moduleId,sourceUrl,sourceCheckedAt}));
fs.writeFileSync(path.join(root,'dist','teks-k5.js'),'export const TEKS_META='+JSON.stringify({total:rows.length,sourceUrl,sourceCheckedAt:checkedAt})+';\nexport const TEKS_ROWS='+JSON.stringify(webRows)+';\n');

const byGrade=Object.fromEntries(expectedGrades.map(g=>[g,rows.filter(r=>r.grade===g).length]));
const byStrand={};
for(const row of rows)byStrand[row.strand]=(byStrand[row.strand]||0)+1;
const summary=[
  '# K–5 TEKS Coverage Matrix Status',
  '',
  `Official student expectations indexed: **${rows.length}**`,
  '',
  '## By grade',
  '',
  '| Grade | Expectations |',
  '|---|---:|',
  ...expectedGrades.map(g=>`| ${g==='K'?'Kindergarten':`Grade ${g}`} | ${byGrade[g]} |`),
  '',
  '## By strand',
  '',
  '| Strand | Expectations |',
  '|---|---:|',
  ...Object.entries(byStrand).sort((a,b)=>a[0].localeCompare(b[0])).map(([s,n])=>`| ${s} | ${n} |`),
  '',
  '## Current coverage truth',
  '',
  `- Pilot planned: ${rows.filter(r=>r.coverageStatus==='pilot planned').length}`,
  `- Unmapped: ${rows.filter(r=>r.coverageStatus==='unmapped').length}`,
  '- A row marked “pilot planned” is not yet a completed lesson.',
  '- The source PDF is authoritative; this generated matrix must be rechecked whenever TEA updates Chapter 111.',
  '- Carroll ISD teaching order must be recorded separately from state-required scope.',
  '',
  '## Next production gate',
  '',
  'Complete one 3–5 mission multiplication-relationships learning chain, independently review it, test it with the two family learners at appropriate depths, and then update only the evidence-backed matrix rows.'
].join('\n')+'\n';
fs.writeFileSync(path.join(outputDir,'COVERAGE-STATUS.md'),summary);
console.log(JSON.stringify({rows:rows.length,byGrade,pilotPlanned:rows.filter(r=>r.coverageStatus==='pilot planned').length,unmapped:rows.filter(r=>r.coverageStatus==='unmapped').length},null,2));
