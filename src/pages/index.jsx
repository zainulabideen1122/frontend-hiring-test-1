import { useEffect, useMemo, useState } from "react";
import { Card } from "antd";
import { useToast } from "@/components/ui/ToastProvider";
import CallTable from "@/components/CallTable";
import FilterBar from "@/components/FilterBar";
import Pager from "@/components/common/Pager";
import AddNoteModal from "@/components/common/AddNoteModal";
import { fetchCalls, archiveCall, addNote } from "@/lib/callService";
import { subscribeToCallUpdates } from "@/lib/realtime";

export default function CallsListPage() {
  const toast = useToast();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [noteModal, setNoteModal] = useState({ open: false, call: null });
  const [allFiltered, setAllFiltered] = useState(null); // when filtering, hold the full filtered dataset

  async function load() {
    setLoading(true);
    try {
      if (filter === "all") {
        // Server-side pagination
        const { nodes, totalCount } = await fetchCalls({
          offset: (page - 1) * pageSize,
          limit: pageSize,
        });
        setData(nodes || []);
        setTotal(totalCount ?? (nodes || []).length);
        return;
      }

      // Client-side pagination for status filter views: fetch a large chunk once, then slice per page
      const seedOffset = 0;
      const seedLimit = 500; // reasonable upper bound for test dataset
      const { nodes } = await fetchCalls({
        offset: seedOffset,
        limit: seedLimit,
      });
      let filtered = nodes || [];
      filtered = filtered.filter((call) =>
        filter === "archived" ? call.is_archived : !call.is_archived
      );
      const startIndex = (page - 1) * pageSize;
      const pageSlice = filtered.slice(startIndex, startIndex + pageSize);
      setData(pageSlice);
      setTotal(filtered.length);
    } catch (e) {
      toast.error("Failed to load calls");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filter]);

  useEffect(() => {
    let unsubscribe = null;
    (async () => {
      unsubscribe = await subscribeToCallUpdates(async (updatedCall) => {
        // Merge the updated call into current list if present
        setData((prev) =>
          prev.map((c) => (c.id === updatedCall.id ? updatedCall : c))
        );
      });
    })();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  async function onArchiveToggle(id, next) {
    try {
      await archiveCall(id, next);
      toast.success(next ? "Archived" : "Unarchived");
      await load();
    } catch (e) {
      toast.error("Action failed");
    }
  }

  function openAddNote(call) {
    setNoteModal({ open: true, call });
  }

  async function saveNote(content) {
    try {
      if (!noteModal.call || !content?.trim()) return;
      await addNote(noteModal.call.id, content.trim());
      toast.success("Note added");
      await load();
    } catch (e) {
      toast.error("Failed to add note");
    } finally {
      setNoteModal({ open: false, call: null });
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-500 py-8">
        Turing Technologies Frontend Test
      </h1>
      <FilterBar
        value={filter}
        onChange={(v) => {
          setPage(1);
          setFilter(v);
        }}
      />
      <CallTable
        data={data}
        loading={loading}
        onArchiveToggle={onArchiveToggle}
        onAddNote={openAddNote}
        onRowClick={(call) => {
          if (call?.id) {
            window.location.href = `/call/${call.id}`;
          }
        }}
      />
      <Pager
        total={total}
        pageSize={pageSize}
        current={page}
        onChange={(p) => setPage(p)}
      />
      <AddNoteModal
        open={noteModal.open}
        call={noteModal.call}
        onClose={() => setNoteModal({ open: false, call: null })}
        onSave={saveNote}
      />
    </div>
  );
}
