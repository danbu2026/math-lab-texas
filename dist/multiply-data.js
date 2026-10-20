export const MULTIPLY_TRACKS={
 explorer:{id:'explorer',label:'Explorer',description:'Break a two-digit number into tens and ones, then rebuild the product.',pos:0,model:{a:23,b:4,parts:[20,3]},strategy:{a:16,b:5,equivalent:'8 × 10',reason:'Halve 16 and double 5. The product stays the same.'},repair:{a:34,b:3,wrong:912,work:['30 × 3 = 90','4 × 3 = 12','90 beside 12 → 912'],reason:'The partial products 90 and 12 were written side by side instead of added.',wrongReasons:['34 was split into 30 + 3.','Only the ones digit should be multiplied by 3.']},fresh:{preview:{a:32,b:6,pos:1},challenge:{a:41,b:7,pos:2}}},
 strategist:{id:'strategist',label:'Strategist',description:'Connect partial products, friendly-number strategies, and two-digit multiplication.',pos:1,model:{a:47,b:6,parts:[40,7]},strategy:{a:25,b:16,equivalent:'100 × 4',reason:'Four groups of 25 make 100, so sixteen groups make four hundreds.'},repair:{a:36,b:14,wrong:404,work:['36 × 10 = 260','36 × 4 = 144','260 + 144 = 404'],reason:'The 36 × 10 partial product was made 100 too small. It should be 360.',wrongReasons:['The 36 × 4 partial product should be 44.','The two partial products should be subtracted.']},fresh:{preview:{a:58,b:14,pos:2},challenge:{a:67,b:13,pos:0}}},
 architect:{id:'architect',label:'Architect',description:'Reason across hundreds, partial products, estimation, and efficient transformations.',pos:2,model:{a:326,b:7,parts:[300,20,6]},strategy:{a:48,b:25,equivalent:'48 × 100 ÷ 4',reason:'Twenty-five is one fourth of 100, so multiply by 100 and divide by 4.'},repair:{a:48,b:23,wrong:1004,work:['48 × 20 = 860','48 × 3 = 144','860 + 144 = 1004'],reason:'The 48 × 20 partial product was made 100 too small. It should be 960.',wrongReasons:['The 48 × 3 partial product should be 44.','The two partial products should be subtracted.']},fresh:{preview:{a:324,b:18,pos:0},challenge:{a:436,b:27,pos:1}}}
};
export const MULTIPLY_CHAIN={id:'multi-digit-multiplication',title:'Multiply by Breaking Apart',releaseStatus:'built · waiting family review',missions:[
{id:'multiply-start',number:1,title:'Find Your Multiplication Starting Point',kind:'diagnostic',minutes:6,objective:'Check equal groups, place value, estimation, and partial-product understanding.'},
{id:'build-partials',number:2,title:'Build the Partial Products',kind:'learn',minutes:8,objective:'Break one factor by place value and show why every partial product belongs.'},
{id:'choose-strategy',number:3,title:'Choose a Smart Strategy',kind:'learn',minutes:8,objective:'Transform a product into friendlier numbers without changing its value.'},
{id:'repair-product',number:4,title:'Find and Repair the Error',kind:'apply',minutes:9,objective:'Use estimation and place value to locate and correct a multiplication error.'},
{id:'multiply-transfer',number:5,title:'Fresh Product Challenge',kind:'delayed-check',minutes:8,objective:'Solve a new product and justify the decomposition after a delay.'}
]};
export const MULTIPLY_DIAGNOSTIC=[
{id:'facts',prompt:'What is 7 × 8?',choices:['54','56','64'],answer:'56',why:'Seven groups of eight make 56.'},
{id:'place',prompt:'Which expression is equal to 34 × 6?',choices:['30 × 6 + 4 × 6','34 + 6','3 × 6 + 4 × 6'],answer:'30 × 6 + 4 × 6',why:'Thirty-four is 30 + 4, so both parts must be multiplied by 6.'},
{id:'estimate',prompt:'Which is the best estimate for 49 × 21?',choices:['About 100','About 10,000','About 1,000'],answer:'About 1,000',why:'50 × 20 is 1,000, so the exact product should be nearby.'}
];
export function recommendMultiplyTrack(score){return score<=1?'explorer':score===2?'strategist':'architect'}
export function product(a,b){if(!Number.isInteger(a)||!Number.isInteger(b)||a<0||b<0)throw new Error('Invalid factors');return a*b}
export function partialProducts(parts,b){return parts.map(x=>x*b)}
export function verifyDecomposition(problem){return problem.parts.reduce((n,x)=>n+x,0)===problem.a&&partialProducts(problem.parts,problem.b).reduce((n,x)=>n+x,0)===product(problem.a,problem.b)}
export function estimateProduct(a,b){const round=n=>n<10?n:Math.round(n/10)*10;return round(a)*round(b)}
export function createBlankMultiplyLearner(){return{track:null,activeMission:0,diagnostic:{index:0,score:0,answers:[]},missions:{},sessions:{},evidence:{placeValue:'unknown',distributive:'unknown',strategy:'unknown',error:'unknown',transfer:'unknown'},retestDue:null,previewFresh:false,family:{help:'',explain:'',continue:''},updatedAt:null}}

