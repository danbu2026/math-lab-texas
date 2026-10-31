const q=(prompt,answer,wrong1,wrong2,model,reason,visual=null)=>({prompt,answer:String(answer),choices:[String(answer),String(wrong1),String(wrong2)],model,reason,visual,wrongReasons:[`The answer is ${wrong1} because I used only part of the information.`,`The answer is ${wrong2} because I did not check it against the model.`]});

const CASE_STANDARDS={
 'l4-place':[['4.2A'],['4.2B'],['4.2C'],['4.2D'],['4.2A','4.2B']],
 'l4-decimals':[['4.2E'],['4.2F'],['4.2G'],['4.2H'],['4.3G']],
 'l4-fraction-meaning':[['4.3A'],['4.3B'],['4.3C'],['4.3A','4.3B'],['4.3C']],
 'l4-fraction-ops':[['4.3D'],['4.3E'],['4.3E'],['4.3F'],['4.3D','4.3F']],
 'l4-addsub':[['4.4A'],['4.4A'],['4.4G'],['4.4G'],['4.4A','4.4G']],
 'l4-multiply':[['4.4B'],['4.4C'],['4.4D'],['4.4D'],['4.4C','4.4D']],
 'l4-division':[['4.4E'],['4.4F'],['4.4H'],['4.4H'],['4.4E','4.4F']],
 'l4-algebra':[['4.5A'],['4.5A'],['4.5B'],['4.5B'],['4.5A','4.5B']],
 'l4-area':[['4.5C'],['4.5C'],['4.5D'],['4.5D'],['4.5C','4.5D']],
 'l4-geometry':[['4.6A'],['4.6B'],['4.6C'],['4.6D'],['4.6A','4.6D']],
 'l4-angles':[['4.7A'],['4.7B'],['4.7C'],['4.7D'],['4.7E']],
 'l4-measure-data':[['4.8A'],['4.8B'],['4.8C'],['4.9A'],['4.9B']],
 'l4-finance':[['4.10A'],['4.10B'],['4.10C'],['4.10D'],['4.10E']]
};
const unit=(id,title,icon,color,standards,goal,wrongModels,wrongReasons,cases)=>({id,title,icon,color,standards,goal,wrongModels,wrongReasons,cases:cases.map((item,index)=>({...item,standards:CASE_STANDARDS[id][index]}))});

