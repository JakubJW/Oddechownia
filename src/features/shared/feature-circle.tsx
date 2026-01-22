export const FeatureCircleImage = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="rounded-full w-min p-6 mb-6 bg-matcha-foreground">
      {children}
    </div>
  );
};

export const FeatureCircleTitle = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <p className="text-center uppercase mb-4 text-lg">{children}</p>;
};

export const FeatureCircleDescription = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <p className="text-center w-3/4 mx-auto font-light">{children}</p>;
};

export const FeatureCircle = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col items-center">{children}</div>;
};
