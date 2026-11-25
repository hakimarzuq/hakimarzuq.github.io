(() => {
  const canvas = document.getElementById("cosmic-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const stars = Array.from({ length: 75 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.4 + 0.4,
    alpha: Math.random() * 0.55 + 0.2,
    speed: Math.random() * 0.008 + 0.003,
    phase: Math.random() * Math.PI * 2,
  }));

  // Lightweight 3D wireframe octahedron orbiting in the hero sky
  const vertices = [
    [0, 1, 0],
    [1, 0, 0],
    [0, 0, 1],
    [-1, 0, 0],
    [0, 0, -1],
    [0, -1, 0],
  ];
  const edges = [
    [0, 1], [0, 2], [0, 3], [0, 4],
    [5, 1], [5, 2], [5, 3], [5, 4],
    [1, 2], [2, 3], [3, 4], [4, 1],
  ];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", (e) => {
    targetX = (e.clientX / Math.max(width, 1) - 0.5) * 2;
    targetY = (e.clientY / Math.max(height, 1) - 0.5) * 2;
  });

  resize();

  let t = 0;
  function frame() {
    t += 0.014;
    mouseX += (targetX - mouseX) * 0.04;
    mouseY += (targetY - mouseY) * 0.04;

    ctx.clearRect(0, 0, width, height);

    // Subtle twinkling stars
    for (const s of stars) {
      const tw = s.alpha + Math.sin(t * 1.8 + s.phase) * 0.18;
      const px = s.x * width - mouseX * s.r * 6;
      const py = s.y * height - mouseY * s.r * 6;
      ctx.fillStyle = `rgba(214, 224, 255, ${Math.max(0.08, Math.min(0.85, tw))})`;
      ctx.beginPath();
      ctx.arc(px, py, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Floating 3D geometric crystal accent on the right of hero
    if (window.scrollY < height * 0.8) {
      const cx = width * 0.84 - mouseX * 14;
      const cy = Math.min(260, height * 0.28) - mouseY * 10 + Math.sin(t) * 6;
      const scale = Math.min(28, width * 0.032);
      const rotY = t * 0.55 + mouseX * 0.4;
      const rotX = 0.45 + mouseY * 0.25;

      const projected = vertices.map(([vx, vy, vz]) => {
        const x1 = vx * Math.cos(rotY) - vz * Math.sin(rotY);
        const z1 = vx * Math.sin(rotY) + vz * Math.cos(rotY);
        const y2 = vy * Math.cos(rotX) - z1 * Math.sin(rotX);
        const z2 = vy * Math.sin(rotX) + z1 * Math.cos(rotX);
        const persp = 3.2 / (3.2 - z2);
        return [cx + x1 * scale * persp, cy + y2 * scale * persp];
      });

      ctx.strokeStyle = "rgba(165, 180, 252, 0.28)";
      ctx.lineWidth = 1.15;
      ctx.beginPath();
      for (const [a, b] of edges) {
        ctx.moveTo(projected[a][0], projected[a][1]);
        ctx.lineTo(projected[b][0], projected[b][1]);
      }
      ctx.stroke();
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();
