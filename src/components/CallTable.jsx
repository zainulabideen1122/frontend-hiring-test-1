import { Table, Button } from "antd";
import { buildCallTableColumns } from "@/constants/callTableColumns";

function buildColumns(props) {
  return buildCallTableColumns(props);
}

// Table component
export default function CallTable({
  data,
  loading,
  onArchiveToggle,
  onAddNote,
  rowSelection,
  onRowClick,
}) {
  const columns = buildColumns({ onAddNote, onArchiveToggle });

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={false}
      className="border border-border rounded"
      rowSelection={rowSelection}
      rowClassName={() => "cursor-pointer"}
      onRow={(record) => ({
        onClick: () => onRowClick && onRowClick(record),
      })}
    />
  );
}
