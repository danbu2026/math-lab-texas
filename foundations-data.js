import {LEVEL3} from './foundations-level3-data.js';
import {LEVEL4} from './foundations-level4-data.js';
import {LEVEL5} from './foundations-level5-data.js';

export const PHASES=[
  {id:'check',label:'Quick Check',verb:'Show what you notice'},
  {id:'build',label:'Build It',verb:'Use a model'},
  {id:'apply',label:'Use It',verb:'Solve a real problem'},
  {id:'explain',label:'Explain It',verb:'Tell why it works'},
  {id:'fresh',label:'Fresh Challenge',verb:'Try new numbers'}
];
const q=(prompt,answer,wrong1,wrong2,model,reason,visual=null)=>({prompt,answer:String(answer),choices:[String(answer),String(wrong1),String(wrong2)],model,reason,visual,wrongReasons:[`The answer is ${wrong1} because I used only one part of the information.`,`The answer is ${wrong2} because I did not check it against the model.`]});
const CASE_STANDARDS={
'l1-count':[['1.2A'],['1.5A'],['1.5B'],['1.5A'],['1.5A']],
'l1-build':[['1.2B'],['1.2C'],['1.3A'],['1.2B','1.2C'],['1.2B']],
'l1-compare':[['1.2E'],['1.2G'],['1.2F'],['1.5C'],['1.2D']],
'l1-addsub':[['1.3C'],['1.3D'],['1.3E'],['1.5G'],['1.3D']],
'l1-stories':[['1.3B','1.5D'],['1.5E'],['1.5F'],['1.3B'],['1.3F']],
'l1-coins':[['1.4A'],['1.4B'],['1.4C'],['1.4A','1.4C'],['1.4B']],
'l1-shapes':[['1.6A','1.6C'],['1.6B'],['1.6D'],['1.6E'],['1.6E']],
'l1-compose':[['1.6F'],['1.6F'],['1.6G'],['1.6G'],['1.6H']],
'l1-measure':[['1.7A','1.7D'],['1.7C'],['1.7B','1.7D'],['1.7E'],['1.7E']],
'l1-data':[['1.8C'],['1.8C'],['1.8C'],['1.8C'],['1.8A','1.8B']],
'l1-finance':[['1.9A'],['1.9B'],['1.9C'],['1.9D'],['1.9B','1.9C']],
'l2-place':[['2.2A'],['2.2B'],['2.2B'],['2.2A'],['2.2A']],
'l2-compare':[['2.2D'],['2.2C'],['2.2E'],['2.7B'],['2.2F']],
'l2-fractions':[['2.3A'],['2.3A'],['2.3C'],['2.3C'],['2.3B','2.3D']],
'l2-facts':[['2.4A'],['2.4A'],['2.4B'],['2.4B'],['2.4B']],
'l2-stories':[['2.4C'],['2.4C'],['2.4D'],['2.7C'],['2.4C']],
'l2-coins':[['2.5A'],['2.5A'],['2.5B'],['2.5A','2.5B'],['2.5A']],
'l2-groups':[['2.6A'],['2.6B'],['2.6A'],['2.7A'],['2.7A']],
'l2-shapes':[['2.8A'],['2.8C'],['2.8B'],['2.8D'],['2.8E']],
'l2-length':[['2.9E'],['2.9A','2.9D'],['2.9B'],['2.9F'],['2.9C']],
'l2-time':[['2.9G'],['2.9G'],['2.9G'],['2.9G'],['2.9G']],
'l2-data':[['2.10A','2.10B'],['2.10C'],['2.10C'],['2.10D'],['2.10C']],
'l2-money1':[['2.11A'],['2.11B'],['2.11C'],['2.11C'],['2.11C']],
'l2-money2':[['2.11D'],['2.11E'],['2.11F'],['2.11F'],['2.11D','2.11E']]
};
const unit=(id,title,icon,color,standards,goal,wrongModels,wrongReasons,cases)=>({id,title,icon,color,standards,goal,wrongModels,wrongReasons,cases:cases.map((item,index)=>({...item,standards:CASE_STANDARDS[id][index]}))});
const CORE_LEVELS=[
{id:'level1',number:1,title:'Number Explorer',subtitle:'See quantities, build meaning, and explain simple choices.',units:[
unit('l1-count','Quick Looks & Counting','●','#f9b83f',['1.2A','1.5A','1.5B'],'Count with meaning to 120.','Count only the biggest group|Guess from the space'.split('|'),'Counting must match one object to one number.|The last count word tells how many altogether.'.split('|'),[
q('Quick look: how many dots are on the structured card?',7,6,8,'See five dots together, then two more.','A group of five and a group of two make 7 without counting every dot.',{type:'dots',groups:[5,2]}),
q('Count backward: 46, 45, __.',44,47,36,'Move one step backward on a number path.','Counting backward one from 45 gives 44.'),
q('Object sets show 6 pairs, 4 groups of 5, and 3 groups of 10. Which totals come from skip-counting?', '12, 20, 30','6, 20, 3','12, 9, 13','Skip-count the three sets by twos, fives, and tens.','Six groups of 2 make 12; four groups of 5 make 20; three groups of 10 make 30.',{type:'groupSets',sets:[[2,2,2,2,2,2],[5,5,5,5],[10,10,10]]}),
q('Count forward: 88, 89, __.',90,99,80,'Use the next-number pattern across a new ten.','After 89, the ones reset and the next ten begins at 90.'),
q('Start at 54 and count forward three numbers. Which sequence is correct?','55, 56, 57','54, 55, 56','53, 52, 51','Say the next number three times without restarting at one.','After 54 come 55, 56, and 57.')
]),
unit('l1-build','Build Numbers to 120','▦','#f28a5b',['1.2B','1.2C','1.3A'],'Build numbers with tens and ones, then combine a multiple of ten and a one-digit number.','Use one long row for every digit|Switch the tens and ones'.split('|'),'A ten is one group containing 10 ones.|Place value tells what each digit is worth.'.split('|'),[
q('4 tens and 6 ones make what number?',46,64,40,'Build four ten-rods and six single cubes.','Four tens are 40; 40 + 6 = 46.',{type:'place',hundreds:0,tens:4,ones:6}),
q('Which expanded form names 73?','70 + 3','7 + 3','30 + 7','Separate the tens from the ones.','The 7 is worth 70 and the 3 is worth 3.',{type:'place',hundreds:0,tens:7,ones:3}),
q('What is 50 + 8?',58,85,508,'Join five tens with eight ones.','No regrouping is needed: 5 tens and 8 ones make 58.',{type:'place',hundreds:0,tens:5,ones:8}),
q('Which number has 9 tens and 2 ones?',92,29,90,'Place nine tens left of two ones.','Nine tens are 90; two more ones make 92.',{type:'place',hundreds:0,tens:9,ones:2}),
q('A model has 11 tens and 4 ones. What number is it?',114,14,104,'Trade ten tens for one hundred if helpful.','Eleven tens are 110; 110 + 4 = 114.',{type:'place',hundreds:1,tens:1,ones:4,note:'11 tens + 4 ones = 1 hundred + 1 ten + 4 ones'})
]),
unit('l1-compare','Compare & Order to 120','↔','#9fc95a',['1.2D','1.2E','1.2F','1.2G','1.5C'],'Compare, order, and find 10 more or 10 less.','Compare the ones digit first every time|Choose the longer numeral'.split('|'),'Compare hundreds, then tens, then ones.|Ten more or less changes the tens while the ones stay.'.split('|'),[
q('Which number is greater: 67 or 76?',76,67,'They are equal','Build both numbers with tens and ones.','76 has 7 tens, more than the 6 tens in 67.'),
q('What symbol makes 48 __ 52 true?','<','>','=','Place both numbers on a number line.','48 comes before 52, so 48 is less than 52.',{type:'numberLine',min:40,max:60,points:[48,52]}),
q('Put 39, 93, and 59 in order from least to greatest.','39, 59, 93','93, 59, 39','39, 93, 59','Place all three values on an open number line, then read left to right.','3 tens < 5 tens < 9 tens.',{type:'numberLine',min:30,max:100,points:[39,59,93]}),
q('What are 10 less and 10 more than 104?','94 and 114','103 and 105','84 and 124','Remove one ten, then add one ten, while keeping four ones.','104 - 10 = 94 and 104 + 10 = 114.'),
q('Generate a whole number greater than 87 but less than 97. Which works?',92,82,102,'Choose a value strictly between the two bounds.','92 is greater than 87 and less than 97.',{type:'numberLine',min:87,max:97,points:[87,92,97]})
]),
unit('l1-addsub','Addition & Subtraction Within 20','＋','#ff7664',['1.3C','1.3D','1.3E','1.5G'],'Use objects, pictures, and properties to add and subtract within 20.','Count both sets from one every time|Change the numbers to easier ones'.split('|'),'A model must keep the same total as the story.|Properties rearrange addends without changing the sum.'.split('|'),[
q('8 + 5 = ?',13,12,14,'Make a ten: move 2 from 5 to join 8.','8 + 2 = 10, then 3 more makes 13.'),
q('14 - 6 = ?',8,9,7,'Take away 4 to reach 10, then 2 more.','14 - 4 - 2 = 8.'),
q('Which has the same sum as 6 + 9?','9 + 6','9 - 6','6 + 6','Swap the order of the two addends.','The commutative property says 6 + 9 = 9 + 6.'),
q('What is 4 + 7 + 6?',17,13,18,'Join 4 and 6 first to make 10.','Regrouping gives (4 + 6) + 7 = 17.'),
q('There are 18 birds. 9 fly away. How many remain?',9,8,10,'Start with 18 counters and remove 9.','18 - 9 = 9.')
]),
unit('l1-stories','Stories, Equality & Unknowns','?','#c99be8',['1.3B','1.3F','1.5D','1.5E','1.5F'],'Represent stories, understand equality, and solve for an unknown.','Use the operation named by a keyword|Treat the equal sign as “the answer comes next”'.split('|'),'Choose an operation from what happens in the story.|The equal sign means both sides have the same value.'.split('|'),[
q('Mia has 6 shells and finds 5 more. Which equation fits?','6 + 5 = 11','6 - 5 = 1','11 + 5 = 16','Show the first set, then join the new set.','Finding more joins two quantities, so addition fits.'),
q('Which equation is true?','7 + 3 = 6 + 4','7 + 3 = 6 + 3','7 + 3 = 10 + 4','Build both sides separately.','Both 7 + 3 and 6 + 4 equal 10.'),
q('9 + __ = 14. What is missing?',5,4,6,'Count on from 9 until 14.','Five more are needed because 9 + 5 = 14.'),
q('There were some frogs. 4 hopped away and 7 remain. How many started?',11,3,10,'Work backward: join the frogs that left and remained.','4 + 7 = 11, so 11 frogs started.'),
q('Create a story for 13 - 8 = 5. Which story works?','Leo had 13 cards, gave away 8, and had 5 left.','Leo had 13 cards and got 8 more, making 5.','Leo put 13 cards into 8 equal groups.','Use a separating action and all three numbers from the sentence.','The story starts with 13, removes 8, and leaves 5.')
]),
unit('l1-coins','Coins & Skip Counting','¢','#ffd65a',['1.4A','1.4B','1.4C'],'Name coins, count their values, and use pennies, nickels, and dimes.','Count every coin as one cent|Use coin size to decide value'.split('|'),'Each coin has a fixed value.|Count equal-value coins by 1s, 5s, or 10s.'.split('|'),[
q('Which coin is worth 25 cents?','quarter','nickel','dime','Compare the coin names and fixed values.','A quarter is worth 25 cents.'),
q('Three dimes are worth how much?','30¢','3¢','13¢','Count by tens: 10, 20, 30.','Each dime is 10 cents, so 3 dimes are 30 cents.'),
q('Two nickels and 3 pennies equal how much?','13¢','10¢','8¢','Count nickels by fives, then pennies by ones.','5 + 5 + 1 + 1 + 1 = 13 cents.'),
q('Which relationship is true?','1 dime = 2 nickels','1 nickel = 2 dimes','1 quarter = 2 pennies','Compare both sides using each coin’s fixed value.','One dime is 10 cents and two nickels are 5 + 5 = 10 cents.'),
q('You have 4 dimes. Which count shows the value?','10, 20, 30, 40','4, 8, 12, 16','5, 10, 15, 20','Use skip counting that matches the coin value.','Dimes are counted by tens.')
]),
unit('l1-shapes','2D Shapes & 3D Solids','◇','#58c6c2',['1.6A','1.6B','1.6C','1.6D','1.6E'],'Classify shapes and solids by defining attributes.','Name a shape only by its color|Count every visible line as an edge'.split('|'),'Defining attributes stay true even when a shape turns.|Faces are flat surfaces; edges meet faces; vertices are corner points.'.split('|'),[
q('Sort the regular hexagon, irregular pentagon, square, and circle. Which group has only shapes with all straight sides equal?','Regular hexagon and square','Irregular pentagon and circle','Square and circle','Compare the side lengths and boundaries of every shape.','The regular hexagon and square have all straight sides equal; the irregular pentagon does not and the circle has no straight sides.',{type:'shapes',items:['regular hexagon','irregular pentagon','square','circle']}),
q('A blue square is turned like a diamond. Which attributes still define it?','4 equal sides and 4 right angles','Blue color and tilted position','One curved side','Separate defining attributes from color and orientation.','Turning or recoloring does not change the four equal sides and four right angles.',{type:'shapes',items:['rotated square','triangle','circle']}),
q('Use the shape pieces to create and identify the required figures. Which list contains every required 2D figure?','circle, triangle, rectangle, square, rhombus, hexagon','circle, triangle, cube, sphere','square, cone, cylinder, hexagon','Separate two-dimensional figures from solids and include squares as special rectangles.','The complete 2D set is circle, triangle, rectangle, square, rhombus, and hexagon.',{type:'shapes',items:['circle','triangle','rectangle','square','rhombus','hexagon']}),
q('Sort the solids by flat and curved surfaces. Which set contains all the named solids?','sphere, cone, cylinder, rectangular prism, cube, triangular prism','circle, triangle, rectangle','sphere, circle, hexagon','Use faces, edges, vertices, and curved surfaces to identify each solid.','The solid set includes sphere, cone, cylinder, rectangular prism, cube, and triangular prism.',{type:'solids',items:['sphere','cone','cylinder','rectangular prism','cube','triangular prism']}),
q('Which solid has 8 vertices, 12 edges, and 6 rectangular faces?','Rectangular prism','Cone','Sphere','Check faces, edges, and vertices together.','A rectangular prism has 8 vertices, 12 edges, and 6 rectangular faces.',{type:'solids',items:['rectangular prism','cone','sphere']})
]),
unit('l1-compose','Compose Shapes & Fair Shares','◫','#7db7f0',['1.6F','1.6G','1.6H'],'Build larger shapes and divide shapes into equal shares.','Any pieces can make any target|Equal shares only need similar-looking colors'.split('|'),'Pieces must meet without gaps or overlaps.|Equal shares have the same amount, even if their positions differ.'.split('|'),[
q('Two equal squares placed side by side make what shape?','A rectangle','A triangle','A circle','Slide the squares together edge to edge.','The outside boundary has four right angles and opposite equal sides.'),
q('Which pair can make a larger triangle?','Two matching right triangles','Two circles','A cube and a cone','Turn and join matching straight edges.','Two matching right triangles can share an edge to make a larger triangle.'),
q('A rectangle is split into 2 equal parts. Each part is called what?','A half','A third','A fourth','Check how many equal shares form the whole.','Two equal shares are halves.'),
q('A circle is split into 4 equal parts. Each part is what?','A fourth','A half','A third','Count the equal shares.','Four equal shares are fourths or quarters.'),
q('Which statement is true about two equal halves?','They make one whole','One half is always bigger','They must be the same shape','Compare the amount, not just the outline.','Two equal halves combine to make one whole.')
]),
unit('l1-measure','Length & Time','⌁','#62b88f',['1.7A','1.7B','1.7C','1.7D','1.7E'],'Measure length with equal units and tell time to the hour and half hour.','Leave gaps between measuring units|Begin counting at one after the first unit'.split('|'),'Measurement units must touch end to end with no gaps or overlaps.|Elapsed length is the number of equal units covering the object.'.split('|'),[
q('A pencil spans 7 equal cubes with no gaps. Describe its length with a number and unit.','7 cubes','7','6 cubes','Count the cubes that cover the pencil end to end.','The pencil is 7 cubes long: the answer includes both the number and the unit.'),
q('The same pencil measures 8 small cubes or 4 large cubes. Why are the numbers different?','Smaller units take more copies to cover the same length','The pencil changed length','Large cubes are not units','Cover the same object with both equal-size unit sets.','A smaller unit needs more copies to span the same length.'),
q('A ribbon is covered end to end by 9 equal cubes with no gaps. Describe its length.','9 cubes','9','8 cubes','Count the same-size units and include the unit name.','The ribbon is 9 cubes long: a number and a unit describe the length.'),
q('The minute hand points to 12 and the hour hand points to 4. What time is it?','4:00','12:04','4:30','Read the hour hand when the minute hand is at 12.','The clock shows exactly four o’clock.'),
q('The minute hand points to 6 and the hour hand is between 2 and 3. What time is it?','2:30','6:02','3:30','Halfway around the clock means 30 minutes.','The hour began at 2 and 30 minutes have passed.')
]),
unit('l1-data','Data & Graphs','▥','#ef8fc6',['1.8A','1.8B','1.8C'],'Collect, organize, read, and discuss data with up to three categories.','Choose the tallest picture without reading labels|Add categories when the question asks for a difference'.split('|'),'A graph represents counted data by category.|Comparison questions use the values shown, often by subtraction.'.split('|'),[
q('A class records cats 6, dogs 4, fish 2. Which is most common?','Cats','Dogs','Fish','Compare the count in each category.','Six is the greatest count.'),
q('Using cats 6 and dogs 4, how many more chose cats?',2,10,3,'Compare by finding the difference.','6 - 4 = 2 more.'),
q('Cats 6, dogs 4, fish 2. How many students were surveyed?',12,10,6,'Combine all category counts.','6 + 4 + 2 = 12.'),
q('Which is a good question for a picture graph of favorite fruit?','How many chose apples?','Why are apples healthy?','What fruit will grow next year?','Ask something the displayed counts can answer.','The graph can answer how many are in each category.'),
q('You collect and sort counters: red 5, blue 3, green 4. Which graph correctly displays the organized data?','Bars with heights 5, 3, and 4','Three equal bars','One bar with height 12','Transfer each category count to its own bar.','A graph created from the collection must preserve each category count: 5, 3, and 4.',{type:'graph',labels:['red','blue','green'],values:[5,3,4]})
]),
unit('l1-finance','Earn, Choose, Save & Give','★','#f0a65c',['1.9A','1.9B','1.9C','1.9D'],'Understand earning, spending, saving, giving, and choices when money is limited.','Choose everything you want|Saving means hiding money forever'.split('|'),'Money is earned by providing work or value.|A plan helps divide limited money among spending, saving, and giving.'.split('|'),[
q('Which is an example of earning income?','Getting paid for watering a neighbor’s plants','Buying a toy','Putting a gift in a box','Look for work that produces payment.','Income is money received for work or value.'),
q('You have $8 but two choices cost $8 each. What must you do?','Choose one now or save for later','Buy both without more money','Change both prices','Compare what you have with the total cost.','Limited money requires a choice.'),
q('Why might someone save part of their money?','To reach a future goal','To make the money disappear','Because spending is never allowed','Connect today’s choice to a later need or want.','Saving keeps money available for a future goal.'),
q('Which plan shows spending, saving, and giving from $10?','$5 spend, $3 save, $2 give','$10 spend, $10 save, $10 give','$12 spend, $0 save, $0 give','Check that all parts total the available amount.','5 + 3 + 2 = 10, so the plan fits the limit.'),
q('A child wants a $12 book and has $7. What is a sensible choice?','Save $5 more before buying','Pretend $7 equals $12','Spend the $7 on something else and still buy it','Find the difference between goal and current savings.','12 - 7 = 5 more dollars needed.')
])
]},
{id:'level2',number:2,title:'Strategy Builder',subtitle:'Connect place value, operations, geometry, data, time, and money.',units:[
unit('l2-place','Place Value to 1,200','▦','#f9b83f',['2.2A','2.2B'],'Compose, decompose, read, and write numbers to 1,200.','Read digits as separate numbers|Ignore a zero place'.split('|'),'Each digit’s value depends on its place.|A number can be decomposed in equivalent ways.'.split('|'),[
q('7 hundreds, 3 tens, and 4 ones make?',734,743,704,'Build hundreds, tens, then ones.','700 + 30 + 4 = 734.',{type:'place',hundreds:7,tens:3,ones:4}),
q('Which expanded form is 1,062?','1,000 + 60 + 2','100 + 60 + 2','1,000 + 600 + 2','Name the value of each nonzero digit.','The 1 is one thousand, the 6 is sixty, and the 2 is two.',{type:'place',thousands:1,hundreds:0,tens:6,ones:2}),
q('Which standard numeral is “nine hundred eighteen”?',918,980,819,'Listen for hundreds, tens, and ones.','Nine hundred + eighteen is 918.',{type:'place',hundreds:9,tens:1,ones:8}),
q('Which is another way to build 450?','4 hundreds and 5 tens','45 hundreds','4 hundreds and 5 ones','Check the value of every group.','400 + 50 = 450.',{type:'place',hundreds:4,tens:5,ones:0}),
q('12 hundreds equal what number?',1200,120,1020,'Each hundred is 100.','12 × 100 = 1,200.',{type:'place',thousands:1,hundreds:2,tens:0,ones:0,note:'12 hundreds = 1 thousand + 2 hundreds'})
]),
unit('l2-compare','Compare, Order & Place Changes','↔','#f28a5b',['2.2C','2.2D','2.2E','2.2F','2.7B'],'Compare and locate numbers, then reason about 10 or 100 more or less.','Compare the last digit first|Treat distance between tick marks as decoration'.split('|'),'Compare the greatest place first.|Equal intervals on a number line represent equal amounts.'.split('|'),[
q('Which is greater: 907 or 879?',907,879,'They are equal','Compare hundreds before tens and ones.','9 hundreds is greater than 8 hundreds.'),
q('Generate a number greater than 645 but less than 654. Which works?',650,640,660,'Place candidate numbers between both endpoints.','650 is greater than 645 and less than 654.'),
q('Locate the given whole number 720 on an open number line from 700 to 800. Where should it go?','20 units to the right of 700','Halfway between 700 and 800','20 units to the left of 800','Measure the distance from the labeled starting location.','720 is 20 units greater than 700, so place it 20 units to the right of 700.',{type:'numberLine',min:700,max:800,points:[720]}),
q('What is 100 less than 1,043?',943,1033,1143,'Remove one hundred and keep 43.','1,043 - 100 = 943.'),
q('A marked point is halfway between 650 and 750 on a number line. Name the whole number at the point.',700,675,800,'Use equal distance from both endpoints to name the marked point.','700 is 50 away from both 650 and 750.',{type:'numberLine',min:650,max:750,points:[700]})
]),
unit('l2-fractions','Halves, Fourths & Eighths','◔','#9fc95a',['2.3A','2.3B','2.3C','2.3D'],'Partition wholes, count equal parts, and understand parts beyond one whole.','Count lines instead of equal regions|Use the denominator as the number shaded'.split('|'),'The denominator names how many equal parts make one whole.|Fraction parts can be joined to make one or more wholes.'.split('|'),[
q('A rectangle is split into 4 equal parts. One part is?', 'one fourth','one half','one eighth','Count how many equal parts form the whole.','One of four equal parts is one fourth.'),
q('Three of eight equal parts are shaded. What fraction is shaded?','3/8','8/3','3/4','Count shaded parts, then total equal parts.','Three shaded eighths are 3/8.'),
q('How many fourths make one whole?',4,2,8,'Rebuild the whole using fourth-size pieces.','Four one-fourth parts make one whole.'),
q('Six fourth-size pieces equal?','1 whole and 2 fourths','6 wholes','1 half','Group four fourths into one whole first.','4/4 is one whole, with 2/4 left.'),
q('The same-size whole is split into halves and eighths. Which pieces are larger?','Halves','Eighths','They are always the same size','Compare how many equal parts must rebuild the same whole.','Fewer equal parts make larger pieces, so halves are larger than eighths.')
]),
unit('l2-facts','Fact Fluency & Multi-Digit Strategies','＋','#ff7664',['2.4A','2.4B'],'Recall facts within 20 and add or subtract within 1,000 using place-value strategies.','Line up numbers by their right edge without place labels|Regroup without showing equivalent value'.split('|'),'Operate on matching place values.|Regrouping trades equivalent amounts, such as 10 ones for 1 ten.'.split('|'),[
q('Quick recall without counting: what is 9 + 8?',17,16,18,'Recall the fact; use make-a-ten only if you need to check.','9 + 8 = 17.'),
q('Quick recall without counting: what is 15 - 7?',8,9,7,'Recall the related addition fact 7 + 8 = 15 if you need to check.','15 - 7 = 8.'),
q('Add four two-digit numbers: 24 + 16 + 35 + 25.',100,90,110,'Pair numbers that make friendly totals.','24 + 16 = 40 and 35 + 25 = 60; 40 + 60 = 100.'),
q('What is 84 - 37?',47,57,43,'Subtract tens and ones with one regrouping.','84 - 30 - 7 = 47.'),
q('Subtract two two-digit numbers: 93 - 47.',46,56,44,'Regroup one ten, then subtract matching place values.','93 - 47 = 46.')
]),
unit('l2-stories','Multi-Step Stories & Unknowns','?','#c99be8',['2.4C','2.4D','2.7C'],'Solve one- and multi-step problems and create stories for equations.','Pick operations from isolated keywords|Stop after the first calculation'.split('|'),'Represent what changes in each part of the situation.|An equation and its story must use the same quantities and relationships.'.split('|'),[
q('A shelf has 28 books. 9 leave and 6 arrive. How many now?',25,13,31,'Show 28 - 9, then add 6.','28 - 9 + 6 = 25.'),
q('Sam has 17 marbles. Kim has 8 fewer. How many does Kim have?',9,25,8,'Compare Kim’s amount with Sam’s.','17 - 8 = 9.'),
q('Create a joining story for 24 + 18 = 42. Which story works?','There are 24 red beads and 18 blue beads, 42 altogether.','There are 42 beads and 18 are removed.','There are 24 bags with 18 beads each.','Build a story that joins two parts and uses all three values.','The story generates the given number sentence by joining 24 and 18 to make 42.'),
q('36 + __ = 61. What is missing?',25,97,35,'Find the distance from 36 to 61.','61 - 36 = 25.'),
q('A team needs 70 points. It has 26, then earns 19. How many more are needed?',25,45,44,'First find the new total, then compare it with the goal.','26 + 19 = 45; 70 - 45 = 25.')
]),
unit('l2-coins','Coins to One Dollar','$','#ffd65a',['2.5A','2.5B'],'Count mixed coins and write amounts with ¢, $, and a decimal point.','Count coins instead of their values|Write cents after the dollar sign without a decimal'.split('|'),'Count each coin by its value and combine amounts.|Dollar notation uses two digits for cents.'.split('|'),[
q('A quarter, dime, and nickel are worth?', '40¢','3¢','45¢','Add 25, 10, and 5 cents.','25 + 10 + 5 = 40 cents.'),
q('Two quarters and three dimes are worth?', '80¢','50¢','35¢','Count quarters first, then dimes.','50 cents + 30 cents = 80 cents.'),
q('How do you write 75 cents with a dollar sign?','$0.75','$75','$0.075','Place cents in the two places after the decimal.','$0.75 means zero whole dollars and 75 cents.'),
q('Which set equals exactly $1.00?','4 quarters','3 quarters','5 dimes','Build 100 cents.','4 × 25 cents = 100 cents = $1.00.'),
q('You have $1.00 and spend 35¢. How much remains?','65¢','75¢','35¢','Rename one dollar as 100 cents.','100 - 35 = 65 cents.')
]),
unit('l2-groups','Equal Groups, Even & Odd','×','#58c6c2',['2.6A','2.6B','2.7A'],'Model and create multiplication and division situations, then connect equal pairs to even and odd numbers.','Treat equal groups as unequal piles|Call every number with a 2 an even number'.split('|'),'Multiplication combines equal groups; division separates into equal groups.|Even numbers can be split into pairs with none left over.'.split('|'),[
q('There are 4 bags with 3 apples in each. How many apples?',12,7,16,'Draw four equal groups of three.','4 × 3 = 12.'),
q('Create an equal-sharing situation for 15 ÷ 3. Which story works?','15 crackers are shared equally among 3 children, so each gets 5.','15 crackers are added to 3 more crackers.','3 children each receive 15 crackers.','Separate one set of 15 into three equivalent sets.','Sharing 15 equally into 3 sets creates 5 in each set.'),
q('Create an equal-groups situation for 5 × 2. Which story works?','Five pairs of socks have 10 socks.','Five socks plus two socks make 8.','Ten socks are shared by five and two children.','Build five equivalent sets with two objects in each.','Five equal groups of 2 model 5 × 2 = 10.'),
q('Is 18 even or odd?','Even','Odd','Neither','Pair all 18 objects.','18 makes 9 pairs with none left over.'),
q('Which number is odd?',17,24,30,'Try to make equal pairs.','17 leaves one unpaired, so it is odd.')
]),
unit('l2-shapes','Build & Classify Shapes','◇','#7db7f0',['2.8A','2.8B','2.8C','2.8D','2.8E'],'Classify, compose, and decompose 2D shapes and 3D solids.','Classify only by color or direction|Assume every four-sided shape is a square'.split('|'),'Shapes belong to classes because of defining attributes.|Composing joins parts; decomposing reveals smaller component shapes.'.split('|'),[
q('Create a shape with 4 equal sides and 4 right angles. Which shape fits?','Square','Any rectangle','Triangle','Use the requested number of sides, vertices, and right angles.','A square has four equal sides, four vertices, and four right angles.'),
q('Sort polygons by sides and vertices. Which polygon has 5 sides and 5 vertices?','Pentagon','Hexagon','Quadrilateral','Count both the boundary segments and corner points.','A pentagon has five sides and five vertices.'),
q('Sort the solids. Which one has 6 flat square faces and is also a rectangular prism?','Cube','Sphere','Cone','Compare faces, edges, vertices, and curved surfaces.','A cube has six square faces and is a special rectangular prism.'),
q('Two congruent right triangles can compose what shape?','A rectangle','A circle','A sphere','Join the matching slanted sides.','The outside boundary can form four right angles.'),
q('Use one straight cut to partition a rectangle into two kept pieces, one of them a square. What are the two resulting pieces?','A square and a smaller rectangle','Two circles','A sphere and a cone','Picture both pieces after the straight cut and name each one.','The partition decomposes the original rectangle into one square and one smaller rectangle.',{type:'shapes',items:['square','smaller rectangle']})
]),
unit('l2-length','Length, Number-Line Distance & Area','⌁','#62b88f',['2.9A','2.9B','2.9C','2.9D','2.9E','2.9F'],'Choose tools, find distance from any starting number, compare length, and build area with squares.','Always measure from zero even when the start is elsewhere|Count grid lines instead of square units'.split('|'),'Distance is the difference between endpoints, wherever the line starts.|Area counts equal square units covering a surface.'.split('|'),[
q('Estimate first: a classroom desk is closest to which length?','1 yard','1 inch','20 yards','Compare the estimate with familiar classroom objects.','One yard is a reasonable desk length; one inch is too short and 20 yards is too long.'),
q('A ruler starts at 0 cm and an object ends at 18 cm. What length?',18,64,22,'Read the ending mark because the object begins at zero.','The object spans 18 one-centimeter intervals.'),
q('The same strip is 12 small units or 6 large units. Which statement is true?','Smaller units need more copies','Larger units need more copies','Unit size never changes the count','Compare unit size with the number of copies.','The measurement number grows when the chosen unit is smaller.'),
q('A rectangle is covered by 3 rows of 5 unit squares. What is its area?',15,8,16,'Count equal squares by rows and columns.','3 × 5 = 15 square units.'),
q('On a number line, a trip starts at 23 and ends at 41. What distance is represented?',18,64,22,'Find the change from the starting location, not the distance from zero.','41 - 23 = 18, so the number line represents a distance of 18 from the given start.')
]),
unit('l2-time','Time to the Minute','◷','#ef8fc6',['2.9G'],'Read and write time to the nearest minute and distinguish a.m. from p.m.','Read the hour from where the minute hand points|Use p.m. for every time after sleeping'.split('|'),'The minute hand counts minute marks; the hour hand shows the current hour.|a.m. is before noon and p.m. is after noon.'.split('|'),[
q('The minute hand points to the 17th minute mark and the hour hand is past 3. What time?', '3:17','3:35','17:03','Count minute marks from 12, then read the current hour.','The clock shows 17 minutes after 3.'),
q('Which label fits eating breakfast at 7:30?', '7:30 a.m.','7:30 p.m.','17:30 a.m.','Decide whether the event is before or after noon.','Breakfast at 7:30 in the morning is a.m.'),
q('School ends at 3:05 in the afternoon. How is it written?', '3:05 p.m.','3:50 a.m.','3:05 a.m.','Afternoon times use p.m.','3:05 after noon is 3:05 p.m.'),
q('The minute hand makes one full trip from 4:12. What time is it?', '5:12','4:13','4:72','One full clock trip is 60 minutes, or one hour.','Adding one hour changes 4:12 to 5:12.'),
q('Which time is 8 minutes after 10:54?', '11:02','10:62','11:08','Move to 11:00, then count the remaining minutes.','Six minutes reach 11:00 and two more reach 11:02.')
]),
unit('l2-data','Graphs, Questions & Predictions','▥','#f0a65c',['2.10A','2.10B','2.10C','2.10D'],'Collect data, build graphs with intervals of one or more, solve problems, and make supported predictions.','Read bar height without checking the scale|Predict whatever you hope will happen'.split('|'),'Graph values come from labels and scale intervals.|A prediction should follow a pattern supported by the data.'.split('|'),[
q('You collect votes: red 8, blue 6, green 4, yellow 2. Which bar graph should you create?','Four bars with lengths 8, 6, 4, and 2','Four equal bars of length 5','One bar of length 20','Organize each category separately and use a consistent interval.','Each bar length represents the data points in its category: 8, 6, 4, and 2.',{type:'graph',labels:['red','blue','green','yellow'],values:[8,6,4,2]}),
q('A graph shows apples 12 and pears 7. How many more apples?',5,19,6,'Find the difference between categories.','12 - 7 = 5.'),
q('Votes are red 9, blue 6, green 5. How many votes total?',20,15,14,'Add all category counts.','9 + 6 + 5 = 20.'),
q('A plant grew 2 cm, then 4 cm, then 6 cm in equal weeks. A supported next prediction is?', '8 cm','20 cm','1 cm','Continue the observed increase of 2.','The values rise by 2 each time, so 8 is supported.'),
q('Which question can this graph answer: books read by four students?','Who read the most books?','Why did one student like reading?','What book will win an award?','Choose a question based on displayed counts.','The graph compares how many books each student read.')
]),
unit('l2-money1','Save, Spend & Track Money','★','#6fb7d9',['2.11A','2.11B','2.11C'],'Understand saving, deposits, withdrawals, and keeping simple financial records.','Treat every deposit as spending|Ignore withdrawals when finding a balance'.split('|'),'A deposit increases a balance; a withdrawal decreases it.|Records help track where money came from and where it went.'.split('|'),[
q('You save $3 each week for 4 weeks. How much saved?', '$12','$7','$1','Combine four equal deposits of $3.','4 × $3 = $12.'),
q('You have $20. A game costs $20, but you are saving for a bike. Which choice shows saving as an alternative to spending?','Keep the $20 for the bike instead of buying the game','Buy the game and call it saving','Spend the $20 twice','Compare spending now with keeping money for a future goal.','Saving means choosing not to spend now so the money remains for the bike goal.'),
q('A balance is $25. A $9 withdrawal is made. New balance?', '$16','$34','$14','Withdrawals remove money.','$25 - $9 = $16.'),
q('Why keep a record of deposits and withdrawals?','To know the current balance and choices','To make prices smaller','To earn money automatically','Track each change to the starting balance.','A record explains how the balance changed.'),
q('A record starts at $10, adds $5, then subtracts $4. Balance?', '$11','$19','$1','Follow the record in time order.','$10 + $5 - $4 = $11.')
]),
unit('l2-money2','Borrow, Lend, Produce & Choose','⚖','#b99de8',['2.11D','2.11E','2.11F'],'Reason about borrowing, lending, producers, consumers, and responsible choices.','Borrowing means receiving something forever|A producer and consumer are always the same person'.split('|'),'Borrowed money or items must be returned under the agreement.|Producers make goods or services; consumers use or buy them.'.split('|'),[
q('Which is responsible borrowing?','Return it on time and in good condition','Keep it forever','Damage it and hide it','Think about the agreement made when borrowing.','Borrowing includes a duty to return the item.'),
q('Which pair shows one lending benefit and one lending cost?','Help someone now; risk late return','Keep everything; lose nothing','Pay no cost; gain two items','Consider what could go wrong after giving temporary use.','The lender may lose value if the agreement is not kept.'),
q('A baker uses $3 of flour, $2 of fruit, and $1 of packaging. What is the total cost to produce the item?','$6','$5','$7','Add every component used to make the item.','$3 + $2 + $1 = $6 total production cost.'),
q('A family buys bread to eat. The family is a?', 'Consumer','Producer','Lender','Ask who uses or buys the good.','A consumer purchases or uses goods and services.'),
q('You can buy a game now or save for a bike. What is the strongest decision step?','Compare both goals, costs, and what matters most','Always buy the cheaper item','Choose without checking your money','Use evidence about resources and goals.','A responsible choice compares costs, goals, and available money.')
])
]}];

