export const TableSkeleton = ({
  columns = 5,
  rows = 5,
}: {
  columns?: number;
  rows?: number;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        {Array(rows)
          .fill(0)
          .map((_, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className="flex w-full gap-2  py-4 border-b"
            >
              {Array(columns)
                .fill(0)
                .map((_, colIndex) => (
                  <div
                    key={`cell-${rowIndex}-${colIndex}`}
                    className="h-4 flex-1 rounded-md bg-muted animate-pulse"
                  />
                ))}
            </div>
          ))}
      </div>
    </div>
  );
};
