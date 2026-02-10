export default function Loading() {
  return (
    <div className="fixed inset-0 z-9999 flex items-start justify-center bg-white/10 backdrop-blur-sm">
      <div className="relative h-1 w-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full w-[30%] bg-linear-to-r from-transparent via-orange-500 to-transparent"
          style={{
            animation: "loading-bar 0.8s ease-in-out infinite",
          }}
        />
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes loading-bar {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(400%); }
          }
        `,
        }}
      />
    </div>
  );
}
