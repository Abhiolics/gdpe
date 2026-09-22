/**
 * GDPe — Interactive Landing Page Application
 * Lightweight, vanilla JavaScript for micro-interactions & simulations.
 */

document.addEventListener('DOMContentLoaded', () => {
  initClock();
  initMobileMenu();
  initHeaderScroll();
  initInteractiveWallet();
  initWithdrawalModal();
  initReferralCopy();
  initCategoryPills();
  initLiveToasts();
  initCounterAnimation();
});

/* --------------------------------------------------------------------------
   1. Device Clock
   -------------------------------------------------------------------------- */
function initClock() {
  const clockEl = document.getElementById('deviceClock');
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    clockEl.textContent = `${hours}:${minutes}`;
  }

  updateClock();
  setInterval(updateClock, 30000);
}

/* --------------------------------------------------------------------------
   2. Sticky Header Scroll Effect
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById('main-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   3. Mobile Navigation Menu Drawer
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileToggle');
  const drawer = document.getElementById('mobileDrawer');
  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
    drawer.classList.toggle('active');
    drawer.setAttribute('aria-hidden', String(isExpanded));
  });

  // Close drawer when link clicked
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
    });
  });
}

/* --------------------------------------------------------------------------
   4. Interactive Wallet & Task Simulator
   -------------------------------------------------------------------------- */
function initInteractiveWallet() {
  const balanceDisplay = document.getElementById('interactiveBalance');
  const taskItems = document.querySelectorAll('.task-card-item');
  const taskPillCount = document.getElementById('taskPillCount');
  const growthTag = document.getElementById('balanceGrowth');

  let currentBalance = 2840.00;
  let remainingTasks = taskItems.length;

  taskItems.forEach(item => {
    const actionBtn = item.querySelector('.btn-task-action');
    const reward = parseFloat(item.getAttribute('data-reward')) || 0;

    actionBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (item.classList.contains('completed')) return;

      // Mark completed
      item.classList.add('completed');
      actionBtn.textContent = 'Earned ✓';

      // Increment balance
      const prevBalance = currentBalance;
      currentBalance += reward;
      animateBalanceChange(prevBalance, currentBalance, balanceDisplay);

      // Pulse growth tag
      if (growthTag) {
        growthTag.style.transform = 'scale(1.15)';
        setTimeout(() => {
          growthTag.style.transform = 'scale(1)';
        }, 300);
      }

      // Update remaining count
      remainingTasks = Math.max(0, remainingTasks - 1);
      if (taskPillCount) {
        taskPillCount.textContent = remainingTasks > 0 ? `${remainingTasks} Ready` : 'All Done! 🎉';
      }
    });
  });
}

