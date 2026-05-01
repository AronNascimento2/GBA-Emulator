import { useRef, useState } from "react";

declare global {
  interface Window {
    EJS_player: string;
    EJS_core: string;
    EJS_gameUrl: string;
    EJS_pathtodata: string;
    EJS_startOnLoaded: boolean;
  }
}

export const GbaEmulator = () => {
  const scriptLoadedRef = useRef(false);
  const [romName, setRomName] = useState("");

  const handleRomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const url = URL.createObjectURL(file);

    setRomName(file.name);

    window.EJS_player = "#game";
    window.EJS_core = "gba";
    window.EJS_gameUrl = url;
    window.EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
    window.EJS_startOnLoaded = true;

    if (!scriptLoadedRef.current) {
      const script = document.createElement("script");
      script.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
      document.body.appendChild(script);
      scriptLoadedRef.current = true;
    }
  };

  return (
    <div className="min-h-screen bg-[#080b12] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-5xl rounded-2xl bg-[#111827] p-6">
        <h1 className="mb-4 text-3xl font-bold">GBA Emulator</h1>

        <input
          type="file"
          accept=".gba"
          onChange={handleRomChange}
          className="mb-4"
        />

        {romName && (
          <p className="mb-4 text-sm text-white/60">
            ROM: <strong className="text-white">{romName}</strong>
          </p>
        )}

        <div
          id="game"
          className="h-[520px] w-full overflow-hidden rounded-xl bg-black"
        />
      </div>
    </div>
  );
};
