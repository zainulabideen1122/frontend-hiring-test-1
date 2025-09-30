import { api } from "@/lib/http";

export async function fetchCalls({ offset = 0, limit = 10, status } = {}) {
  const params = { offset, limit };
  if (status && status !== "all") params.status = status;
  const { data } = await api.get(`/calls`, { params });
  return data;
}

export async function fetchCallById(id) {
  const { data } = await api.get(`/calls/${id}`);
  return data;
}

export async function archiveCall(id, archived) {
  const { data } = await api.put(`/calls/${id}/archive`);
  return data;
}

export async function addNote(activityId, content) {
  const { data } = await api.post(`/calls/${activityId}/note`, { content });
  return data;
}
