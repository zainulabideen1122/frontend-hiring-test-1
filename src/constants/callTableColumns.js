import { styleForCallType } from "@/constants/callTypes";
import { Button } from "antd";

function DirectionLink({ direction }) {
  function handleClick(event) {
    event.preventDefault();
  }
  const label = direction?.charAt(0).toUpperCase() + direction?.slice(1);
  return (
    <a href="#" className="text-blue-600" onClick={handleClick}>
      {label}
    </a>
  );
}

function DurationCell({ duration }) {
  const minutes = Math.round(duration / 60);
  const seconds = Math.round(duration % 60);
  return (
    <div className="leading-tight">
      {minutes} minutes {seconds} seconds
      <div className="text-[11px] text-blue-600">({duration} seconds)</div>
    </div>
  );
}

function StatusBadge({ isArchived }) {
  if (isArchived) {
    return (
      <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 text-xs">
        Archived
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200 text-xs">
      Unarchive
    </span>
  );
}

function ActionsCell({ call, onAddNote, onArchiveToggle }) {
  function handleAddNote(event) {
    event.stopPropagation();
    if (onAddNote) onAddNote(call);
  }

  function handleToggleArchive(event) {
    event.stopPropagation();
    if (onArchiveToggle) onArchiveToggle(call.id, !call.is_archived);
  }

  return (
    <div className="flex items-center gap-2">
      <Button size="middle" type="primary" onClick={handleAddNote}>
        Add Note
      </Button>
      <Button size="middle" onClick={handleToggleArchive}>
        {call.is_archived ? "Unarchive" : "Archive"}
      </Button>
    </div>
  );
}

export function buildCallTableColumns({ onAddNote, onArchiveToggle }) {
  return [
    {
      title: "Call Type",
      dataIndex: "call_type",
      render: (type) => {
        const { label, className } = styleForCallType(type);
        return (
          <span className={`capitalize font-medium ${className}`}>{label}</span>
        );
      },
    },
    {
      title: "Direction",
      dataIndex: "direction",
      render: (direction) => <DirectionLink direction={direction} />,
    },
    {
      title: "Duration",
      key: "duration",
      render: (_unused, call) => <DurationCell duration={call.duration} />,
    },
    { title: "From", dataIndex: "from" },
    { title: "To", dataIndex: "to" },
    { title: "Via", dataIndex: "via" },
    {
      title: "Created At",
      dataIndex: "created_at",
      render: (dateIso) => new Date(dateIso).toLocaleDateString(),
    },
    {
      title: "Status",
      key: "status",
      render: (_unused, call) => <StatusBadge isArchived={call.is_archived} />,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_unused, call) => (
        <div className="flex items-center gap-2">
          <Button
            size="middle"
            type="primary"
            onClick={(e) => {
              e.stopPropagation();
              onAddNote?.(call);
            }}
          >
            Add Note
          </Button>
          <Button
            size="middle"
            onClick={(e) => {
              e.stopPropagation();
              onArchiveToggle?.(call.id, !call.is_archived);
            }}
          >
            {call.is_archived ? "Unarchive" : "Archive"}
          </Button>
        </div>
      ),
    },
  ];
}
