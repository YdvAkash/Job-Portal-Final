import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { logout } from "../../store/authSlice";
import axios from "axios";
import { USER_API_END_POINT } from "../../utils/const";
import { toast } from "sonner";
import {
  Menu,
  X,
  Briefcase,
  Home,
  Search,
  User,
  LogOut,
  Building2,
  ChevronRight,
} from "lucide-react";

function Navbar() {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 10);
      if (currentScrollY < lastScrollY || currentScrollY === 0) {
        setIsVisible(true);
      } else if (currentScrollY > 80) {
        setIsVisible(false);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${USER_API_END_POINT}/logout`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        dispatch(logout());
        toast.success("Logged out successfully");
      }
    } catch (error) {
      // Force logout on client even if server fails
      dispatch(logout());
      toast.success("Logged out");
    }
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `nav-link text-sm font-medium transition-all duration-200 ${
      isActive(path)
        ? "text-purple-700 font-semibold"
        : "text-gray-600 hover:text-purple-700"
    }`;

  const recruiterLinks = [
    { to: "/admin/dashboard", label: "Dashboard", icon: Home },
    { to: "/admin/companies", label: "Companies", icon: Building2 },
    { to: "/admin/jobs", label: "Jobs", icon: Briefcase },
  ];

  const applicantLinks = [
    { to: "/home", label: "Home", icon: Home },
    { to: "/jobs", label: "Jobs", icon: Briefcase },
    { to: "/browse", label: "Browse", icon: Search },
  ];

  const guestLinks = [
    { to: "/home", label: "Home", icon: Home },
    { to: "/browse", label: "Browse Jobs", icon: Search },
  ];

  const links = user
    ? user.role === "recruiter"
      ? recruiterLinks
      : applicantLinks
    : guestLinks;

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } ${
          scrolled
            ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-purple-100/50"
            : "bg-white/90 backdrop-blur-sm shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/home" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-purple-gradient flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold font-outfit">
                <span className="text-gray-900">Job</span>
                <span
                  className="text-brand-gradient"
                  style={{
                    background: "linear-gradient(135deg, #6a38c2, #7209b7)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Portal
                </span>
              </h1>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              {links.map(({ to, label }) => (
                <Link key={to} to={to} className={navLinkClass(to)}>
                  {label}
                  {isActive(to) && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-purple-600 rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-purple-50 transition-colors duration-200">
                      <Avatar className="w-8 h-8 ring-2 ring-purple-200">
                        <AvatarImage src={user?.profile?.profileImage} />
                        <AvatarFallback className="bg-purple-gradient text-white text-xs font-bold">
                          {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left hidden sm:block">
                        <p className="text-sm font-semibold text-gray-800 leading-tight">
                          {user?.fullName?.split(" ")[0]}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                      </div>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 p-0 rounded-2xl shadow-2xl border border-purple-100" align="end">
                    {/* Profile Header */}
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-t-2xl border-b border-purple-100">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12 ring-2 ring-purple-300">
                          <AvatarImage src={user?.profile?.profileImage} />
                          <AvatarFallback className="bg-purple-gradient text-white font-bold">
                            {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">{user?.fullName}</h3>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 capitalize mt-1">
                            {user?.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      {user.role !== "recruiter" && (
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-purple-50 transition-colors duration-200 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                            <User className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">View Profile</span>
                          <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors duration-200 w-full group mt-1"
                      >
                        <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                          <LogOut className="w-4 h-4 text-red-600" />
                        </div>
                        <span className="text-sm font-medium text-red-600">Logout</span>
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="font-medium text-gray-700 hover:text-purple-700 hover:bg-purple-50"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button
                      size="sm"
                      className="bg-purple-gradient hover:opacity-90 text-white font-semibold px-5 rounded-xl shadow-md hover:shadow-purple-200 hover:-translate-y-0.5 transition-all duration-200"
                      style={{ background: "linear-gradient(135deg, #6a38c2, #7209b7)" }}
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-purple-50 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-lg animate-fade-in">
            <div className="px-4 py-4 space-y-1">
              {links.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive(to)
                      ? "bg-purple-50 text-purple-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}

              {/* Mobile Auth */}
              <div className="pt-3 border-t border-gray-100 mt-3">
                {user ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 px-4 py-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user?.profile?.profileImage} />
                        <AvatarFallback className="bg-purple-gradient text-white font-bold">
                          {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">{user?.fullName}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    {user.role !== "recruiter" && (
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-50 text-gray-700"
                      >
                        <User className="w-5 h-5" />
                        <span className="font-medium">Profile</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3 px-4">
                    <Link to="/login" className="flex-1">
                      <Button variant="outline" className="w-full rounded-xl">
                        Login
                      </Button>
                    </Link>
                    <Link to="/signup" className="flex-1">
                      <Button
                        className="w-full rounded-xl text-white font-semibold"
                        style={{ background: "linear-gradient(135deg, #6a38c2, #7209b7)" }}
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}

export default Navbar;