function animateBalanceChange(startVal, endVal, element) {
  const duration = 600;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const val = startVal + (endVal - startVal) * easeProgress;

    element.textContent = val.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* --------------------------------------------------------------------------
   5. Interactive Simulated UPI Withdrawal Modal
   -------------------------------------------------------------------------- */
function initWithdrawalModal() {
  const modal = document.getElementById('payoutModal');
  const simWithdrawBtn = document.getElementById('simWithdrawBtn');
  const simEarnBtn = document.getElementById('simEarnBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalDoneBtn = document.getElementById('modalDoneBtn');
  const modalStepProcessing = document.getElementById('modalStepProcessing');
  const modalStepSuccess = document.getElementById('modalStepSuccess');
  const progressBar = document.getElementById('modalProgressBar');
  const settleCount = document.getElementById('settleCount');

  if (!modal || !simWithdrawBtn) return;

  function openModal() {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');

    // Reset state
    modalStepProcessing.classList.remove('hidden');
    modalStepSuccess.classList.add('hidden');
    progressBar.style.width = '0%';
    settleCount.textContent = '7.2s';

    // Simulate 7.2s settlement in accelerated UI mode (2.2s real time)
    setTimeout(() => {
      progressBar.style.width = '100%';
    }, 100);

    let countdown = 7.2;
    const interval = setInterval(() => {
      countdown = Math.max(0, countdown - 1.2);
      settleCount.textContent = `${countdown.toFixed(1)}s`;
      if (countdown <= 0) {
        clearInterval(interval);
        setTimeout(() => {
          modalStepProcessing.classList.add('hidden');
          modalStepSuccess.classList.remove('hidden');
        }, 200);
      }
    }, 350);
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }

  simWithdrawBtn.addEventListener('click', openModal);

  if (simEarnBtn) {
    simEarnBtn.addEventListener('click', () => {
      const taskList = document.getElementById('heroTaskList');
      if (taskList) {
        taskList.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (modalDoneBtn) modalDoneBtn.addEventListener('click', closeModal);

  // Close on outside overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   6. Referral Code One-Click Copy
   -------------------------------------------------------------------------- */
function initReferralCopy() {
  const copyBtn = document.getElementById('copyCodeBtn');
  const codeTextEl = document.getElementById('referralCodeText');
  const copyToast = document.getElementById('copyToast');
  const copyBtnText = document.getElementById('copyBtnText');

  if (!copyBtn || !codeTextEl) return;

  copyBtn.addEventListener('click', async () => {
    const code = codeTextEl.textContent.trim();

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        // Fallback for older contexts
        const textarea = document.createElement('textarea');
        textarea.value = code;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      // Success feedback
      copyBtnText.textContent = 'Copied! ✓';
      copyBtn.style.background = '#059669';
      if (copyToast) copyToast.classList.add('show');

      setTimeout(() => {
        copyBtnText.textContent = 'Copy';
        copyBtn.style.background = '';
        if (copyToast) copyToast.classList.remove('show');
      }, 2500);

    } catch (err) {
      console.warn('Copy failed:', err);
    }
  });
}

/* --------------------------------------------------------------------------
   7. Interactive Category Pills in "Easy Tasks"
   -------------------------------------------------------------------------- */
function initCategoryPills() {
  const pills = document.querySelectorAll('.cat-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });
}

/* --------------------------------------------------------------------------
   8. Live Withdrawal Periodic Corner Toast Notification
   -------------------------------------------------------------------------- */
function initLiveToasts() {
  const toast = document.getElementById('liveToast');
  const toastUser = document.getElementById('toastUser');
  const toastMoney = document.getElementById('toastMoney');
  const toastInitial = document.getElementById('toastInitial');
  const toastTime = document.getElementById('toastTime');
  const toastCloseBtn = document.getElementById('toastCloseBtn');

  if (!toast) return;

  const mockPayouts = [
    { name: 'Rahul S.', amount: '₹350', time: '3s ago' },
    { name: 'Priya M.', amount: '₹520', time: '7s ago' },
    { name: 'Aakash V.', amount: '₹150', time: '12s ago' },
    { name: 'Sneha K.', amount: '₹815', time: '18s ago' },
    { name: 'Devendra R.', amount: '₹480', time: '24s ago' },
    { name: 'Kavita J.', amount: '₹1,200', time: '30s ago' },
    { name: 'Mohit B.', amount: '₹230', time: '42s ago' }
  ];

  let currentIndex = 0;
  let toastTimer = null;

  function showToast() {
    const item = mockPayouts[currentIndex];
    toastUser.textContent = item.name;
    toastMoney.textContent = item.amount;
    toastInitial.textContent = item.name.charAt(0);
    toastTime.textContent = item.time;

    toast.classList.add('active');

    // Hide after 4 seconds
    setTimeout(() => {
      toast.classList.remove('active');
    }, 4200);

    currentIndex = (currentIndex + 1) % mockPayouts.length;
  }

  // Initial trigger after 3.5s
  setTimeout(() => {
    showToast();
    toastTimer = setInterval(showToast, 9500);
  }, 3500);

  if (toastCloseBtn) {
    toastCloseBtn.addEventListener('click', () => {
      toast.classList.remove('active');
      if (toastTimer) clearInterval(toastTimer);
    });
  }
}

/* --------------------------------------------------------------------------
   9. Live Counter Animation (Hero Badge)
   -------------------------------------------------------------------------- */
function initCounterAnimation() {
  const counterEl = document.getElementById('heroCounter');
  if (!counterEl) return;

  let current = 12840;

  // Slowly increment throughout the session to make it feel genuinely live
  setInterval(() => {
    current += Math.floor(Math.random() * 3) + 1;
    counterEl.textContent = current.toLocaleString('en-IN');
  }, 6000);
}
