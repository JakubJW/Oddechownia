import Brandmark from '@/assets/Brandmark.svg';

export interface ReviewCardProps {
  review: string;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div>
      <div className="flex flex-col items-center p-6 border border-matcha rounded-xl">
        <div className="rounded-full bg-richBlack w-min p-4 mb-6">
          <Brandmark className="size-12 text-matcha" />
        </div>
        <p className="font-light text-lg italic text-center">{review}</p>
      </div>
    </div>
  );
}
