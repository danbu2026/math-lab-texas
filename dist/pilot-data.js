export const TRACKS={
  explorer:{id:'explorer',label:'Explorer',description:'Build and count equal groups.',rows:3,cols:4,split:2,transfer:{preview:{total:20,groups:5},fresh:{total:24,groups:6}}},
  strategist:{id:'strategist',label:'Strategist',description:'Connect arrays, multiplication, and division.',rows:6,cols:8,split:5,transfer:{preview:{total:72,groups:8},fresh:{total:84,groups:7}}},
  architect:{id:'architect',label:'Architect',description:'Split larger products and defend the reasoning.',rows:7,cols:13,split:10,transfer:{preview:{total:168,groups:12},fresh:{total:192,groups:12}}}
};

export const PILOT_CHAIN={
  id:'multiplication-relationships',
  title:'Multiplication Relationships',
  promise:'See one structure in equal groups, arrays, multiplication, and division.',
  releaseStatus:'ready for family test',
  sourceCheckedAt:'2026-10-03',
  missions:[
    {id:'starting-point',number:1,title:'Find Your Starting Point',kind:'diagnostic',minutes:6,objective:'Use three short questions to select a useful starting depth.',standards:['2.6A','3.4D','3.4E','4.4C'],evidence:['concept']},
    {id:'equal-groups',number:2,title:'Build Equal Groups',kind:'learn',minutes:8,objective:'Connect rows, equal groups, repeated addition, and multiplication.',standards:['2.6A','3.4D','3.4E'],evidence:['concept','procedure']},
    {id:'split-array',number:3,title:'Split Without Changing the Total',kind:'learn',minutes:10,objective:'Use a movable divider to see the distributive relationship.',standards:['3.4E','4.4B','4.4C'],evidence:['concept','procedure','explanation']},
    {id:'fact-family',number:4,title:'Multiply and Divide the Same Array',kind:'learn',minutes:9,objective:'Use one array to write related multiplication and division equations.',standards:['2.6B','3.4J','3.5D'],evidence:['procedure','explanation']},
    {id:'fresh-transfer',number:5,title:'Fresh Garden Challenge',kind:'delayed-check',minutes:8,objective:'Use the relationship in a new situation after time has passed.',standards:['3.4K','3.5B','4.4H','5.4B'],evidence:['application','explanation']}
  ]
};

export const DIAGNOSTIC=[
  {id:'groups',prompt:'Which story matches an array with 4 rows and 6 counters in every row?',choices:['4 equal groups of 6','4 + 6 counters','6 counters shared into 4 unequal groups'],answer:0,why:'Each row is one equal group, so there are 4 equal groups of 6.'},
  {id:'total',prompt:'A tray has 5 rows of 7 tiles. How many tiles are there?',answer:35,why:'Five equal groups of 7 make 35.'},
  {id:'split',prompt:'Complete the split: 6 × 13 = 6 × 10 + 6 × 3 = 60 + ___',answer:18,why:'The second part still has 6 rows. Six groups of 3 make 18.'}
];

export function recommendTrack(score){
  if(score<=1)return 'explorer';
  if(score===2)return 'strategist';
  return 'architect';
}
export function product(rows,cols){return Number(rows)*Number(cols)}
export function splitParts(rows,cols,split){
  rows=Number(rows);cols=Number(cols);split=Number(split);
  if(!Number.isInteger(rows)||!Number.isInteger(cols)||!Number.isInteger(split)||rows<1||cols<2||split<1||split>=cols)throw new Error('Invalid array split');
  return {left:rows*split,right:rows*(cols-split),total:rows*cols};
}
export function factFamily(rows,cols){
  const total=product(rows,cols);
  return {multiply:total,divideByRows:cols,divideByCols:rows};
}
export function nextDayDelayMs(){return 20*60*60*1000}
export function isIndependentEvidence(attempts,hints){return Number(attempts)<=1&&Number(hints)===0}
export function createBlankLearner(){
  return {track:null,activeMission:0,diagnostic:{index:0,score:0,answers:[]},missions:{},evidence:{concept:'unknown',procedure:'unknown',application:'unknown',explanation:'unknown'},retestDue:null,previewFresh:false,sessions:{},updatedAt:null};
}
