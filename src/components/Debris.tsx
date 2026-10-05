import { motion } from 'framer-motion';
import { FLOOR_H, STAGE_H, TOWER_W, TOWER_X } from '../game/constants';

const COLORS = ['#c026f0', '#e07bff', '#1fe9a3', '#7a0aa0', '#ffd600'];
// Fixed fan of particles: [dx, dy, size, rotation]
const PARTICLES: [number, number, number, number][] = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2 + (i % 3) * 0.2;
  const dist = 90 + (i % 4) * 30;
  return [Math.cos(angle) * dist * 1.4, Math.sin(angle) * dist - 40, 10 + (i % 3) * 6, (i % 2 ? 1 : -1) * 220];
});

/**
 * Debris burst where the bottom floor was destroyed. When the camera is locked that
 * floor is below the stage, so the burst is clamped to stay visible at the bottom edge.
 */
export function Debris({ floorTopY }: { floorTopY: number }) {
  const cy = Math.min(floorTopY + FLOOR_H / 2, STAGE_H - 40);
  const cx = TOWER_X + TOWER_W / 2;
  return (
    <div style={{ position: 'absolute', left: cx, top: cy, pointerEvents: 'none', zIndex: 3 }}>
      <motion.div
        initial={{ scale: 0.2, opacity: 0.9 }}
        animate={{ scale: 1.6, opacity: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          left: -80,
          top: -80,
          width: 160,
          height: 160,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #fff7b0 0%, #ffb300 45%, rgba(255,87,34,0) 70%)',
        }}
      />
      {PARTICLES.map(([dx, dy, size, rot], i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: dx, y: [0, dy, dy + 120], opacity: [1, 1, 0], rotate: rot }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            left: -size / 2,
            top: -size / 2,
            width: size,
            height: size,
            background: COLORS[i % COLORS.length],
            border: '2px solid rgba(0,0,0,0.5)',
            borderRadius: 3,
          }}
        />
      ))}
    </div>
  );
}
