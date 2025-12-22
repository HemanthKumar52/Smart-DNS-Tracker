"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, CheckCircle, AlertTriangle, XCircle, ChevronDown, Copy, Share2, Lightbulb } from "lucide-react";
import { analyzeDomain, type AnalysisReport, type DNSResult } from "@/lib/dns";
import { cn } from "@/lib/utils";

export default function DNSAnalyzer() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AnalysisReport | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;
    
    setLoading(true);
    setReport(null);
    
    // Simulate reading time for better UX
    await new Promise(r => setTimeout(r, 800));
    
    try {
      const data = await analyzeDomain(domain);
      setReport(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
        {/* Search Input */}
        <div className="relative z-10">
            <form onSubmit={handleAnalyze} className="relative max-w-2xl mx-auto">
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
                    <div className="relative flex items-center bg-gray-900 rounded-2xl border border-white/10 p-2 shadow-2xl">
                        <Search className="w-6 h-6 text-gray-400 ml-3 mr-3" />
                        <input
                            type="text"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            placeholder="hostname.com"
                            className="w-full bg-transparent border-none outline-none text-lg text-white placeholder-gray-500 font-medium h-12"
                        />
                        <button
                            type="submit"
                            disabled={loading || !domain}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Analyze"}
                        </button>
                    </div>
                </div>
            </form>
        </div>

        {/* Results Area */}
        <AnimatePresence>
            {report && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="mt-16 space-y-10"
                >
                    {/* Score Header */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-10">
                        <HealthScore score={report.score} />
                        <div className="text-center md:text-left space-y-2">
                             <h2 className="text-3xl font-bold text-white">Analysis Report</h2>
                             <p className="text-gray-400">
                                Generated for <span className="font-mono text-blue-400">{report.domain}</span>
                             </p>
                             <div className="flex gap-2 justify-center md:justify-start mt-2">
                                <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm border border-green-500/20">
                                    {report.records.filter(r => r.status === 'valid').length} Valid
                                </span>
                                <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-sm border border-red-500/20">
                                    {report.records.filter(r => r.status === 'error').length} Errors
                                </span>
                             </div>
                        </div>
                        <button className="md:ml-auto flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white transition-colors border border-white/5 backdrop-blur-sm">
                             <Share2 className="w-4 h-4" />
                             Share Report
                        </button>
                    </div>

                    {/* Education Tip */}
                    <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-4 flex gap-4 items-start">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Lightbulb className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-blue-300 text-sm mb-1">Did you know?</h4>
                            <p className="text-sm text-gray-400">DNS propagation can take up to 48 hours, but modern DNS providers like Cloudflare often propagate changes in seconds.</p>
                        </div>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {report.records.map((record, index) => (
                            <ResultCard key={index} record={record} delay={index * 0.1} />
                        ))}
                    </div>
                    
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
}

function HealthScore({ score }: { score: number }) {
    const circumference = 2 * Math.PI * 40; // radius 40
    const offset = circumference - (score / 100) * circumference;
    
    let color = "text-red-500";
    if (score >= 90) color = "text-green-500";
    else if (score >= 50) color = "text-yellow-500";

    return (
        <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
                <circle
                    className="text-gray-800"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="64"
                    cy="64"
                />
                <circle
                    className={cn("transition-all duration-1000 ease-out", color)}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="64"
                    cy="64"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={cn("text-3xl font-bold", color)}>{score}</span>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Score</span>
            </div>
        </div>
    );
}

function ResultCard({ record, delay }: { record: DNSResult; delay: number }) {
    const [expanded, setExpanded] = useState(false);

    const icons = {
        valid: <CheckCircle className="w-5 h-5 text-green-500" />,
        warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
        error: <XCircle className="w-5 h-5 text-red-500" />
    };

    const borders = {
        valid: "border-green-500/20 hover:border-green-500/30",
        warning: "border-yellow-500/20 hover:border-yellow-500/30",
        error: "border-red-500/20 hover:border-red-500/30"
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className={cn(
                "glass-card p-5 rounded-xl border flex flex-col gap-3 group cursor-pointer",
                borders[record.status]
            )}
            onClick={() => setExpanded(!expanded)}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg">
                        {icons[record.status]}
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">{record.type} Record</h3>
                        <p className="text-sm text-gray-400">{record.message}</p>
                    </div>
                </div>
                <ChevronDown className={cn("text-gray-500 transition-transform", expanded && "rotate-180")} />
            </div>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-3 border-t border-white/5 space-y-3">
                            <p className="text-sm text-gray-300">{record.explanation}</p>
                            
                            {record.records.length > 0 ? (
                                <div className="space-y-2">
                                    {record.records.map((r, i) => (
                                        <div key={i} className="bg-black/30 p-2 rounded border border-white/5 font-mono text-xs text-blue-300 break-all flex justify-between items-center group/code">
                                            {r}
                                            <Copy className="w-3 h-3 text-gray-600 group-hover/code:text-white cursor-pointer" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-red-500/10 p-2 rounded text-xs text-red-300">
                                    No records found.
                                </div>
                            )}

                            {record.status === 'error' && (
                                <button className="w-full py-2 bg-blue-500/10 text-blue-400 text-sm font-medium rounded hover:bg-blue-500/20 transition-colors">
                                    Get Suggested Fix
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
