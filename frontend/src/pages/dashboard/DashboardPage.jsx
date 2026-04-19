import MainLayout from "../../components/layout/MainLayout";
import HeroSection from "../../components/layout/home/HeroSection";
import QuickAccessSection from "../../components/layout/home/QuickAccessSection";
import FeaturesSection from "../../components/layout/home/FeaturesSection";

function DashboardPage() {
  return (
    <MainLayout>
      <HeroSection />
      <QuickAccessSection />
      <FeaturesSection />
    </MainLayout>
  );
}

export default DashboardPage;