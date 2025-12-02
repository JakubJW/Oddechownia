import { useMemo } from 'react';
import { useLabels } from '../../Labels/hooks/useLabels';
import { LessonLabel } from '@/components/LessonLabel';

type Props = {
  currentLabels: number[];
  onAdd: (id: number) => void;
  onRemove: (id: number) => void;
};
export const Labels = ({ currentLabels, onAdd, onRemove }: Props) => {
  const { queryLabels } = useLabels();

  const assignedLabels = useMemo(
    () =>
      queryLabels.data?.data.filter((label) =>
        currentLabels.includes(label.id)
      ),
    [queryLabels.data?.data, currentLabels]
  );

  const availableLabels = useMemo(
    () =>
      queryLabels.data?.data.filter(
        (label) => !currentLabels.includes(label.id)
      ),
    [queryLabels.data?.data, currentLabels]
  );

  return (
    <div className="grid grid-cols-2">
      <div className="flex flex-col gap-1">
        <span className="text-sm text-muted-foreground">Aktualne</span>
        {assignedLabels?.map((label) => (
          <button
            className="inline-flex"
            key={label.id}
            onClick={() => onRemove(label.id)}
          >
            <LessonLabel label={label} />
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-sm text-muted-foreground">Dostepne</span>
        {availableLabels?.map(({ color, text, id }) => (
          <button
            className="inline-flex"
            key={id}
            onClick={() => onAdd(id)}
          >
            <LessonLabel
              key={id}
              label={{ color, text }}
            />
          </button>
        ))}
      </div>
    </div>
  );
};
