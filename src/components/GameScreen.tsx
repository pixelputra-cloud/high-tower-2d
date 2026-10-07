import { motion, useAnimationControls } from 'framer-motion';
import { useCallback, useEffect, type Dispatch, type RefObject } from 'react';
import {
  ANSWER_SLOT,
  CORRECT_RESOLVE_MS,
  DROP_TOLERANCE,
  EXPLODE_MS,
  SETTLE_MS,
  WRONG_RESOLVE_MS,
} from '../game/constants';
import { points, type GameAction } from '../game/gameMachine';
import { inRect } from '../game/layout';
import type { GameState, Symbol } from '../game/types';
import { useCountdown } from '../hooks/useCountdown';
import { usePointerDrag } from '../hooks/usePointerDrag';
import { AnswerPanel } from './AnswerPanel';
import { Background } from './Background';
import { Debris } from './Debris';
import { DragLayer } from './DragLayer';
import { QuestionRow } from './QuestionRow';
import { ScorePanel } from './ScorePanel';
import { StreakBanner } from './StreakBanner';
import { Timer } from './Timer';
import { Tower } from './Tower';

interface Props {
  state: GameState;
  dispatch: Dispatch<GameAction>;
  stageRef: RefObject<HTMLDivElement | null>;
}

const RUNNING: GameState['phase'][] = ['playing', 'dragging', 'resolving'];

export function GameScreen({ state, dispatch, stageRef }: Props) {
  const { phase, resolution } = state;
  const running = RUNNING.includes(phase);
  const shake = useAnimationControls();

  // §7.1 — the clock runs through resolution animations too.
  const onTick = useCallback((dt: number) => dispatch({ type: 'TICK', dt }), [dispatch]);
  useCountdown(running, onTick);

  // §7.3 — drag-and-drop is the only input.
  const { drag, startDrag } = usePointerDrag({
    stageRef,
    active: phase === 'dragging',
    onStart: useCallback(() => dispatch({ type: 'DRAG_START' }), [dispatch]),
    onRelease: useCallback(
      (symbol: Symbol, x: number, y: number) => {
        if (!inRect(ANSWER_SLOT, x, y, DROP_TOLERANCE)) return false;
        dispatch({ type: 'DROP', symbol });
        return true;
      },
      [dispatch],
    ),
    onCancel: useCallback(() => dispatch({ type: 'DRAG_CANCEL' }), [dispatch]),
  });

  // §7.4 — after the resolution beat, move on to the next question.
  useEffect(() => {
    if (phase !== 'resolving' || !resolution) return;
    const ms = resolution.kind === 'correct' ? CORRECT_RESOLVE_MS : WRONG_RESOLVE_MS;
    const t = window.setTimeout(() => dispatch({ type: 'NEXT_QUESTION' }), ms);
    return () => window.clearTimeout(t);
  }, [phase, resolution, dispatch]);

  // 4px screen-shake when the tower lands after losing its bottom floor.
  useEffect(() => {
    if (resolution?.kind !== 'wrong') return;
    const t = window.setTimeout(
      () => shake.start({ y: [0, 4, -4, 3, -2, 0], transition: { duration: 0.25 } }),
      EXPLODE_MS + SETTLE_MS,
    );
    return () => window.clearTimeout(t);
  }, [resolution, shake]);

  return (
    <div className={`layer${drag ? ' dragging-cursor' : ''}`}>
      <Background floorCount={state.floors.length} />
      <motion.div className="layer" animate={shake}>
        <Tower floors={state.floors} cameraOffsetY={state.cameraOffsetY} resolution={resolution} />
        {resolution?.kind === 'wrong' && resolution.destroyedFloorScreenY !== null && (
          <Debris key={resolution.id} floorTopY={resolution.destroyedFloorScreenY} />
        )}
        <QuestionRow
          question={state.currentQuestion}
          droppedSymbol={state.droppedSymbol}
          dragging={phase === 'dragging'}
          resolution={resolution}
        />
        <AnswerPanel onGrab={startDrag} enabled={phase === 'playing'} />
        <ScorePanel points={points(state)} attempts={state.attempts} />
        <Timer timeRemaining={state.timeRemaining} running={running} />
      </motion.div>
      <StreakBanner message={state.activeStreakMessage} id={state.streakMessageId} />
      <DragLayer drag={drag} />
    </div>
  );
}
