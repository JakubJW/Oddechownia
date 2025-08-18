import Image from 'next/image';

interface CourseVideoCardProps {
  thumbnailUrl: string;
  title: string;
  description: string;
}

export default function CourseVideoCard({
  thumbnailUrl,
  title,
  description,
}: CourseVideoCardProps) {
  return (
    <div className="rounded-xl bg-white overflow-hidden relative">
      <Image
        src={thumbnailUrl}
        alt="Obraz"
        width={400}
        height={300}
        className="w-full h-[200px] object-cover"
      />
      <div className="flex flex-col p-6 gap-4">
        <p className="text-lg text-black font-bold line-clamp-2">{title}</p>
        <p className="text-gray-400 line-clamp-3">{description}</p>
      </div>
    </div>
  );
}
