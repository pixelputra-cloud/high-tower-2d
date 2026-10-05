import { forwardRef, type ReactNode } from 'react';
import { useStageScale } from '../hooks/useStageScale';

/** Fixed 800×600 stage, scaled (never re-flowed) to fit the window and letterboxed. */
export const Stage = forwardRef<HTMLDivElement, { children: ReactNode }>(function Stage({ children }, ref) {
  const k = useStageScale();
  return (
    <div className="viewport">
      <div ref={ref} className="stage" style={{ transform: `scale(${k})` }}>
        {children}
      </div>
    </div>
  );
});
