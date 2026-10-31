const q=(prompt,answer,wrong1,wrong2,model,reason,visual=null)=>({prompt,answer:String(answer),choices:[String(answer),String(wrong1),String(wrong2)],model,reason,visual,wrongReasons:[`The answer is ${wrong1} because I used only part of the information.`,`The answer is ${wrong2} because I did not check it against the model.`]});

const CASE_STANDARDS={
 'l5-decimals':[['5.2A'],['5.2A'],['5.2B'],['5.2C'],['5.2B','5.2C']],
 'l5-whole-ops':[['5.3A'],['5.3B'],['5.3C'],['5.3A','5.3B'],['5.3A','5.3C']],
 'l5-decimal-ops':[['5.3D'],['5.3E'],['5.3F'],['5.3G'],['5.3E','5.3G']],
 'l5-fraction-add':[['5.3H'],['5.3H'],['5.3K'],['5.3K'],['5.3H','5.3K']],
 'l5-fraction-multdiv':[['5.3I'],['5.3I'],['5.3J'],['5.3L'],['5.3J','5.3L']],
 'l5-prime-model':[['5.4A'],['5.4A'],['5.4B'],['5.4B'],['5.4A','5.4B']],
 'l5-patterns':[['5.4C'],['5.4C'],['5.4D'],['5.4D'],['5.4C','5.4D']],
 'l5-expressions':[['5.4E'],['5.4E'],['5.4F'],['5.4F'],['5.4E','5.4F']],
 'l5-volume':[['5.4G'],['5.6A'],['5.6B'],['5.4H'],['5.4G','5.4H']],
 'l5-hierarchy':[['5.5'],['5.5'],['5.5'],['5.5'],['5.5']],
 'l5-coordinate':[['5.7'],['5.8A'],['5.8B'],['5.8C'],['5.7','5.8C']],
 'l5-data':[['5.9A'],['5.9A'],['5.9B'],['5.9C'],['5.9C']],
 'l5-finance':[['5.10A'],['5.10B'],['5.10C'],['5.10D'],['5.10E','5.10F']]
};
const unit=(id,title,icon,color,standards,goal,wrongModels,wrongReasons,cases)=>({id,title,icon,color,standards,goal,wrongModels,wrongReasons,cases:cases.map((item,index)=>({...item,standards:CASE_STANDARDS[id][index]}))});

