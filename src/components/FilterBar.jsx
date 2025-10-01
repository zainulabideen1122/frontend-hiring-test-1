import { Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";

export default function FilterBar({ value, onChange }) {
  const items = [
    { key: "all", label: "All" },
    { key: "archived", label: "Archived" },
    { key: "unarchived", label: "Unarchived" },
  ];

  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-sm text-muted-foreground">Filter by:</span>
      <Dropdown
        className="cursor-pointer"
        menu={{
          items,
          selectable: true,
          selectedKeys: [value],
          onClick: ({ key }) => onChange && onChange(key),
        }}
        trigger={["click"]}
        overlayClassName="tt-filter-menu"
      >
        <button className="text-blue-600 text-sm inline-flex items-center gap-1">
          Status <DownOutlined style={{ fontSize: 10 }} />
        </button>
      </Dropdown>
    </div>
  );
}
