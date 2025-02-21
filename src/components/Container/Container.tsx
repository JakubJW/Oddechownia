export default function Container({
  children,
}: React.PropsWithChildren<object>) {
  return (
    <div className="container mx-auto px-4 py-32">{children}</div>
  );
}
