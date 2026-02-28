import { RiskLevel } from '../data/mockData';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function RiskBadge({ level, size = 'md', showIcon = true }: RiskBadgeProps) {
  const configs = {
    LOW: {
      bg: 'bg-[#D1FAE5]',
      text: 'text-[#10B981]',
      border: 'border-[#10B981]',
    },
    MEDIUM: {
      bg: 'bg-[#FEF3C7]',
      text: 'text-[#F59E0B]',
      border: 'border-[#F59E0B]',
    },
    HIGH: {
      bg: 'bg-[#FEE2E2]',
      text: 'text-[#EF4444]',
      border: 'border-[#EF4444]',
    },
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const config = configs[level];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border
        ${config.bg} ${config.text} ${config.border} ${sizes[size]}
        font-semibold
      `}
    >
      {showIcon && (
        <span className={`w-2 h-2 rounded-full ${config.text.replace('text-', 'bg-')}`} />
      )}
      {level}
    </span>
  );
}
