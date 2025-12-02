import { Badge } from './ui/badge';
import { hexToTailwindHSL } from '@/lib/utils';

type Props = {
  label: { text: string; color: string };
};

export const LessonLabel = ({ label }: Props) => {
  return (
    <Badge
      className="font-semibold rounded-full"
      style={{
        color: `hsl(${hexToTailwindHSL(label.color)})`,
        borderColor: `hsl(${hexToTailwindHSL(label.color)})`,
        backgroundColor: `hsla(${hexToTailwindHSL(label.color)}, 0.2)`,
      }}
    >
      {label.text}
    </Badge>
  );
};
