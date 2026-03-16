"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type Template = {
  id: string;
  name: string;
  logo: string;
  color: string;
  records: { type: string; name: string; value: string; priority?: number }[];
};

const templates: Template[] = [
  {
    id: "google",
    name: "Google Workspace",
    color: "from-blue-500 to-red-500",
    logo: "G",
    records: [
      { type: "MX", name: "@", value: "SMTP.GOOGLE.COM.", priority: 1 },
      { type: "TXT", name: "@", value: "v=spf1 include:_spf.google.com ~all" },
    ],
  },
  {
    id: "microsoft",
    name: "Microsoft 365",
    color: "from-blue-600 to-cyan-500",
    logo: "M",
    records: [
      { type: "MX", name: "@", value: "*.mail.protection.outlook.com", priority: 0 },
      { type: "TXT", name: "@", value: "v=spf1 include:spf.protection.outlook.com -all" },
      { type: "CNAME", name: "autodiscover", value: "autodiscover.outlook.com" },
    ],
  },
  {
    id: "resend",
    name: "Resend",
    color: "from-black to-gray-800",
    logo: "R",
    records: [
      { type: "MX", name: "bounces", value: "feedback-smtp.us-east-1.amazonses.com", priority: 10 },
      { type: "TXT", name: "bounces", value: "v=spf1 include:amazonses.com ~all" },
      { type: "DKIM", name: "resend._domainkey", value: "p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQ..." },
    ],
  },
  {
    id: "sendgrid",
    name: "SendGrid",
    color: "from-blue-500 to-blue-700",
    logo: "SG",
    records: [
      { type: "CNAME", name: "em1234", value: "u1234567.wl123.sendgrid.net" },
      { type: "CNAME", name: "s1._domainkey", value: "s1.domainkey.u1234567.wl123.sendgrid.net" },
      { type: "CNAME", name: "s2._domainkey", value: "s2.domainkey.u1234567.wl123.sendgrid.net" },
      { type: "TXT", name: "@", value: "v=spf1 include:sendgrid.net ~all" },
    ],
  },
  {
    id: "vercel",
    name: "Vercel",
    color: "from-gray-900 to-gray-600",
    logo: "V",
    records: [
      { type: "A", name: "@", value: "76.76.21.21" },
      { type: "CNAME", name: "www", value: "cname.vercel-dns.com" },
    ],
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    color: "from-orange-500 to-yellow-500",
    logo: "CF",
    records: [
      { type: "NS", name: "@", value: "*.ns.cloudflare.com" },
      { type: "A", name: "@", value: "Proxied via Cloudflare" },
      { type: "TXT", name: "@", value: "v=spf1 include:_spf.mx.cloudflare.net ~all" },
    ],
  },
  {
    id: "aws-ses",
    name: "AWS SES",
    color: "from-orange-500 to-yellow-600",
    logo: "AWS",
    records: [
      { type: "MX", name: "mail", value: "inbound-smtp.us-east-1.amazonaws.com", priority: 10 },
      { type: "TXT", name: "@", value: "v=spf1 include:amazonses.com ~all" },
      { type: "TXT", name: "_dmarc", value: "v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com" },
    ],
  },
  {
    id: "zoho",
    name: "Zoho Mail",
    color: "from-red-500 to-red-700",
    logo: "Z",
    records: [
      { type: "MX", name: "@", value: "mx.zoho.com", priority: 10 },
      { type: "MX", name: "@", value: "mx2.zoho.com", priority: 20 },
      { type: "TXT", name: "@", value: "v=spf1 include:zoho.com ~all" },
    ],
  },
];

export default function TemplatesSection() {
  const [filter, setFilter] = useState("");

  const filtered = templates.filter((t) =>
    t.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <section id="templates" className="py-24 bg-black/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Verified Templates</h2>
          <p className="text-gray-400 mb-6">One-click copy configurations for your favorite tools.</p>

          {/* Search/filter */}
          <div className="max-w-sm mx-auto relative">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter templates..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500/50 transition-colors backdrop-blur-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((template, i) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <TemplateCard template={template} />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No templates match your search.</p>
        )}
      </div>
    </section>
  );
}

function TemplateCard({ template }: { template: Template }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="glass-card rounded-xl p-6 border border-white/5 space-y-4 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-2">
        <div
          className={cn(
            "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center font-bold text-white shadow-lg text-xs",
            template.color
          )}
        >
          {template.logo}
        </div>
        <h3 className="font-semibold text-white">{template.name}</h3>
      </div>

      <div className="space-y-3 flex-1">
        {template.records.map((record, i) => (
          <div
            key={i}
            className="group relative bg-black/40 rounded-lg p-3 border border-white/5 hover:border-white/10 transition-colors"
          >
            <div className="flex justify-between items-start mb-1 text-xs text-gray-500 uppercase font-mono">
              <span>{record.type}</span>
              <span>{record.name}</span>
            </div>
            <div className="font-mono text-xs text-blue-300 break-all pr-8">{record.value}</div>

            <button
              onClick={() => handleCopy(record.value, i)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              {copiedIndex === i ? (
                <Check className="w-3.5 h-3.5 text-green-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        ))}
      </div>

      <button className="w-full mt-2 py-2 text-xs font-medium text-center text-gray-500 hover:text-white transition-colors border-t border-white/5 pt-4">
        View Full Documentation →
      </button>
    </div>
  );
}
