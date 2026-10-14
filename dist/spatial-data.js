export function normalizeCells(cells){return [...cells].map(([r,c])=>[r,c]).sort((a,b)=>a[0]-b[0]||a[1]-b[1])}
export function rotateCellsClockwise(cells,size){return normalizeCells(cells.map(([r,c])=>[c,size-1-r]))}
export function sameCells(a,b){return JSON.stringify(normalizeCells(a))===JSON.stringify(normalizeCells(b))}
export function countCubes(grid){return grid.flat().reduce((sum,n)=>sum+n,0)}
export function frontView(grid){const width=Math.max(...grid.map(row=>row.length));return Array.from({length:width},(_,x)=>Math.max(...grid.map(row=>row[x]||0)))}
export function sideView(grid){return grid.map(row=>Math.max(...row))}
export function displayRowsBackToFront(grid){return[...grid].reverse()}
export function fitsClues(grid,clues){return JSON.stringify(frontView(grid))===JSON.stringify(clues.front)&&JSON.stringify(sideView(grid))===JSON.stringify(clues.side)&&(clues.total==null||countCubes(grid)===clues.total)}
export function countCompatibleStructures(clues,rows,cols,maxHeight=Math.max(...clues.front,...clues.side)){let count=0,grid=Array.from({length:rows},()=>Array(cols).fill(0));function visit(i,total){if(total>(clues.total??Infinity))return;if(i===rows*cols){if(fitsClues(grid,clues))count++;return}const r=Math.floor(i/cols),c=i%cols;for(let h=0;h<=maxHeight;h++){grid[r][c]=h;visit(i+1,total+h)}}visit(0,0);return count}
export function spatialChoiceIndex(seed,count){let hash=0;for(const char of seed)hash=(hash*31+char.charCodeAt(0))>>>0;return hash%count}
export function freshSpatialChoiceIndex(trackId,kind,challenge,count){const base=spatialChoiceIndex(`${trackId}:spatial:${kind}`,count);return challenge?(base+1)%count:base}

const shape=(size,cells)=>({size,cells:normalizeCells(cells)});
const structure=(grid)=>({grid,front:frontView(grid),side:sideView(grid),total:countCubes(grid)});
function caseSet(rotation,model,candidates){const turned={size:rotation.size,cells:rotateCellsClockwise(rotation.cells,rotation.size)};const clues=structure(model);return{rotation,turned,model,clues,candidates,answer:candidates.findIndex(x=>fitsClues(x,clues))}}

export const SPATIAL_TRACKS={
 explorer:{id:'explorer',label:'Explorer',description:'Turn a small pattern and connect a simple block model to its front and side views.',case:caseSet(shape(3,[[0,0],[1,0],[1,1]]),[[1,2],[0,1]],[[[1,2],[0,1]],[[2,1],[0,1]],[[1,1],[0,2]]]),fresh:{preview:caseSet(shape(3,[[0,1],[1,1],[1,2]]),[[2,0],[1,1]],[[[1,0],[2,1]],[[2,0],[1,1]],[[2,1],[0,2]]]),challenge:caseSet(shape(3,[[0,0],[0,1],[1,0]]),[[1,1],[2,0]],[[[1,2],[1,0]],[[1,1],[2,0]],[[2,1],[1,0]]])}},
 strategist:{id:'strategist',label:'Strategist',description:'Keep an asymmetric pattern oriented and combine two views with a cube total.',case:caseSet(shape(4,[[0,0],[1,0],[2,0],[2,1]]),[[2,0,1],[1,3,0]],[[[2,0,1],[1,3,0]],[[2,1,2],[0,3,0]],[[1,0,2],[2,3,0]]]),fresh:{preview:caseSet(shape(4,[[0,1],[1,1],[1,2],[2,1]]),[[1,2,0],[2,0,1]],[[[1,2,0],[2,0,1]],[[2,1,0],[1,0,2]],[[1,2,2],[2,0,0]]]),challenge:caseSet(shape(4,[[0,0],[0,1],[1,1],[2,1]]),[[2,1,0],[0,3,1]],[[[2,1,0],[0,3,1]],[[1,2,0],[0,3,1]],[[1,0,1],[1,3,0]]])}},
 architect:{id:'architect',label:'Architect',description:'Coordinate rotation, unequal silhouettes, and totals while rejecting structures that fit only part of the evidence.',case:caseSet(shape(5,[[0,1],[1,1],[2,1],[2,2],[3,2]]),[[3,0,1],[1,2,0],[0,1,2]],[[[3,0,1],[1,2,0],[0,1,2]],[[3,1,0],[0,2,1],[1,0,3]],[[2,0,1],[1,3,0],[0,1,2]]]),fresh:{preview:caseSet(shape(5,[[0,0],[1,0],[1,1],[2,1],[2,2]]),[[2,1,0],[0,3,1],[1,0,2]],[[[2,1,0],[0,3,1],[1,0,2]],[[2,0,1],[1,3,0],[0,1,3]],[[1,2,0],[0,3,1],[2,0,1]]]),challenge:caseSet(shape(5,[[0,2],[1,2],[2,2],[2,1],[3,1]]),[[1,3,0],[2,0,1],[0,2,2]],[[[1,3,0],[2,0,1],[0,2,2]],[[2,2,0],[1,0,3],[0,2,1]],[[1,3,0],[1,0,2],[0,2,2]]])}}
};

