import { api } from "@/lib/http";

export async function fetchCalls({ offset = 0, limit = 10 } = {}) {
  const params = { offset, limit };
  const { data } = await api.get(`/calls`);
  return data;
}

export async function fetchCallById(id) {
  const { data } = await api.get(`/calls/${id}`);
  return data;
}

export async function archiveCall(id, archived) {
  // API toggles archive state on each call
  const { data } = await api.put(`/calls/${id}/archive`);
  return data;
}

export async function addNote(activityId, content) {
  const { data } = await api.post(`/calls/${activityId}/note`, { content });
  return data;
}

// Placeholders to keep imports compiling when switching off mock realtime
export function onCallsUpdated() {
  return () => {};
}
export function startMockRealtime() {
  return () => {};
}
