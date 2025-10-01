import { Modal, Input } from "antd";
import { useState, useEffect } from "react";

export default function AddNoteModal({ open, onClose, call, onSave }) {
  const [value, setValue] = useState("");
  useEffect(() => {
    if (open) setValue("");
  }, [open]);

  return (
    <Modal
      title="Add Notes"
      open={open}
      onCancel={onClose}
      okText="Save"
      onOk={() => onSave(value)}
    >
      {call ? (
        <div className="space-y-2 text-sm mb-3">
          <div className="text-blue-600">Call ID {call.id}</div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-muted-foreground">Call Type</span>{" "}
              {call.call_type}
            </div>
            <div>
              <span className="text-muted-foreground">Duration</span>{" "}
              {Math.round(call.duration / 60)} minutes{" "}
              {Math.round(call.duration % 60)} seconds
            </div>
            <div>
              <span className="text-muted-foreground">From</span> {call.from}
            </div>
            <div>
              <span className="text-muted-foreground">To</span> {call.to}
            </div>
            <div>
              <span className="text-muted-foreground">Via</span> {call.via}
            </div>
          </div>
        </div>
      ) : null}
      <Input.TextArea
        rows={4}
        placeholder="Add Notes"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </Modal>
  );
}
