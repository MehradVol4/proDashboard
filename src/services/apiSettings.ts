import { api } from "./apiClient";

export async function getSettings() {
  return api.get("/settings");
}

// We expect a newSetting object that looks like {setting: newValue}
export async function updateSetting(newSetting) {
  return api.patch("/settings", newSetting);
}
