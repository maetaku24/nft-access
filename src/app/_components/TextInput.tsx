import type { ComponentPropsWithRef } from 'react';
import { forwardRef } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { Input } from './ui/input';
import { Label } from './ui/label';

// tv を使用して Tailwind CSS のスタイルを定義
const textInputStyles = tv({
  slots: {
    labelStyle: 'mb-2 block text-base font-medium text-gray-900',
    inputStyle:
      'block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-base text-gray-900 focus:border-blue-500 focus:ring-blue-500',
    errorStyle: 'mt-2 text-sm font-medium text-red-600',
  },
  variants: {
    disabled: {
      true: 'block w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-100 p-2.5 text-base text-gray-900 focus:border-blue-500 focus:ring-blue-500',
    },
    error: {
      true: {
        labelStyle: 'mb-2 block text-base font-medium text-red-700',
        inputStyle:
          'block w-full rounded-lg border border-red-500 bg-red-50 p-2.5 text-base text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500',
      },
    },
  },
  defaultVariants: {
    disabled: false,
    error: false,
  },
});

// ComponentPropsWithRef<'input'> を継承することで、すべての input の標準プロパティを受け取れる
// Omit<> を使って className を除外しているため、意図しない className の適用を防ぐ
interface Props
  extends Omit<ComponentPropsWithRef<'input'>, 'className'>,
    VariantProps<typeof textInputStyles> {
  label?: string;
  errorMessage?: string;
  className?: string;
}

const TextInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { id, disabled, label, errorMessage, className, ...rest } = props;
  const { labelStyle, inputStyle, errorStyle } = textInputStyles({
    disabled,
    error: !!errorMessage,
  });

  return (
    <div>
      <Label htmlFor={id} className={labelStyle()}>
        {label}
      </Label>
      <Input
        id={id}
        ref={ref}
        className={inputStyle() + (className ? `${className} ` : '')}
        disabled={disabled}
        {...rest}
      />
      {errorMessage && <p className={errorStyle()}>{errorMessage}</p>}
    </div>
  );
});

TextInput.displayName = 'TextInput';
export default TextInput;
