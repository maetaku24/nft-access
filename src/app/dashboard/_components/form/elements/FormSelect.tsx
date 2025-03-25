import React from 'react';
import { FieldValues, UseControllerProps } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/ui/select';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/_components/ui/form';

export interface FormSelectProps<T extends FieldValues>
  extends UseControllerProps<T> {
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  [x: string]: unknown;
}

export function FormSelect<S extends FieldValues>({
  name,
  control,
  label,
  options,
  placeholder,
  ...props
}: FormSelectProps<S>) {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => {
        const selectedOption = options.find((opt) => opt.value === field.value);
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Select
                {...props}
                value={field.value}
                onValueChange={(value) => field.onChange(value)}
              >
                <SelectTrigger id={name} onBlur={() => field.onBlur()} className='bg-white'>
                  <SelectValue placeholder={placeholder || '選択してください'}>
                    {selectedOption ? selectedOption.label : ''}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
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
