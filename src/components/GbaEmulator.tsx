import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    EJS_player: string;
    EJS_core: string;
    EJS_gameName: string;
    EJS_gameUrl: string;
    EJS_pathtodata: string;
    EJS_startOnLoaded: boolean;
    EJS_emulator?: any;
    EJS_onGameStart?: () => void;
  }
}

const DEFAULT_ROM_URL = "/assets/SuperMarioWorld.gba";
const DEFAULT_ROM_NAME = "Super Mario World";

export const GbaEmulator = () => {
  const scriptLoadedRef = useRef(false);
  const startedRef = useRef(false);

  const [romName, setRomName] = useState(DEFAULT_ROM_NAME);
  const [loading, setLoading] = useState(true);
  const [gameReady, setGameReady] = useState(false);
  const startGame = (url: string, name: string) => {
    const gameElement = document.querySelector("#game");

    if (!gameElement || startedRef.current) return;

    startedRef.current = true;

    setRomName(name);
    setLoading(true);

    window.EJS_player = "#game";
    window.EJS_core = "gba";
    window.EJS_gameName = name;
    window.EJS_gameUrl = url;
    window.EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
    window.EJS_startOnLoaded = true;

    window.EJS_onGameStart = () => {
      setLoading(false);
      setGameReady(true);

      setTimeout(() => {
        document.querySelector<HTMLElement>("#game")?.focus();
      }, 300);
    };

    if (!scriptLoadedRef.current) {
      const script = document.createElement("script");
      script.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
      script.async = true;

      document.body.appendChild(script);
      scriptLoadedRef.current = true;
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      startGame(DEFAULT_ROM_URL, DEFAULT_ROM_NAME);
    }, 100);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const handleRomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    alert("Para trocar a ROM, recarregue a página após selecionar outra ROM.");
  };

  return (
    <div className="min-h-screen bg-[#080b12] text-white flex flex-col items-center justify-center md:gap-5 md:p-4 max-md:p-0 max-md:justify-start">
      {" "}
      <div className="flex flex-wrap items-center justify-center gap-3 max-md:w-full max-md:px-3 max-md:pt-3">
        <input
          type="file"
          accept=".gba"
          onChange={handleRomChange}
          className="text-sm text-white/70 file:mr-3 file:rounded-full file:border-0 file:bg-[#6f5cff] file:px-4 file:py-2 file:text-white hover:file:bg-[#5146c9]"
        />

        <button
          onClick={() => window.location.reload()}
          className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/20"
        >
          Sem o jogo demorar para funcionar clique aqui!
        </button>
      </div>
      <div className="w-full max-w-5xl md:rounded-3xl md:border md:border-white/10 md:bg-[#111827] md:p-4 md:shadow-2xl max-md:w-screen max-md:h-[92dvh] max-md:max-w-none max-md:rounded-none max-md:border-0 max-md:bg-black max-md:p-0 max-md:shadow-none">
        {" "}
        <div className="mb-3 flex items-center justify-between text-xs text-white/50 max-md:px-2">
          <span>{romName}</span>
          <span>GBA Emulator</span>
        </div>
        <div className="relative md:aspect-[3/2] overflow-hidden md:rounded-2xl md:border md:border-black bg-black max-md:w-full max-md:h-[92dvh] max-md:rounded-none max-md:border-0">
          {" "}
          <div
            id="game"
            tabIndex={0}
            className={`h-full w-full outline-none transition-opacity duration-300 ${
              gameReady ? "opacity-100" : "opacity-0"
            }`}
          />
          {loading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white" />
              <p className="mt-4 text-sm text-white/70">Carregando jogo...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
