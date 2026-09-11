"use strict";
class PortfolioScene {
  constructor() {
    this.sceneRef = { current: document.getElementById("scene") };
    this.obsRef = { current: document.getElementById("obs") };
    this.runnerRef = { current: document.getElementById("runner") };
    this.leanRef = { current: document.getElementById("lean") };
    this.shadowRef = { current: document.getElementById("shadow") };
    this.puffRef = { current: document.getElementById("puff") };
    this.legARef = { current: document.getElementById("legA") };
    this.legBRef = { current: document.getElementById("legB") };
    this.hairRef = { current: document.getElementById("hair") };
    this.slashRef = { current: document.getElementById("slash") };
    this.sparkRef = { current: document.getElementById("spark") };
    this.swordRef = { current: document.getElementById("sword") };
    this.armRef = { current: document.getElementById("arm") };
    this.bodyRef = { current: document.getElementById("body") };
    this.shinARef = { current: document.getElementById("shinA") };
    this.shinBRef = { current: document.getElementById("shinB") };
    this.streakRef = { current: document.getElementById("streak") };
    this.ringRef = { current: document.getElementById("ring") };
    this.capeRef = { current: document.getElementById("cape") };
    this.strandRef = { current: document.getElementById("strand") };
    this.skirtRef = { current: document.getElementById("skirt") };
    this.armBRef = { current: document.getElementById("armB") };
    this.foreBRef = { current: document.getElementById("foreB") };
    this.headRef = { current: document.getElementById("head") };
    this.footARef = { current: document.getElementById("footA") };
    this.footBRef = { current: document.getElementById("footB") };
    this.hair2Ref = { current: document.getElementById("hair2") };
    this.hair3Ref = { current: document.getElementById("hair3") };
    this.foreRef = { current: document.getElementById("fore") };
  }

