import { AppLayout } from "@/components/layout/AppLayout";
import { ModalsRoot } from "@/components/modals/ModalsRoot";
import { AboutSection } from "@/components/sections/AboutSection";
import { CasesSection } from "@/components/sections/CasesSection";
import { FooterSection } from "@/components/sections/FooterSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { TeamSection } from "@/components/sections/TeamSection";
import { ContentProvider } from "@/context/contentContext";
import { ModalProvider } from "@/context/modalContext";

export default function App() {
  return (
    <ContentProvider>
      <ModalProvider>
        <AppLayout footer={<FooterSection />} modals={<ModalsRoot />}>
          <HeroSection />
          <AboutSection />
          <TeamSection />
          <CasesSection />
        </AppLayout>
      </ModalProvider>
    </ContentProvider>
  );
}
