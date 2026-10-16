export const DIVISION_TRACKS={
  explorer:{id:'explorer',label:'Explorer',description:'Share and group with friendly facts, then make sense of small remainders.',answerPosition:0,model:{total:24,groups:6},remainder:{total:17,size:5},context:{total:22,size:4,item:'students',container:'car'},fresh:{preview:{total:29,size:4,item:'art kits',container:'box',mode:'ignore'},challenge:{total:38,size:6,item:'campers',container:'tent',mode:'up'}}},
  strategist:{id:'strategist',label:'Strategist',description:'Use larger facts, connect multiplication, and decide what a remainder means.',answerPosition:1,model:{total:96,groups:8},remainder:{total:53,size:6},context:{total:47,size:8,item:'players',container:'team'},fresh:{preview:{total:68,size:9,item:'books',container:'shelf',mode:'ignore'},challenge:{total:73,size:9,item:'musicians',container:'ensemble',mode:'report'}}},
  architect:{id:'architect',label:'Architect',description:'Reason with multi-digit dividends and defend a context-based remainder decision.',answerPosition:2,model:{total:156,groups:12},remainder:{total:278,size:15},context:{total:185,size:24,item:'visitors',container:'bus'},fresh:{preview:{total:265,size:18,item:'samples',container:'tray',mode:'report'},challenge:{total:347,size:24,item:'tiles',container:'mosaic',mode:'ignore'}}}
};
export const DIVISION_CHAIN={id:'division-remainders',title:'Division & Remainders',promise:'See division as equal groups, prove the quotient, and decide what leftovers mean.',releaseStatus:'built · waiting family review',missions:[
{id:'division-start',number:1,title:'Find Your Division Starting Point',kind:'diagnostic',minutes:6,objective:'Check equal sharing, quotient and remainder meaning to choose a useful depth.'},
{id:'build-division',number:2,title:'Build Equal Groups',kind:'learn',minutes:8,objective:'Connect total, number of groups, amount in each group, multiplication and division.'},
{id:'read-remainder',number:3,title:'Read the Remainder',kind:'learn',minutes:8,objective:'Separate complete groups from leftovers and prove the equation.'},
{id:'use-remainder',number:4,title:'Make the Remainder Decision',kind:'apply',minutes:9,objective:'Decide whether a real situation needs another group, ignores leftovers, or reports them.'},
{id:'division-transfer',number:5,title:'Fresh Trip Challenge',kind:'delayed-check',minutes:8,objective:'Solve with new numbers and explain why the remainder changes the answer.'}
]};
export const DIVISION_DIAGNOSTIC=[
{id:'share',prompt:'24 counters are shared equally among 6 teams. How many counters does each team get?',choices:['6','4','18'],answer:'4',why:'Division asks how much is in each equal group. 6 × 4 = 24.'},
{id:'remainder',prompt:'25 stickers are put into groups of 6. What is the result?',choices:['5 groups with 0 left','3 groups with 7 left','4 groups with 1 left'],answer:'4 groups with 1 left',why:'Four complete groups use 24 stickers. One sticker remains.'},
{id:'context',prompt:'26 students ride in vans that hold 5 students each. How many vans are needed?',choices:['6 vans','5 vans','21 vans'],answer:'6 vans',why:'Five vans hold only 25 students. The remaining student needs another van.'}
];
export function recommendDivisionTrack(score){return score<=1?'explorer':score===2?'strategist':'architect'}
export function divide(total,size){if(!Number.isInteger(total)||!Number.isInteger(size)||total<0||size<=0)throw new Error('Invalid division');return{quotient:Math.floor(total/size),remainder:total%size}}
export function groupsModel(total,groups){const d=divide(total,groups);if(d.remainder)throw new Error('Model must divide evenly');return{groups,each:d.quotient,total}}
export function containersNeeded(total,capacity){const d=divide(total,capacity);return d.quotient+(d.remainder?1:0)}
export function correctChoiceIndex(total,size){return divide(total,size).remainder%3}
export function pluralize(word,count=2){if(count===1)return word;if(word==='bus')return'buses';if(word==='box')return'boxes';if(word==='shelf')return'shelves';return word+'s'}
export function remainderContextLead(problem){if(problem.container==='team')return `${problem.total} players form teams of ${problem.size}. Every player must join a team.`;return `${problem.total} travelers ride in ${pluralize(problem.container)} that hold ${problem.size} each.`}
export function createBlankDivisionLearner(){return{track:null,activeMission:0,diagnostic:{index:0,score:0,answers:[]},missions:{},sessions:{},evidence:{model:'unknown',facts:'unknown',remainder:'unknown',decision:'unknown',transfer:'unknown'},retestDue:null,previewFresh:false,family:{help:'',explain:'',continue:''},updatedAt:null}}
