import { motion } from "framer-motion";
import { PublicNavbar } from "@/components/PublicNavbar";
import { CodeBlock } from "@/components/code-block";
import { GlassCard } from "@/components/glass-card";
import { 
  Book, Code, Terminal, Zap, Shield, 
  Cpu, CheckCircle2, Info, 
  ChevronRight, Share2
} from "lucide-react";
import { useState, useEffect } from "react";

const sections = [
  { id: "intro", title: "Introduction", icon: <Book className="w-4 h-4" /> },
  { id: "get-started", title: "Getting Started", icon: <Zap className="w-4 h-4" /> },
  { id: "installation", title: "Installation", icon: <Terminal className="w-4 h-4" /> },
  { id: "configuration", title: "Configuration", icon: <Cpu className="w-4 h-4" /> },
  { id: "upload-express", title: "Express Integration", icon: <Code className="w-4 h-4" /> },
  { id: "response", title: "Response Structure", icon: <Shield className="w-4 h-4" /> },
];

const configExample = `import { RRVault } from "@rr-vault/r2";

RRVault.config({
  appId: process.env.RRVAULT_APP_ID,
  apiKey: process.env.RRVAULT_API_KEY,
  secretKey: process.env.RRVAULT_SECRET_KEY,
});`;

const expressExample = `import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import { RRVault } from "@rr-vault/r2";

dotenv.config();

// Configure RR Vault SDK
RRVault.config({
  appId: process.env.RRVAULT_APP_ID,
  apiKey: process.env.RRVAULT_API_KEY,
  secretKey: process.env.RRVAULT_SECRET_KEY,
});

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file provided" });
  }

  try {
    const response = await RRVault.upload(
      req.file.buffer, 
      req.file.originalname, 
      {
        contentType: req.file.mimetype,
      }
    );
    
    // Returns the public URL and metadata
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3030, () => console.log("Server running on port 3030"));`;

