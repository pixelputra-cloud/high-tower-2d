import { motion } from 'framer-motion';
import { ASSETS } from '../game/assets';
import { CREDIT_LINE, STAGE_H, STAGE_W, START_BUTTON_RECT, TITLE_RECT } from '../game/constants';
import { rectStyle } from '../game/layout';

export function SplashScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="layer">
      {/* Pinned to the stage rather than sized by the file, so swapping the art in at a
          slightly different height can't leave a gap or overhang at the bottom. */}
      <img
        src={ASSETS.splashBg}
        alt=""
        draggable={false}
        style={{ position: 'absolute', left: 0, top: 0, width: STAGE_W, height: STAGE_H }}
      />
      <img src={ASSETS.title} alt="High Tower" draggable={false} style={rectStyle(TITLE_RECT)} />
      <motion.button
        aria-label="Start Game"
        onClick={onStart}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="img-fill"
        style={{
          ...rectStyle(START_BUTTON_RECT),
          backgroundImage: `url("${ASSETS.startButton}")`,
          backgroundColor: 'transparent',
          border: 0,
          padding: 0,
          cursor: 'pointer',
        }}
      />
      {CREDIT_LINE && <div className="credit">{CREDIT_LINE}</div>}
    </div>
  );
}
