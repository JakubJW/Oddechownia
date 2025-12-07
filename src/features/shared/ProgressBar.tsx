type Props = { percent?: number };

export const ProgressBar = ({ percent }: Props) => {
  if (!percent) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200/20 z-10">
      <div
        className="h-full bg-emerald-300"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};