export function DocsPage() {
  const [activeSection, setActiveSection] = useState("intro");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      for (const section of [...sections].reverse()) {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-[#E2E8F0]">
      <PublicNavbar />
      
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] bg-[#7C3AED]/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] right-[10%] w-[35%] h-[35%] bg-[#22D3EE]/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 pt-32 pb-20 flex gap-12">
        {/* Sidebar Nav */}
        <aside className="hidden lg:block w-64 h-[calc(100vh-8rem)] sticky top-32">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4A5568] mb-4 px-3">Documentation</p>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollTo(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  activeSection === section.id 
                    ? "bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20 shadow-[0_0_15px_rgba(124,58,237,0.1)]" 
                    : "text-[#94A3B8] hover:text-white hover:bg-[#1E293B]/50"
                }`}
              >
                <span className={`${activeSection === section.id ? "text-[#7C3AED]" : "text-[#4A5568] group-hover:text-[#94A3B8]"}`}>
                  {section.icon}
                </span>
                {section.title}
                {activeSection === section.id && (
                  <motion.div layoutId="active" className="ml-auto">
                    <ChevronRight className="w-4 h-4" />
                  </motion.div>
                )}
              </button>
            ))}
          </div>

          <div className="mt-12 p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] group cursor-pointer hover:border-[#7C3AED]/30 transition-all">
            <p className="text-[10px] font-bold text-[#7C3AED] uppercase tracking-widest mb-2 flex items-center gap-2">
              <Share2 className="w-3 h-3" /> API Status
            </p>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]"></span>
              </span>
              <span className="text-xs font-semibold text-[#94A3B8]">Systems Operational</span>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 max-w-4xl min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Intro */}
            <section id="intro" className="mb-20 scroll-mt-32">
              <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                Developer <span className="text-[#7C3AED]">Documentation</span>
              </h1>
              <p className="text-lg text-[#94A3B8] leading-relaxed mb-8">
                Welcome to the RR Vault SDK documentation. This guide will help you integrate our 
                high-performance R2 storage layer into your applications with ease.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GlassCard className="p-6 border-[#1E293B] hover:border-[#7C3AED]/20 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center text-[#7C3AED] mb-4">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold mb-2">Instant Deployment</h3>
                  <p className="text-sm text-[#94A3B8]">Start uploading files in under 2 minutes with our streamlined SDK.</p>
                </GlassCard>
                <GlassCard className="p-6 border-[#1E293B] hover:border-[#7C3AED]/20 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-[#22D3EE]/10 flex items-center justify-center text-[#22D3EE] mb-4">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold mb-2">Secure by Default</h3>
                  <p className="text-sm text-[#94A3B8]">End-to-end encryption and per-app isolation for your sensitive assets.</p>
                </GlassCard>
              </div>
            </section>

            {/* Getting Started */}
            <section id="get-started" className="mb-20 scroll-mt-32">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Zap className="w-6 h-6 text-[#7C3AED]" /> Getting Started
              </h2>
              <p className="text-[#94A3B8] leading-relaxed mb-6">
                To use RR Vault, you'll need three pieces of information from your 
                <a href="/app" className="text-[#7C3AED] font-semibold hover:underline px-1">Dashboard</a>:
              </p>
              <div className="space-y-4">
                {[
                  { title: "App ID", desc: "The unique identifier for your application container." },
                  { title: "API Key", desc: "Used for public authentication and requests." },
                  { title: "Secret Key", desc: "Required for secure server-side operations. Keep this private." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl bg-[#0F172A]/50 border border-[#1E293B]">
                    <div className="w-6 h-6 rounded-full bg-[#1E293B] flex items-center justify-center text-[10px] font-black text-[#7C3AED] shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-xs text-[#4A5568]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Installation */}
            <section id="installation" className="mb-20 scroll-mt-32">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Terminal className="w-6 h-6 text-[#7C3AED]" /> SDK Installation
              </h2>
              <p className="text-[#94A3B8] leading-relaxed mb-6">
                Install our official Node.js SDK via your favorite package manager.
              </p>
              <div className="grid gap-3">
                <CodeBlock code="npm install @rr-vault/r2" language="bash" />
                <CodeBlock code="yarn add @rr-vault/r2" language="bash" />
                <CodeBlock code="pnpm add @rr-vault/r2" language="bash" />
              </div>
            </section>

            {/* Configuration */}
            <section id="configuration" className="mb-20 scroll-mt-32">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Cpu className="w-6 h-6 text-[#7C3AED]" /> Initialization
              </h2>
              <p className="text-[#94A3B8] leading-relaxed mb-6">
                Configure the SDK before calling any methods. It's best to do this in your 
                app's entry point (e.g., `index.ts` or `app.ts`).
              </p>
              <CodeBlock code={configExample} language="typescript" />
            </section>

            {/* Express Example */}
            <section id="upload-express" className="mb-20 scroll-mt-32">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Code className="w-6 h-6 text-[#7C3AED]" /> Express + Multer Integration
              </h2>
              <div className="mb-6 p-4 rounded-2xl bg-[#7C3AED]/5 border-l-4 border-l-[#7C3AED] flex gap-4">
                <Info className="w-6 h-6 text-[#7C3AED] shrink-0 mt-1" />
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  This approach is ideal for handling multi-part form data. By using `multer.memoryStorage()`, 
                  large files are processed efficiently in memory and passed directly to the RR Vault SDK.
                </p>
              </div>
              <CodeBlock code={expressExample} language="javascript" />
            </section>

            {/* Response Structure */}
            <section id="response" className="mb-20 scroll-mt-32">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-[#22C55E]" /> Response Structure
              </h2>
              <p className="text-[#94A3B8] leading-relaxed mb-6">
                The `upload` method returns a Promise containing the file resolution details.
              </p>
              <CodeBlock 
                code={`{
  "success": true,
  "data": {
    "fileId": "65f2...",
    "url": "https://cdn.rrvault.com/u/...",
    "mimeType": "image/webp",
    "size": 42069,
    "createdAt": "2026-04-02T10:00:00Z"
  }
}`} 
                language="json" 
              />
            </section>

            {/* Need More Help? */}
            <section className="mb-10">
              <GlassCard className="p-8 border-[#7C3AED]/40 bg-gradient-to-br from-[#7C3AED]/5 to-transparent text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C3AED]/10 blur-[50px] rounded-full -translate-y-1/2 translate-x-1/2" />
                <h3 className="text-2xl font-bold mb-3">Need more help?</h3>
                <p className="text-[#94A3B8] mb-8 max-w-sm mx-auto">
                  Our team of engineers is available 24/7 to help you with your integration.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <button className="px-6 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-xl transition-all shadow-[0_10px_20px_rgba(124,58,237,0.3)]">
                    Contact Support
                  </button>
                  <button className="px-6 py-3 bg-[#1E293B] hover:bg-[#334155] text-white font-bold rounded-xl transition-all">
                    Community Discord
                  </button>
                </div>
              </GlassCard>
            </section>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
