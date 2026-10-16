
const panel=document.querySelector('.evidence-panel');
const rail=document.querySelector('.mission-rail');
const nav=document.querySelector('#missionNav');
const workspace=document.querySelector('.mission-workspace');
if(panel&&rail&&nav&&workspace){
  document.body.classList.add('kid-focus');
  const actions=document.querySelector('.pilot-topbar .top-actions');
  const learnerLabel=actions?.querySelector('label');
  if(learnerLabel&&learnerLabel.firstChild)learnerLabel.firstChild.textContent='Playing as ';
  const learnerSelect=document.querySelector('#learnerSelect');
  if(learnerSelect){learnerSelect.setAttribute('aria-label','Playing as');[...learnerSelect.options].forEach(o=>o.textContent=(o.value==='a'?'👧 ':'🧒 ')+o.textContent)}
  const toggle=document.createElement('button');
  toggle.className='parent-view-toggle';
  toggle.type='button';
  toggle.setAttribute('aria-expanded','false');
  toggle.textContent='⚙ Parent View';
  actions?.append(toggle);
  const close=document.createElement('button');
  close.className='parent-view-close';
  close.type='button';
  close.setAttribute('aria-label','Close parent view');
  close.textContent='×';
  panel.prepend(close);
  const backdrop=document.createElement('button');
  backdrop.className='parent-view-backdrop';
  backdrop.type='button';
  backdrop.setAttribute('aria-label','Close parent view');
  document.body.append(backdrop);
  const track=document.querySelector('#trackCard');
  const reset=document.querySelector('#resetPath,#resetPilot');
  const family=panel.querySelector('.family-check');
  if(track&&family){const title=document.createElement('h3');title.textContent='Learning level';family.before(title,track)}
  if(reset&&family)family.append(reset);
  const progress=document.createElement('div');
  progress.className='kid-progress';
  workspace.prepend(progress);
  function updateProgress(){
    const steps=[...nav.querySelectorAll('.mission-button')];
    const active=Math.max(0,steps.findIndex(x=>x.classList.contains('active')));
    progress.innerHTML='<strong>Mission '+(active+1)+' of '+steps.length+'</strong><span>'+steps.map((_,i)=>'<i class="'+(i<active?'done ':i===active?'active ':'')+'"></i>').join('')+'</span>';
  }
  new MutationObserver(updateProgress).observe(nav,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  function setParent(open){
    document.body.classList.toggle('parent-view-open',open);
    toggle.setAttribute('aria-expanded',String(open));
    panel.setAttribute('aria-hidden',String(!open));
    panel.inert=!open;
    if(open)close.focus(); else toggle.focus();
  }
  toggle.onclick=()=>setParent(true);
  close.onclick=backdrop.onclick=()=>setParent(false);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('parent-view-open'))setParent(false)});
  setParent(false);
  updateProgress();
}
