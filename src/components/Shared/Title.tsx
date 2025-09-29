type SectionTitleProps = {
  title: string;
};

export const Title = ({ title }: SectionTitleProps) => {
  return (
    <h1 className="font-sans text-3xl leading-[40px] font-medium text-gray-900 sm:text-4xl">
      {title}
    </h1>
  );
};

export default Title;
