export default function Logo({ height = 56, className = '' }) {
  return (
    <img
      className={`logo ${className}`.trim()}
      src={`${import.meta.env.BASE_URL}images/logo-512.png`}
      alt="FinanTrack"
      width={height}
      height={height}
    />
  );
}
