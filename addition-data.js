export const ADDITION_TRACKS={
  explorer:{id:'explorer',label:'Explorer',description:'Work within 20 by making ten and using fact relationships.',addition:{a:8,b:5,bridge:2,remainder:3,friendly:10,result:13},subtraction:{start:14,sub:6,friendlySub:4,adjust:-2,result:8},check:{start:14,sub:6,wrong:9,result:8},fresh:{preview:{a:7,b:6,op:'+',answer:13,story:'Two trays hold 7 and 6 muffins.',strategy:'7 + 3 + 3 = 13. Split 6 into 3 and 3 so 7 can reach 10.',decoys:['7 + 6 + 3 = 16. Count the moved 3 twice.','7 + 1 + 4 = 12. Lose 1 when splitting 6.']},challenge:{a:15,b:7,op:'-',answer:8,story:'A shelf has 15 books and 7 are borrowed.',strategy:'15 − 5 − 2 = 8. Split 7 into 5 and 2 so 15 can reach 10.',decoys:['15 − 5 + 2 = 12. Add the leftover part.','15 − 10 + 7 = 12. Subtract 10 and add all 7 back.']}}},
  strategist:{id:'strategist',label:'Strategist',description:'Work within 100 by bridging a ten and compensating.',addition:{a:47,b:38,bridge:3,remainder:35,friendly:50,result:85},subtraction:{start:72,sub:38,friendlySub:40,adjust:2,result:34},check:{start:72,sub:38,wrong:44,result:34},fresh:{preview:{a:56,b:29,op:'+',answer:85,story:'A garden has 56 red flowers and 29 yellow flowers.',strategy:'56 + 4 + 25 = 85. Split 29 into 4 and 25 so 56 can reach 60.',decoys:['56 + 4 + 29 = 89. Keep all 29 after moving 4.','56 + 30 + 1 = 87. Add 1 after rounding 29 up.']},challenge:{a:63,b:27,op:'-',answer:36,story:'A builder has 63 blocks and uses 27.',strategy:'63 − 30 + 3 = 36. Subtract 30, then add back the extra 3.',decoys:['63 − 30 − 3 = 30. Subtract the extra 3 again.','63 − 20 + 7 = 50. Add the remaining 7.']}}},
  architect:{id:'architect',label:'Architect',description:'Work with larger numbers by choosing efficient bridges and checking reasonableness.',addition:{a:398,b:257,bridge:2,remainder:255,friendly:400,result:655},subtraction:{start:802,sub:468,friendlySub:470,adjust:2,result:334},check:{start:802,sub:468,wrong:344,result:334},fresh:{preview:{a:1245,b:699,op:'+',answer:1944,story:'Two school drives collect 1,245 and 699 cans.',strategy:'1,245 + 700 − 1 = 1,944. Add 700, then remove the extra 1.',decoys:['1,245 + 700 + 1 = 1,946. Add the rounding difference.','1,245 + 600 + 99 = 1,844. Ignore one part of 699.']},challenge:{a:1250,b:685,op:'-',answer:565,story:'A library starts with 1,250 bookmarks and gives away 685.',strategy:'1,250 − 700 + 15 = 565. Subtract 700, then add back the extra 15.',decoys:['1,250 − 700 − 15 = 535. Subtract the rounding difference twice.','1,250 − 600 + 85 = 735. Add the remaining 85.']}}}
};

export const ADDITION_CHAIN={
  id:'addition-subtraction-strategies',title:'Addition & Subtraction Strategies',promise:'Change the form of a problem without changing its value.',releaseStatus:'built · waiting family review',missions:[
    {id:'addition-start',number:1,title:'Find Your Strategy Starting Point',kind:'diagnostic',minutes:6,objective:'Notice friendly numbers, inverse relationships, and reasonable answers.'},
    {id:'bridge-friendly',number:2,title:'Bridge to a Friendly Number',kind:'learn',minutes:8,objective:'Split one addend so the first jump lands on a friendly number.'},
    {id:'subtract-adjust',number:3,title:'Subtract and Compensate',kind:'learn',minutes:9,objective:'Subtract an easier amount, then correct the small difference.'},
    {id:'inverse-check',number:4,title:'Catch an Error with the Inverse',kind:'apply',minutes:8,objective:'Use addition in a changed problem to prove an answer fails and repair it.'},
    {id:'addition-transfer',number:5,title:'Fresh Story Challenge',kind:'delayed-check',minutes:8,objective:'Choose and explain an efficient strategy in a changed situation.'}
  ]
};

export const ADDITION_DIAGNOSTIC=[
  {id:'make-ten',prompt:'You want to solve 8 + 5. How much of the 5 moves first to make 10?',choices:['2','3','5'],answer:0,why:'Eight needs 2 more to become 10. The remaining 3 can be added next.'},
  {id:'inverse',prompt:'Which addition fact checks 14 − 6 = 8?',choices:['8 + 6 = 14','14 + 6 = 20','8 + 14 = 22'],answer:0,why:'Subtraction can be checked by adding the difference and the amount removed.'},
  {id:'reasonable',prompt:'Which is a reasonable answer for 47 + 38?',choices:['About 85','About 20','About 400'],answer:0,why:'47 is near 50 and 38 is near 40, so the total should be near 90.'}
];

export function recommendAdditionTrack(score){return score<=1?'explorer':score===2?'strategist':'architect'}
export function bridgeAddition({a,b,bridge}){return a+bridge+(b-bridge)}
export function compensateSubtraction({start,sub,friendlySub}){return start-friendlySub+(friendlySub-sub)}
export function inverseCheck(start,sub,result){return result+sub===start}
export function solveStory({a,b,op}){return op==='+'?a+b:a-b}
export function createBlankAdditionLearner(){return{track:null,activeMission:0,diagnostic:{index:0,score:0,answers:[]},missions:{},sessions:{},evidence:{friendly:'unknown',decompose:'unknown',inverse:'unknown',explanation:'unknown'},retestDue:null,previewFresh:false,family:{help:'',explain:'',continue:''},updatedAt:null}}
