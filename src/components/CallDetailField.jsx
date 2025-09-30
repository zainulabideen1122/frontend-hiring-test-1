export default function CallDetailField({ label, value, children }) {
  return (
    <div>
      <span className="text-muted-foreground">{label}:</span>{" "}
      {children || value}
    </div>
  );
}
