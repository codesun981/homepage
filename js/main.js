// 主逻辑
(function () {
  // 1. 填入配置
  document.getElementById('domain-name').textContent = SITE_CONFIG.domain;
  document.getElementById('hero-subtitle').textContent = SITE_CONFIG.subtitle;
  document.getElementById('footer-domain').textContent = SITE_CONFIG.domain;
  document.getElementById('page-title').textContent = SITE_CONFIG.domain + ' 🎉';

  // 2. 开场撒花
  setTimeout(() => {
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
    setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 60, origin: { x: 0 } }), 300);
    setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 60, origin: { x: 1 } }), 450);
  }, 500);

  // 3. Hero 淡入动画
  gsap.to('.hero-fade', { opacity: 1, y: 0, duration: 1, stagger: 0.15, delay: 0.3, ease: 'power2.out' });

  // 4. 滚动触发动画
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray('.project-card').forEach((card, i) => {
    gsap.from(card, {
      opacity: 0, y: 50, duration: 0.8, delay: i * 0.1,
      scrollTrigger: { trigger: card, start: 'top 85%' }
    });
  });

  // 5. 粒子背景
  initParticles();

  // 6. Konami 彩蛋：↑↑↓↓←→←→BA
  initKonami();
})();

function cardFlip(card) {
  const front = card.querySelector('.card-front');
  const back = card.querySelector('.card-back');
  front.classList.toggle('hidden');
  back.classList.toggle('hidden');
  confetti({ particleCount: 20, spread: 50, origin: { y: 0.7 }, scalar: 0.7 });
}

function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const colors = ['#f472b6', '#a78bfa', '#22d3ee', '#fbbf24'];
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.5 + 0.2,
    });
  }

  (function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  })();
}

function initKonami() {
  const code = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let idx = 0;
  document.addEventListener('keydown', (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === code[idx]) {
      idx++;
      if (idx === code.length) {
        idx = 0;
        // 彩蛋爆发！
        const end = Date.now() + 3000;
        (function frame() {
          confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
          confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
          if (Date.now() < end) requestAnimationFrame(frame);
        })();
        setTimeout(() => alert('🎮 彩蛋解锁！你是第 1 个发现的人，快去朋友圈炫耀吧！'), 500);
      }
    } else {
      idx = 0;
    }
  });
}
