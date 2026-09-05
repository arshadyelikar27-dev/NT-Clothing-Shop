export default function AdminLoading() {
  return (
    <div style={{ padding: "40px", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
      <div style={{
        width: "36px",
        height: "36px",
        border: "3px solid #E4DDD3",
        borderTopColor: "#9E3B2B",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite"
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
