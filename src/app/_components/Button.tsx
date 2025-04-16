import type { ComponentPropsWithRef, ReactNode } from 'react';
import { forwardRef } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

// tv を使用して Tailwind CSS のスタイルを定義
const buttonStyles = tv({
  base: 'mb-2 me-2 flex items-center justify-center rounded-lg px-5 py-2.5 font-bold transition-colors',
  variants: {
    variant: {
      primary:
        'border-2 border-green-300 bg-green-300 text-white hover:bg-transparent hover:text-green-300 focus:outline-none focus:ring focus:ring-green-200',
      secondary:
        'border-2 border-gray-900 bg-green-200 text-gray-900 hover:bg-green-200/50',
      outline:
        'border-2 border-green-300 text-green-300 hover:bg-green-300 hover:text-white focus:outline-none focus:ring focus:ring-green-200',
      delete:
        'border-2 border-red-500 bg-transparent text-red-500 hover:bg-red-100',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
    width: {
      auto: '',
      stretch: 'w-full',
      slim: 'px-3 py-1',
    },
    disabled: {
      true: 'pointer-events-none cursor-not-allowed opacity-50',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    width: 'auto',
    disabled: false,
  },
});

// ComponentPropsWithRef<'button'> を継承することで、すべての button の標準プロパティを受け取れる
// Omit<> を使って className を除外しているため、意図しない className の適用を防ぐ
interface Props
  extends Omit<ComponentPropsWithRef<'button'>, 'className'>,
    VariantProps<typeof buttonStyles> {
  children?: ReactNode;
  className?: string;
}

const Button = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const { children, variant, size, width, disabled, className, ...rest } =
    props;

  return (
    <button
      ref={ref}
      className={buttonStyles({
        variant,
        size,
        width,
        disabled,
        class: className,
      })}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
