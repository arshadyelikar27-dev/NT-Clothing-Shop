export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
        gap: "8px",
      }}
    >
      <div
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: "#E0A96D",
          animation: "pulse 1s ease-in-out infinite",
        }}
      />
      <div
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: "#E0A96D",
          animation: "pulse 1s ease-in-out 0.2s infinite",
        }}
      />
      <div
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: "#E0A96D",
          animation: "pulse 1s ease-in-out 0.4s infinite",
        }}
      />
    </div>
  );
}
