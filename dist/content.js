export const topics=[
{id:'number',title:'数字工坊',en:'NUMBER SENSE',icon:'⊞',intro:'拆开、凑整，发现数字之间的关系。',reflect:'移动珠子后，总数为什么没有改变？',lessons:[['凑成十','K–1','从第二组借几颗，把第一组补成 10。剩下的再相加，总数保持不变。'],['整十加法','1–2','把个位凑成 10，再与已有的十位合起来。移动不改变总数。'],['小数凑整','4–5','每颗珠子表示 0.1。10 个 0.1 是 1，凑整后再相加。']]},
{id:'array',title:'乘除工厂',en:'MULTIPLY & DIVIDE',icon:'▦',intro:'排成行、分成组，乘法和除法就看得见。',reflect:'把阵列分成两块，为什么总数不变？',lessons:[['一行有几个','2–3','每行一样多：行数 × 每行个数，就是总数。'],['拆开乘法','3–4','把大阵列分成两个小阵列，两部分的乘积相加，得到原来的总数。'],['乘除互相检查','3–5','总数 ÷ 每组个数 = 组数。用组数 × 每组个数可以检查。']]},
{id:'fraction',title:'分数实验室',en:'FRACTIONS',icon:'◒',intro:'同一个整体，分得不同，也能一样大。',reflect:'比较分数前，为什么要确定整体一样大？',lessons:[['认识几分之几','2–3','整体平均分成几份，分母就是几。涂了几份，分子就是几。'],['寻找等值分数','3–4','每一份再平均分成两份，涂色部分大小不变，分子与分母都乘 2。'],['同分母加法','4–5','每份大小相同，只需把份数相加。分母表示份的大小，不相加。']]},
{id:'space',title:'空间建筑师',en:'GEOMETRY LAB',icon:'◇',intro:'先猜另一面，再旋转验证你的想法。',reflect:'换一个角度，积木数量会改变吗？有没有被挡住的积木？',lessons:[['换个角度看','K–2','从上面看，每根积木柱只显示一个顶面。柱子再高，占地也只有一格。'],['数出隐藏积木','2–4','逐层数，再把各层相加。不要只数看得见的面。'],['体积与层数','5','长方体每层有 长 × 宽 个单位正方体。再乘层数，得到体积。']]},
{id:'story',title:'故事解题室',en:'WORD PROBLEMS',icon:'☷',intro:'把故事画出来，找到数量之间的关系。',reflect:'题目求的是一共、相差，还是每一组？你怎样知道？',lessons:[['谁多几个','1–2','把两条数量条从同一起点排齐，多出来的一段就是相差的数量。'],['相同的几组','3','每盒一样多，先求全部有几个，再考虑拿走或增加的部分。'],['两步解决','4–5','把大问题拆成小问题。先算总量，再减去已经用掉的数量。']]},
{id:'logic',title:'数学侦探社',en:'THINK DEEPER',icon:'⌘',intro:'找规律、倒着想，用证据解释答案。',reflect:'你怎样确定答案成立？还能用另一种方法检查吗？',lessons:[['找变化规律','K–2','先比较相邻两个数的差，再检查每一步是否都按同一个规则变化。'],['有序列举','3–4','按从小到大的顺序尝试，记录每一种可能，避免重复或遗漏。'],['反向推理','4–5','从结果倒着想。加法用减法还原，乘法用除法还原，顺序也要反过来。']]}
];
export function rng(seed){let s=seed>>>0;s=Math.imul(s^(s>>>16),0x21f0aaad);s=Math.imul(s^(s>>>15),0x735a2d97);s=(s^(s>>>15))>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
const n=(r,a,b)=>a+Math.floor(r()*(b-a+1));
export function parameters(id,level,seed){let r=rng(seed);switch(id){
case 'number':return{a:n(r,6,9),b:n(r,4,9),tens:level===1?n(r,1,5)*10:0,unit:level===2?.1:1};
case 'array':return{rows:n(r,level?3:2,level?8:4),cols:n(r,3,level?9:5)};
case 'fraction':{let d=[4,6,8][n(r,0,2)];return{d,a:n(r,1,d/2),b:n(r,1,d/2)}}
case 'space':return{w:n(r,2,3),d:n(r,2,3),h:n(r,2,3),heights:level===2?null:[1,2,1,3,1,2,2,1,1]};
case 'story':return{a:n(r,level?4:9,level?9:18),b:n(r,2,level?6:8),c:n(r,1,6)};
default:return{start:n(r,1,7),step:n(r,2,5),target:[12,18,24][n(r,0,2)]}
}}
export function cubes(p,level){let out=[];for(let x=0;x<p.w;x++)for(let z=0;z<p.d;z++)for(let y=0;y<(level===2?p.h:p.heights[x*p.d+z]);y++)out.push([x,y,z]);return out}
const fmt=x=>Number(x.toFixed(3)).toString();
function Q(zh,en,answer,why,hint,unit=''){return{zh,en,answer:fmt(answer),why,hint,unit}}
export function question(id,level,seed,index=0,challenge=false){let p=parameters(id,level,seed),r=rng(seed+index*7919),a=p.a,b=p.b;
if(challenge){switch(id){
case 'number':return Q('把 8＋7 改成 9＋□，总和保持不变。□ 是几？','8 + 7 = 9 + □. What is the missing number?',6,'一个加数多 1，另一个就要少 1，才能保持总数 15。','先算原来的总和，再想 9 还差多少。');
case 'array':return Q('24 个小方块排成长方形。旋转后算同一种，有几种排法？','How many different rectangles use 24 unit squares? Rotations count as the same rectangle.',4,'依次列举：1×24、2×12、3×8、4×6，共 4 种。','从 1 行、2 行、3 行依次尝试，直到开始重复。','种');
case 'fraction':return Q('同样大的两条纸，第一条涂 2/3。第二条分成 12 份，要涂几份才一样长？','Two equal strips: one has 2/3 shaded. How many twelfths equal 2/3?',8,'把每个三分之一再分成 4 份，2×4=8，所以 2/3=8/12。','3 份变成 12 份，每份被分成了几小份？','份');
case 'space':return Q('2×2×2 的实心积木，拿走一个角上的小方块，还剩几个？','A solid 2 × 2 × 2 block loses one corner cube. How many unit cubes remain?',7,'原来有 2×2×2=8 个。只拿走 1 个，还剩 7 个。','先算原来一共有几个。','个');
case 'story':return Q('小安比小贝多 6 张卡。他给小贝 2 张后，还多几张？','Ann has 6 more cards than Ben. She gives Ben 2 cards. How many more cards does Ann have now?',2,'小安少 2，小贝多 2，差距一共缩小 4：6−4=2。','转给对方一张，双方的差距会缩小几张？','张');
default:return Q('有 3 件上衣、2 条裤子、2 顶帽子。每种选一件，共几种搭配？','Choose 1 of 3 shirts, 1 of 2 pairs of pants and 1 of 2 hats. How many outfits are possible?',12,'每件上衣对应 2×2=4 种搭配。3 件上衣共 3×4=12 种。','先固定一件上衣，数裤子和帽子的搭配。','种');
}}
switch(id){
case 'number':{let x=(a+p.tens)*p.unit,y=b*p.unit;if(index===1)return Q(`${fmt(x)}＋□＝${fmt(x+y)}。缺少多少？`,`${fmt(x)} + □ = ${fmt(x+y)}. Find the missing number.`,y,`总数减去已知部分：${fmt(x+y)}−${fmt(x)}=${fmt(y)}。`,'用总数减去已经有的数。');if(index===2)return Q(`有 ${fmt(x+y)} 米彩带，用掉 ${fmt(y)} 米，还剩多少米？`,`A ribbon is ${fmt(x+y)} meters long. You use ${fmt(y)} meters. How many meters remain?`,x,`${fmt(x+y)}−${fmt(y)}=${fmt(x)}。用加法可以检查。`,'剩下的部分加上用掉的部分，应该等于原来的总数。','米');return Q(`${fmt(x)}＋${fmt(y)}＝？`,`What is ${fmt(x)} + ${fmt(y)}?`,x+y,`先从第二组取 ${fmt((10-a)*p.unit)} 凑整，得到 ${fmt((p.tens+10)*p.unit)}＋${fmt((a+b-10)*p.unit)}=${fmt(x+y)}。`,'先想第一个数还差多少能凑成整十或整数。');}
case 'array':{let total=p.rows*p.cols;if(index===1)return Q(`${total} 个平均分成 ${p.rows} 组，每组几个？`,`Share ${total} objects equally among ${p.rows} groups. How many per group?`,p.cols,`${total}÷${p.rows}=${p.cols}。用 ${p.rows}×${p.cols} 检查。`,'想：组数乘几等于总数？','个');if(index===2)return Q(`${p.rows}×${p.cols}＝${p.rows}×2＋${p.rows}×□。□ 是多少？`,`${p.rows} × ${p.cols} = ${p.rows} × 2 + ${p.rows} × □. Find □.`,p.cols-2,`把 ${p.cols} 列分成 2 列和 ${p.cols-2} 列，总数不变。`,'这里只把列数分成两部分。');return Q(`${p.rows} 行，每行 ${p.cols} 个。一共有几个？`,`There are ${p.rows} rows with ${p.cols} objects in each row. How many altogether?`,total,`${p.rows}×${p.cols}=${total}。每行一样多。`,'把每一行的数量相加，或者用乘法。','个');}
case 'fraction':if(level===0)return Q(`整体平均分成 ${p.d} 份，涂了 ${a} 份。分数是多少？（可输入 a/b）`,`A whole has ${p.d} equal parts. ${a} parts are shaded. What fraction is shaded?`,a/p.d,`分母 ${p.d} 表示等分份数，分子 ${a} 表示涂色份数，所以是 ${a}/${p.d}。`,'分母看一共分几份，分子看涂了几份。');if(level===1)return Q(`${a}/${p.d}＝□/${p.d*2}。□ 是几？`,`${a}/${p.d} = □/${p.d*2}. Find □.`,a*2,`每份一分为二，涂色份数也加倍：${a}×2=${a*2}。`,'分母变为 2 倍，分子也变为 2 倍。');return Q(`${a}/${p.d}＋${b}/${p.d}＝？（可输入 a/b）`,`What is ${a}/${p.d} + ${b}/${p.d}?`,(a+b)/p.d,`份的大小不变，份数相加，得到 ${a+b}/${p.d}。`,'只把分子相加；分母保持不变。');
case 'space':{let count=cubes(p,level).length;if(level===0)return Q(`积木占地 ${p.w} 列、${p.d} 排，每格都有一根柱。从上面看，共占几格？`,`A block model has ${p.w} columns and ${p.d} rows of towers, one tower in each space. How many squares does its top view cover?`,p.w*p.d,`从上面看每根柱占一格，${p.w}×${p.d}=${p.w*p.d}。`,'上面看到的是占地格数，先不考虑柱子的高度。','格');if(level===1){let heights=p.heights.slice(0,p.w*p.d);return Q(`共有 ${heights.length} 根柱，高度分别是 ${heights.join('、')}。一共用了几个单位积木？`,`Tower heights are ${heights.join(', ')} unit cubes. How many cubes are used altogether?`,count,`把每根柱的高度相加：${heights.join('+')}=${count}。`,'每根柱的高度，就是这根柱的积木数量。','个')}return Q(`长 ${p.w}、宽 ${p.d}、高 ${p.h} 个单位的实心长方体，体积是多少？`,`A solid prism is ${p.w} units long, ${p.d} units wide and ${p.h} units high. What is its volume?`,count,`每层 ${p.w*p.d} 个，共 ${p.h} 层：${p.w}×${p.d}×${p.h}=${count}。`,'先求每层有几个，再乘层数。','立方单位')}
case 'story':if(level===0)return Q(`小安有 ${a} 张卡，小贝有 ${b} 张。小安多几张？`,`Ann has ${a} cards and Ben has ${b}. How many more cards does Ann have?`,a-b,`求相差，用较多的减较少的：${a}−${b}=${a-b}。`,'问题问“多几张”，不是“一共几张”。','张');if(level===1)return Q(`有 ${a} 盒铅笔，每盒 ${b} 支。一共有几支？`,`There are ${a} boxes with ${b} pencils in each box. How many pencils altogether?`,a*b,`每盒一样多，${a}×${b}=${a*b}。`,'把每盒的数量重复相加。','支');return Q(`有 ${a} 盒铅笔，每盒 ${b} 支。送出 ${p.c} 支后，还剩几支？`,`There are ${a} boxes with ${b} pencils each. After giving away ${p.c} pencils, how many remain?`,a*b-p.c,`先求总数 ${a}×${b}=${a*b}，再减 ${p.c}，剩 ${a*b-p.c}。`,'先求原来有多少，再处理送出的数量。','支');
default:if(level===0)return Q(`按每次加同一个数的规则：${p.start}，${p.start+p.step}，${p.start+p.step*2}，下一项是几？`,`Add the same amount each time: ${p.start}, ${p.start+p.step}, ${p.start+p.step*2}. What comes next?`,p.start+p.step*3,`每次加 ${p.step}，所以下一项是 ${p.start+p.step*3}。`,'相邻两个数相差多少？');if(level===1){let count=0;for(let i=1;i*i<=p.target;i++)if(p.target%i===0)count++;return Q(`${p.target} 个方块排成长方形，旋转算同一种。共有几种排法？`,`How many rectangles use ${p.target} unit squares? Rotations count as the same.`,count,`从 1 开始找整除 ${p.target} 的行数，只记录行数不超过列数的组合，共 ${count} 种。`,'按 1 行、2 行、3 行试。排不整齐的不用记录。','种')}let x=n(r,2,9),times=n(r,2,5),plus=n(r,2,8);return Q(`一个数先乘 ${times} 再加 ${plus}，得到 ${x*times+plus}。原来的数是几？`,`A number is multiplied by ${times}, then ${plus} is added. The result is ${x*times+plus}. What was the number?`,x,`倒过来：先减 ${plus}，再除以 ${times}，得到 ${x}。`,'最后加的数，要先减掉。');
}}
export function parseAnswer(raw){let s=String(raw).trim();if(!s)return NaN;if(/^[+-]?\d+(?:\.\d+)?\s*\/\s*[+-]?\d+(?:\.\d+)?$/.test(s)){let[a,b]=s.split('/').map(Number);return b===0?NaN:a/b}return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(s)?Number(s):NaN}
export function correct(raw,answer){let a=parseAnswer(raw);return Number.isFinite(a)&&Math.abs(a-Number(answer))<0.0006}

export function nextProblemSeed(id,level,seed){
  const previous=parameters(id,level,seed);
  let next=seed+1;
  if(id==='number') while(parameters(id,level,next).a===previous.a) next++;
  return next;
}