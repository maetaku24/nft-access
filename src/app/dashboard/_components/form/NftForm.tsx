'use client';

import type { Control } from 'react-hook-form';
import { useFieldArray, useWatch } from 'react-hook-form';
import { FormInput } from './elements/FormInput';
import { FormSelect } from './elements/FormSelect';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/_components/ui/form';
import { Input } from '@/app/_components/ui/input';
import type { Event } from '@/app/dashboard/_schema/eventSchema';

interface Props {
  control: Control<Event>;
}

export const NftForm: React.FC<Props> = ({ control }) => {
  const { fields } = useFieldArray({
    control,
    name: 'nfts',
  });

  const watchedStandardValues = useWatch({
    control,
    name: 'nfts',
  });

  return (
    <div>
      <h2 className='mb-10 text-2xl font-bold'>NFT情報設定</h2>
      {fields.map((field, index) => {
        const standardValue = watchedStandardValues?.[index]?.standard;

        return (
          <div key={field.id} className='space-y-6'>
            <FormInput
              control={control}
              name={`nfts.${index}.collectionName`}
              label='表示させるコレクション名'
              type='text'
            />
            <FormInput
              control={control}
              name={`nfts.${index}.contractAddress`}
              label='コントラクトアドレス'
              type='text'
            />
            <FormSelect
              label='ネットワーク'
              name={`nfts.${index}.network`}
              control={control}
              options={[
                { value: 'ETHEREUM', label: 'Ethereum' },
                { value: 'POLYGON', label: 'Polygon' },
              ]}
            />
            <FormSelect
              label='規格'
              name={`nfts.${index}.standard`}
              control={control}
              options={[
                { value: 'ERC721', label: 'ERC721' },
                { value: 'ERC1155', label: 'ERC1155' },
              ]}
            />
            {standardValue === 'ERC1155' && (
              <FormInput
                control={control}
                name={`nfts.${index}.tokenId`}
                label='トークンID'
                type='number'
              />
            )}
            <FormItem>
              <FormLabel>保有条件</FormLabel>
              <div className='flex w-full items-center gap-2'>
                <FormField
                  control={control}
                  name={`nfts.${index}.minBalance`}
                  render={({ field, fieldState }) => (
                    <FormItem className='relative flex-1'>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='最小値'
                          {...field}
                          value={field.value ?? ''}
                          className='rounded-lg border border-gray-300 bg-white text-base text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                        />
                      </FormControl>
                      <FormMessage className='absolute left-0 top-full mt-1 text-xs text-red-500'>
                        {fieldState.error?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <span>〜</span>
                <FormField
                  control={control}
                  name={`nfts.${index}.maxBalance`}
                  render={({ field, fieldState }) => (
                    <FormItem className='relative flex-1'>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='最大値'
                          {...field}
                          value={field.value ?? ''}
                          className='rounded-lg border border-gray-300 bg-white text-base text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                        />
                      </FormControl>
                      <FormMessage className='absolute left-0 top-full mt-1 text-xs text-red-500'>
                        {fieldState.error?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>
            </FormItem>
          </div>
        );
      })}
    </div>
  );
};
