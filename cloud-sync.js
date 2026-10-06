import{TRACKED_KEYS,inferTimestamp,mergeItems}from'./sync-model.js';

const firebaseConfig={apiKey:'AIzaSyCyCVjwLxanaRy17ueRxi8X3gGd1JqoJLo',authDomain:'little-steam-lab-family-sync.firebaseapp.com',projectId:'little-steam-lab-family-sync',storageBucket:'little-steam-lab-family-sync.firebasestorage.app',messagingSenderId:'547576570653',appId:'1:547576570653:web:f27294ca5e04c6899ab7f4'};
const META_KEY='mathlab-cloud-meta-v1';
const nativeSet=Storage.prototype.setItem;
let user=null,auth=null,db=null,unsubscribe=null,trackingReady=false,suppress=false,pushTimer=null;
let GoogleAuthProvider,signInWithPopup,signOut,doc,getDoc,setDoc,onSnapshot,serverTimestamp;

function readMeta(){try{return JSON.parse(localStorage.getItem(META_KEY))||{}}catch{return{}}}
function writeMeta(meta){nativeSet.call(localStorage,META_KEY,JSON.stringify(meta))}
function localItems(){
  const meta=readMeta(),items={};
  for(const key of TRACKED_KEYS){
    const value=localStorage.getItem(key);if(value===null)continue;
    const updatedAt=Number(meta[key]||inferTimestamp(key,value));
    if(updatedAt>0)items[key]={value,updatedAt};
  }
  return items;
}
function setStatus(text,tone=''){document.querySelectorAll('[data-sync-status]').forEach(el=>{el.textContent=text;el.dataset.tone=tone})}
function controls(){
  const host=document.querySelector('.top-actions,.header-tools,header');if(!host)return;
  if(!document.querySelector('[data-cloud-account]')){
    const wrap=document.createElement('div');wrap.className='cloud-controls';
    wrap.innerHTML='<button class="outline cloud-account" type="button" data-cloud-account>Parent sign in</button><span class="sync-status" data-sync-status>This device only</span>';
    host.append(wrap);
  }
  const button=document.querySelector('[data-cloud-account]');
  button.textContent=user?`${(user.displayName||'Parent').split(' ')[0]} · Sign out`:'Parent sign in';
  button.onclick=async()=>{
    try{
      await sdkReady;
      if(!auth)throw new Error('auth-unavailable');
      if(user)await signOut(auth);else await signInWithPopup(auth,new GoogleAuthProvider());
    }catch(error){setStatus(error?.code==='auth/popup-closed-by-user'?'Sign-in canceled':navigator.onLine?'Could not sign in':'Offline · saved here',navigator.onLine?'error':'offline')}
  };
}
function applyRemote(items,keys){
  if(!keys.length)return false;const meta=readMeta();suppress=true;
  for(const key of keys){const item=items[key];if(!item)continue;nativeSet.call(localStorage,key,item.value);meta[key]=Number(item.updatedAt||0)}
  writeMeta(meta);suppress=false;return true;
}
async function push(){
  if(!user||!db)return;clearTimeout(pushTimer);
  setStatus(navigator.onLine?'Syncing…':'Offline · saved here',navigator.onLine?'':'offline');if(!navigator.onLine)return;
  try{await setDoc(doc(db,'families',user.uid,'state','progress'),{schema:1,items:localItems(),serverUpdatedAt:serverTimestamp()});setStatus('Cloud synced','ok')}
  catch{setStatus('Offline · will sync','offline')}
}
function queuePush(){clearTimeout(pushTimer);pushTimer=setTimeout(push,700)}
async function reconcile(){
  const ref=doc(db,'families',user.uid,'state','progress');setStatus('Syncing…');
  try{
    const snap=await getDoc(ref),remote=snap.exists()?(snap.data().items||{}):{},local=localItems(),result=mergeItems(local,remote);
    const changed=applyRemote(result.merged,result.download);
    if(!snap.exists()||result.upload.length)await setDoc(ref,{schema:1,items:result.merged,serverUpdatedAt:serverTimestamp()});
    setStatus('Cloud synced','ok');
    if(changed)window.dispatchEvent(new CustomEvent('mathlab-cloud-updated'));
    unsubscribe=onSnapshot(ref,next=>{
      if(!next.exists())return;
      const current=localItems(),incoming=next.data().items||{},merged=mergeItems(current,incoming);
      if(applyRemote(merged.merged,merged.download))window.dispatchEvent(new CustomEvent('mathlab-cloud-updated'));
      if(merged.upload.length)queuePush();
    });
  }catch{setStatus('Offline · will sync','offline')}
  trackingReady=true;
}

Storage.prototype.setItem=function(key,value){
  nativeSet.call(this,key,value);
  if(this!==localStorage||suppress||!trackingReady||!TRACKED_KEYS.includes(key))return;
  const meta=readMeta();meta[key]=Date.now();writeMeta(meta);queuePush();
};
window.addEventListener('online',()=>user?push():setStatus('This device only'));
window.addEventListener('offline',()=>setStatus('Offline · saved here','offline'));
window.addEventListener('mathlab-cloud-updated',()=>setTimeout(()=>location.reload(),80),{once:true});

controls();
const sdkReady=(async()=>{
  try{
    const[appModule,authModule,firestoreModule]=await Promise.all([
      import('https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js'),
      import('https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js')
    ]);
    ({GoogleAuthProvider,signInWithPopup,signOut}=authModule);
    ({doc,getDoc,setDoc,onSnapshot,serverTimestamp}=firestoreModule);
    const app=appModule.initializeApp(firebaseConfig);
    auth=authModule.getAuth(app);db=firestoreModule.getFirestore(app);
    authModule.onAuthStateChanged(auth,async current=>{
      if(unsubscribe){unsubscribe();unsubscribe=null}user=current;controls();
      if(user)await reconcile();else{trackingReady=true;setStatus('This device only')}
    });
  }catch{trackingReady=true;setStatus(navigator.onLine?'Sync unavailable':'Offline · saved here',navigator.onLine?'error':'offline')}
})();
