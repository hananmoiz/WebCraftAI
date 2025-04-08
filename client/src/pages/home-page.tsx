import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import { AlertCircle, ChevronRight, Check, Wand2, Code, Eye, Palette, Smartphone, Download } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function HomePage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const navigateToBuilder = () => {
    if (user) {
      setLocation("/builder");
    } else {
      setLocation("/auth");
    }
  };

  return (
    <div className="bg-primary-900 text-neutral-200 min-h-screen font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#00FFFF] rounded-full filter blur-[120px] opacity-20"></div>
          <div className="absolute bottom-40 right-10 w-80 h-80 bg-[#FF00FF] rounded-full filter blur-[130px] opacity-20"></div>
          <div className="absolute top-60 right-1/4 w-60 h-60 bg-[#7C3AED] rounded-full filter blur-[100px] opacity-15"></div>
        </div>

        <div className="container mx-auto max-w-7xl z-10 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-primary-800 text-[#00FFFF] border border-[#00FFFF]">
                  <span className="mr-2 h-2 w-2 rounded-full bg-[#00FFFF] animate-pulse"></span>
                  The Future of Web Development
                </span>
              </div>
              
              <h1 className="font-space font-bold text-4xl md:text-5xl lg:text-6xl leading-tight">
                Create Stunning <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] animate-gradient-x">Websites with AI</span> in Minutes
              </h1>
              
              <p className="text-neutral-300 text-lg md:text-xl leading-relaxed max-w-xl">
                Just describe what you want, and our AI will generate a complete, customizable website with real-time preview and code editing.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={navigateToBuilder}
                  className="px-8 py-4 bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-primary-900 font-medium rounded-md hover:shadow-[0_0_10px_rgba(0,255,255,0.5)] transition duration-300"
                >
                  Try It Now
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => {
                    const howItWorksSection = document.getElementById('how-it-works');
                    if (howItWorksSection) {
                      howItWorksSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="px-8 py-4 border border-neutral-500 text-neutral-200 rounded-md hover:border-[#00FFFF] hover:text-[#00FFFF] transition duration-300"
                >
                  See How It Works
                </Button>
              </div>
              
              <div className="flex items-center space-x-4 text-neutral-400">
                <div className="flex -space-x-2">
                  <div className="h-8 w-8 rounded-full border-2 border-primary-900 bg-neutral-700 flex items-center justify-center text-xs">U1</div>
                  <div className="h-8 w-8 rounded-full border-2 border-primary-900 bg-neutral-700 flex items-center justify-center text-xs">U2</div>
                  <div className="h-8 w-8 rounded-full border-2 border-primary-900 bg-neutral-700 flex items-center justify-center text-xs">U3</div>
                </div>
                <span>Trusted by <span className="text-[#00FFFF]">10,000+</span> developers & designers</span>
              </div>
            </div>
            
            <div className="relative p-0.5 rounded-xl shadow-xl bg-gradient-to-r from-[#00FFFF] via-[#FF00FF] to-[#7C3AED] animate-gradient-x">
              <div className="relative bg-primary-800 rounded-xl overflow-hidden">
                {/* Futuristic AI interface mockup */}
                <div className="w-full h-auto aspect-video rounded-t-xl bg-primary-900 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-800/30 to-primary-900/90">
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary-900 to-primary-900/20 p-6">
                      <div className="flex items-start space-x-3">
                        <div className="h-8 w-8 rounded-full bg-[#00FFFF] flex items-center justify-center text-primary-900">
                          <Robot className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="bg-primary-800/80 backdrop-blur-sm p-3 rounded-lg rounded-tl-none max-w-md">
                            I'll create a responsive e-commerce site with product showcase, cart functionality, and modern UI.
                          </div>
                          <div className="mt-3 text-sm text-neutral-400">DesignAI is generating your website...</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-800/50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-space font-bold text-3xl md:text-4xl mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-[#FF00FF]">AI-Powered</span> Website Creation
            </h2>
            <p className="text-neutral-300 text-lg">Our advanced AI understands your requirements and generates complete, functional websites with clean code and stunning designs.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-primary-800 border border-neutral-700 rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#00FFFF] to-[#00FFFF]/20 flex items-center justify-center text-primary-900 mb-5">
                <Wand2 className="h-6 w-6" />
              </div>
              <h3 className="font-space font-semibold text-xl mb-3">Text-to-Website Conversion</h3>
              <p className="text-neutral-400">Simply describe your website needs in plain language, and watch as our AI generates a complete website based on your requirements.</p>
            </div>
            
            {/* Feature Card 2 */}
            <div className="bg-primary-800 border border-neutral-700 rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#FF00FF] to-[#FF00FF]/20 flex items-center justify-center text-primary-900 mb-5">
                <Code className="h-6 w-6" />
              </div>
              <h3 className="font-space font-semibold text-xl mb-3">Real-time Code Editor</h3>
              <p className="text-neutral-400">Modify your website's code with our intuitive editor featuring syntax highlighting, auto-completion, and error checking.</p>
            </div>
            
            {/* Feature Card 3 */}
            <div className="bg-primary-800 border border-neutral-700 rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#7C3AED]/20 flex items-center justify-center text-primary-900 mb-5">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="font-space font-semibold text-xl mb-3">Live Preview</h3>
              <p className="text-neutral-400">See changes in real-time with our dynamic preview panel that shows exactly how your website will look across different devices.</p>
            </div>
            
            {/* Feature Card 4 */}
            <div className="bg-primary-800 border border-neutral-700 rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#00FFFF] to-[#00FFFF]/20 flex items-center justify-center text-primary-900 mb-5">
                <Palette className="h-6 w-6" />
              </div>
              <h3 className="font-space font-semibold text-xl mb-3">Customizable Templates</h3>
              <p className="text-neutral-400">Start with AI-generated templates and customize colors, layouts, and components to match your brand identity perfectly.</p>
            </div>
            
            {/* Feature Card 5 */}
            <div className="bg-primary-800 border border-neutral-700 rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#FF00FF] to-[#FF00FF]/20 flex items-center justify-center text-primary-900 mb-5">
                <Smartphone className="h-6 w-6" />
              </div>
              <h3 className="font-space font-semibold text-xl mb-3">Responsive Design</h3>
              <p className="text-neutral-400">All generated websites are fully responsive, ensuring they look perfect on desktops, tablets, and mobile devices.</p>
            </div>
            
            {/* Feature Card 6 */}
            <div className="bg-primary-800 border border-neutral-700 rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#7C3AED]/20 flex items-center justify-center text-primary-900 mb-5">
                <Download className="h-6 w-6" />
              </div>
              <h3 className="font-space font-semibold text-xl mb-3">One-Click Export</h3>
              <p className="text-neutral-400">Export your complete website as HTML/CSS/JS files or directly deploy to popular hosting platforms with a single click.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-space font-bold text-3xl md:text-4xl mb-6">
              Experience the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-[#FF00FF]">Future</span> of Web Design
            </h2>
            <p className="text-neutral-300 text-lg">Try our AI website builder and see how it transforms your ideas into stunning websites in minutes.</p>
          </div>
          
          {/* Builder Demo Interface */}
          <div className="relative p-0.5 rounded-xl shadow-xl bg-gradient-to-r from-[#00FFFF] via-[#FF00FF] to-[#7C3AED] animate-gradient-x">
            <div className="bg-primary-800 rounded-xl overflow-hidden">
              {/* Builder Demo Mockup */}
              <div className="bg-primary-900 border-b border-neutral-700 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-[#00FFFF] font-space font-bold text-lg">Design<span className="text-[#FF00FF]">AI</span> Builder</span>
                  
                  {/* Tab navigation */}
                  <div className="hidden md:flex space-x-1 ml-8">
                    <Button variant="default" size="sm" className="bg-primary-700 text-[#00FFFF] border-b-2 border-[#00FFFF]">
                      Editor
                    </Button>
                    <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-neutral-200">
                      Templates
                    </Button>
                    <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-neutral-200">
                      Assets
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Button variant="outline" size="sm" className="text-neutral-300 border-neutral-600">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-primary-900 font-medium">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
              
              {/* Demo content - make it look like the builder interface */}
              <div className="bg-primary-800 h-[400px] sm:h-[600px] flex flex-col lg:flex-row">
                {/* This is just a visual mockup for the landing page */}
                <div className="w-full lg:w-1/2 lg:border-r border-neutral-700 flex flex-col">
                  <div className="text-center py-12 flex flex-col items-center justify-center h-full">
                    <Wand2 className="h-12 w-12 text-[#00FFFF] mb-4" />
                    <h3 className="text-xl font-space font-medium mb-3">Experience the Full Builder</h3>
                    <p className="text-neutral-400 max-w-sm mx-auto mb-6">Sign up and get access to our AI-powered website builder with real-time preview and code editing.</p>
                    <Button 
                      onClick={navigateToBuilder}
                      className="bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-primary-900 font-medium"
                    >
                      Try The Builder Now
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="hidden lg:flex w-1/2 bg-primary-900 items-center justify-center">
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-[#FF00FF] mx-auto mb-4" />
                    <h3 className="text-xl font-space font-medium mb-2">Preview Window</h3>
                    <p className="text-neutral-400 max-w-sm mx-auto">Your website preview will appear here in real-time as you make changes.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-800/50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-space font-bold text-3xl md:text-4xl mb-6">
              How <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-[#FF00FF]">DesignAI</span> Works
            </h2>
            <p className="text-neutral-300 text-lg">Our advanced AI transforms your text descriptions into fully functional websites in just a few simple steps.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Process steps connector */}
            <div className="hidden md:block absolute top-24 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-[#00FFFF] via-[#FF00FF] to-[#7C3AED]"></div>
            
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary-900 border-2 border-[#00FFFF] flex items-center justify-center mb-6 z-10">
                <span className="text-xl font-bold text-[#00FFFF]">1</span>
              </div>
              <h3 className="font-space font-semibold text-xl mb-3">Describe Your Website</h3>
              <p className="text-neutral-400">Tell our AI what kind of website you need. Be as specific or general as you want - our AI understands your requirements.</p>
              <div className="mt-6 h-48 w-full rounded-lg shadow-lg bg-primary-900 flex items-center justify-center">
                <div className="p-4 text-center">
                  <span className="text-[#00FFFF] font-medium">Input prompt example:</span>
                  <p className="text-sm text-neutral-300 mt-2">
                    "I need a responsive portfolio website for a photographer with a dark theme, gallery section, and contact form."
                  </p>
                </div>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary-900 border-2 border-[#FF00FF] flex items-center justify-center mb-6 z-10">
                <span className="text-xl font-bold text-[#FF00FF]">2</span>
              </div>
              <h3 className="font-space font-semibold text-xl mb-3">AI Generates Your Website</h3>
              <p className="text-neutral-400">Our AI analyzes your description and creates a complete, responsive website with clean code and modern design.</p>
              <div className="mt-6 h-48 w-full rounded-lg shadow-lg bg-primary-900 flex items-center justify-center">
                <div className="p-4 text-center">
                  <span className="text-[#FF00FF] font-medium">Processing your request:</span>
                  <div className="mt-4 space-y-2">
                    <div className="h-2 bg-primary-800 rounded-full w-full"></div>
                    <div className="h-2 bg-[#FF00FF]/30 rounded-full w-2/3 relative">
                      <div className="absolute top-0 left-0 h-full bg-[#FF00FF] rounded-full animate-pulse" style={{width: '70%'}}></div>
                    </div>
                    <div className="h-2 bg-primary-800 rounded-full w-full"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary-900 border-2 border-[#7C3AED] flex items-center justify-center mb-6 z-10">
                <span className="text-xl font-bold text-[#7C3AED]">3</span>
              </div>
              <h3 className="font-space font-semibold text-xl mb-3">Customize & Export</h3>
              <p className="text-neutral-400">Refine your website using our code editor and live preview, then export the finished site or deploy it directly.</p>
              <div className="mt-6 h-48 w-full rounded-lg shadow-lg bg-primary-900 flex items-center justify-center">
                <div className="p-4 text-center">
                  <span className="text-[#7C3AED] font-medium">Available export options:</span>
                  <div className="mt-3 flex flex-col space-y-2">
                    <div className="flex items-center text-neutral-300 text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2" /> HTML/CSS/JS files
                    </div>
                    <div className="flex items-center text-neutral-300 text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2" /> GitHub repository
                    </div>
                    <div className="flex items-center text-neutral-300 text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2" /> Netlify deployment
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-800/50 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-20 right-10 w-80 h-80 bg-[#00FFFF] rounded-full filter blur-[130px] opacity-20"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#FF00FF] rounded-full filter blur-[130px] opacity-20"></div>
        </div>
        
        <div className="container mx-auto max-w-5xl z-10 relative">
          <div className="relative p-0.5 rounded-2xl bg-gradient-to-r from-[#00FFFF] via-[#FF00FF] to-[#7C3AED] animate-gradient-x">
            <div className="bg-primary-900 rounded-2xl px-6 py-12 md:p-12 text-center">
              <h2 className="font-space font-bold text-3xl md:text-4xl mb-6">
                Ready to Build Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-[#FF00FF]">Website</span>?
              </h2>
              <p className="text-neutral-300 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of developers, designers, and entrepreneurs who are creating stunning websites with AI. No coding required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={navigateToBuilder} 
                  className="px-8 py-4 bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-primary-900 font-medium rounded-md hover:shadow-[0_0_10px_rgba(0,255,255,0.5)] transition duration-300"
                >
                  Get Started Free
                </Button>
                <Button 
                  size="lg"
                  variant="outline" 
                  className="px-8 py-4 border border-neutral-500 text-neutral-200 rounded-md hover:border-[#00FFFF] hover:text-[#00FFFF] transition duration-300"
                >
                  Schedule a Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Robot({ className, size }: { className?: string; size?: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <rect x="9" y="7" width="6" height="4" />
      <path d="M10 15h.01" />
      <path d="M14 15h.01" />
      <path d="M9 7v4" />
      <path d="M15 7v4" />
    </svg>
  );
}
