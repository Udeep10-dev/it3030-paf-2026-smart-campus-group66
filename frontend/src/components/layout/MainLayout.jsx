import Footer from "./Footer";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F5F8FC] text-slate-800">
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default MainLayout;
