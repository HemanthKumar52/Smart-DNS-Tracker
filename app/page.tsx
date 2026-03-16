import Navbar from "@/components/Navbar";
import DNSAnalyzer from "@/components/DNSAnalyzer";
import Footer from "@/components/Footer";
import FeaturesSection from "@/components/Features";
import TemplatesSection from "@/components/TemplatesSection";
import PropagationChecker from "@/components/PropagationChecker";
import DNSCompare from "@/components/DNSCompare";
import LearnDNS from "@/components/LearnDNS";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-4 sm:px-6 lg:px-8 space-y-12 max-w-7xl mx-auto w-full">

        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            v1.0 Public Beta
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-white leading-[1.1]">
            DNS Diagnostics <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Made Simple
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Stop guessing why your emails land in spam. Diagnose DNS issues, get AI-powered explanations, and fix them in seconds.
          </p>
        </div>

        {/* Analyzer Component */}
        <div className="w-full max-w-4xl mx-auto">
          <DNSAnalyzer />
        </div>

        {/* Features / Social Proof */}
        <div className="pt-10 flex flex-wrap justify-center gap-8 text-gray-500 text-sm font-medium">
            <div className="flex items-center gap-2">
                <svg className="w-5 h-5 opacity-50" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                <span>Global Checks</span>
            </div>
            <div className="flex items-center gap-2">
                <svg className="w-5 h-5 opacity-50" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
                <span>Security Analysis</span>
            </div>
            <div className="flex items-center gap-2">
                <svg className="w-5 h-5 opacity-50" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                <span>Deliverability Score</span>
            </div>
        </div>

      </section>

      <FeaturesSection />

      <TemplatesSection />

      <PropagationChecker />

      <DNSCompare />

      <LearnDNS />

      {/* Background Gradients */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />

      <Footer />
    </main>
  );
}
