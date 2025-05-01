export default function PublicaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout-container">
      {children}
    </div>
  );
}
