const installButton = document.querySelector('#installApp');
const installDialog = document.querySelector('#installDialog');
const installTitle = document.querySelector('#installTitle');
const installBody = document.querySelector('#installBody');
const closeInstall = document.querySelector('#closeInstall');
const isAppleTouch = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
let installPrompt;

function isEnglish() {
  const requested = new URLSearchParams(location.search).get('lang');
  if (requested === 'en' || requested === 'zh') return requested === 'en';
  return document.documentElement.lang.toLowerCase().startsWith('en');
}

function copy() {
  const en = isEnglish();
  installButton.textContent = en ? 'Install on iPad' : '安装到 iPad';
  installTitle.textContent = en ? 'Put Math Lab on the Home Screen' : '把数学实验室放到主屏幕';
  closeInstall.setAttribute('aria-label', en ? 'Close' : '关闭');
  installBody.innerHTML = en
    ? `<p class="install-lead">Open this page in <strong>Safari</strong>. It takes about 20 seconds.</p>
       <ol class="install-steps"><li><span class="step-icon">1</span><div>Tap Safari’s <strong>Share</strong> button <span class="share-symbol" aria-label="Share">↥</span>.</div></li><li><span class="step-icon">2</span><div>Scroll and choose <strong>Add to Home Screen</strong>.</div></li><li><span class="step-icon">3</span><div>Tap <strong>Add</strong>. Open the Math Lab icon like any other app.</div></li></ol>
       <p class="install-note">After the first online visit, the core activities can open without internet. Learning records stay on this iPad.</p>`
    : `<p class="install-lead">请用 iPad 的 <strong>Safari</strong> 打开本页，大约 20 秒即可完成。</p>
       <ol class="install-steps"><li><span class="step-icon">1</span><div>点 Safari 的<strong>分享</strong>按钮 <span class="share-symbol" aria-label="分享">↥</span>。</div></li><li><span class="step-icon">2</span><div>向下找到并选择<strong>“添加到主屏幕”</strong>。</div></li><li><span class="step-icon">3</span><div>点<strong>“添加”</strong>。以后像普通 App 一样点图标进入。</div></li></ol>
       <p class="install-note">第一次联网打开后，核心活动可以离线使用。学习记录只保存在这台 iPad。</p>`;
}

function openInstructions() {
  copy();
  installDialog.showModal();
}

if (isStandalone) {
  installButton.hidden = true;
  document.documentElement.classList.add('standalone');
} else {
  installButton.hidden = false;
  installButton.addEventListener('click', async () => {
    if (installPrompt && !isAppleTouch) {
      installPrompt.prompt();
      await installPrompt.userChoice;
      installPrompt = undefined;
      return;
    }
    openInstructions();
  });
}

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  installPrompt = event;
});

window.addEventListener('appinstalled', () => {
  installButton.hidden = true;
  if (installDialog.open) installDialog.close();
});

closeInstall.addEventListener('click', () => installDialog.close());
installDialog.addEventListener('click', event => {
  if (event.target === installDialog) installDialog.close();
});
document.querySelector('#language').addEventListener('click', () => queueMicrotask(copy));
copy();
