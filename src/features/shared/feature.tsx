type Props = {
  icon: React.ReactNode;
  children: React.ReactNode;
};

export const Feature = ({ icon, children }: Props) => {
  return (
    <div className="flex items-center gap-4">
      <div className="p-2 rounded-full border-2 border-matcha-foreground">
        {icon}
      </div>
      <span className="font-light text-lg">{children}</span>
    </div>
  );
};
