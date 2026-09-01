export default function ShopLoading() {
  return (
    <div style={{ padding: "40px 20px", maxWidth: "1280px", margin: "0 auto" }}>
      {/* Header skeleton */}
      <div
        style={{
          width: "200px",
          height: "28px",
          borderRadius: "6px",
          backgroundColor: "#f0ebe4",
          marginBottom: "24px",
        }}
      />
      {/* Filter bar skeleton */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "32px",
        }}
      >
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              width: "100px",
              height: "36px",
              borderRadius: "8px",
              backgroundColor: "#f0ebe4",
            }}
          />
        ))}
      </div>
      {/* Product grid skeleton */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "24px",
        }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div
              style={{
                aspectRatio: "3/4",
                borderRadius: "12px",
                backgroundColor: "#f0ebe4",
                marginBottom: "12px",
                animation: "pulse 1.5s ease-in-out infinite",
                animationDelay: `${i * 0.1}s`,
              }}
            />
            <div
              style={{
                width: "70%",
                height: "14px",
                borderRadius: "4px",
                backgroundColor: "#f0ebe4",
                marginBottom: "8px",
              }}
            />
            <div
              style={{
                width: "40%",
                height: "14px",
                borderRadius: "4px",
                backgroundColor: "#f0ebe4",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
