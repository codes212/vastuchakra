export default function MapZoningPage() {
  return (
    <div className="w-full" style={{ height: 'calc(100vh - 56px)' }}>
      <iframe
        src="/vastu-map.html"
        className="w-full h-full border-0"
        title="Vastu Map Zoning"
        allow="clipboard-write"
      />
    </div>
  );
}
