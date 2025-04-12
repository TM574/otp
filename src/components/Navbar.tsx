import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Cookies from 'js-cookie';
import { ChevronDown, LogOut, Menu, User, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUserData } from "@/services/api";

const Navbar: React.FC = () => {
  const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const token = Cookies.get("token");

  const getDataOnLoad = async () => {
    const data = await getUserData(token);
    setUserData(data.user);
  };

  const handleLogout = () => {
    // logout();
    Cookies.remove("token");
  };

  useEffect(() => {
    if (token) {
      getDataOnLoad();
    }
  }, );

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and name */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center">
              <div className="w-10 h-10 flex items-center justify-center bg-brand-600 text-white font-bold rounded-md">
                {userData?.name?.charAt(0).toUpperCase() || "O"}
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-800">OTP Auth</span>
            </Link>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-brand-600">Home</Link>
            <Link to="/about" className="text-gray-700 hover:text-brand-600">About Us</Link>
            <Link to="/services" className="text-gray-700 hover:text-brand-600">Services</Link>
          </div>

          {/* Auth/Profile */}
          <div className="hidden md:block">
            {token ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-100">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userData?.profileImage} alt={userData?.name} />
                      <AvatarFallback className="bg-brand-500 text-white">
                        {userData?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{userData?.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="text-red-500 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="default" className="bg-brand-600 hover:bg-brand-700">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu icon */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="text-gray-700 focus:outline-none">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu content */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t mt-3 animate-slide-in">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-700 hover:text-brand-600 px-2 py-1" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/about" className="text-gray-700 hover:text-brand-600 px-2 py-1" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
              <Link to="/services" className="text-gray-700 hover:text-brand-600 px-2 py-1" onClick={() => setMobileMenuOpen(false)}>Services</Link>
              {token ? (
                <>
                  <Link to="/profile" className="flex items-center text-gray-700 hover:text-brand-600 px-2 py-1" onClick={() => setMobileMenuOpen(false)}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="flex items-center text-red-500 hover:text-red-600 px-2 py-1">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-brand-600 hover:bg-brand-700">Login</Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
