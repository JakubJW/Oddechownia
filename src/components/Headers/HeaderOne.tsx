export default function HeaderOne({
  children,
}: React.PropsWithChildren<object>) {
  return (
    <h1 className="font-bold text-4xl leading-normal xl:text-5xl xl:leading-relaxed">
      {children}
    </h1>
  );
}
