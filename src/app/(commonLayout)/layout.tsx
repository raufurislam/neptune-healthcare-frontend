import PublicFooter from "@/components/shared/PublicFooter";
import PublicNavbar from "@/components/shared/PublicNavbar";

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <PublicNavbar />
      <main className="min-h-dvh">{children}</main>
      <PublicFooter />
    </>
  );
};

export default CommonLayout;
