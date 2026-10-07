import { useEffect, useReducer, useRef } from 'react';
import { GameScreen } from './components/GameScreen';
import { ResultsOverlay } from './components/ResultsOverlay';
import { ReviewScreen } from './components/ReviewScreen';
import { SplashScreen } from './components/SplashScreen';
import { Stage } from './components/Stage';
import { BEST_SCORE_KEY } from './game/constants';
import { createInitialState, gameReducer, points } from './game/gameMachine';
import { newSeed } from './game/rng';

function loadBestScore(): number {
  try {
    const n = Number(localStorage.getItem(BEST_SCORE_KEY));
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

function saveBestScore(score: number) {
  try {
    localStorage.setItem(BEST_SCORE_KEY, String(score));
  } catch {
    // Storage unavailable (private mode etc.) — best score just won't persist.
  }
}

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => createInitialState(loadBestScore(), newSeed()));
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.phase === 'results' && state.isNewBest) saveBestScore(state.bestScore);
  }, [state.phase, state.isNewBest, state.bestScore]);

  // Dev-only handle for poking at game state from the console.
  useEffect(() => {
    if (import.meta.env.DEV) (window as unknown as { __ht: unknown }).__ht = { state, dispatch };
  });

  const start = () => dispatch({ type: 'START_GAME', seed: newSeed() });

  return (
    <Stage ref={stageRef}>
      {state.phase === 'splash' ? (
        <SplashScreen onStart={start} />
      ) : (
        <>
          {/* Keyed by session so Play Again remounts the playfield with no leftover animation state. */}
          <GameScreen key={state.session} state={state} dispatch={dispatch} stageRef={stageRef} />
          {state.phase === 'results' && (
            <ResultsOverlay
              points={points(state)}
              floors={state.floors.length}
              correct={state.correctCount}
              wrong={state.wrongCount}
              bestScore={state.bestScore}
              isNewBest={state.isNewBest}
              onReview={() => dispatch({ type: 'SHOW_REVIEW' })}
              onPlayAgain={start}
              onHome={() => dispatch({ type: 'GO_HOME' })}
            />
          )}
          {state.phase === 'review' && (
            <ReviewScreen attempts={state.attempts} onBack={() => dispatch({ type: 'HIDE_REVIEW' })} />
          )}
        </>
      )}
    </Stage>
  );
}
