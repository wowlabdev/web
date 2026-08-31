type ResultsStatCellProps = {
  label: string;
  value: string;
};

export function ResultsStatCell({
  label,
  value,
}: Readonly<ResultsStatCellProps>) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="font-mono font-medium tabular-nums">{value}</p>
    </div>
  );
}
