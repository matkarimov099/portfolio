import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#09090b",
        backgroundImage:
          "radial-gradient(circle at 25px 25px, #1a1a1a 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1a1a1a 2%, transparent 0%)",
        backgroundSize: "100px 100px",
      }}
    >
      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, transparent 50%, rgba(16, 185, 129, 0.05) 100%)",
          display: "flex",
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: "50%",
            overflow: "hidden",
            marginBottom: 30,
            boxShadow: "0 0 60px rgba(16, 185, 129, 0.4)",
            border: "4px solid #10b981",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* biome-ignore lint/performance/noImgElement: ImageResponse requires native img element */}
          <img
            src="https://avatars.githubusercontent.com/matkarimov099"
            alt="Matkarimov Matkarim"
            width={150}
            height={150}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Name */}
        <h1
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "white",
            margin: 0,
            marginBottom: 10,
            textAlign: "center",
          }}
        >
          Matkarimov Matkarim
        </h1>

        {/* Title */}
        <p
          style={{
            fontSize: 32,
            color: "#10b981",
            margin: 0,
            marginBottom: 30,
          }}
        >
          Full Stack Developer
        </p>

        {/* Tech stack */}
        <div
          style={{
            display: "flex",
            gap: 16,
          }}
        >
          {["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL"].map(
            (tech) => (
              <div
                key={tech}
                style={{
                  padding: "8px 20px",
                  borderRadius: 20,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "white",
                  fontSize: 18,
                }}
              >
                {tech}
              </div>
            ),
          )}
        </div>

        {/* Location */}
        <p
          style={{
            fontSize: 20,
            color: "#888",
            marginTop: 30,
          }}
        >
          Tashkent, Uzbekistan
        </p>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
