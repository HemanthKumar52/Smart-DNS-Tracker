"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, BookOpen, Shield, Mail, Globe, Server, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface DNSTopic {
  id: string;
  icon: React.ReactNode;
  title: string;
  tagline: string;
  color: string;
  sections: { heading: string; content: string }[];
  example?: string;
}

const topics: DNSTopic[] = [
  {
    id: "a-record",
    icon: <Globe className="w-5 h-5" />,
    title: "A Record",
    tagline: "Points your domain to an IP address",
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    sections: [
      {
        heading: "What is it?",
        content: "An A (Address) record maps a domain name to an IPv4 address. It's the most fundamental DNS record — when someone types your domain in a browser, the A record tells the internet which server to connect to.",
      },
      {
        heading: "Why does it matter?",
        content: "Without an A record, your domain won't resolve to a website. It's the foundation of making your site accessible to the world.",
      },
      {
        heading: "Common issues",
        content: "Pointing to the wrong IP, having stale records after migrating servers, or missing A records entirely when using a CNAME at the root.",
      },
    ],
    example: "example.com.  300  IN  A  93.184.216.34",
  },
  {
    id: "mx-record",
    icon: <Mail className="w-5 h-5" />,
    title: "MX Record",
    tagline: "Routes email to your mail server",
    color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    sections: [
      {
        heading: "What is it?",
        content: "MX (Mail Exchange) records tell other mail servers where to deliver emails for your domain. They include a priority number — lower numbers get tried first.",
      },
      {
        heading: "Why does it matter?",
        content: "No MX record = no email. If you use Google Workspace, Microsoft 365, or any email service, your MX records must point to their servers.",
      },
      {
        heading: "Best practices",
        content: "Always have at least 2 MX records with different priorities for redundancy. Keep TTL values reasonable (300-3600s).",
      },
    ],
    example: "example.com.  300  IN  MX  10  mail.example.com.",
  },
  {
    id: "spf",
    icon: <Shield className="w-5 h-5" />,
    title: "SPF Record",
    tagline: "Prevents email spoofing",
    color: "text-green-400 bg-green-500/10 border-green-500/20",
    sections: [
      {
        heading: "What is it?",
        content: "SPF (Sender Policy Framework) is a TXT record that lists which servers are authorized to send email on behalf of your domain. Receiving servers check this to verify the sender.",
      },
      {
        heading: "Why does it matter?",
        content: "Without SPF, anyone can send emails pretending to be from your domain. This leads to phishing attacks and your legitimate emails landing in spam.",
      },
      {
        heading: "Common mistakes",
        content: "Using +all (allows everyone), having multiple SPF records (only one is allowed), exceeding the 10 DNS lookup limit, or forgetting to include all your sending services.",
      },
    ],
    example: 'v=spf1 include:_spf.google.com include:sendgrid.net ~all',
  },
  {
    id: "dmarc",
    icon: <Lock className="w-5 h-5" />,
    title: "DMARC Record",
    tagline: "Policy for handling failed authentication",
    color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    sections: [
      {
        heading: "What is it?",
        content: "DMARC (Domain-based Message Authentication, Reporting & Conformance) tells receiving mail servers what to do when an email fails SPF or DKIM checks. It also lets you receive reports about authentication failures.",
      },
      {
        heading: "Why does it matter?",
        content: "DMARC is the final layer of email authentication. It prevents spoofing, increases deliverability, and gives you visibility into who is sending email as your domain.",
      },
      {
        heading: "Policy levels",
        content: "p=none (monitor only), p=quarantine (send to spam), p=reject (block entirely). Start with 'none' and gradually move to 'reject' as you verify all legitimate senders.",
      },
    ],
    example: 'v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@example.com; pct=100',
  },
  {
    id: "cname",
    icon: <Server className="w-5 h-5" />,
    title: "CNAME Record",
    tagline: "Creates an alias to another domain",
    color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    sections: [
      {
        heading: "What is it?",
        content: "A CNAME (Canonical Name) record creates an alias from one domain to another. Instead of pointing to an IP, it points to another domain name which then resolves to an IP.",
      },
      {
        heading: "Why does it matter?",
        content: "CNAMEs are essential for pointing subdomains to services like Vercel, Netlify, or AWS. They make DNS management simpler when IPs change.",
      },
      {
        heading: "Limitations",
        content: "You cannot have a CNAME at the root domain (example.com) alongside other records. CNAMEs add an extra DNS lookup, slightly increasing latency.",
      },
    ],
    example: "www.example.com.  300  IN  CNAME  example.vercel-dns.com.",
  },
  {
    id: "ns",
    icon: <Globe className="w-5 h-5" />,
    title: "NS Record",
    tagline: "Delegates DNS authority",
    color: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    sections: [
      {
        heading: "What is it?",
        content: "NS (Name Server) records specify which DNS servers are authoritative for your domain. They delegate the responsibility of answering DNS queries to specific servers.",
      },
      {
        heading: "Why does it matter?",
        content: "NS records are set at your domain registrar and determine which DNS provider manages your domain. Incorrect NS records mean your entire domain stops working.",
      },
      {
        heading: "Best practices",
        content: "Always have at least 2 NS records for redundancy. When migrating DNS providers, update NS records last and verify everything works before removing old records.",
      },
    ],
    example: "example.com.  86400  IN  NS  ns1.cloudflare.com.",
  },
];

export default function LearnDNS() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section id="learn" className="py-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            Interactive Guide
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Learn DNS Records</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Understanding DNS doesn't require a CS degree. Click any record type below to learn what it does, why it matters, and how to configure it correctly.
          </p>
        </div>

        <div className="space-y-4">
          {topics.map((topic, i) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <div
                className={cn(
                  "glass-card rounded-xl border cursor-pointer transition-all",
                  expandedId === topic.id ? "border-white/10" : "border-white/5 hover:border-white/10"
                )}
              >
                <button
                  onClick={() => setExpandedId(expandedId === topic.id ? null : topic.id)}
                  className="w-full p-5 flex items-center gap-4 text-left"
                >
                  <div className={cn("p-2.5 rounded-xl border", topic.color)}>
                    {topic.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white">{topic.title}</h3>
                    <p className="text-sm text-gray-400">{topic.tagline}</p>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-gray-500 transition-transform shrink-0",
                      expandedId === topic.id && "rotate-180"
                    )}
                  />
                </button>

                <AnimatePresence>
                  {expandedId === topic.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4">
                        {topic.sections.map((section, j) => (
                          <div key={j}>
                            <h4 className="text-sm font-semibold text-gray-300 mb-1">{section.heading}</h4>
                            <p className="text-sm text-gray-400 leading-relaxed">{section.content}</p>
                          </div>
                        ))}

                        {topic.example && (
                          <div className="mt-3">
                            <h4 className="text-sm font-semibold text-gray-300 mb-2">Example</h4>
                            <div className="bg-black/40 rounded-lg p-3 border border-white/5 font-mono text-xs text-blue-300 break-all">
                              {topic.example}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
