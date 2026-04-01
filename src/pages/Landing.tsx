import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { GlowButton } from "../components/glow-button";
import { GlassCard } from "../components/glass-card";
import { CodeBlock } from "../components/code-block";
import { PublicNavbar } from "../components/PublicNavbar";
import {
  Zap, Shield, Cloud, Code, Check, ArrowRight, Cpu, Layers
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const features = [
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Instant API Access",
    description: "Generate API keys and start uploading files in seconds."
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Secure by Design",
    description: "End-to-end encryption for all your sensitive assets."
  },
  {
    icon: <Cloud className="h-6 w-6" />,
    title: "Cloud Native",
    description: "Built on high-performance R2 storage for maximum reliability."
  },
  {
    icon: <Code className="h-6 w-6" />,
    title: "Clean SDKs",
    description: "Powerful SDKs for React, Node.js, and more."
  },
  {
    icon: <Layers className="h-6 w-6" />,
    title: "App Isolation",
    description: "Organize your files into separate Apps and Folders."
  },
  {
    icon: <Cpu className="h-6 w-6" />,
    title: "Edge Delivery",
    description: "Serve your assets globally with lightning-fast latency."
  }
];


const codeExample = `import { MyCloud } from '@mycloud/sdk';

const cloud = new MyCloud({
  apiKey: 'mc_live_...',
  appId: 'app_v1...'
});

// Upload a user avatar
const { url } = await cloud.upload({
  file: imageFile,
  path: 'avatars/profile-1.jpg'
});

console.log('Public URL:', url);`;

export function LandingPage() {
  const { accessToken } = useAuthStore();
  return (
  <div className="min-h-screen bg-[#0B1220] text-[#E2E8F0] selection:bg-[#7C3AED]/30 selection:text-white overflow-x-hidden">
    {/* Background Gradients */}
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#7C3AED]/10 blur-[120px] rounded-full" />
      <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] bg-[#22D3EE]/5 blur-[120px] rounded-full" />
      <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] bg-[#7C3AED]/5 blur-[120px] rounded-full" />
    </div>

    {/* Navigation */}
    <PublicNavbar />

    {/* Hero Section */}
    <section className="pt-48 pb-20 px-6 relative">
      <div className="max-w-[1600px] mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7C3AED] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7C3AED]"></span>
            </span>
            <span className="text-[#7C3AED] text-[13px] font-semibold uppercase tracking-wider">Cloud v2.0 is Here</span>
          </div>
            
          <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight">
            Powerful File Storage <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-[#E2E8F0] via-[#7C3AED] to-[#22D3EE] bg-clip-text text-transparent">
              For Modern Apps
            </span>
          </h1>
            
          <p className="text-lg md:text-xl text-[#94A3B8] mb-12 max-w-3xl mx-auto leading-relaxed">
            Experience the fast, secure, and developer-friendly way to manage your application assets.
            Upload via API, deliver via global CDN, and scale without limits.
          </p>
            
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link to={accessToken ? "/app" : "/register"}>
              <GlowButton variant="primary" className="text-lg px-10 py-5 rounded-xl shadow-2xl">
                Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
              </GlowButton>
            </Link>
            <Link to="/docs">
              <GlowButton variant="ghost" className="text-lg px-10 py-5 rounded-xl border-[#1E293B]">
                View SDK Docs
              </GlowButton>
            </Link>
          </div>
        </motion.div>

        {/* Floating UI Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="mt-28 max-w-4xl mx-auto relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <CodeBlock
            code={codeExample}
            language="typescript"
            className="relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-[#1E293B]/50"
          />
          {/* Floating Badges */}
          <div className="absolute -top-12 -right-12 hidden lg:block animate-bounce-slow">
            <GlassCard className="py-2 px-4 border-[#22D3EE]/30">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#22C55E]" />
                <span className="text-xs font-semibold">Response: 200 OK</span>
              </div>
            </GlassCard>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Features Section */}
    <section id="features" className="py-32 px-6 relative">
      <div className="max-w-[1600px] mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Engineered for Reliability</h2>
          <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto">
            We've built all the core primitives you need to manage billions of files without breaking a sweat.
          </p>
        </div>
          
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="h-full border-[#1E293B] hover:border-[#7C3AED]/40 hover:-translate-y-2 transition-all duration-500 group">
                <div className="p-4 bg-[#1E293B]/50 rounded-2xl w-fit mb-6 text-[#7C3AED] group-hover:bg-[#7C3AED]/20 group-hover:scale-110 transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-[#94A3B8] leading-relaxed">{feature.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Stats Section */}
    <section className="py-24 border-y border-[#1E293B]/50 bg-[#0F172A]/20">
      <div className="max-w-[1600px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
        {[
          { label: "Files Hosted", value: "2M+" },
          { label: "Countries", value: "45+" },
          { label: "Uptime", value: "99.9%" },
          { label: "API Latency", value: "40ms" }
        ].map((stat, idx) => (
          <div key={idx}>
            <p className="text-4xl font-black text-white mb-2">{stat.value}</p>
            <p className="text-sm font-semibold text-[#7C3AED] uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>

    {/* CTA Section */}
    <section className="py-40 px-6">
      <div className="max-w-5xl mx-auto">
        <GlassCard className="text-center border-[#7C3AED]/40 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#7C3AED]/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Scale Your App Today</h2>
            <p className="text-lg text-[#94A3B8] mb-10 max-w-xl mx-auto">
              Join thousands of developers who trust RR Vault for their mission-critical file management.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <GlowButton variant="primary" className="text-lg px-12 py-5 shadow-2xl">
                  Create Free Account
                </GlowButton>
              </Link>
              <Link to="/contact">
                <GlowButton variant="ghost" className="text-lg px-12 py-5 border-[#1E293B]">
                  Contact Sales
                </GlowButton>
              </Link>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>

    {/* Footer */}
    <footer className="border-t border-[#1E293B] pt-24 pb-12 px-6 bg-[#0B1220] relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <img src="/rr_vault_logo.jpg" alt="RR Vault" className="w-8 h-8 rounded-lg object-cover" />
              <span className="text-xl font-bold tracking-tight">RR Vault</span>
            </div>
            <p className="text-[#94A3B8] text-sm leading-relaxed mb-6">
              Redefining the way developers interact with cloud storage. Fast, Secure, and Scalable.
            </p>
          </div>
            
          {['Product', 'Resources', 'Legal'].map((col) => (
            <div key={col}>
              <h4 className="text-white font-bold mb-6">{col}</h4>
              <ul className="space-y-4 text-sm text-[#94A3B8]">
                {col === 'Product' && ['Features', 'Pricing', 'CDN', 'Security'].map(l => <li key={l}><a href="#" className="hover:text-[#7C3AED] transition-colors">{l}</a></li>)}
                {col === 'Resources' && ['Documentation', 'API Reference', 'Community', 'Status'].map(l => <li key={l}><a href="#" className="hover:text-[#7C3AED] transition-colors">{l}</a></li>)}
                {col === 'Legal' && ['Privacy', 'Terms', 'Security', 'GDPR'].map(l => <li key={l}><a href="#" className="hover:text-[#7C3AED] transition-colors">{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
          
        <div className="pt-12 border-t border-[#1E293B]/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-[#94A3B8] font-medium uppercase tracking-widest">
            © 2026 RR Vault Infrastructure Inc.
          </p>
          <div className="flex items-center gap-8 text-xs font-semibold text-[#94A3B8]">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
  );
}