export const LEVELS=[...CORE_LEVELS,LEVEL3,LEVEL4,LEVEL5];

export function visualFacts(visual){
 if(!visual)return null;
 if(visual.type==='place')return{type:'place',value:(visual.hundredMillions||0)*100000000+(visual.tenMillions||0)*10000000+(visual.millions||0)*1000000+(visual.hundredThousands||0)*100000+(visual.tenThousands||0)*10000+(visual.thousands||0)*1000+(visual.hundreds||0)*100+(visual.tens||0)*10+(visual.ones||0)};
 if(visual.type==='placeCompare')return{type:'placeCompare',values:[...visual.values]};
 if(visual.type==='graph')return{type:'graph',categories:visual.labels.map((label,index)=>({label,value:visual.values[index]})),...(visual.scale?{scale:visual.scale}:{})};
 if(visual.type==='dots')return{type:'dots',total:visual.groups.reduce((sum,value)=>sum+value,0)};
 if(visual.type==='groupSets')return{type:'groupSets',totals:visual.sets.map(set=>set.reduce((sum,value)=>sum+value,0))};
 if(visual.type==='numberLine')return{type:'numberLine',min:visual.min,max:visual.max,points:visual.points.map(value=>({value,percent:(value-visual.min)/(visual.max-visual.min)*100}))};
 if(visual.type==='fractionBar')return{type:'fractionBar',total:visual.total,shaded:visual.shaded,value:visual.shaded/visual.total};
 if(visual.type==='fractionLine')return{type:'fractionLine',denominator:visual.denominator,numerator:visual.numerator,value:visual.numerator/visual.denominator};
 if(visual.type==='array')return{type:'array',rows:visual.rows,cols:visual.cols,total:visual.rows*visual.cols};
 if(visual.type==='pairs')return{type:'pairs',pairs:visual.pairs.map(pair=>[...pair])};
 if(visual.type==='areaRects')return{type:'areaRects',areas:visual.rects.map(([width,height])=>width*height),total:visual.rects.reduce((sum,[width,height])=>sum+width*height,0)};
 if(visual.type==='money')return{type:'money',totalCents:visual.items.reduce((sum,[,count,cents])=>sum+count*cents,0)};
 if(visual.type==='timeIntervals')return{type:'timeIntervals',totalMinutes:visual.intervals.reduce((sum,value)=>sum+value,0)};
 if(visual.type==='scaleRead'||visual.type==='capacityRead')return{type:visual.type,value:visual.value,unit:visual.unit};
 if(visual.type==='pointGrid')return{type:'pointGrid',points:visual.points.map(point=>[...point])};
 if(visual.type==='decimalGrid')return{type:'decimalGrid',hundredths:visual.hundredths,value:visual.hundredths/100};
 if(visual.type==='decimalArea')return{type:'decimalArea',width:visual.width,height:visual.height,product:visual.width*visual.height};
 if(visual.type==='decimalShare')return{type:'decimalShare',tenths:visual.tenths,groups:visual.groups,each:visual.tenths/visual.groups};
 if(visual.type==='fractionOperation')return{type:'fractionOperation',denominator:visual.denominator,left:visual.left,right:visual.right,operator:visual.operator};
 if(visual.type==='fractionOfSet')return{type:'fractionOfSet',total:visual.total,groups:visual.groups,take:visual.take,taken:visual.total/visual.groups*visual.take};
 if(visual.type==='fractionDivision')return{type:'fractionDivision',wholeParts:visual.wholeParts,activeParts:visual.activeParts,splitEach:visual.splitEach,totalPieces:visual.wholeParts*visual.splitEach};
 if(visual.type==='angle')return{type:'angle',degrees:visual.degrees,...(visual.split?{split:visual.split}:{})};
 if(visual.type==='stemLeaf')return{type:'stemLeaf',rows:visual.rows.map(([stem,leaves])=>[stem,[...leaves]])};
 if(visual.type==='dotPlot')return{type:'dotPlot',values:[...visual.values],min:Math.min(...visual.values),max:Math.max(...visual.values)};
 if(visual.type==='budget')return{type:'budget',income:visual.income,total:visual.items.reduce((sum,[,value])=>sum+value,0)};
 if(visual.type==='coordinate'||visual.type==='scatter')return{type:visual.type,points:visual.points.map(point=>[...point])};
 if(visual.type==='volume')return{type:'volume',length:visual.length,width:visual.width,height:visual.height,total:visual.length*visual.width*visual.height};
 if(visual.type==='hierarchy')return{type:'hierarchy',groups:[...visual.groups]};
 if(visual.type==='shapes'||visual.type==='solids')return{type:visual.type,items:[...visual.items]};
 return{type:visual.type};
}
export function levelMissionId(levelId,unitId,missionIndex){return levelId+'-'+unitId+'-m'+(missionIndex+1)}
export function blankFoundationsLearner(){return{level:'level1',unit:0,mission:0,completed:{},sessions:{},familyNotes:'',updatedAt:null}}
export function shuffledChoices(items,seed=0){
  const copy=[...items];for(let i=copy.length-1;i>0;i--){const j=(seed*7+i*3+1)%(i+1);[copy[i],copy[j]]=[copy[j],copy[i]]}return copy;
}