export const LEVEL4={id:'level4',number:4,title:'Strategy Architect',subtitle:'Connect decimals, fractions, operations, geometry, data, and money through multi-step reasoning.',units:[
unit('l4-place','Place Value to One Billion','▦','#f9b83f',['4.2A','4.2B','4.2C','4.2D'],'Interpret, write, compare, and round large whole numbers.','Read digits without place value|Compare only the last digits'.split('|'),'Each place is ten times the place to its right.|Compare from the greatest place first.'.split('|'),[
 q('In 630,000, the 6 is how many times the value of the 6 in 63,000?',10,100,1,'Compare the two place values.','600,000 is 10 times 60,000.',{type:'placeCompare',values:[630000,63000]}),
 q('Which is expanded notation for 407,205,019?','400,000,000 + 7,000,000 + 200,000 + 5,000 + 10 + 9','4,000,000 + 700,000 + 20,000 + 519','400,000,000 + 7,000,000 + 205,019,000','Match every nonzero digit to its place.','The terms preserve 4 hundred-millions, 7 millions, 2 hundred-thousands, 5 thousands, 1 ten, and 9 ones.',{type:'place',hundredMillions:4,tenMillions:0,millions:7,hundredThousands:2,tenThousands:0,thousands:5,hundreds:0,tens:1,ones:9}),
 q('Order from least to greatest: 98,765,432; 98,756,432; 89,765,432.','89,765,432 < 98,756,432 < 98,765,432','98,765,432 < 98,756,432 < 89,765,432','89,765,432 < 98,765,432 < 98,756,432','Compare from the leftmost digit.','89 million is least; then compare the hundred-thousands in the two 98-million numbers.'),
 q('Round 746,281 to the nearest hundred thousand.',700000,750000,800000,'Check the ten-thousands digit.','The ten-thousands digit is 4, so 746,281 rounds to 700,000.'),
 q('Which numeral has 3 hundred-millions, 5 ten-millions, 8 thousands, and 2 ones?','350,008,002','305,080,002','350,080,020','Place each digit in its named position.','The numeral is 350,008,002.',{type:'place',hundredMillions:3,tenMillions:5,millions:0,hundredThousands:0,tenThousands:0,thousands:8,hundreds:0,tens:0,ones:2})
]),
unit('l4-decimals','Decimals, Money & Fraction Links','◫','#63b7e8',['4.2E','4.2F','4.2G','4.2H','4.3G'],'Model, compare, and locate tenths and hundredths.','Ignore the decimal point|Compare decimal digits as whole numbers'.split('|'),'Tenths and hundredths are equal parts of one whole.|Trailing zeros do not change a decimal value.'.split('|'),[
 q('A hundred grid has 37 shaded squares. What decimal is shaded?','0.37','3.7','0.037','Treat each small square as one hundredth.','37 hundredths is 0.37.',{type:'decimalGrid',hundredths:37}),
 q('Which order is least to greatest?','0.45 < 0.50 < 0.54','0.54 < 0.50 < 0.45','0.50 < 0.45 < 0.54','Use the proportional number line to compare their distances from zero.','45 hundredths is less than 50 hundredths, which is less than 54 hundredths.',{type:'numberLine',min:0.4,max:0.6,points:[0.45,0.50,0.54]}),
 q('Which fraction equals 0.72?','72/100','72/10','7/2','Read the decimal as hundredths.','0.72 means 72 hundredths.'),
 q('A point is 6 tenths from zero. Which decimal labels it?','0.6','0.06','6.0','Count tenths from zero.','Six one-tenth intervals equal 0.6.',{type:'fractionLine',denominator:10,numerator:6}),
 q('Which point is farther from zero: 0.8 or 0.65?','0.8','0.65','They are equal','Compare 0.80 and 0.65.','80 hundredths is farther from zero than 65 hundredths.',{type:'numberLine',min:0,max:1,points:[0.65,0.8]})
]),
unit('l4-fraction-meaning','Fraction Decomposition & Equivalence','≈','#77c9bf',['4.3A','4.3B','4.3C'],'Build fractions from unit fractions and prove equivalence.','Add denominators when combining equal parts|Judge equivalence by numerator size only'.split('|'),'A fraction is a count of equal unit fractions.|Equivalent fractions name the same amount of the same whole.'.split('|'),[
 q('Write 7/4 as a sum of unit fractions.','1/4 + 1/4 + 1/4 + 1/4 + 1/4 + 1/4 + 1/4','7 × 1/7','1/4 + 6/3','Use seven copies of one fourth.','Seven unit fractions of size 1/4 make 7/4.'),
 q('Which is a different decomposition of 6/8?','3/8 + 2/8 + 1/8','3/4 + 3/4','6/4 + 2/4','Compare the three same-whole fraction bars. Keep every part sized as one eighth.','3 + 2 + 1 = 6, so the three bars combine to 6/8.',{type:'fractionDecompose',denominator:8,parts:[3,2,1],total:6}),
 q('Which pair is equivalent?','3/4 and 6/8','3/4 and 4/6','2/5 and 5/2','Use equal-size models or multiply numerator and denominator by the same number.','3/4 × 2/2 = 6/8.',{type:'fractionBar',total:8,shaded:6}),
 q('How many one-fifths make 8/5?',8,5,13,'The numerator counts the unit fractions.','8/5 contains eight copies of 1/5.'),
 q('Which equation proves 4/6 and 2/3 are equivalent?','4 × 3 = 6 × 2','4 + 3 = 6 + 2','4 × 6 = 3 × 2','Compare cross-products or use a common model.','Both cross-products equal 12.')
]),
unit('l4-fraction-ops','Compare, Add & Subtract Fractions','◔','#b99de8',['4.3D','4.3E','4.3F'],'Compare unlike fractions and operate on equal-size parts.','Compare denominators alone|Add or subtract denominators'.split('|'),'Fractions must refer to the same whole.|Equal denominators mean the parts have the same size.'.split('|'),[
 q('Which comparison is true?','5/6 > 3/4','5/6 < 3/4','5/6 = 3/4','Rename both fractions in twelfths.','5/6 = 10/12 and 3/4 = 9/12.'),
 q('What is 3/8 + 4/8?','7/8','7/16','1/8','Combine equal eighth-size parts.','3 eighths plus 4 eighths is 7 eighths.',{type:'fractionBar',total:8,shaded:7}),
 q('What is 11/6 - 5/6?',1,'6/12','6/6','Subtract the number of sixths.','11 sixths minus 5 sixths is 6/6, or 1.'),
 q('Is 5/8 + 2/8 = 7/8 reasonable?','Yes; 5/8 is above 1/2 and adding 1/4 stays below 1','No; every fraction sum must be above 1','No; 5 + 2 must equal 8','Use 0, 1/4, 1/2, 3/4, and 1 as benchmarks.','5/8 + 2/8 = 7/8, between 3/4 and 1.'),
 q('Which is greater: 7/10 or 5/8?','7/10','5/8','They are equal','Use a common denominator or decimals, then check against benchmarks.','7/10 = 0.70 and 5/8 = 0.625, so 7/10 is greater.')
]),
unit('l4-addsub','Whole & Decimal Addition, Subtraction & Estimation','＋','#f28a5b',['4.4A','4.4G'],'Calculate exactly and estimate to check reasonableness.','Line up numbers at the left edge|Use an exact algorithm when only an estimate is requested'.split('|'),'Align place values, including decimal points.|A useful estimate is close enough to test an exact result.'.split('|'),[
 q('What is 2,746 + 8,539?',11285,10275,11385,'Align ones, tens, hundreds, and thousands.','2,746 + 8,539 = 11,285.'),
 q('What is $52.40 - $18.75?','$33.65','$34.75','$31.65','Align decimal points and regroup.','$52.40 - $18.75 = $33.65.'),
 q('Estimate 3,487 + 5,612 by rounding to the nearest thousand.',9000,8000,10000,'Round each addend to the nearest thousand.','3,487 ≈ 3,000 and 5,612 ≈ 6,000, so the estimate is 9,000.'),
 q('Which is a compatible-number estimate for 1,978 ÷ 4?',500,400,600,'Use a nearby number divisible by 4.','2,000 ÷ 4 = 500.'),
 q('A receipt shows $28.65 and $17.80. Which exact total and estimate agree?','$46.45; about $47','$45.45; about $30','$46.55; about $60','Add exactly, then round each amount to check.','$28.65 + $17.80 = $46.45; $29 + $18 ≈ $47.')
]),
unit('l4-multiply','Multiplication Models & Algorithms','×','#9fc95a',['4.4B','4.4C','4.4D'],'Use place value, area models, and efficient algorithms to multiply.','Add factors instead of multiplying|Multiply only the ones digits'.split('|'),'Place-value patterns explain products by 10 and 100.|Partial products preserve every place value.'.split('|'),[
 q('What is 47 × 100?',4700,470,47000,'Multiplying by 100 makes each digit worth 100 times as much.','47 × 100 = 4,700.'),
 q('Which area-model parts represent 23 × 14?','20×10, 20×4, 3×10, 3×4','23×10 and 14×10','2×1 and 3×4','Decompose both factors by place value.','The four partial rectangles cover the entire 23 by 14 area.'),
 q('What is 3,208 × 6?',19248,1928,18248,'Use partial products or the standard algorithm.','3,000×6 + 200×6 + 8×6 = 19,248.'),
 q('What is 46 × 37?',1702,1482,1732,'Multiply 46 by 30 and by 7, then add.','1,380 + 322 = 1,702.'),
 q('A square garden is 15 m on each side. What is its area?','225 square meters','60 square meters','30 square meters','Use 15 × 15.','15 × 15 = 225.',{type:'array',rows:15,cols:15})
]),
unit('l4-division','Division Models, Algorithms & Remainders','÷','#63b7e8',['4.4E','4.4F','4.4H'],'Represent division, calculate quotients, and interpret remainders.','Ignore place value in the dividend|Always discard the remainder'.split('|'),'Division can be modeled with equal groups or an area model.|The situation determines what a remainder means.'.split('|'),[
 q('Which equation represents 1,248 objects split into 6 equal groups?','1,248 ÷ 6 = n','1,248 × 6 = n','1,248 - 6 = n','Match total ÷ number of groups.','The unknown is the size of each of 6 equal groups.'),
 q('What is 3,276 ÷ 7?','468','478','458','Divide by place value and check by multiplication.','468 × 7 = 3,276.'),
 q('125 students ride buses holding 40 each. How many buses are needed?',4,3,5,'Interpret the remainder as people who still need a bus.','125 ÷ 40 = 3 remainder 5, so 4 buses are needed.'),
 q('97 stickers are shared equally among 8 children. What should be reported?','12 each with 1 sticker left','13 each','12 each with none left','Use the context to report the remainder.','97 ÷ 8 = 12 remainder 1.'),
 q('Which check proves 2,184 ÷ 8 = 273?','273 × 8 = 2,184','273 + 8 = 2,184','2,184 - 273 = 8','Use multiplication as the inverse of division.','273 × 8 reconstructs the dividend.')
]),
unit('l4-algebra','Multi-Step Models & Number Patterns','↗','#77c9bf',['4.5A','4.5B'],'Represent unknowns, sequences, and rules with equations and tables.','Solve only the first step|Use a rule that fits only one pair'.split('|'),'A strip diagram or equation keeps the whole problem visible.|A table rule must work for every input and output.'.split('|'),[
 q('A store had 240 balls, sold 85, then received 60. Which equation finds the new total?','240 - 85 + 60 = n','240 + 85 + 60 = n','240 - 60 = n','Represent events in time order.','Subtract the sold balls, then add the new shipment.'),
 q('Mia buys 4 books at $7 each and pays with $40. Which equation finds the change?','40 - (4 × 7) = c','40 - 4 + 7 = c','4 × 40 = c','Group the multiplication before subtraction.','The books cost $28, so the change is $12.'),
 q('A table follows y = 5x + 2. What is y when x = 6?',32,17,42,'Multiply the input by 5, then add 2.','5 × 6 + 2 = 32.',{type:'pairs',pairs:[[1,7],[2,12],[3,17],[6,32]]}),
 q('Sequence positions 1, 2, 3, 4 have values 4, 7, 10, 13. Which rule gives the value?', '3 × position + 1','position + 3','4 × position','Test the rule on every position.','3n + 1 gives 4, 7, 10, 13.'),
 q('A theater has 18 rows with 24 seats, then blocks 36 seats. Which expression finds usable seats?','18 × 24 - 36','18 + 24 - 36','36 - 18 × 24','Find total seats before subtracting blocked seats.','18 × 24 = 432; 432 - 36 = 396.')
]),
unit('l4-area','Perimeter & Area Relationships','▦','#f9b83f',['4.5C','4.5D'],'Develop and apply rectangle and square formulas.','Use perimeter when the question asks for area|Use only one pair of sides for perimeter'.split('|'),'Perimeter measures the boundary; area covers the surface.|Formulas summarize repeated equal lengths or rows.'.split('|'),[
 q('Which formula finds the perimeter of a rectangle?', 'P = 2l + 2w','P = lw','P = l + w','Trace all four sides in the model: two lengths and two widths.','The model shows l + w + l + w, which combines to 2l + 2w.',{type:'rectangleFormula',mode:'perimeter',length:6,width:4}),
 q('Which formula finds the area of a square with side s?','A = s × s','A = 4s','A = s + s','Count the equal rows and columns of unit squares.','The model has s rows with s unit squares in each row, so A = s × s.',{type:'rectangleFormula',mode:'area',length:4,width:4}),
 q('A rectangle is 12 m by 7 m. What are its perimeter and area?','38 m; 84 square meters','19 m; 84 square meters','38 m; 19 square meters','Calculate boundary and surface separately.','2(12)+2(7)=38 and 12×7=84.'),
 q('A rectangle has area 96 square units and length 12. What is its width?',8,7,9,'Use 12 × width = 96.','96 ÷ 12 = 8.'),
 q('A square has perimeter 52 cm. What is its area?','169 square centimeters','208 square centimeters','26 square centimeters','Find the side with 52 ÷ 4, then square it.','The side is 13 cm and 13 × 13 = 169.')
]),
unit('l4-geometry','Lines, Symmetry, Triangles & Figures','◇','#b99de8',['4.6A','4.6B','4.6C','4.6D'],'Identify geometric elements and classify figures by precise attributes.','Classify by appearance only|Assume every figure has symmetry'.split('|'),'Lines, rays, segments, and angles have distinct definitions.|Classifications depend on parallel lines, perpendicular lines, and angle sizes.'.split('|'),[
 q('Which classification matches all five labeled objects in the diagram?','A point; B line; C line segment; D ray; E angle','A line; B point; C ray; D angle; E segment','A point; B segment; C line; D angle; E ray','Use dots for endpoints and arrows for directions that continue forever.','A is a point. B has arrows at both ends. C has two endpoints. D has one endpoint and one arrow. E is formed by two rays.',{type:'geometryTerms'}),
 q('Which two folds are lines of symmetry for this non-square rectangle?','vertical and horizontal','both diagonals','only the vertical fold','Choose a fold only when both halves match exactly.','The vertical and horizontal folds each make matching halves; the diagonal folds do not.',{type:'symmetry',shape:'rectangle',lines:['vertical','horizontal']}),
 q('A triangle has one angle greater than 90°. What type is it?','obtuse triangle','acute triangle','right triangle','Classify by the largest angle.','An angle greater than 90° makes the triangle obtuse.',{type:'angle',degrees:120}),
 q('Which statement describes a trapezoid in this course?','It has exactly one pair of parallel sides','It has four right angles','It has no parallel sides','Look for exactly one pair of parallel sides.','In this course, a trapezoid has exactly one pair of parallel sides.',{type:'shapes',items:['trapezoid','rectangle','rhombus']}),
 q('Which pair of lines meets to form four right angles?','perpendicular lines','parallel lines','two rays that never meet','Use the angle formed at the intersection.','Perpendicular lines intersect at 90° angles.')
]),
unit('l4-angles','Measure, Draw & Combine Angles','∠','#f28a5b',['4.7A','4.7B','4.7C','4.7D','4.7E'],'Understand degrees and use angle addition to measure and draw.','Judge only by side length|Add a full circle to every angle'.split('|'),'Angle measure describes a turn, not ray length.|Adjacent non-overlapping angles can be added.'.split('|'),[
 q('A 90° sector cuts what fraction of a full circle?','1/4','1/2','1/90','Compare the highlighted sector with the 360° full circle.','90/360 simplifies to 1/4.',{type:'angle',degrees:90,mode:'sector'}),
 q('Why is one degree 1/360 of a circle?','A full turn is divided into 360 equal angle units','Every angle has 360 rays','A circle has 360 sides','Use the full-turn model: 360 equal one-degree turns complete the circle.','360 one-degree turns make one full 360° turn.',{type:'angle',degrees:1,mode:'degreeCircle'}),
 q('A protractor ray points near 68°. What is the nearest whole-degree measure?','68°','112°','6.8°','Start at the highlighted zero and follow the correct scale to the ray.','The ray crosses the 68° mark.',{type:'angle',degrees:68,mode:'protractor'}),
 q('Which directions draw a 125° angle?','Draw one ray, center a protractor at the vertex, mark 125°, then draw the second ray','Draw two equal-length rays without measuring','Draw a 125-unit line segment','Drag the second ray until it reaches 125° on the protractor scale.','The protractor locates a 125° turn before the second ray is drawn.',{type:'angle',degrees:125,mode:'draw'}),
 q('Two adjacent angles form 140°. One is 55°. What is the other?', '85°','195°','75°','Subtract the known part from the whole angle.','140° - 55° = 85°.',{type:'angle',degrees:140,split:55})
]),
unit('l4-measure-data','Measurement Conversions & Data Displays','▥','#63b7e8',['4.8A','4.8B','4.8C','4.9A','4.9B'],'Convert units and interpret tables, dot plots, and stem-and-leaf plots.','Mix units from different systems|Ignore the data key or place value'.split('|'),'Equivalent measures describe the same amount.|Data displays organize values without changing them.'.split('|'),[
 q('Which comparison is true?','1 kilometer is larger than 1 meter','1 centimeter is larger than 1 meter','1 gram is larger than 1 kilogram','Compare units measuring the same attribute.','1 kilometer equals 1,000 meters.'),
 q('A table shows 1 yard = 3 feet. How many feet are in 8 yards?',24,11,16,'Multiply each yard by 3 feet.','8 × 3 = 24 feet.',{type:'pairs',pairs:[[1,3],[2,6],[4,12],[8,24]]}),
 q('Which set of equations correctly solves one length, elapsed-time, mass, and money problem?','3 m + 125 cm = 425 cm; 2 h 15 min + 45 min = 3 h; 2 kg 500 g + 750 g = 3,250 g; $12.50 + $7.75 = $20.25','3 m + 125 cm = 128 cm; 2 h 15 min + 45 min = 2 h 60 min; 2 kg 500 g + 750 g = 2,575 g; $12.50 + $7.75 = $19.25','3 m + 125 cm = 4.25 m; 2 h 15 min + 45 min = 2 h 45 min; 2 kg 500 g + 750 g = 3,250 kg; $12.50 + $7.75 = $20.15','Rename units before operating, then check that each result uses a sensible unit.','The four equations correctly convert and operate with length, elapsed time, mass, and money.',{type:'measurementSet',items:[['Length','3 m + 125 cm'],['Time','2 h 15 min + 45 min'],['Mass','2 kg 500 g + 750 g'],['Money','$12.50 + $7.75']]}),
 q('Raw data are 21, 24, 24, 30. Which stem-and-leaf plot represents them?','2 | 1 4 4 and 3 | 0','2 | 1 4 and 3 | 0 4','21 | 24 24 30','Use each tens digit as a stem and each ones digit as one leaf.','The 20s use stem 2 with leaves 1, 4, 4; 30 uses stem 3 with leaf 0.',{type:'rawData',values:[21,24,24,30]}),
 q('A dot plot has values 2½, 2½, 3, 3½. What is the range?',1,'1½','3½','Subtract the least value from the greatest.','3½ - 2½ = 1.',{type:'dotPlot',values:[2.5,2.5,3,3.5]})
]),
unit('l4-finance','Expenses, Profit, Saving & Banks','★','#77c9bf',['4.10A','4.10B','4.10C','4.10D','4.10E'],'Make financial decisions using costs, goals, and services.','Treat all expenses as fixed|Call revenue the same as profit'.split('|'),'Profit is revenue minus costs.|Saving choices have different access, risk, and return.'.split('|'),[
 q('Which is usually a fixed expense?','Monthly rent','Weekly grocery total','Electric use charge','Look for a cost that stays the same for a set period.','Rent is commonly a set monthly amount.'),
 q('A stand earns $85 and spends $32. What is the profit?','$53','$117','$32','Subtract total costs from revenue.','$85 - $32 = $53.'),
 q('Which comparison of saving options is reasonable?','A savings account is accessible and may earn interest; a longer-term option may pay more but restrict access','Every option has the same access and return','Cash at home always earns bank interest','Compare safety, access, and possible return.','Different saving options trade immediate access for possible earnings or other benefits.'),
 q('Allocate a $20 allowance with spending, college saving, and sharing. Which plan uses all $20?','$6 spending, $10 college saving, $4 sharing','$10 spending, $10 saving, $10 sharing','$20 spending, $5 saving, $2 sharing','Add every category and preserve the total.','$6 + $10 + $4 = $20.',{type:'budget',income:20,items:[['Spend',6],['College',10],['Share',4]]}),
 q('What is a basic purpose of a financial institution?','Keep money safe and connect savers with borrowers','Guarantee every purchase is free','Remove the need to repay loans','Connect deposits, lending, and safekeeping.','Financial institutions hold deposits and may lend money under repayment agreements.')
])
]};
