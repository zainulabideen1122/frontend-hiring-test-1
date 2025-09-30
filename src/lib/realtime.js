import { getToken } from "@/lib/http";

const APP_KEY = process.env.NEXT_PUBLIC_PUSHER_KEY;
const APP_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
const AUTH_ENDPOINT = process.env.NEXT_PUBLIC_PUSHER_AUTH_ENDPOINT;

// Lazy-load Pusher SDK so it doesn't bloat the initial bundle
async function getPusherClient() {
  const mod = await import("pusher-js");
  return mod.default || mod;
}

export async function subscribeToCallUpdates(onUpdate) {
  const token = getToken();
  if (!token) return () => {};
  const Pusher = await getPusherClient();

  const pusher = new Pusher(APP_KEY, {
    cluster: APP_CLUSTER,
    authEndpoint: AUTH_ENDPOINT,
    auth: {
      headers: { Authorization: `Bearer ${token}` },
    },
  });

  const channel = pusher.subscribe("private-aircall");

  function handleUpdateCall(payload) {
    if (onUpdate) onUpdate(payload);
  }

  channel.bind("update-call", handleUpdateCall);

  // Return cleanup function
  return () => {
    try {
      channel.unbind("update-call", handleUpdateCall);
      pusher.unsubscribe("private-aircall");
      pusher.disconnect();
    } catch {}
  };
}
