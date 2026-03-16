"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftRight, Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { analyzeDomain, type AnalysisReport } from "@/lib/dns";
import { cn } from "@/lib/utils";

export default function DNSCompare() {
  const [domainA, setDomainA] = useState("");
  const [domainB, setDomainB] = useState("");
  const [reportA, setReportA] = useState<AnalysisReport | null>(null);
  const [reportB, setReportB] = useState<AnalysisReport | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainA || !domainB) return;

    setLoading(true);
    setReportA(null);
    setReportB(null);

    try {
      const [a, b] = await Promise.all([analyzeDomain(domainA), analyzeDomain(domainB)]);
      setReportA(a);
      setReportB(b);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statusIcon = (status: string) => {
    if (status === "valid") return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (status === "warning") return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  const scoreColor = (score: number) => {
    if (score >= 90) return "text-green-500 dark:text-green-400";
    if (score >= 50) return "text-yellow-500 dark:text-yellow-400";
    return "text-red-500 dark:text-red-400";
  };

  return (
    <section id="compare" className="py-24 bg-gray-50/50 dark:bg-black/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Compare DNS Records</h2>
          <p className="text-gray-600 dark:text-gray-400">Side-by-side comparison of two domains' DNS configuration.</p>
        </div>

        <form onSubmit={handleCompare} className="max-w-3xl mx-auto mb-12">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              value={domainA}
              onChange={(e) => setDomainA(e.target.value.replace(/^https?:\/\//, "").replace(/\/.*$/, ""))}
              placeholder="first-domain.com"
              className="w-full sm:flex-1 px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-blue-500/50 transition-colors backdrop-blur-sm"
            />
            <ArrowLeftRight className="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0" />
            <input
              type="text"
              value={domainB}
              onChange={(e) => setDomainB(e.target.value.replace(/^https?:\/\//, "").replace(/\/.*$/, ""))}
              placeholder="second-domain.com"
              className="w-full sm:flex-1 px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-blue-500/50 transition-colors backdrop-blur-sm"
            />
            <button
              type="submit"
              disabled={loading || !domainA || !domainB}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Compare"}
            </button>
          </div>
        </form>

        <AnimatePresence>
          {reportA && reportB && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-5xl mx-auto"
            >
              {/* Score Comparison */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                {[reportA, reportB].map((report, idx) => (
                  <div key={idx} className="glass-card rounded-xl p-6 text-center border border-gray-200 dark:border-white/5">
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-mono mb-2">{report.domain}</p>
                    <p className={cn("text-4xl font-bold", scoreColor(report.score))}>{report.score}</p>
                    <p className="text-xs text-gray-500 mt-1">Health Score</p>
                  </div>
                ))}
              </div>

              {/* Record-by-record comparison */}
              <div className="space-y-4">
                {reportA.records.map((recA, i) => {
                  const recB = reportB.records[i];
                  if (!recB) return null;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass-card rounded-xl border border-gray-200 dark:border-white/5 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{recA.type} Record</h4>
                      </div>
                      <div className="grid grid-cols-2 divide-x divide-gray-200 dark:divide-white/5">
                        {[recA, recB].map((rec, j) => (
                          <div key={j} className="p-4 space-y-2">
                            <div className="flex items-center gap-2">
                              {statusIcon(rec.status)}
                              <span className="text-sm text-gray-600 dark:text-gray-300">{rec.message}</span>
                            </div>
                            {rec.records.length > 0 ? (
                              rec.records.map((r, k) => (
                                <div key={k} className="font-mono text-xs text-blue-600 dark:text-blue-300 bg-gray-100 dark:bg-black/30 px-2 py-1 rounded break-all">
                                  {r}
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-red-500 dark:text-red-400">No records</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
