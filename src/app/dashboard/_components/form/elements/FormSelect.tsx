import React from 'react';
import type { FieldValues, UseControllerProps } from 'react-hook-form';
import { Badge } from '@/app/_components/ui/badge';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/_components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/ui/select';

export interface FormSelectProps<T extends FieldValues>
  extends UseControllerProps<T> {
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  contentClassName?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  [x: string]: unknown;
}

export function FormSelect<S extends FieldValues>({
  name,
  control,
  label,
  options,
  placeholder,
  contentClassName,
  onValueChange,
  disabled,
  required,
  ...props
}: FormSelectProps<S>) {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => {
        const selectedOption = options.find(
          (opt) => opt.value === String(field.value)
        );
        return (
          <FormItem>
            <FormLabel className='flex items-center gap-2'>
              {label}
              {required && (
                <Badge variant='destructive' className='text-xs shadow-none'>
                  必須
                </Badge>
              )}
            </FormLabel>
            <FormControl>
              <Select
                {...props}
                value={String(field.value)}
                disabled={disabled || field.disabled}
                onValueChange={(value) => {
                  if (onValueChange) {
                    onValueChange(value);
                  } else {
                    field.onChange(value);
                  }
                }}
              >
                <SelectTrigger
                  id={name}
                  onBlur={() => field.onBlur()}
                  className='bg-white'
                  disabled={disabled || field.disabled}
                >
                  <SelectValue placeholder={placeholder || '選択してください'}>
                    {selectedOption ? selectedOption.label : ''}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className={contentClassName}>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
