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
import type { InputProps } from '@/app/_components/ui/input';
import { Input } from '@/app/_components/ui/input';

export type FormInputProps<T extends FieldValues> = InputProps &
  UseControllerProps<T> & {
    label: string;
    required?: boolean;
  };

export function FormInput<S extends FieldValues>({
  name,
  control,
  label,
  disabled,
  required,
  ...inputProps
}: FormInputProps<S>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
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
            <Input
              {...inputProps}
              onChange={field.onChange}
              value={field.value ?? ''}
              onBlur={field.onBlur}
              disabled={disabled || field.disabled}
              name={field.name}
              ref={field.ref}
              className='rounded-lg border border-gray-300 bg-white text-base text-gray-900 focus:border-blue-500 focus:ring-blue-500'
            />
          </FormControl>
          <FormMessage className='text-xs' />
        </FormItem>
      )}
    />
  );
}
