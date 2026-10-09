// 主逻辑
(function () {
  document.getElementById('domain-name').textContent = SITE_CONFIG.domain;
  document.getElementById('hero-subtitle').textContent = SITE_CONFIG.subtitle;
  document.getElementById('footer-domain').textContent = SITE_CONFIG.domain;
  document.getElementById('page-title').textContent = SITE_CONFIG.domain;

  // Hero 淡入
  gsap.to('.hero-fade', { opacity: 1, y: 0, duration: 1, stagger: 0.15, delay: 0.3, ease: 'power2.out' });

  // 滚动动画
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray('.story-item').forEach((el, i) => {
    gsap.from(el, {
      opacity: 0, x: -30, duration: 0.8,
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

  initParticles();
  initFireworks();
  initDanmaku();
})();

/* ---------- 粒子背景 ---------- */
function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
  resize();
  addEventListener('resize', resize);
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.2, dy: (Math.random() - 0.5) * 0.2,
      alpha: Math.random() * 0.3 + 0.1,
    });
  }
  (function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  })();
}

/* ---------- 烟花 ---------- */
function initFireworks() {
  const area = document.getElementById('firework-area');
  area.addEventListener('click', (e) => {
    const rect = area.getBoundingClientRect();
    const x = (rect.left + e.clientX - rect.left) / innerWidth;
    const y = (rect.top + e.clientY - rect.top) / innerHeight;
    confetti({
      particleCount: 60, spread: 75, startVelocity: 35,
      origin: { x: (rect.left + e.clientX - rect.left) / innerWidth, y: (rect.top + e.clientY - rect.top) / innerHeight },
      colors: ['#ffffff', '#94a3b8', '#e2e8f0'],
    });
  });
}

/* ---------- 今日运势 ---------- */
const FORTUNES = [
  { level: '大吉', text: '宜写代码，宜摸鱼，宜发朋友圈。' },
  { level: '中吉', text: '平稳的一天，适合把拖延的事做了。' },
  { level: '小吉', text: '会有小惊喜，别错过。' },
  { level: '平', text: '无事发生也是一种好运。' },
  { level: '末吉', text: '宜谨慎，忌冲动消费。' },
];
function drawFortune() {
  const today = new Date().toDateString();
  const key = 'fortune_' + today;
  const btn = document.getElementById('fortune-btn');
  const result = document.getElementById('fortune-result');
  let saved = null;
  try { saved = localStorage.getItem(key); } catch (e) {}
  let f;
  if (saved) {
    f = JSON.parse(saved);
  } else {
    f = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
    try { localStorage.setItem(key, JSON.stringify(f)); } catch (e) {}
  }
  document.getElementById('fortune-level').textContent = f.level;
  document.getElementById('fortune-text').textContent = f.text;
  result.classList.remove('hidden');
  gsap.from(result, { opacity: 0, y: 20, duration: 0.6 });
  btn.textContent = '今日已抽';
  btn.disabled = true;
  btn.classList.add('opacity-40');
  if (f.level === '大吉') {
    confetti({ particleCount: 100, spread: 100, origin: { y: 0.7 } });
  }
}
// 页面加载时检查今天是否已抽
(function () {
  const today = new Date().toDateString();
  try {
    if (localStorage.getItem('fortune_' + today)) {
      const btn = document.getElementById('fortune-btn');
      if (btn) { btn.textContent = '今日已抽'; btn.disabled = true; btn.classList.add('opacity-40'); }
    }
  } catch (e) {}
})();

/* ---------- 贪吃蛇 ---------- */
let snakeGame = null;
function startSnake() {
  const canvas = document.getElementById('snake');
  const ctx = canvas.getContext('2d');
  const grid = 16, size = canvas.width / grid;
  let snake = [{ x: 8, y: 8 }];
  let dir = { x: 1, y: 0 };
  let food = spawnFood();
  let score = 0, timer = null, alive = true;

  function spawnFood() {
    return { x: Math.floor(Math.random() * grid), y: Math.floor(Math.random() * grid) };
  }
  function update() {
    if (!alive) return;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    if (head.x < 0 || head.x >= grid || head.y < 0 || head.y >= grid ||
        snake.some(s => s.x === head.x && s.y === head.y)) {
      alive = false;
      clearInterval(timer);
      document.getElementById('snake-btn').textContent = '再来一局';
      document.getElementById('snake-btn').disabled = false;
      return;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score += 10;
      document.getElementById('snake-score').textContent = score;
      food = spawnFood();
    } else {
      snake.pop();
    }
    draw();
  }
  function draw() {
    ctx.fillStyle = 'rgba(15,23,42,0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#e2e8f0';
    snake.forEach((s, i) => {
      ctx.globalAlpha = 1 - (i / snake.length) * 0.5;
      ctx.fillRect(s.x * size + 1, s.y * size + 1, size - 2, size - 2);
    });
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.arc(food.x * size + size / 2, food.y * size + size / 2, size / 3, 0, Math.PI * 2);
    ctx.fill();
  }
  document.onkeydown = (e) => {
    const k = e.key.toLowerCase();
    if ((e.key === 'ArrowUp' || k === 'w') && dir.y !== 1) dir = { x: 0, y: -1 };
    else if ((e.key === 'ArrowDown' || k === 's') && dir.y !== -1) dir = { x: 0, y: 1 };
    else if ((e.key === 'ArrowLeft' || k === 'a') && dir.x !== 1) dir = { x: -1, y: 0 };
    else if ((e.key === 'ArrowRight' || k === 'd') && dir.x !== -1) dir = { x: 1, y: 0 };
  };
  document.getElementById('snake-btn').disabled = true;
  document.getElementById('snake-btn').textContent = '游戏中…';
  document.getElementById('snake-score').textContent = '0';
  if (timer) clearInterval(timer);
  draw();
  timer = setInterval(update, 120);
}

/* ---------- 弹幕 ---------- */
function initDanmaku() {
  const input = document.getElementById('danmaku-input');
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendDanmaku(); });
  // 加载历史弹幕
  try {
    const history = JSON.parse(localStorage.getItem('danmaku') || '[]');
    history.slice(-5).forEach((text, i) => {
      setTimeout(() => showDanmaku(text), i * 1500);
    });
  } catch (e) {}
}
function sendDanmaku() {
  const input = document.getElementById('danmaku-input');
  const text = input.value.trim();
  if (!text) return;
  showDanmaku(text);
  try {
    const history = JSON.parse(localStorage.getItem('danmaku') || '[]');
    history.push(text);
    localStorage.setItem('danmaku', JSON.stringify(history.slice(-20)));
  } catch (e) {}
  input.value = '';
}
function showDanmaku(text) {
  const layer = document.getElementById('danmaku-layer');
  const el = document.createElement('div');
  el.textContent = text;
  el.className = 'absolute whitespace-nowrap text-sm text-slate-300 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-700';
  el.style.top = (Math.random() * 70 + 10) + 'vh';
  el.style.left = '100%';
  layer.appendChild(el);
  const duration = 8000 + Math.random() * 4000;
  el.animate(
    [{ transform: 'translateX(0)' }, { transform: `translateX(-${innerWidth + 400}px)` }],
    { duration, easing: 'linear' }
  ).onfinish = () => el.remove();
}
