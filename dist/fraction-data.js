export const FRACTION_TRACKS={
  explorer:{id:'explorer',label:'Explorer',description:'Build halves, thirds, and fourths with clear pictures.',share:{parts:4,target:3},line:{parts:4,target:3},equivalent:{a:[1,2],b:[2,4]},fresh:{preview:[2,3],challenge:[3,4]}},
  strategist:{id:'strategist',label:'Strategist',description:'Connect sixths and eighths to familiar fractions.',share:{parts:8,target:5},line:{parts:8,target:5},equivalent:{a:[2,3],b:[4,6]},fresh:{preview:[4,6],challenge:[6,8]}},
  architect:{id:'architect',label:'Architect',description:'Reason with less familiar equivalents and defend the relationship.',share:{parts:12,target:7},line:{parts:12,target:7},equivalent:{a:[5,6],b:[10,12]},fresh:{preview:[6,9],challenge:[8,12]}}
};

export const FRACTION_CHAIN={
  id:'fraction-meaning-equivalence',
  title:'Fractions as Relationships',
  promise:'See a fraction as a relationship between equal parts and one whole.',
  releaseStatus:'built · waiting family review',
  missions:[
    {id:'fraction-start',number:1,title:'Find Your Fraction Starting Point',kind:'diagnostic',minutes:6,objective:'Notice equal parts, identify a fraction, and choose a useful starting depth.'},
    {id:'equal-shares',number:2,title:'Build Equal Shares',kind:'learn',minutes:8,objective:'Build a fraction by dividing one whole into equal parts.'},
    {id:'fraction-line',number:3,title:'Place a Fraction on the Number Line',kind:'learn',minutes:8,objective:'Connect equal parts of a shape to equal distances from zero to one.'},
    {id:'equivalent-bars',number:4,title:'Prove Two Fractions Are Equivalent',kind:'learn',minutes:10,objective:'Use aligned bars to prove that different names can describe the same amount.'},
    {id:'fraction-transfer',number:5,title:'Fresh Recipe Challenge',kind:'delayed-check',minutes:8,objective:'Use fraction relationships with new numbers and explain the evidence.'}
  ]
};

export const FRACTION_DIAGNOSTIC=[
  {id:'equal',prompt:'Which picture could show fourths?',choices:['Four equal pieces','Four pieces of any size','One large piece and three tiny pieces'],answer:0,why:'A fraction names equal parts of one whole.'},
  {id:'name',prompt:'A whole is split into 4 equal parts. Three are shaded. Which fraction is shaded?',choices:['3/4','4/3','1/4'],answer:0,why:'The denominator counts all equal parts. The numerator counts the selected parts.'},
  {id:'equivalent',prompt:'Which fraction covers the same amount as 1/2?',choices:['2/4','1/3','3/4'],answer:0,why:'Two fourths cover the same length as one half.'}
];

export function recommendFractionTrack(score){return score<=1?'explorer':score===2?'strategist':'architect'}
export function isEqualShare(parts,widths){return Number.isInteger(parts)&&parts>0&&Array.isArray(widths)&&widths.length===parts&&widths.every(x=>x===widths[0])}
export function sameFraction(a,b,c,d){return Number(a)*Number(d)===Number(b)*Number(c)}
export function fractionValue(n,d){if(!Number.isInteger(n)||!Number.isInteger(d)||d<=0||n<0||n>d)throw new Error('Invalid fraction');return n/d}
export function createBlankFractionLearner(){return{track:null,activeMission:0,diagnostic:{index:0,score:0,answers:[]},missions:{},sessions:{},evidence:{whole:'unknown',representation:'unknown',equivalence:'unknown',explanation:'unknown'},retestDue:null,previewFresh:false,family:{help:'',explain:'',continue:''},updatedAt:null}}
