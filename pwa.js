const installButton = document.querySelector('#installApp');
const installDialog = document.querySelector('#installDialog');
const installTitle = document.querySelector('#installTitle');
const installBody = document.querySelector('#installBody');
const closeInstall = document.querySelector('#closeInstall');
const isAppleTouch = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
let installPrompt;

function copy() {
  installButton.textContent = 'Install on iPad';
  installTitle.textContent = 'Put Math Lab on the Home Screen';
  closeInstall.setAttribute('aria-label', 'Close');
  installBody.innerHTML = `<p class="install-lead">Open this page in <strong>Safari</strong>. It takes about 20 seconds.</p>
       <ol class="install-steps"><li><span class="step-icon">1</span><div>Tap Safari’s <strong>Share</strong> button <span class="share-symbol" aria-label="Share">↥</span>.</div></li><li><span class="step-icon">2</span><div>Scroll and choose <strong>Add to Home Screen</strong>.</div></li><li><span class="step-icon">3</span><div>Tap <strong>Add</strong>. Open the Math Lab icon like any other app.</div></li></ol>
       <p class="install-note">After the first online visit, the core activities can open without internet. Learning records stay on this iPad.</p>`;
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
copy();
