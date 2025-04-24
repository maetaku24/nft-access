import Skeleton from 'react-loading-skeleton';
import { TableCell, TableRow } from '@/app/_components/ui/table';

interface Props {
  row: number;
  columns: number;
}

export const SkeletonTable: React.FC<Props> = ({ row, columns }) => (
  <>
    {[...Array(row)].map((_, index) => (
      <TableRow key={index}>
        {[...Array(columns)].map((_, index) => (
          <TableCell key={index} className='py-4 text-center'>
            <Skeleton height={20} width='80%' />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);