export const SPATIAL_CHAIN={id:'spatial-viewpoint-lab',title:'Spatial Viewpoint Lab',promise:'Turn it in your mind, read what each viewpoint reveals, and combine clues before deciding.',releaseStatus:'built · waiting family review',missions:[
 {id:'spatial-start',number:1,title:'Find Your Spatial Starting Point',kind:'diagnostic',minutes:6,objective:'Check mental turns, viewpoint language, and hidden-stack reasoning.'},
 {id:'mental-turn',number:2,title:'Turn the Pattern in Your Mind',kind:'learn',minutes:8,objective:'Rotate one asymmetric pattern without flipping or changing its pieces.'},
 {id:'read-views',number:3,title:'See the Same Build Two Ways',kind:'learn',minutes:9,objective:'Read front and right-side silhouettes from one block structure.'},
 {id:'combine-clues',number:4,title:'Use Every Clue Before You Choose',kind:'apply',minutes:10,objective:'Find which shown model matches both views and the cube total, then decide what the clues can truly prove.'},
 {id:'spatial-transfer',number:5,title:'Fresh Viewpoint Challenge',kind:'delayed-check',minutes:9,objective:'Transfer the reasoning to a changed pattern and structure after a delay.'}
]};

export const SPATIAL_DIAGNOSTIC=[
 {id:'turn',prompt:'An arrow points up. After one clockwise quarter-turn, where does it point?',choices:['Right','Left','Down'],answer:0,why:'Clockwise carries the top direction to the right.'},
 {id:'front',prompt:'From the front, one column reaches height 3. What must be true?',choices:['At least one stack in that column is 3 cubes high','Every stack is 3 cubes high','There are exactly 3 cubes in the whole model'],answer:0,why:'A silhouette shows the tallest stack in that line of sight.'},
 {id:'evidence',prompt:'Two structures have the same front view. Is that enough to prove they are identical?',choices:['No—use another view or another clue','Yes—the front view shows every hidden stack','Yes—if both use cubes'],answer:0,why:'Different hidden arrangements can share one silhouette.'}
];
export function recommendSpatialTrack(score){return score<=1?'explorer':score===2?'strategist':'architect'}
export function createBlankSpatialLearner(){return{track:null,activeMission:0,diagnostic:{index:0,score:0,answers:[]},missions:{},sessions:{},evidence:{rotation:'unknown',views:'unknown',constraints:'unknown',transfer:'unknown'},retestDue:null,previewFresh:false,family:{help:'',explain:'',continue:''},updatedAt:null}}
