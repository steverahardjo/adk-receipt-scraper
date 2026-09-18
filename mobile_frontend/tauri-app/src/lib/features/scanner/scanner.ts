import { invoke } from "@tauri-apps/api/core";
import type { QrisData } from "./types";

export async function parseQrisManual(payload: string): Promise<QrisData> {
  return invoke<QrisData>("parse_qris", { payload });
}
