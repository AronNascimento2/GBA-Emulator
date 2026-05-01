// src/types/emulatorjs.d.ts
export {};

declare global {
  interface Window {
    EJS_player: string;
    EJS_core: string;
    EJS_gameUrl: string;
    EJS_pathtodata: string;
    EJS_startOnLoaded: boolean;
  }
}
