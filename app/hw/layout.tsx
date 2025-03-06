type Props = React.HtmlHTMLAttributes<HTMLDivElement>;

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="container mx-auto my-8 flex flex-col px-4">
      {children}
    </div>
  );
};
Layout.displayName = 'HomeworkLayout';

export default Layout;
