"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Loader2, CheckCircle, XCircle, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Resolver {
  name: string;
  region: string;
  endpoint: string;
  flag: string;
}

const resolvers: Resolver[] = [
  { name: "Google", region: "Global", endpoint: "https://dns.google/resolve", flag: "🌐" },
  { name: "Cloudflare", region: "Global", endpoint: "https://cloudflare-dns.com/dns-query", flag: "🌐" },
  { name: "Quad9", region: "Global", endpoint: "https://dns.quad9.net:5053/dns-query", flag: "🌐" },
  { name: "OpenDNS", region: "US", endpoint: "https://doh.opendns.com/dns-query", flag: "🇺🇸" },
  { name: "AdGuard", region: "EU", endpoint: "https://dns.adguard-dns.com/dns-query", flag: "🇪🇺" },
  { name: "DNS.SB", region: "EU", endpoint: "https://doh.dns.sb/dns-query", flag: "🇪🇺" },
];

interface PropResult {
  resolver: Resolver;
  records: string[];
  status: "success" | "error" | "pending";
  responseTime: number;
}

async function queryResolver(resolver: Resolver, domain: string, type: string): Promise<PropResult> {
  const start = performance.now();
  try {
    const url = `${resolver.endpoint}?name=${encodeURIComponent(domain)}&type=${type}`;
    const res = await fetch(url, {
      headers: { Accept: "application/dns-json" },
    });
    const data = await res.json();
    const elapsed = Math.round(performance.now() - start);
    const records = data.Answer ? data.Answer.map((a: { data: string }) => a.data) : [];
    return {
      resolver,
      records,
      status: records.length > 0 ? "success" : "error",
      responseTime: elapsed,
    };
  } catch {
    return {
      resolver,
      records: [],
      status: "error",
      responseTime: Math.round(performance.now() - start),
    };
  }
}

export default function PropagationChecker() {
  const [domain, setDomain] = useState("");
  const [recordType, setRecordType] = useState("A");
  const [results, setResults] = useState<PropResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;

    setLoading(true);
    setResults(resolvers.map((r) => ({ resolver: r, records: [], status: "pending", responseTime: 0 })));

    const promises = resolvers.map(async (resolver) => {
      const result = await queryResolver(resolver, domain, recordType);
      setResults((prev) => prev.map((p) => (p.resolver.name === resolver.name ? result : p)));
      return result;
    });

    await Promise.all(promises);
    setLoading(false);
  };

  const recordTypes = ["A", "AAAA", "MX", "TXT", "CNAME", "NS"];

  const successCount = results.filter((r) => r.status === "success").length;
  const totalChecked = results.filter((r) => r.status !== "pending").length;

  return (
    <section id="propagation" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">DNS Propagation Checker</h2>
          <p className="text-gray-400">Check if your DNS records have propagated across global resolvers.</p>
        </div>

        <form onSubmit={handleCheck} className="max-w-2xl mx-auto mb-12">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Globe className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value.replace(/^https?:\/\//, "").replace(/\/.*$/, ""))}
                placeholder="example.com"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-blue-500/50 transition-colors backdrop-blur-sm"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={recordType}
                onChange={(e) => setRecordType(e.target.value)}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500/50 transition-colors backdrop-blur-sm cursor-pointer"
              >
                {recordTypes.map((t) => (
                  <option key={t} value={t} className="bg-gray-900">{t}</option>
                ))}
              </select>
              <button
                type="submit"
                disabled={loading || !domain}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Check
              </button>
            </div>
          </div>
        </form>

        {/* Progress indicator */}
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {totalChecked > 0 && (
                <div className="max-w-2xl mx-auto mb-8">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Propagation Status</span>
                    <span>{successCount}/{resolvers.length} resolvers responding</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className={cn(
                        "h-full rounded-full transition-all",
                        successCount === resolvers.length ? "bg-green-500" :
                        successCount > 0 ? "bg-yellow-500" : "bg-red-500"
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${(successCount / resolvers.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                {results.map((result, i) => (
                  <motion.div
                    key={result.resolver.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className={cn(
                      "glass-card p-4 rounded-xl border",
                      result.status === "success" ? "border-green-500/20" :
                      result.status === "error" ? "border-red-500/20" :
                      "border-white/5"
                    )}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{result.resolver.flag}</span>
                        <div>
                          <h4 className="font-semibold text-white text-sm">{result.resolver.name}</h4>
                          <p className="text-xs text-gray-500">{result.resolver.region}</p>
                        </div>
                      </div>
                      {result.status === "pending" ? (
                        <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
                      ) : result.status === "success" ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>

                    {result.status !== "pending" && (
                      <div className="space-y-1">
                        {result.records.length > 0 ? (
                          result.records.slice(0, 3).map((r, j) => (
                            <div key={j} className="font-mono text-xs text-blue-300 bg-black/30 px-2 py-1 rounded break-all">
                              {r}
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-red-400">No records found</p>
                        )}
                        {result.records.length > 3 && (
                          <p className="text-xs text-gray-500">+{result.records.length - 3} more</p>
                        )}
                        <p className="text-xs text-gray-600 mt-1">{result.responseTime}ms</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
