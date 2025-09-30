import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Card, Button, Input, List, message, Tag } from "antd";
import { fetchCallById, addNote, archiveCall } from "@/lib/callService";
import { subscribeToCallUpdates } from "@/lib/realtime";
import CallDetailField from "@/components/CallDetailField";

export default function CallDetailsPage() {
  const router = useRouter();
  const { id } = router.query || {};
  const [call, setCall] = useState(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchCallsData() {
    if (!id) return;
    setLoading(true);
    try {
      const call = await fetchCallById(id);
      setCall(call);
    } catch (e) {
      message.error("Failed to load call");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCallsData();
  }, [id]);

  // pusher
  useEffect(() => {
    let unsubscribe = null;
    (async () => {
      unsubscribe = await subscribeToCallUpdates((updated) => {
        if (!updated || !updated.id || !id) return;
        if (String(updated.id) === String(id)) {
          setCall(updated);
        }
      });
    })();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [id]);

  async function onAddNote() {
    if (!note.trim()) return;
    try {
      await addNote(id, note.trim());
      setNote("");
    } catch (e) {
      message.error("Failed to add note");
    }
  }

  async function onToggleArchive() {
    try {
      await archiveCall(id, !call.is_archived);
    } catch (e) {
      message.error("Action failed");
    }
  }

  if (!call) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <Button onClick={() => router.push("/")}>Back</Button>
      <Card title={`Call #${call.id}`} loading={loading}>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <CallDetailField label="From" value={call.from} />
          <CallDetailField label="To" value={call.to} />
          <CallDetailField label="Direction" value={call.direction} />
          <CallDetailField label="Via" value={call.via} />
          <CallDetailField label="Type">
            <Tag>{call.call_type}</Tag>
          </CallDetailField>
          <CallDetailField label="Duration">
            {Math.round(call.duration / 60)}m {Math.round(call.duration % 60)}s
          </CallDetailField>
          <CallDetailField label="Created at">
            {new Date(call.created_at).toLocaleString()}
          </CallDetailField>
          <CallDetailField label="Status">
            {call.is_archived ? "Archived" : "Active"}
          </CallDetailField>
        </div>
        <div className="mt-4">
          <Button onClick={onToggleArchive}>
            {call.is_archived ? "Unarchive" : "Archive"}
          </Button>
        </div>
      </Card>

      <Card title="Notes">
        <div className="flex items-center gap-2 mb-3">
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note"
          />
          <Button type="primary" onClick={onAddNote}>
            Add
          </Button>
        </div>
        <List
          dataSource={call.notes}
          locale={{ emptyText: "No notes" }}
          renderItem={(n) => <List.Item>{n.content}</List.Item>}
        />
      </Card>
    </div>
  );
}
