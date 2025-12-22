import Link from "next/link";
import { Zap } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass rounded-full px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-white">
            Smart DNS
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#templates" className="hover:text-white transition-colors">Templates</Link>
          <Link href="#about" className="hover:text-white transition-colors">How it Works</Link>
        </div>

        <button className="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-full text-sm font-medium transition-all border border-white/5 backdrop-blur-md">
          Get Started
        </button>
      </div>
    </nav>
  );
}
