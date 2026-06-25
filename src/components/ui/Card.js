export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-surface rounded-2xl shadow-sm ${className}`}>
      {children}
    </div>
  );
}
