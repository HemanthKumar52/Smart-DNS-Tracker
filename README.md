# Smart DNS Tracker 🌐

> **DNS Diagnostics Made Simple**

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
[![Deployed on Vercel](https://img.shields.io/badge/deployed%20on-Vercel-black.svg)](https://smart-dns-tracker.vercel.app/)

Stop guessing why your emails land in spam. **Smart DNS Tracker** helps you diagnose DNS issues, verify global propagation, and improve email deliverability with AI-powered explanations.

## 🔗 Live Demo

**[https://smart-dns-tracker.vercel.app/](https://smart-dns-tracker.vercel.app/)**

## 🚀 Features

- **DNS Analyzer** — Enter any domain and get a full health score covering MX, SPF, DMARC, and A records with detailed explanations and one-click copy for record values.
- **DNS Propagation Checker** — Check if your DNS records have propagated across 6 global resolvers (Google, Cloudflare, Quad9, OpenDNS, AdGuard, DNS.SB) with real-time response times.
- **DNS Compare** — Side-by-side comparison of two domains' DNS configurations and health scores.
- **Verified Templates** — One-click copy DNS configurations for Google Workspace, Microsoft 365, Vercel, Cloudflare, SendGrid, AWS SES, Resend, and Zoho Mail.
- **Learn DNS** — Interactive accordion guide covering A, MX, SPF, DMARC, CNAME, and NS records with explanations and examples.
- **Dark / Light Mode** — Full theme toggle with persistent preference saved to localStorage.
- **Search History** — Recent domain lookups stored locally with scores and timestamps.
- **Keyboard Shortcuts** — Press `/` or `Ctrl+K` to focus the search bar instantly.

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Icons**: [Lucide React](https://lucide.dev)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **DNS Resolution**: [Google DNS-over-HTTPS API](https://dns.google) & [Cloudflare DoH](https://cloudflare-dns.com)
- **Deployment**: [Vercel](https://vercel.com)

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with theme support
│   ├── page.tsx            # Main page composing all sections
│   └── globals.css         # Tailwind config, CSS variables, glass utilities
├── components/
│   ├── Navbar.tsx           # Navigation bar with theme toggle
│   ├── DNSAnalyzer.tsx      # Domain analyzer with health scoring
│   ├── Features.tsx         # Feature cards section
│   ├── TemplatesSection.tsx # DNS config templates
│   ├── PropagationChecker.tsx # Multi-resolver propagation check
│   ├── DNSCompare.tsx       # Side-by-side domain comparison
│   ├── LearnDNS.tsx         # Interactive DNS education guide
│   └── Footer.tsx           # Footer with navigation links
├── lib/
│   ├── dns.ts              # DNS analysis logic (Google DoH API)
│   └── utils.ts            # Tailwind class merge utility
```

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm, yarn, pnpm, or bun

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/HemanthKumar52/Smart-DNS-Tracker.git
    cd Smart-DNS-Tracker
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Open the app**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  **Fork the Project**
2.  **Create your Feature Branch**
    ```bash
    git checkout -b feature/AmazingFeature
    ```
3.  **Commit your Changes**
    ```bash
    git commit -m 'Add some AmazingFeature'
    ```
4.  **Push to the Branch**
    ```bash
    git push origin feature/AmazingFeature
    ```
5.  **Open a Pull Request**

---

Project Link: [https://github.com/HemanthKumar52/Smart-DNS-Tracker](https://github.com/HemanthKumar52/Smart-DNS-Tracker)
