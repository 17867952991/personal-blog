type BackgroundVideoProps = {
  src: string;
  className?: string;
};

export function BackgroundVideo({ src, className = "" }: BackgroundVideoProps) {
  return (
    <video
      aria-hidden="true"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      className={`absolute inset-0 z-0 h-[130%] w-full object-cover object-top ${className}`}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
