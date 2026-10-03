import test from 'node:test';import assert from 'node:assert/strict';import {topics,parameters,question,correct,cubes,parseAnswer} from '../dist/content.js';
test('18 lessons each generate finite answers and bilingual explanations',()=>{assert.equal(topics.reduce((n,t)=>n+t.lessons.length,0),18);for(const t of topics)for(let l=0;l<3;l++)for(let seed=1;seed<=150;seed++)for(let i=0;i<3;i++){let q=question(t.id,l,seed,i);assert.ok(q.zh&&q.en&&q.why&&q.hint);assert.ok(Number.isFinite(Number(q.answer)),t.id);assert.ok(correct(q.answer,q.answer));assert.ok(!correct(Number(q.answer)+1,q.answer));let ch=question(t.id,l,seed,i,true);assert.ok(Number.isFinite(Number(ch.answer)))}});test('fractions are accepted and invalid inputs rejected',()=>{assert.ok(correct('2/3','0.667'));assert.ok(correct('4/6','0.667'));assert.ok(correct('0.5','0.5'));for(let s of ['',' ','abc','1/0','2abc','Infinity','1+1'])assert.ok(Number.isNaN(parseAnswer(s)),s)});test('number conservation and nonnegative make-ten remainder',()=>{for(let l=0;l<3;l++)for(let s=0;s<100;s++){let p=parameters('number',l,s);let moved=10-p.a;assert.ok(moved<=p.b);assert.equal(p.a+p.b,10+p.b-moved)}});test('cube counts match independent column and volume calculations',()=>{for(let l=0;l<3;l++)for(let s=0;s<100;s++){let p=parameters('space',l,s),cs=cubes(p,l);assert.equal(cs.length,l===2?p.w*p.d*p.h:p.heights.slice(0,p.w*p.d).reduce((a,b)=>a+b,0));assert.equal(new Set(cs.map(c=>c.join(','))).size,cs.length);assert.equal(new Set(cs.map(c=>c[0]+','+c[2])).size,p.w*p.d)}});
test('new number problems vary the first ones digit and preserve make-ten bounds',async()=>{
  const {nextProblemSeed}=await import('../dist/content.js');
  for(let level=0;level<3;level++){
    let seed=481;const seen=new Set();
    for(let i=0;i<100;i++){
      const next=nextProblemSeed('number',level,seed);
      const before=parameters('number',level,seed),after=parameters('number',level,next);
      assert.notEqual(after.a,before.a);
      assert.ok(after.a+after.b>=10);
      assert.equal(question('number',level,next).answer,String(Number(((after.tens+after.a+after.b)*after.unit).toFixed(3))));
      seen.add(after.a);seed=next;
    }
    assert.equal(seen.size,4);
  }
});
