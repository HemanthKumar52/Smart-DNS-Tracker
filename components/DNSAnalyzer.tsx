"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Loader2, CheckCircle, AlertTriangle, XCircle,
  ChevronDown, Copy, Share2, Lightbulb, Clock, Trash2,
  Check, Download, Clipboard
} from "lucide-react";
import { analyzeDomain, type AnalysisReport, type DNSResult } from "@/lib/dns";
import { cn } from "@/lib/utils";

interface HistoryEntry {
  domain: string;
  score: number;
  timestamp: number;
}

function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("dns-history") || "[]");
  } catch {
    return [];
  }
}

function saveHistory(entry: HistoryEntry) {
  const history = getHistory().filter((h) => h.domain !== entry.domain);
  history.unshift(entry);
  localStorage.setItem("dns-history", JSON.stringify(history.slice(0, 20)));
}

function clearHistory() {
  localStorage.removeItem("dns-history");
}

function isValidDomain(domain: string): boolean {
  const pattern = /^(?!:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
  return pattern.test(domain.trim());
}

export default function DNSAnalyzer() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  // Keyboard shortcut: "/" or Ctrl+K to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        inputRef.current?.blur();
        setShowHistory(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleDomainChange = (val: string) => {
    // Strip protocol and paths
    let cleaned = val.replace(/^https?:\/\//, "").replace(/\/.*$/, "").trim();
    setDomain(cleaned);
    if (cleaned && !isValidDomain(cleaned)) {
      setValidationError("Enter a valid domain (e.g., example.com)");
    } else {
      setValidationError("");
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain || !isValidDomain(domain)) {
      setValidationError("Enter a valid domain (e.g., example.com)");
      return;
    }

    setLoading(true);
    setReport(null);
    setShowHistory(false);
    setValidationError("");

    await new Promise((r) => setTimeout(r, 800));

    try {
      const data = await analyzeDomain(domain);
      setReport(data);
      const entry: HistoryEntry = { domain: data.domain, score: data.score, timestamp: data.timestamp };
      saveHistory(entry);
      setHistory(getHistory());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryClick = (d: string) => {
    setDomain(d);
    setShowHistory(false);
    setValidationError("");
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  const copyReportToClipboard = () => {
    if (!report) return;
    const lines = [
      `DNS Analysis Report — ${report.domain}`,
      `Score: ${report.score}/100`,
      `Date: ${new Date(report.timestamp).toLocaleString()}`,
      "",
      ...report.records.map(
        (r) => `[${r.status.toUpperCase()}] ${r.type} Record — ${r.message}\n  ${r.explanation}${r.records.length ? "\n  Values: " + r.records.join(", ") : ""}`
      ),
    ];
    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // TLD suggestions
  const tldSuggestions = [".com", ".io", ".dev", ".org", ".net"];
  const showTldHints = domain.length > 0 && !domain.includes(".") && !loading;

  return (
    <div className="w-full">
      {/* Keyboard shortcut hint */}
      <div className="text-center mb-3">
        <span className="text-xs text-gray-500 dark:text-gray-600">
          Press <kbd className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 text-gray-500 dark:text-gray-400 font-mono text-[10px]">/</kbd> or{" "}
          <kbd className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 text-gray-500 dark:text-gray-400 font-mono text-[10px]">Ctrl+K</kbd> to focus search
        </span>
      </div>

      {/* Search Input */}
      <div className="relative z-10">
        <form onSubmit={handleAnalyze} className="relative max-w-2xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
            <div className="relative flex items-center bg-white dark:bg-gray-900 rounded-2xl border border-black/10 dark:border-white/10 p-2 shadow-2xl">
              <Search className="w-6 h-6 text-gray-400 ml-3 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={domain}
                onChange={(e) => handleDomainChange(e.target.value)}
                onFocus={() => history.length > 0 && setShowHistory(true)}
                onBlur={() => setTimeout(() => setShowHistory(false), 200)}
                placeholder="hostname.com"
                className="w-full bg-transparent border-none outline-none text-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-medium h-12"
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

          {/* Validation Error */}
          {validationError && (
            <p className="text-red-500 dark:text-red-400 text-xs mt-2 ml-4">{validationError}</p>
          )}

          {/* TLD Suggestions */}
          {showTldHints && (
            <div className="flex gap-2 mt-2 ml-4 flex-wrap">
              {tldSuggestions.map((tld) => (
                <button
                  key={tld}
                  type="button"
                  onClick={() => { setDomain(domain + tld); setValidationError(""); }}
                  className="text-xs px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                >
                  {domain}{tld}
                </button>
              ))}
            </div>
          )}

          {/* Search History Dropdown */}
          <AnimatePresence>
            {showHistory && history.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute top-full mt-2 w-full glass rounded-xl overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-2 border-b border-black/10 dark:border-white/10">
                  <span className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Recent Searches
                  </span>
                  <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); handleClearHistory(); }}
                    className="text-xs text-gray-500 hover:text-red-400 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Clear
                  </button>
                </div>
                {history.slice(0, 8).map((h, i) => (
                  <button
                    key={i}
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); handleHistoryClick(h.domain); }}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Search className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-sm text-gray-900 dark:text-white font-mono">{h.domain}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "text-xs font-semibold px-2 py-0.5 rounded-full",
                        h.score >= 90 ? "bg-green-500/10 text-green-600 dark:text-green-400" :
                        h.score >= 50 ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400" :
                        "bg-red-500/10 text-red-600 dark:text-red-400"
                      )}>
                        {h.score}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-600">
                        {new Date(h.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
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
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Analysis Report</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Generated for <span className="font-mono text-blue-600 dark:text-blue-400">{report.domain}</span>
                </p>
                <div className="flex gap-2 justify-center md:justify-start mt-2">
                  <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm border border-green-500/20">
                    {report.records.filter((r) => r.status === "valid").length} Valid
                  </span>
                  <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-sm border border-yellow-500/20">
                    {report.records.filter((r) => r.status === "warning").length} Warnings
                  </span>
                  <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-sm border border-red-500/20">
                    {report.records.filter((r) => r.status === "error").length} Errors
                  </span>
                </div>
              </div>
              <div className="md:ml-auto flex gap-2">
                <button
                  onClick={copyReportToClipboard}
                  className="flex items-center gap-2 px-4 py-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg text-sm text-gray-700 dark:text-white transition-colors border border-black/5 dark:border-white/5 backdrop-blur-sm"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Clipboard className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy Report"}
                </button>
                <button
                  onClick={() => {
                    if (!report) return;
                    const lines = [
                      `DNS Analysis Report — ${report.domain}`,
                      `Score: ${report.score}/100`,
                      `Date: ${new Date(report.timestamp).toLocaleString()}`,
                      "",
                      ...report.records.map(
                        (r) => `[${r.status.toUpperCase()}] ${r.type} Record — ${r.message}\n  ${r.explanation}${r.records.length ? "\n  Values: " + r.records.join(", ") : ""}`
                      ),
                      "",
                      `Analyzed with Smart DNS Tracker`,
                    ];
                    if (navigator.share) {
                      navigator.share({ title: `DNS Report: ${report.domain}`, text: lines.join("\n") }).catch(() => {});
                    } else {
                      navigator.clipboard.writeText(lines.join("\n"));
                      setShared(true);
                      setTimeout(() => setShared(false), 2000);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg text-sm text-gray-700 dark:text-white transition-colors border border-black/5 dark:border-white/5 backdrop-blur-sm"
                >
                  {shared ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
                  {shared ? "Copied!" : "Share"}
                </button>
              </div>
            </div>

            {/* Education Tip */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4 flex gap-4 items-start">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Lightbulb className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-700 dark:text-blue-300 text-sm mb-1">Did you know?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  DNS propagation can take up to 48 hours, but modern DNS providers like Cloudflare often propagate changes in seconds.
                </p>
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
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  let color = "text-red-500";
  if (score >= 90) color = "text-green-500";
  else if (score >= 50) color = "text-yellow-500";

  return (
    <div className="relative w-32 h-32 flex items-center justify-center" role="img" aria-label={`Health score: ${score} out of 100`}>
      <svg className="w-full h-full transform -rotate-90">
        <circle className="text-gray-200 dark:text-gray-800" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="64" cy="64" />
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

function getSuggestedFix(record: DNSResult): { title: string; steps: string[]; example: string } {
  switch (record.type) {
    case "MX":
      return {
        title: "Add MX Records",
        steps: [
          "Log in to your DNS provider (e.g., Cloudflare, GoDaddy, Namecheap).",
          "Navigate to DNS management for your domain.",
          "Add an MX record pointing to your email provider.",
          "Set the priority (lower = higher priority).",
          "Save and wait for propagation (up to 48 hours).",
        ],
        example: "MX 10 mail.example.com\nMX 20 mail2.example.com",
      };
    case "TXT":
      if (record.message.toLowerCase().includes("spf")) {
        return {
          title: record.message.includes("Weak") ? "Strengthen Your SPF Record" : "Add an SPF Record",
          steps: record.message.includes("Weak")
            ? [
                "Your current SPF record uses +all or ?all which allows anyone to send as you.",
                "Replace +all or ?all with ~all (softfail) or -all (hardfail).",
                "Update the TXT record in your DNS provider.",
              ]
            : [
                "Log in to your DNS provider.",
                "Add a TXT record for your root domain (@).",
                "Set the value to your SPF policy authorizing your email senders.",
                "Use ~all (softfail) or -all (hardfail) at the end.",
              ],
          example: record.message.includes("Weak")
            ? 'v=spf1 include:_spf.google.com ~all'
            : 'v=spf1 include:_spf.google.com ~all',
        };
      }
      if (record.message.toLowerCase().includes("dmarc")) {
        return {
          title: "Add a DMARC Record",
          steps: [
            "Log in to your DNS provider.",
            "Add a TXT record for _dmarc.yourdomain.com.",
            "Start with a monitoring policy (p=none) to collect reports.",
            "Gradually move to p=quarantine then p=reject as you verify legitimate senders.",
          ],
          example: 'v=DMARC1; p=none; rua=mailto:dmarc-reports@yourdomain.com',
        };
      }
      return {
        title: "Add Missing TXT Record",
        steps: [
          "Log in to your DNS provider.",
          "Add a TXT record with the required value.",
          "Save and wait for propagation.",
        ],
        example: '"v=spf1 include:your-provider.com ~all"',
      };
    default:
      return {
        title: `Fix ${record.type} Record`,
        steps: [
          "Log in to your DNS provider.",
          `Add or update the ${record.type} record for your domain.`,
          "Save changes and allow time for DNS propagation.",
        ],
        example: `${record.type} record value depends on your provider.`,
      };
  }
}

function ResultCard({ record, delay }: { record: DNSResult; delay: number }) {
  const [expanded, setExpanded] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [showFix, setShowFix] = useState(false);

  const icons = {
    valid: <CheckCircle className="w-5 h-5 text-green-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
  };

  const borders = {
    valid: "border-green-500/20 hover:border-green-500/30",
    warning: "border-yellow-500/20 hover:border-yellow-500/30",
    error: "border-red-500/20 hover:border-red-500/30",
  };

  const handleCopyRecord = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
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
          <div className="p-2 bg-black/5 dark:bg-white/5 rounded-lg">{icons[record.status]}</div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{record.type} Record</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{record.message}</p>
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
            <div className="pt-3 border-t border-black/5 dark:border-white/5 space-y-3" onClick={(e) => e.stopPropagation()}>
              <p className="text-sm text-gray-600 dark:text-gray-300">{record.explanation}</p>

              {record.records.length > 0 ? (
                <div className="space-y-2">
                  {record.records.map((r, i) => (
                    <div
                      key={i}
                      className="bg-gray-100 dark:bg-black/30 p-2 rounded border border-gray-200 dark:border-white/5 font-mono text-xs text-blue-600 dark:text-blue-300 break-all flex justify-between items-center group/code"
                    >
                      <span className="mr-2">{r}</span>
                      <button
                        onClick={() => handleCopyRecord(r, i)}
                        className="shrink-0 p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                      >
                        {copiedIdx === i ? (
                          <Check className="w-3 h-3 text-green-400" />
                        ) : (
                          <Copy className="w-3 h-3 text-gray-400 dark:text-gray-600 group-hover/code:text-gray-900 dark:group-hover/code:text-white" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-red-500/10 p-2 rounded text-xs text-red-600 dark:text-red-300">No records found.</div>
              )}

              {(record.status === "error" || record.status === "warning") && (
                <>
                  <button
                    onClick={() => setShowFix(!showFix)}
                    className="w-full py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium rounded hover:bg-blue-500/20 transition-colors"
                  >
                    {showFix ? "Hide Fix" : "Get Suggested Fix"}
                  </button>
                  <AnimatePresence>
                    {showFix && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/20 rounded-lg space-y-3">
                          <h5 className="font-semibold text-blue-700 dark:text-blue-300 text-sm">
                            {getSuggestedFix(record).title}
                          </h5>
                          <ol className="list-decimal list-inside space-y-1">
                            {getSuggestedFix(record).steps.map((step, i) => (
                              <li key={i} className="text-xs text-gray-600 dark:text-gray-300">{step}</li>
                            ))}
                          </ol>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">Example record:</p>
                            <div className="bg-gray-100 dark:bg-black/30 p-2 rounded font-mono text-xs text-blue-600 dark:text-blue-300 break-all whitespace-pre-wrap">
                              {getSuggestedFix(record).example}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
