import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[#4de082] hover:bg-white text-[#003919] hover:text-black border border-transparent font-bold',
  secondary:
    'bg-transparent border border-[#38BDF8] text-[#38BDF8] hover:bg-[#38BDF8] hover:text-white font-semibold',
  danger:
    'bg-red-600 hover:bg-red-500 text-white border border-transparent font-bold',
  ghost:
    'bg-transparent border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white font-semibold',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-[10px] px-2.5 py-1.5',
  md: 'text-xs px-3.5 py-2',
  lg: 'text-sm px-5 py-2.5',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={[
          'inline-flex items-center justify-center gap-1.5 rounded-sm font-mono uppercase tracking-wide',
          'transition-all duration-150 cursor-pointer',
          'active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
          variantClasses[variant],
          sizeClasses[size],
          className,
        ].join(' ')}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
