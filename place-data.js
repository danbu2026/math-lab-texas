export const PLACE_TRACKS={
  explorer:{id:'explorer',label:'Explorer',description:'Work with tens and ones.',places:[{name:'Tens',value:10},{name:'Ones',value:1}],target:[4,7],trade:[3,14],compare:[47,74],fresh:{preview:[36,63],challenge:[58,85]}},
  strategist:{id:'strategist',label:'Strategist',description:'Work with hundreds, tens, and ones, including zero as a placeholder.',places:[{name:'Hundreds',value:100},{name:'Tens',value:10},{name:'Ones',value:1}],target:[3,6,4],trade:[2,15,6],compare:[506,560],fresh:{preview:[407,470],challenge:[608,680]}},
  architect:{id:'architect',label:'Architect',description:'Extend the same base-ten structure through tenths and hundredths.',places:[{name:'Ones',value:1},{name:'Tenths',value:.1},{name:'Hundredths',value:.01}],target:[3,6,4],trade:[2,15,6],compare:[3.64,3.46],fresh:{preview:[5.08,5.8],challenge:[7.09,7.9]}}
};

export const PLACE_CHAIN={
  id:'place-value-regrouping',title:'Place Value & Regrouping',promise:'The position of a digit tells how much it is worth.',releaseStatus:'built · waiting family review',missions:[
    {id:'place-start',number:1,title:'Find Your Place-Value Starting Point',kind:'diagnostic',minutes:6,objective:'Notice digit value, base-ten trades, and the job of zero.'},
    {id:'build-number',number:2,title:'Build a Number by Place',kind:'learn',minutes:8,objective:'Build one number from units with different values.'},
    {id:'trade-ten',number:3,title:'Trade Ten Without Changing the Total',kind:'learn',minutes:9,objective:'Exchange ten smaller units for one larger unit and preserve the amount.'},
    {id:'compare-place',number:4,title:'Compare from the Greatest Place',kind:'learn',minutes:8,objective:'Compare numbers by place value instead of scanning for the largest digit.'},
    {id:'place-transfer',number:5,title:'Fresh Shop Challenge',kind:'delayed-check',minutes:8,objective:'Use place-value evidence with new numbers and explain the comparison.'}
  ]
};

export const PLACE_DIAGNOSTIC=[
  {id:'digit-value',prompt:'In 47, what does the digit 4 mean?',choices:['4 tens','4 ones','47 ones'],answer:0,why:'The 4 is in the tens place, so it represents 40.'},
  {id:'trade',prompt:'Which trade keeps the same total?',choices:['10 ones for 1 ten','10 ones for 10 tens','1 one for 10 tens'],answer:0,why:'Ten ones and one ten both have a value of 10.'},
  {id:'zero',prompt:'What is the job of 0 in 506?',choices:['It holds the tens place so 5 still means 500.','It makes the 5 mean 50.','It can be removed without changing the number.'],answer:0,why:'Zero can hold an empty place. In 506 there are no tens.'}
];

export function recommendPlaceTrack(score){return score<=1?'explorer':score===2?'strategist':'architect'}
export function valueOfCounts(counts,places){return Number(counts.reduce((sum,count,i)=>sum+Number(count)*Number(places[i].value),0).toFixed(8))}
export function standardizeTrade(counts){const result=[...counts];for(let i=result.length-1;i>0;i--){const trades=Math.floor(result[i]/10);result[i]-=trades*10;result[i-1]+=trades}return result}
export function compareNumbers(a,b){return Number(a)===Number(b)?'equal':Number(a)>Number(b)?'left':'right'}
export function formatValue(value){return Number.isInteger(value)?String(value):String(Number(value.toFixed(2)))}
export function createBlankPlaceLearner(){return{track:null,activeMission:0,diagnostic:{index:0,score:0,answers:[]},missions:{},sessions:{},evidence:{unit:'unknown',compose:'unknown',compare:'unknown',explanation:'unknown'},retestDue:null,previewFresh:false,family:{help:'',explain:'',continue:''},updatedAt:null}}
