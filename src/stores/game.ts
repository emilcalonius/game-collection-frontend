import { defineStore } from "pinia";
import type { Game } from "../models/game";

export const useGameStore = defineStore("game", {
  state: () => {
    return { game: {} as Game}
  }
})