export const LEVEL5={id:'level5',number:5,title:'Systems Challenger',subtitle:'Use rational numbers, expressions, coordinates, volume, data, and budgets to solve connected problems.',units:[
unit('l5-decimals','Decimals to Thousandths','◫','#63b7e8',['5.2A','5.2B','5.2C'],'Represent, compare, order, and round decimals to thousandths.','Ignore place names after the decimal|Compare only the number of digits'.split('|'),'Each decimal place is one-tenth of the place to its left.|Equivalent trailing zeros help align comparisons.'.split('|'),[
 q('Which expanded notation represents 6.407?','6 + 4/10 + 7/1000','6 + 4/100 + 7/10','6 + 407/10','Match 4 to tenths and 7 to thousandths.','6.407 has 6 ones, 4 tenths, 0 hundredths, and 7 thousandths.'),
 q('What numeral is 3 + 8/10 + 5/100 + 2/1000?','3.852','3.825','38.52','Place each fractional part in its decimal position.','The digits are 3 ones, 8 tenths, 5 hundredths, and 2 thousandths.'),
 q('Order least to greatest: 0.506, 0.56, 0.509.','0.506 < 0.509 < 0.560','0.560 < 0.509 < 0.506','0.506 < 0.560 < 0.509','Write each number to three decimal places.','506 thousandths < 509 thousandths < 560 thousandths.'),
 q('Round 7.846 to the nearest hundredth.','7.85','7.84','7.8','Check the thousandths digit.','The thousandths digit is 6, so 7.84 rounds up to 7.85.'),
 q('Which statement is true?','2.399 < 2.40','2.399 > 2.40','2.399 = 2.40','Compare 2.399 with 2.400.','399 thousandths is less than 400 thousandths.')
]),
unit('l5-whole-ops','Estimate, Multiply & Divide Whole Numbers','×','#f9b83f',['5.3A','5.3B','5.3C'],'Estimate first, then calculate multi-digit products and quotients.','Use an estimate as an exact answer|Drop place values during the algorithm'.split('|'),'Estimation predicts a reasonable range.|Inverse operations can verify exact calculations.'.split('|'),[
 q('Estimate 298 × 41.','about 12,000','about 1,200','about 120,000','Use 300 × 40.','300 × 40 = 12,000.'),
 q('What is 326 × 47?',15322,14322,1532,'Use partial products or the standard algorithm.','326×40 = 13,040 and 326×7 = 2,282; total 15,322.'),
 q('What is 3,456 ÷ 24?',144,134,154,'Use partial quotients or the standard algorithm, then multiply to check.','144 × 24 = 3,456.'),
 q('A factory packs 215 boxes with 36 items each. Which exact total and estimate agree?','7,740; about 8,000','7,540; about 6,000','77,400; about 80,000','Calculate exactly and compare with 200 × 40.','215 × 36 = 7,740, close to 8,000.'),
 q('2,975 tickets are placed in rows of 25. Which quotient and estimate agree?','119; about 120','109; about 100','129; about 150','Use 3,000 ÷ 25 for the estimate and calculate exactly.','2,975 ÷ 25 = 119, close to 120.')
]),
unit('l5-decimal-ops','Decimal Products & Quotients','▦','#77c9bf',['5.3D','5.3E','5.3F','5.3G'],'Model and calculate decimal multiplication and division to hundredths.','Place the decimal by guessing|Treat tenths as whole units'.split('|'),'Area models preserve decimal place value.|Whole-number relationships help locate the decimal in a result.'.split('|'),[
 q('Which area-model parts represent 1.4 × 0.6?','(1 × 0.6) + (0.4 × 0.6)','1.4 + 0.6','14 × 6 with no place-value adjustment','Decompose 1.4 into 1 and 0.4.','The 14-by-6 tenths grid has 84 hundredths, so 0.6 + 0.24 = 0.84.',{type:'decimalArea',width:1.4,height:0.6}),
 q('A notebook costs $2.35. What do 4 notebooks cost?','$9.40','$8.20','$94.00','Multiply 235 cents by 4, then write dollars.','235 × 4 = 940 cents, or $9.40.'),
 q('Which model represents 6.3 ÷ 3?','Split 63 tenths into 3 equal groups','Split 63 wholes into 3 groups and call each 0.21','Multiply 6.3 by 3','Rename the dividend in tenths, then share equally.','63 tenths ÷ 3 = 21 tenths, or 2.1.',{type:'decimalShare',tenths:63,groups:3}),
 q('What is 48.6 ÷ 12?',4.05,4.5,40.5,'Use a division algorithm and check with multiplication.','4.05 × 12 = 48.6.'),
 q('A $36.75 bill is shared equally by 5 people. How much each?','$7.35','$6.75','$73.50','Divide cents or use decimal long division.','3,675 cents ÷ 5 = 735 cents, or $7.35.')
]),
unit('l5-fraction-add','Add & Subtract Unlike Fractions','＋','#b99de8',['5.3H','5.3K'],'Use common units to add and subtract positive rational numbers.','Add denominators directly|Rename only one fraction and leave unlike units'.split('|'),'Fractions need a common denominator before combining.|Benchmark estimates check exact rational-number results.'.split('|'),[
 q('What is 2/3 + 3/4?','1 5/12','5/7','1 1/12','Rename both fractions in twelfths.','8/12 + 9/12 = 17/12 = 1 5/12.',{type:'fractionOperation',denominator:12,left:8,right:9,operator:'+'}),
 q('What is 5/6 - 1/4?','7/12','4/2','1/2','Use twelfths as a common unit.','10/12 - 3/12 = 7/12.',{type:'fractionOperation',denominator:12,left:10,right:3,operator:'−'}),
 q('What is 3.75 + 2 1/2?','6.25','5.80','6.75','Rename 2 1/2 as 2.5 or 3.75 as a fraction.','3.75 + 2.50 = 6.25.',{type:'numberLine',min:0,max:7,points:[2.5,3.75,6.25]}),
 q('What is 8 1/5 - 3.65?','4.55','5.45','4.65','Rename 1/5 as 0.2 and align decimals.','8.20 - 3.65 = 4.55.',{type:'numberLine',min:0,max:9,points:[3.65,4.55,8.2]}),
 q('A trail is 1 3/4 miles, then 2 2/3 miles. Total distance?','4 5/12 miles','3 5/7 miles','4 1/12 miles','Use twelfths for the fractional parts and add the wholes.','1 9/12 + 2 8/12 = 3 17/12 = 4 5/12.',{type:'fractionOperation',denominator:12,left:21,right:32,operator:'+'})
]),
unit('l5-fraction-multdiv','Fraction Multiplication & Division','÷','#f28a5b',['5.3I','5.3J','5.3L'],'Model a fraction of a whole number and divide with unit fractions.','Multiply denominators into the whole number|Reverse every division situation without checking'.split('|'),'A fraction of a quantity can be modeled as equal parts.|Dividing by a unit fraction asks how many such pieces fit.'.split('|'),[
 q('What is 3/5 of 20?',12,15,4,'Split 20 into fifths, then take 3 parts.','20 ÷ 5 = 4 and 3 × 4 = 12.',{type:'fractionOfSet',total:20,groups:5,take:3}),
 q('A model shades 2/3 of 18 squares. How many are shaded?',12,9,6,'Make 3 equal groups, then count 2 groups.','18 ÷ 3 × 2 = 12.',{type:'fractionOfSet',total:18,groups:3,take:2}),
 q('Which model represents 1/3 ÷ 4?','Split one third into 4 equal parts, each 1/12','Make 4 groups of 1/3 and get 4/3','Split 4 into thirds and get 12','The dividend is one-third, not one whole.','One third split into 4 equal parts gives 1/12.',{type:'fractionDivision',wholeParts:3,activeParts:1,splitEach:4}),
 q('What is 6 ÷ 1/3?',18,2,6,'Count how many one-thirds fit in 6 wholes.','Each whole has three thirds, so 6 wholes have 18 thirds.',{type:'fractionDivision',wholeParts:6,activeParts:6,splitEach:3}),
 q('What is 1/4 ÷ 5?','1/20','5/4','1/9','Partition one fourth into 5 equal pieces.','Each piece is one fifth of one fourth, or 1/20.',{type:'fractionDivision',wholeParts:4,activeParts:1,splitEach:5})
]),
unit('l5-prime-model','Prime Numbers & Multi-Step Models','?','#9fc95a',['5.4A','5.4B'],'Classify numbers and represent multi-step unknowns.','Call every odd number prime|Solve steps without representing their order'.split('|'),'A prime number has exactly two positive factors.|Parentheses can preserve the intended order in an equation.'.split('|'),[
 q('Which number is prime?',29,27,33,'Test possible divisors through the square root.','29 has only factors 1 and 29.'),
 q('Why is 51 composite?','3 × 17 = 51','It is odd','It is greater than 50','Give a factor pair other than 1 and itself.','The pair 3 and 17 proves 51 is composite.'),
 q('A club earns $360, spends $85, then shares the rest among 5 teams. Which equation finds each share?','(360 - 85) ÷ 5 = s','360 - 85 ÷ 5 = s','360 ÷ 5 - 85 = s','Group the subtraction before division.','The amount remaining is $275, then $275 ÷ 5 = $55.'),
 q('Four buses carry 48 students each. Then 35 students leave. Which equation finds how many remain?','4 × 48 - 35 = n','4 + 48 - 35 = n','48 - 35 × 4 = n','Find the total before subtracting those who leave.','192 - 35 = 157.'),
 q('Which statement and equation are both true?','37 is prime; 6 × 28 + 12 = 180','39 is prime; 6 + 28 × 12 = 180','37 is composite; 180 ÷ 12 = 6 × 28','Check factor classification and operation order.','37 has only factors 1 and 37; 168 + 12 = 180.')
]),
unit('l5-patterns','Rules, Tables & Graphs','↗','#63b7e8',['5.4C','5.4D'],'Generate and compare additive and multiplicative patterns.','Use a rule that fits one point only|Treat repeated addition and constant addition as identical descriptions'.split('|'),'A rule must match every pair.|Additive patterns have constant differences; multiplicative patterns have constant ratios.'.split('|'),[
 q('For y = 4x, which point belongs on the graph?','(6,24)','(6,10)','(4,6)','Substitute x into the rule.','4 × 6 = 24.',{type:'coordinate',max:25,points:[[6,24,'A']]}),
 q('For y = x + 7, what is y when x = 12?',19,84,5,'Add 7 to the input.','12 + 7 = 19.',{type:'pairs',pairs:[[1,8],[5,12],[12,19]]}),
 q('Table A is 3, 6, 9, 12. Table B is 3, 9, 27, 81. Which description is true?','A is additive; B is multiplicative','Both are additive','A is multiplicative; B is additive','Compare differences and ratios.','A adds 3; B multiplies by 3.'),
 q('Which rule is multiplicative?','y = 5x','y = x + 5','y = x - 5','Check whether output is a constant multiple of input.','In y = 5x, every output is five times the input.'),
 q('At x = 4, compare y = 2x and y = x + 2.','8 is greater than 6','6 is greater than 8','Both equal 4','Evaluate both rules at the same input.','2×4 = 8 and 4+2 = 6.')
]),
unit('l5-expressions','Parentheses, Brackets & Expressions','[ ]','#77c9bf',['5.4E','5.4F'],'Interpret grouping symbols and simplify expressions accurately.','Always work left to right|Treat grouping symbols as decoration'.split('|'),'Grouping symbols tell which calculation is a unit.|Work from inner groups outward, then multiply or divide before adding or subtracting.'.split('|'),[
 q('What do parentheses mean in 6 × (8 - 3)?','Find 8 - 3 before multiplying by 6','Multiply 6 × 8 before subtracting 3','Ignore 8 - 3','Treat the parenthesized part as one quantity.','6 × (8 - 3) = 6 × 5.'),
 q('In 50 - [4 × (7 + 2)], which operation happens first?','7 + 2','50 - 4','4 × 7','Begin with the innermost grouping symbols.','The parentheses are inside the brackets.'),
 q('Simplify 5 + 3 × (12 - 8).',17,32,20,'Evaluate parentheses, then multiply, then add.','12-8=4; 3×4=12; 5+12=17.'),
 q('Simplify [36 ÷ (4 + 2)] × 5.',30,75,11,'Work inside parentheses and brackets first.','4+2=6; 36÷6=6; 6×5=30.'),
 q('Which expression equals 42?','6 + [3 × (14 - 2)]','6 × 3 + 14 - 2','[6 + 3] × 14 - 2','Simplify each grouped expression carefully.','14-2=12; 3×12=36; 36+6=42.')
]),
unit('l5-volume','Area, Perimeter & Volume Systems','▣','#b99de8',['5.4G','5.4H','5.6A','5.6B'],'Develop volume formulas and connect length, area, and volume.','Use square units for volume|Count only the visible cubes'.split('|'),'A unit cube measures one cubic unit.|A prism volume is base area times number of layers.'.split('|'),[
 q('Which set gives valid prism volume formulas, including a cube?','V = l × w × h, V = Bh, and for a cube V = s × s × s','V = 2l + 2w and V = 4s','V = l + w + h only','Count cubes in one layer, then multiply by layers.','The base area B equals l×w; multiplying by height gives V=Bh=l×w×h. For a cube all three dimensions are s.',{type:'volume',length:3,width:3,height:3}),
 q('What does one cubic unit mean?','The volume of a 1 by 1 by 1 cube','The area of a 1 by 1 square','A line segment one unit long','Distinguish length, area, and volume units.','A unit cube fills one cubic unit of space.',{type:'volume',length:1,width:1,height:1}),
 q('A prism is 8 units long, 5 units wide, and 3 units high. Volume?','120 cubic units','40 cubic units','16 cubic units','Find 40 cubes per layer and use 3 layers.','8 × 5 × 3 = 120.',{type:'volume',length:8,width:5,height:3}),
 q('A box is 10 by 4 by 6. What are the base area and volume?','40 square units; 240 cubic units','20 square units; 120 cubic units','40 cubic units; 240 square units','Calculate the two-dimensional base before using height.','10×4=40 square units; B×h=40×6=240 cubic units.',{type:'volume',length:10,width:4,height:6}),
 q('A room floor is 12 by 9 and a storage box is 3 by 2 by 4. Which results are correct?','Floor area 108 square units; box volume 24 cubic units','Floor perimeter 108 units; box area 24 square units','Floor area 21 square units; box volume 9 cubic units','Match each attribute to its dimensions and units.','12×9=108 and 3×2×4=24.',{type:'volume',length:3,width:2,height:4})
]),
unit('l5-hierarchy','Shape Families & Hierarchies','◇','#f28a5b',['5.5'],'Classify two-dimensional figures as nested sets and subsets.','Put each shape in only one category|Classify by size or direction'.split('|'),'A figure can belong to several nested families.|Definitions and attributes determine subset relationships.'.split('|'),[
 q('Which hierarchy statement is true?','Every square is a rectangle, but not every rectangle is a square','Every rectangle is a square','No square is a rhombus','Compare required attributes.','Squares satisfy all rectangle rules plus equal sides.',{type:'hierarchy',groups:['Quadrilaterals','Parallelograms','Rectangles','Squares']}),
 q('Where does a rhombus belong?','Quadrilaterals → parallelograms → rhombuses','Triangles → rhombuses','Circles → quadrilaterals','Use parallel sides and equal-side attributes.','A rhombus is a parallelogram with four equal sides.',{type:'hierarchy',groups:['Quadrilaterals','Parallelograms','Rhombuses']}),
 q('Which figure is both a rectangle and a rhombus?','square','trapezoid','kite with unequal sides','Find the overlap of both attribute sets.','A square has four right angles and four equal sides.',{type:'hierarchy',groups:['Quadrilaterals','Parallelograms','Rectangle ∩ Rhombus','Square']}),
 q('Which figure has exactly one pair of parallel sides?','trapezoid','parallelogram','square','Count pairs of parallel sides.','In this Texas course definition, a trapezoid has exactly one pair of parallel sides.',{type:'shapes',items:['trapezoid','parallelogram','square']}),
 q('Which organizer best shows the hierarchy?','Squares inside rectangles and rhombuses, both inside parallelograms','Rectangles outside all quadrilaterals','All quadrilaterals inside triangles','Nest a subset inside every broader set whose rules it satisfies.','The organizer shows squares in the rectangle-and-rhombus overlap, with both inside parallelograms and quadrilaterals.',{type:'hierarchy',groups:['Quadrilaterals','Parallelograms','Rectangles + Rhombuses','Squares']})
]),
unit('l5-coordinate','Conversions & Coordinate Plane','⌖','#9fc95a',['5.7','5.8A','5.8B','5.8C'],'Convert measurements and graph ordered pairs in the first quadrant.','Switch systems without a conversion relationship|Read the y-coordinate before x'.split('|'),'Equivalent units preserve the measured amount.|An ordered pair moves x first, then y from the origin.'.split('|'),[
 q('How many inches are in 7 feet?',84,72,19,'Use 1 foot = 12 inches.','7 × 12 = 84 inches.'),
 q('What is the origin of a coordinate plane?','(0,0)','(1,1)','(0,1)','Find where the perpendicular axes meet at zero.','Both coordinates are zero at the origin.',{type:'coordinate',max:5,points:[[0,0,'O']]}),
 q('How do you graph (4,7)?','Move 4 units along x, then 7 units parallel to y','Move 7 along x, then 4 along y','Move diagonally 11 units','Read x first and y second.','The first coordinate is horizontal movement and the second is vertical.',{type:'coordinate',max:8,points:[[4,7,'P']]}),
 q('A table follows y = 2x + 1. Which point belongs on its graph?','(3,7)','(3,6)','(7,3)','Use the input as x and calculate y.','2×3+1=7.',{type:'coordinate',max:8,points:[[3,7,'A']]}),
 q('A map scale says 1 grid unit = 2 miles. From (1,2) to (1,6), how far?','8 miles','4 miles','12 miles','Find the vertical grid distance, then convert units.','The points are 4 grid units apart; 4×2=8 miles.',{type:'coordinate',max:7,points:[[1,2,'A'],[1,6,'B']]})
]),
unit('l5-data','Dot Plots, Stem-and-Leaf & Scatterplots','▥','#63b7e8',['5.9A','5.9B','5.9C'],'Represent and interpret categorical, numerical, and paired data.','Use a display that hides the data type|Claim causation from any plotted association'.split('|'),'Different displays answer different questions.|A scatterplot shows paired values and possible association, not automatic cause.'.split('|'),[
 q('Measurements are 1.5, 1.5, 2.0, 2.5. Which display preserves every value?','A dot plot with two dots at 1.5 and one each at 2.0 and 2.5','A bar graph with no numeric scale','A circle labeled four','Place one mark for every numerical measurement.','The dot plot keeps both repeated 1.5 values and each other measurement.',{type:'dotPlot',values:[1.5,1.5,2,2.5]}),
 q('A stem-and-leaf row is 3 | 1 4 8. Which values are represented?','31, 34, 38','3.1, 3.4, 3.8 only','314 and 318','Combine the stem tens digit with each leaf ones digit.','The row represents 31, 34, and 38.',{type:'stemLeaf',rows:[[3,[1,4,8]]]}),
 q('A table lists paired values (1,2), (3,4), (5,5), (7,8), (9,9). Which plotted set represents it?','All five points (1,2), (3,4), (5,5), (7,8), (9,9)','Only the x-values on the horizontal axis','The reversed points (2,1), (4,3), (5,5), (8,7), (9,9)','Plot each ordered pair with x first and y second.','The scatterplot must contain one point for every paired row.',{type:'scatter',maxX:10,maxY:10,points:[[1,2],[3,4],[5,5],[7,8],[9,9]]}),
 q('A table has 12 red, 9 blue, and 5 green items. How many more red and blue together than green?',16,21,11,'Add red and blue, then subtract green.','12+9-5=16.',{type:'graph',labels:['red','blue','green'],values:[12,9,5],scale:1}),
 q('Using the plotted paired data, which conclusion is supported?','The variables have a positive association in this sample','One variable definitely causes the other','Every possible point must lie on one line','Describe only what the plotted paired data show.','An upward trend supports positive association, not proof of causation.',{type:'scatter',maxX:10,maxY:10,points:[[1,1],[2,3],[4,4],[6,7],[8,7],[9,10]]})
]),
unit('l5-finance','Taxes, Pay, Payments & Budgets','★','#77c9bf',['5.10A','5.10B','5.10C','5.10D','5.10E','5.10F'],'Understand pay, taxes, payment tools, records, and balanced budgets.','Treat every tax as the same|Spend before checking income and records'.split('|'),'Gross income is before deductions; net income is take-home pay.|A balanced budget assigns no more than available income.'.split('|'),[
 q('Which choice correctly defines four common taxes?','Income tax is based on earnings; payroll tax is withheld from wages for programs; sales tax is charged on purchases; property tax is based on owned property','All four taxes are charged only when buying a toy','Property tax and sales tax are both deductions from every paycheck','Match each tax to the income, paycheck, purchase, or property it applies to.','The four definitions distinguish what each tax is based on.'),
 q('Gross pay is $500 and deductions are $85. What is net pay?','$415','$585','$85','Subtract deductions from gross income.','$500 - $85 = $415.'),
 q('Which comparison includes all four payment methods and a real tradeoff?','Check: written record but slower; credit: buyer protection but borrowed debt; debit: direct account use but overdraft risk; electronic payment: fast but needs security','Credit and debit are identical, and checks and electronic payments leave no record','Every method is free, instant, and risk-free','Compare convenience, recordkeeping, source of funds, fees, debt, and security.','Each method has a different mix of speed, records, access, and risk.'),
 q('Which complete financial-record system should you create and update?','Columns for date, description, payment method, money in, money out, and running balance','A list of purchases with no dates or amounts','Only the current wallet cash','Design columns that can reconstruct every balance change.','Updating all six fields creates a usable financial record.'),
 q('A $1,200 budget first totals $1,260. Which revised plan is balanced?','$650 needs, $250 saving, $200 wants, $100 giving','$700 needs, $300 saving, $250 wants, $100 giving','$1,200 needs and $100 saving','Find the $60 gap, reduce or replace expenses, then verify the new total.','$650+$250+$200+$100=$1,200, so the revised plan exactly matches income.',{type:'budget',income:1200,items:[['Needs',650],['Save',250],['Wants',200],['Give',100]]})
])
]};
