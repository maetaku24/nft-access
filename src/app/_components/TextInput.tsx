import { tv, type VariantProps } from 'tailwind-variants';
import { ComponentPropsWithRef, forwardRef } from 'react';

// tv を使用して Tailwind CSS のスタイルを定義
const textInputStyles = tv({
  slots: {
    labelStyle: 'block mb-2 text-sm font-medium text-gray-900',
    inputStyle:
      'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5',
    errorStyle: 'mt-2 text-sm text-red-600 font-medium',
  },
  variants: {
    disabled: {
      true: 'bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed',
    },
    error: {
      true: {
        labelStyle: 'block mb-2 text-sm font-medium text-red-700',
        inputStyle:
          'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5',
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
      <label htmlFor={id} className={labelStyle()}>
        {label}
      </label>
      <input
        id={id}
        ref={ref}
        className={inputStyle()}
        disabled={disabled}
        {...rest}
      />
      {errorMessage && (
        <p
          className={errorStyle()}
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
});

TextInput.displayName = 'TextInput';
export default TextInput;
