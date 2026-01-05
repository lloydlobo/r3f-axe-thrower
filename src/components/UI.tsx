import viteLogo from "/vite.svg"
import "./UI.css"
import { useGame } from "../hooks/useGame.ts"

export const UI = () => {
  const startGame = useGame((state) => state.startGame)
  const balloonsHit = useGame((state) => state.balloonsHit)
  const targetsHit = useGame((state) => state.targetsHit)
  const throws = useGame((state) => state.throws)
  const isFirstGame = useGame((state) => state.isFirstGame)

  return (
    <section className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center">
      <div className="animate-fade-in-down animation-delay-200 pointer-events-auto absolute top-4 left-4 opacity-0 md:top-8 md:left-14">
        <a href="/">
          <img src={viteLogo} alt="Vite logo" className="h-20 w-20 object-contain" />
        </a>
      </div>

      <div className="animation-delay-1500 animate-fade-in-down absolute left-4 flex -translate-x-1/2 -rotate-90 items-center gap-4 opacity-0 md:left-15">
        <div className="h-px w-20 bg-white/60"></div>
        <p className="text-xs text-white/60">Break the curse</p>
      </div>

      <div className="animate-fade-in-up animation-delay-1000 mt-[50vh] flex flex-col items-center gap-2 p-4 opacity-0 md:gap-4">
        {throws === 0 && (
          <>
            <h1 className="bold text-center text-4xl font-extrabold text-white/80 md:text-5xl">Axe Trainer Center</h1>
            <p className="text-sm text-white/70">
              Become an axe master and break the curse. <br />
            </p>
            <button
              onClick={startGame}
              className="pointer-events-auto cursor-pointer rounded-lg bg-white/80 px-4 py-2 font-bold text-black shadow-md transition duration-200 hover:bg-white/100"
            >
              Start
            </button>
          </>
        )}
      </div>

      <div className="absolute top-4 right-4 flex flex-col items-end justify-end gap-4">
        <div className="flex flex-col items-center gap-2 saturate-0">
          <p className="">
            {Array(throws)
              .fill(0)
              .map((_, i) => (
                <span key={i} className="text-6xl text-white">
                  🪓
                </span>
              ))}
          </p>
        </div>
        {!isFirstGame && (
          <>
            <div className="text-right">
              <p className="text-sm font-medium text-white">SCORE</p>
              <p className="text-6xl font-bold text-white">{balloonsHit * 5 + targetsHit * 50}</p>
            </div>
            <p className="text-3xl font-bold text-white">🎈 {balloonsHit}</p>
            <p className="text-3xl font-bold text-white">🎯 {targetsHit}</p>
          </>
        )}
      </div>
    </section>
  )
}
