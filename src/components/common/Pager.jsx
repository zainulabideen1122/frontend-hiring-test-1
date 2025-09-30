import { Pagination } from "antd";

export default function Pager({ total, pageSize, current, onChange }) {
  const start = (current - 1) * pageSize + 1;
  const end = Math.min(current * pageSize, total);
  return (
    <div className="mt-6">
      <div className="flex items-center justify-center">
        <Pagination
          total={total}
          pageSize={pageSize}
          current={current}
          onChange={onChange}
          showSizeChanger={false}
        />
      </div>
      <p className="text-sm text-muted-foreground text-center mt-2">
        {total === 0 ? "0 results" : `${start} – ${end} of ${total} results`}
      </p>
    </div>
  );
}
