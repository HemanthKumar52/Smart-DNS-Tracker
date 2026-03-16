import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/20 backdrop-blur-md mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h3 className="text-lg font-bold text-white">Smart DNS</h3>
          <p className="text-sm text-gray-500">AI-powered DNS diagnostics for modern teams.</p>
        </div>

        <div className="flex gap-6 text-sm text-gray-400">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#templates" className="hover:text-white transition-colors">Templates</Link>
          <Link href="#propagation" className="hover:text-white transition-colors">Propagation</Link>
          <Link href="#learn" className="hover:text-white transition-colors">Learn DNS</Link>
          <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-white transition-colors">GitHub</Link>
        </div>

        <div className="text-sm text-gray-600">
          © {new Date().getFullYear()} Smart DNS Inc.
        </div>
      </div>
    </footer>
  );
}
