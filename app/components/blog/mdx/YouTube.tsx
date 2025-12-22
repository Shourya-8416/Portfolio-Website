"use client";

interface YouTubeProps {
  videoId: string;
}

export default function YouTube({ videoId }: YouTubeProps) {
  if (!videoId) {
    return null;
  }

  return (
    <div className="youtube-embed my-6 relative w-full" style={{ paddingBottom: "56.25%" }}>
      <iframe
        className="absolute top-0 left-0 w-full h-full rounded-lg"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
