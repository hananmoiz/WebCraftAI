import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-primary-900 border-t border-neutral-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/">
              <a className="text-accent-cyan font-space font-bold text-2xl mb-4 inline-block">
                Design<span className="text-accent-magenta">AI</span>
              </a>
            </Link>
            <p className="text-neutral-400 mb-4">Create stunning websites in minutes with the power of AI.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-accent-cyan transition duration-300">
                <i className="fab fa-twitter text-lg"></i>
              </a>
              <a href="#" className="text-neutral-400 hover:text-accent-cyan transition duration-300">
                <i className="fab fa-github text-lg"></i>
              </a>
              <a href="#" className="text-neutral-400 hover:text-accent-cyan transition duration-300">
                <i className="fab fa-linkedin text-lg"></i>
              </a>
              <a href="#" className="text-neutral-400 hover:text-accent-cyan transition duration-300">
                <i className="fab fa-instagram text-lg"></i>
              </a>
            </div>
          </div>
          
          <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="font-space font-medium text-lg mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/#features"><a className="text-neutral-400 hover:text-accent-cyan transition duration-300">Features</a></Link></li>
                <li><Link href="/#demo"><a className="text-neutral-400 hover:text-accent-cyan transition duration-300">Demo</a></Link></li>
                <li><Link href="/builder"><a className="text-neutral-400 hover:text-accent-cyan transition duration-300">Builder</a></Link></li>
                <li><a href="#" className="text-neutral-400 hover:text-accent-cyan transition duration-300">Pricing</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-accent-cyan transition duration-300">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-space font-medium text-lg mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-neutral-400 hover:text-accent-cyan transition duration-300">About</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-accent-cyan transition duration-300">Blog</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-accent-cyan transition duration-300">Careers</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-accent-cyan transition duration-300">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-space font-medium text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-neutral-400 hover:text-accent-cyan transition duration-300">Privacy</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-accent-cyan transition duration-300">Terms</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-accent-cyan transition duration-300">Security</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-neutral-500 text-sm">© {new Date().getFullYear()} DesignAI. All rights reserved.</p>
          <div className="mt-4 sm:mt-0">
            <select className="bg-primary-800 text-neutral-400 border border-neutral-700 rounded px-3 py-1 text-sm">
              <option>English (US)</option>
              <option>Español</option>
              <option>Français</option>
              <option>Deutsch</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
}
