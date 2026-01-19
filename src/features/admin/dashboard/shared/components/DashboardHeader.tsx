interface DashboardHeaderProps {
  title: string;
  highlightedText?: string;
  subtitle?: string;
  className?: string;
}

export function DashboardHeader({
  title,
  highlightedText,
  subtitle,
  className = "",
}: DashboardHeaderProps) {
  return (
    <div className={className}>
      <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
        {title}
        {highlightedText && (
          <>
            {" "}
            <span className="text-secondary">{highlightedText}</span>
          </>
        )}
      </h1>
      {subtitle && <p className="text-white/60 mb-8">{subtitle}</p>}
    </div>
  );
}
