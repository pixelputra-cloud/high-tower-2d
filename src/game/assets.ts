const url = (path: string) =>
  `${import.meta.env.BASE_URL}assets/${path.split('/').map(encodeURIComponent).join('/')}`;

export const ASSETS = {
  splashBg: url('splash/Splash screen BG.png'),
  title: url('splash/Game title.png'),
  startButton: url('splash/Start game_button.png'),
  bgPlain: url('game/bg/BG_Plain.png'),
  bgBush: url('game/bg/BG_Bush.png'),
  bgBuilding: url('game/bg/Building_BG_03.png'),
  mgBuilding: url('game/bg/Building_MG_02.png'),
  fgBuilding: url('game/bg/Building_FG_01.png'),
  cloud1: url('game/bg/Cloud_01.png'),
  cloud2: url('game/bg/Cloud_02.png'),
  blockLeft: url('game/Question Block Left.png'),
  blockRight: url('game/Question Block Right.png'),
  answerBlock: url('game/Answer Block.png'),
  symbolBlock: url('game/User_Input Button_Main.png'),
  uiPanel: url('game/UI Panel.png'),
  scorePanel: url('game/Score panel.png'),
  rightCard: url('game/Right Score card.png'),
  wrongCard: url('game/Wrong Score card.png'),
  topFloor: url('game/Top Floor.png'),
  stack: [url('game/Stack 01.png'), url('game/Stack 02.png')] as const,
};
