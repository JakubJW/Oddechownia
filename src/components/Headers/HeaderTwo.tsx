export default function HeaderTwo({
  children,
}: React.PropsWithChildren<object>) {
  return (
    <h2 className="font-bold text-2xl leading-normal xl:text-4xl xl:leading-relaxed">
      {children}
    </h2>
  );
}
