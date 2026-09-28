import {topics,question as baseQuestion,parameters,cubes} from './content.js';
const details=[
['Number Workshop','Break apart numbers and make friendly totals.','Why does moving beads leave the total unchanged?',['Make ten','Add by making ten','Make a whole with tenths'],['Borrow beads from the second group to fill the first ten-frame. Add what is left. The total stays the same.','Make ten with the ones, then add the tens you already have. Moving beads does not change the total.','Each bead is 0.1. Ten tenths make 1 whole. Make a whole first, then add what is left.']],
['Multiplication Lab','Build equal rows. See how multiplication and division connect.','Why does splitting an array leave the total unchanged?',['Equal rows','Split a multiplication','Check with division'],['Number of rows × objects in each row = total objects.','Split one array into two smaller arrays. Add their products to find the same total.','Total ÷ objects per group = number of groups. Multiply to check.']],
['Fraction Lab','Use equal parts to explore the same size whole.','Why must the wholes be the same size when comparing shaded amounts?',['Name a fraction','Equivalent fractions','Add like fractions'],['The denominator counts all the equal parts. The numerator counts the shaded parts.','Split each part in half. The shaded amount stays the same, while both numbers in the fraction double.','The parts are the same size. Add the number of parts. Keep the denominator the same.']],
['Block Builder','Predict a view, then turn the blocks to check.','Does turning the model change the number of cubes? Which cubes are hidden?',['Look from another side','Count hidden cubes','Volume and layers'],['From above, each tower covers one square. A taller tower still covers just one square.','Count the cubes in each tower or layer, then add. Do not count only the faces you can see.','A solid rectangular prism has length × width cubes in each layer. Multiply by the number of layers to find its volume.']],
['Story Solver','Draw the quantities. Discover how they fit together.','Are you finding a total, a difference, or an equal group? How do you know?',['How many more?','Equal groups','Solve in two steps'],['Line up the bars at the same starting point. The extra length shows the difference.','Each box holds the same amount. Multiply the number of boxes by the amount in each box.','Break the problem into steps. Find the total first, then subtract the amount used.']],
['Math Detectives','Find patterns, work backward, and explain your evidence.','How can you check your answer in a different way?',['Find the change','List in order','Work backward'],['Compare neighboring numbers. Check that the same change works each time.','Try possibilities in order. Record them so you do not miss or repeat any.','Start at the result. Undo the last step first: subtract to undo addition, and divide to undo multiplication.']]
];
export const englishTopics=topics.map((t,i)=>({...t,title:details[i][0],intro:details[i][1],reflect:details[i][2],lessons:t.lessons.map((l,j)=>[details[i][3][j],l[1],details[i][4][j]])}));
const f=x=>Number(x.toFixed(3));
export function question(id,level,seed,index=0,challenge=false){
const q=baseQuestion(id,level,seed,index,challenge),p=parameters(id,level,seed);let hint='',why='',unit='';
if(challenge){
const map={
number:['Find the original total. How much more does 9 need?','8 + 7 = 15. One addend goes up by 1, so the other goes down by 1: 9 + 6 = 15.',''],
array:['Try 1 row, then 2 rows, and so on. Stop counting pairs you have already used.','The pairs are 1 × 24, 2 × 12, 3 × 8, and 4 × 6. There are 4 rectangles.','ways'],
fraction:['How many smaller pieces does each third become?','Each third becomes 4 twelfths. Two thirds become 2 × 4 = 8 twelfths.','parts'],
space:['Find the original total, then take away one cube.','2 × 2 × 2 = 8. Take away 1 to leave 7 cubes.','cubes'],
story:['When one card changes hands, what happens to both children’s amounts?','Ann loses 2 and Ben gains 2. The gap shrinks by 4: 6 − 4 = 2.','cards'],
logic:['Keep one shirt fixed. Count all the pants-and-hat choices for that shirt.','Each shirt has 2 × 2 = 4 combinations. Three shirts give 3 × 4 = 12 outfits.','outfits']};
[hint,why,unit]=map[id];
}else if(id==='number'){
let x=f((p.a+p.tens)*p.unit),y=f(p.b*p.unit),total=f(x+y);
if(index===1){hint='Subtract the known part from the total.';why=total+' − '+x+' = '+y+'. Check by adding the two parts.';}
else if(index===2){hint='The part left and the part used must add up to the original length.';why=total+' − '+y+' = '+x+'. Check with addition.';unit='meters';}
else{hint='How much does the first number need to reach the next ten or whole?';why='Move '+f((10-p.a)*p.unit)+' from the second group. Then '+f((p.tens+10)*p.unit)+' + '+f((p.a+p.b-10)*p.unit)+' = '+total+'. The total stays the same.';}
}else if(id==='array'){
const total=p.rows*p.cols;
if(index===1){hint='Number of groups × how many in each group = total.';why=total+' ÷ '+p.rows+' = '+p.cols+'. Check: '+p.rows+' × '+p.cols+' = '+total+'.';unit='objects';}
else if(index===2){hint='Split the number of columns into two parts.';why=p.cols+' columns split into 2 and '+(p.cols-2)+'. Both parts still have '+p.rows+' rows.';}
else{hint='Add the equal rows, or multiply.';why=p.rows+' × '+p.cols+' = '+total+'. Each row has the same number.';unit='objects';}
}else if(id==='fraction'){
if(level===0){hint='Count all the equal parts for the denominator. Count the shaded parts for the numerator.';why='There are '+p.d+' equal parts and '+p.a+' are shaded: '+p.a+'/'+p.d+'.';}
else if(level===1){hint='The denominator doubles. What must happen to the numerator?';why='Each part is split in half: '+p.a+' × 2 = '+p.a*2+'. So '+p.a+'/'+p.d+' = '+p.a*2+'/'+p.d*2+'.';}
else{hint='The parts are the same size. Add the numerators and keep the denominator.';why=p.a+' + '+p.b+' = '+(p.a+p.b)+' parts of size 1/'+p.d+'. The sum is '+(p.a+p.b)+'/'+p.d+'.';}
}else if(id==='space'){
if(level===0){hint='From above, count the ground squares. Ignore how tall each tower is.';why=p.w+' × '+p.d+' = '+p.w*p.d+' squares. Each tower covers one square.';unit='squares';}
else if(level===1){hint='A tower’s height tells you how many cubes it contains.';why=p.heights.slice(0,p.w*p.d).join(' + ')+' = '+cubes(p,level).length+' cubes.';unit='cubes';}
else{hint='Find the cubes in one layer. Then multiply by the number of layers.';why=p.w+' × '+p.d+' = '+p.w*p.d+' cubes per layer. With '+p.h+' layers, the volume is '+cubes(p,level).length+' cubic units.';unit='cubic units';}
}else if(id==='story'){
if(level===0){hint='The question asks how many more, not how many altogether.';why='Subtract the smaller amount from the larger: '+p.a+' − '+p.b+' = '+(p.a-p.b)+'.';unit='cards';}
else if(level===1){hint='Add the same amount for each box, or multiply.';why=p.a+' × '+p.b+' = '+p.a*p.b+' pencils.';unit='pencils';}
else{hint='First find how many pencils there were. Then subtract the pencils given away.';why=p.a+' × '+p.b+' = '+p.a*p.b+'. Then '+p.a*p.b+' − '+p.c+' = '+(p.a*p.b-p.c)+'.';unit='pencils';}
}else{
if(level===0){hint='What is the difference between neighboring numbers?';why='Add '+p.step+' each time. The next number is '+q.answer+'.';}
else if(level===1){hint='Try 1 row, 2 rows, then 3. Skip row sizes with leftovers. Count rotated pairs only once.';const pairs=[];for(let i=1;i*i<=p.target;i++)if(p.target%i===0)pairs.push(i+' × '+p.target/i);why=pairs.join(', ')+'. There are '+pairs.length+' rectangles.';unit='ways';}
else{hint='Undo the last addition first. Then undo the multiplication.';const m=q.en.match(/multiplied by (\d+), then (\d+) is added. The result is (\d+)/);why='('+m[3]+' − '+m[2]+') ÷ '+m[1]+' = '+q.answer+'. Check by doing the original steps.';}
}
return {...q,enHint:hint,enWhy:why,enUnit:unit};
}
