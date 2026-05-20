export type ChartConfig = Record<
  string,
  {
    label?: string;
    icon?: React.ComponentType;
    color?: string;
    theme?: {
      light?: string;
      dark?: string;
    };
  }
>;

interface ChartContainerProps {
  config: ChartConfig;
  className?: string;
  children: React.ReactNode;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({ className, children }) => {
  return <div className={className}>{children}</div>;
};

interface ChartTooltipProps {
  content?: React.ReactNode;
  cursor?: boolean;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = () => {
  return null; // Tooltip handling is done by recharts directly
};

interface ChartTooltipContentProps {
  active?: boolean;
  payload?: { name: string; value: number; color: string; dataKey: string }[];
  label?: string;
  indicator?: 'line' | 'dot' | 'dashed';
  labelFormatter?: (value: string) => string;
  formatter?: (value: number, name: string) => string;
  hideLabel?: boolean;
  hideIndicator?: boolean;
  className?: string;
}

export const ChartTooltipContent: React.FC<ChartTooltipContentProps> = ({
  active,
  payload,
  label,
  hideLabel,
  className,
}) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {!hideLabel && label && <div className="font-medium">{label}</div>}
      <div className="space-y-1">
        {payload.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span
              className="inline-block size-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm">
              {item.name}: {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
