export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="p-2 bg-red-100 border border-destructive rounded-md">
      <p className="text-destructive text-center">{message}</p>
    </div>
  );
}
