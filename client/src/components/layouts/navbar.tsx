import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X,
  User,
  LogOut,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logoutMutation } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navLinks = [
    { name: "Features", href: "/#features" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Demo", href: "/#demo" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-lg bg-primary-900/70 border-b border-neutral-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center">
              <span className="text-accent-cyan font-space font-bold text-2xl">
                Design<span className="text-accent-magenta">AI</span>
              </span>
            </a>
          </Link>
          
          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                <a className="text-neutral-300 hover:text-accent-cyan transition duration-300">
                  {link.name}
                </a>
              </Link>
            ))}
            {user && (
              <Link href="/builder">
                <a className="text-neutral-300 hover:text-accent-cyan transition duration-300">
                  Builder
                </a>
              </Link>
            )}
          </div>
          
          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:bg-opacity-10">
                    <User className="mr-2 h-4 w-4" />
                    {user.username}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="outline" className="border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:bg-opacity-10">
                    Login
                  </Button>
                </Link>
                <Link href="/auth?tab=register">
                  <Button className="bg-gradient-to-r from-accent-cyan to-accent-magenta text-primary-900 hover:shadow-neon-cyan">
                    Sign Up Free
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleMobileMenu}
              className="text-neutral-300 hover:text-accent-cyan"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden bg-primary-800 pb-4 px-4 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="space-y-4 pt-2 pb-3">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href}>
              <a 
                className="block px-4 py-2 text-neutral-300 hover:text-accent-cyan transition duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            </Link>
          ))}
          {user && (
            <Link href="/builder">
              <a 
                className="block px-4 py-2 text-neutral-300 hover:text-accent-cyan transition duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                Builder
              </a>
            </Link>
          )}
          <div className="pt-4 flex flex-col space-y-4">
            {user ? (
              <Button 
                variant="destructive" 
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            ) : (
              <>
                <Link href="/auth">
                  <Button
                    variant="outline"
                    className="w-full border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:bg-opacity-10"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/auth?tab=register">
                  <Button
                    className="w-full bg-gradient-to-r from-accent-cyan to-accent-magenta text-primary-900 hover:shadow-neon-cyan"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up Free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
