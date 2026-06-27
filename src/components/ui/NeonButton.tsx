import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Variant = 'primary' | 'ghost' | 'danger';

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { to?: undefined };

type LinkProps = BaseProps & { to: string; onClick?: never };

const variants: Record<Variant, string> = {
  primary:
    'border-neon-cyan/60 bg-neon-cyan/10 text-neon-cyan shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:bg-neon-cyan/20 hover:shadow-[0_0_28px_rgba(0,240,255,0.4)]',
  ghost:
    'border-white/20 bg-transparent text-text-primary hover:border-neon-purple/50 hover:text-neon-purple',
  danger:
    'border-status-red/50 bg-status-red/10 text-status-red hover:bg-status-red/20',
};

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg border px-5 py-2.5 font-display text-xs tracking-widest uppercase transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40';

export function NeonButton(props: ButtonProps): React.ReactElement;
export function NeonButton(props: LinkProps): React.ReactElement;
export function NeonButton({
  children,
  variant = 'primary',
  className = '',
  ...rest
}: ButtonProps | LinkProps) {
  const cls = `${base} ${variants[variant]} ${className}`;

  if ('to' in rest && rest.to) {
    return (
      <Link to={rest.to} className={cls}>
        {children}
      </Link>
    );
  }

  const { to: _, ...buttonProps } = rest as ButtonProps;
  return (
    <button className={cls} {...buttonProps}>
      {children}
    </button>
  );
}
