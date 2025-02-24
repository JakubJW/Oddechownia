import { Star } from 'lucide-react';

export interface ReviewCardProps {
  customerName: string;
  review: string;
  rating: number;
  date: string;
}

export default function ReviewCard({
  customerName,
  review,
  rating,
  date,
}: ReviewCardProps) {
  return (
    <div className="flex flex-col flex-grow p-8">
      <div className="mb-6">
        <h3 className="text-2xl mb-2">{customerName}</h3>
        <span className="text-sm text-primaryFg">{date}</span>
      </div>
      <p className="mb-6">{review}</p>
      <div className="flex justify-center mt-auto">
        {Array.from({ length: rating }).map((_, index) => (
          <Star
            key={index}
            className="text-yellow-300 fill-yellow-300"
          />
        ))}
      </div>
    </div>
  );
}
