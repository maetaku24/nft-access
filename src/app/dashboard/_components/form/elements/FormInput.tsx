import React from 'react';
import type { FieldValues, UseControllerProps } from 'react-hook-form';
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
  };

export function FormInput<S extends FieldValues>({
  name,
  control,
  label,
  ...inputProps
}: FormInputProps<S>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...inputProps}
              onChange={field.onChange}
              value={field.value ?? ''}
              onBlur={field.onBlur}
              disabled={field.disabled}
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
