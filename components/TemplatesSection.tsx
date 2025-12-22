"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Template = {
  id: string;
  name: string;
  logo: string; // Using simple text/colors for now, could be SVGs
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
    id: "resend",
    name: "Resend",
    color: "from-black to-gray-800",
    logo: "R",
    records: [
      { type: "MX", name: "bounces", value: "feedback-smtp.us-east-1.amazonses.com", priority: 10 },
      { type: "TXT", name: "bounces", value: "v=spf1 include:amazonses.com ~all" },
      { type: "dkim", name: "resend._domainkey", value: "p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQ..." },
    ],
  },
  {
    id: "vercel",
    name: "Vercel",
    color: "from-black to-white",
    logo: "V",
    records: [
      { type: "A", name: "@", value: "76.76.21.21" },
      { type: "CNAME", name: "www", value: "cname.vercel-dns.com" },
    ],
  },
];

export default function TemplatesSection() {
  return (
    <section id="templates" className="py-24 bg-black/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Verified Templates</h2>
            <p className="text-gray-400">One-click copy configurations for your favorite tools.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
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
        <div className="glass-card rounded-xl p-6 border border-white/5 space-y-4">
            <div className="flex items-center gap-3 mb-2">
                <div className={cn("w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center font-bold text-white shadow-lg", template.color)}>
                    {template.logo}
                </div>
                <h3 className="font-semibold text-white">{template.name}</h3>
            </div>
            
            <div className="space-y-3">
                {template.records.map((record, i) => (
                    <div key={i} className="group relative bg-black/40 rounded-lg p-3 border border-white/5 hover:border-white/10 transition-colors">
                         <div className="flex justify-between items-start mb-1 text-xs text-gray-500 uppercase font-mono">
                            <span>{record.type}</span>
                            <span>{record.name}</span>
                        </div>
                        <div className="font-mono text-xs text-blue-300 break-all pr-8">
                            {record.value}
                        </div>
                        
                        <button 
                            onClick={() => handleCopy(record.value, i)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        >
                            {copiedIndex === i ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
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