  componentDidMount() {
    const SPEED = 132, GAP = 265, G = 1250, V0 = 400;
    const AIR = 2 * V0 / G, RANGE = SPEED * AIR, JUMP_AT = RANGE / 2, SWING_AT = 40;
    const scene = this.sceneRef.current;
    const els = Array.from(this.obsRef.current ? this.obsRef.current.querySelectorAll("[data-ent]") : []);
    const ents = els.map((el, i) => ({
      el, kind: el.dataset.kind, fly: parseFloat(el.dataset.fly) || 0,
      x: Math.min(scene.clientWidth * 0.65, 520) + i * GAP, dead: 0
    }));
    ents.forEach(e => { e.el.style.transform = `translate(${e.x}px, ${-e.fly}px)`; });
    let y = 0, vy = 0, air = false, last = null, cooldown = 0, swing = 0, swingHit = null;
    let kind = "slash", combo = 0, dash = 0;
    const MOVES = {
      slash: { dur: 0.46, from: 126, sweep: -205, armFrom: 26, armSweep: -74, dash: 8 },
      thrust: { dur: 0.4, from: 126, sweep: -62, armFrom: 26, armSweep: -30, dash: 20 },
      spin: { dur: 0.62, from: 126, sweep: -430, armFrom: 26, armSweep: -96, dash: 4 }
    };

    const PERIOD = 0.5;
    let phase = 0;
    const TAU = Math.PI * 2;
    const R = (el, deg, extra) => { if (el) el.style.transform = "rotate(" + deg.toFixed(2) + "deg)" + (extra || ""); };

    const hairChain = (base, amp, lag) => {
      R(this.hairRef.current, base + amp * Math.sin(lag));
      R(this.hair2Ref.current, base * 0.7 + amp * 1.25 * Math.sin(lag - 0.55));
      R(this.hair3Ref.current, base * 0.5 + amp * 1.5 * Math.sin(lag - 1.1));
    };

    const pose = (ph, blend) => {
      const a = ph * TAU, b = a + Math.PI, k = blend;
      const mix = (v, rest) => rest + (v - rest) * k;
      const thigh = (t) => 6 + 44 * Math.sin(t);
      const shin = (t) => 4 + 34 * Math.max(0, Math.sin(t + 1.1)) + 28 * Math.max(0, -Math.sin(t - 0.5));
      const foot = (t) => -6 - 14 * Math.sin(t + 0.9);

      R(this.legARef.current, mix(thigh(a), -10));
      R(this.shinARef.current, mix(shin(a), 14));
      R(this.footARef.current, mix(foot(a), -4));
      R(this.legBRef.current, mix(thigh(b), 14));
      R(this.shinBRef.current, mix(shin(b), 8));
      R(this.footBRef.current, mix(foot(b), -2));

      R(this.armBRef.current, mix(-6 + 34 * Math.sin(a + Math.PI), 18));
      R(this.foreBRef.current, mix(-30 - 26 * Math.sin(a + Math.PI * 0.55), -20));
      R(this.armRef.current, mix(12 + 20 * Math.sin(a), 18));
      R(this.foreRef.current, mix(-18 - 16 * Math.sin(a + 0.4), -22));

      const bd = this.bodyRef.current;
      if (bd) bd.style.transform = "translateY(" + mix(-2 - 2 * Math.cos(2 * a), 0).toFixed(2) + "px) rotate(" + mix(3.5 + 1.4 * Math.sin(2 * a), 2).toFixed(2) + "deg)";
      R(this.headRef.current, mix(-3 - 2 * Math.sin(2 * a + 0.9), 0));
      R(this.skirtRef.current, mix(2 + 6 * Math.sin(a - 0.8), 2), " skewX(" + mix(4 * Math.sin(a - 0.8), 1).toFixed(2) + "deg)");
      hairChain(mix(-16, -12), mix(8, 3), a - 1.0);
    };

    const restart = (el, anim) => {
      if (!el) return;
      el.style.animation = "none";
      void el.offsetWidth;
      el.style.animation = anim;
    };
    const puff = () => restart(this.puffRef.current, "puff 0.42s ease-out forwards");

    const strike = (ent, dx) => {
      ent.dead = 0.001;
      const sp = this.sparkRef.current;
      const fx = kind === "thrust" ? this.streakRef.current : (kind === "spin" ? this.ringRef.current : this.slashRef.current);
      const anim = kind === "thrust" ? "streak 0.3s ease-out forwards" : (kind === "spin" ? "ring 0.5s ease-out forwards" : "slash 0.34s ease-out forwards");
      if (fx) {
        fx.style.left = (this.runnerX + (kind === "thrust" ? 8 : -2)) + "px";
        fx.style.bottom = (24 + y + (kind === "thrust" ? 20 : 2) + ent.fly * 0.4) + "px";
        restart(fx, anim);
      }
      if (sp) {
        sp.style.left = (this.runnerX + dx - 2) + "px";
        sp.style.bottom = (24 + ent.fly + 6) + "px";
        restart(sp, "spark 0.36s ease-out forwards");
      }
    };

    const frame = (t) => {
      this.raf = requestAnimationFrame(frame);
      if (this.paused || document.hidden) { last = null; return; }
      if (last === null) { last = t; return; }
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      const W = scene ? scene.clientWidth : 900;
      const runnerX = W * 0.17 + 24;
      this.runnerX = runnerX;
      const maxX = ents.reduce((m, e) => Math.max(m, e.x), 0);

      let jumpTarget = Infinity, hitTarget = null, hitDx = 0;
      ents.forEach(e => {
        if (e.dead) {
          e.dead += dt;
          const k = Math.min(1, e.dead / 0.7);
          e.x += 170 * dt;
          const lift = Math.sin(k * Math.PI) * 34;
          e.el.style.transform = "translate(" + e.x.toFixed(1) + "px," + (-e.fly - lift).toFixed(1) + "px) rotate(" + (k * 220).toFixed(0) + "deg) scale(" + (1 - 0.5 * k).toFixed(2) + ")";
          e.el.style.opacity = (1 - k).toFixed(2);
          if (k >= 1) {
            e.dead = 0;
            e.x = Math.max(maxX, W) + GAP * 0.9 + Math.random() * 70;
            e.el.style.opacity = "1";
          }
          return;
        }
        e.x -= SPEED * dt;
        if (e.x < -90) e.x = Math.max(maxX, W) + GAP * 0.8;
        e.el.style.transform = "translate(" + e.x.toFixed(1) + "px," + (-e.fly) + "px)";
        const dx = e.x - runnerX;
        if (e.kind === "obstacle") {
          if (dx > 4 && dx < jumpTarget) jumpTarget = dx;
        } else if (dx > -14 && dx < SWING_AT) {
          if (!hitTarget || dx < hitDx) { hitTarget = e; hitDx = dx; }
        }
        // flying foes also need a jump to be reached
        if (e.kind === "enemy" && e.fly > 20 && dx > 4 && dx < jumpTarget) jumpTarget = dx;
      });

      if (!air && cooldown <= 0 && jumpTarget <= JUMP_AT) {
        air = true; vy = V0; puff();
      }
      if (cooldown > 0) cooldown -= dt;

      if (hitTarget && swing <= 0) {
        const reach = y - hitTarget.fly;
        if (reach < 74 && reach > -30 && hitDx < 26) {
          swing = 0.001;
          kind = air ? "spin" : (combo % 2 === 0 ? "slash" : "thrust");
          combo++;
          swingHit = { ent: hitTarget, dx: hitDx };
        }
      }

      if (swing > 0) {
        swing += dt;
        if (swingHit && swing > 0.12) { strike(swingHit.ent, swingHit.dx); swingHit = null; }
        if (swing > MOVES[kind].dur) swing = 0;
      }
      dash = swing > 0 ? Math.sin(Math.min(1, swing / MOVES[kind].dur) * Math.PI) * MOVES[kind].dash : 0;

      if (air) {
        vy -= G * dt;
        y += vy * dt;
        if (y <= 0) { y = 0; vy = 0; air = false; cooldown = 0.26; puff(); }
      }

      const r = this.runnerRef.current, ln = this.leanRef.current, sh = this.shadowRef.current;
      const sw = this.swordRef.current, ar = this.armRef.current;
      const rise = Math.max(-1, Math.min(1, vy / V0));
      if (r) {
        const sy = air ? 1 + 0.1 * rise : 1;
        r.style.transform = "translate(" + dash.toFixed(1) + "px," + (-y).toFixed(1) + "px) scale(" + (2 - sy).toFixed(3) + "," + sy.toFixed(3) + ")";
      }
      if (ln) {
        const atk = swing > 0 ? Math.sin(Math.min(1, swing / MOVES[kind].dur) * Math.PI) * (kind === "thrust" ? 12 : 8) : 0;
        ln.style.transform = "rotate(" + ((air ? -6 * rise : 2.5) + atk).toFixed(1) + "deg)";
      }

      const mv = MOVES[kind];
      const p = swing > 0 ? Math.min(1, swing / mv.dur) : -1;
      const ease = p >= 0 ? Math.sin(Math.min(1, p * 1.15) * Math.PI * (kind === "spin" ? 0.5 : 0.62)) : 0;
      if (sw) sw.style.transform = "rotate(" + (p >= 0 ? (mv.from + mv.sweep * ease).toFixed(0) : 126) + "deg)";
      if (ar && p >= 0) ar.style.transform = "rotate(" + (mv.armFrom + mv.armSweep * Math.sin(Math.min(1, p * 1.2) * Math.PI * 0.7)).toFixed(0) + "deg)";
      if (this.foreRef.current && p >= 0) R(this.foreRef.current, -20 + 46 * Math.sin(Math.min(1, p * 1.1) * Math.PI * 0.8));
      if (sh) {
        const k = Math.max(0.35, 1 - y / 120);
        sh.style.transform = "scale(" + k.toFixed(2) + ")";
        sh.style.opacity = (0.15 + 0.4 * k).toFixed(2);
      }
      if (air) {
        const t = Math.max(0, Math.min(1, (rise + 1) / 2));
        R(this.legARef.current, -42 + 18 * t);
        R(this.shinARef.current, 52 + 18 * (1 - t));
        R(this.footARef.current, -14);
        R(this.legBRef.current, 30 - 44 * (1 - t));
        R(this.shinBRef.current, 22 + 34 * (1 - t));
        R(this.footBRef.current, 8);
        R(this.armBRef.current, -34 + 50 * (1 - t));
        R(this.foreBRef.current, -54 + 24 * t);
        R(this.foreRef.current, -30 + 14 * t);
        const bd = this.bodyRef.current;
        if (bd) bd.style.transform = "translateY(-2px) rotate(" + (2 + 3 * rise).toFixed(2) + "deg)";
        R(this.headRef.current, -4 * rise);
        R(this.skirtRef.current, 8 + 5 * rise, " skewX(" + (5 + 3 * rise).toFixed(1) + "deg)");
        hairChain(-24 - 8 * rise, 3, phase * TAU * 0.5);
      } else {
        phase = (phase + dt / PERIOD) % 1;
        pose(phase, swing > 0 ? 0.45 : 1);
      }
    };
    pose(0.1, 0.35);
    this.raf = requestAnimationFrame(frame);
  }

  componentWillUnmount() { cancelAnimationFrame(this.raf); }

}

const portfolioScene = new PortfolioScene();
const motionButton = document.getElementById("toggle-motion");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
function setMotionPaused(paused) {
  portfolioScene.paused = paused;
  document.documentElement.classList.toggle("motion-paused", paused);
  document.documentElement.classList.toggle("motion-running", !paused);
  motionButton.setAttribute("aria-pressed", String(paused));
  motionButton.textContent = paused ? "Retomar animações" : "Pausar animações";
}
setMotionPaused(reducedMotion.matches);
portfolioScene.componentDidMount();
motionButton.hidden = false;
motionButton.addEventListener("click", () => setMotionPaused(!portfolioScene.paused));
reducedMotion.addEventListener("change", event => setMotionPaused(event.matches));
window.addEventListener("pagehide", () => portfolioScene.componentWillUnmount());
window.addEventListener("pageshow", event => {
  if (event.persisted) portfolioScene.componentDidMount();
});
