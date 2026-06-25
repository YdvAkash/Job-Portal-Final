import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, Twitter, Linkedin, Github, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/home" className="flex items-center gap-2 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #6a38c2, #7209b7)" }}
              >
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold font-outfit">
                Job<span className="text-purple-400">Portal</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              India's leading job portal connecting talented professionals with top companies. 
              Find your dream career today.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
                { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
                { icon: Github, href: "https://github.com", label: "GitHub" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-purple-600 hover:border-purple-600 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* For Job Seekers */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4">
              For Job Seekers
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Browse Jobs", to: "/browse" },
                { label: "Find Jobs", to: "/jobs" },
                { label: "My Profile", to: "/profile" },
                { label: "Applied Jobs", to: "/profile" },
                { label: "Sign Up Free", to: "/signup" },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-gray-400 hover:text-purple-400 text-sm transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Recruiters */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4">
              For Recruiters
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Post a Job", to: "/admin/job/create" },
                { label: "My Companies", to: "/admin/companies" },
                { label: "View Applicants", to: "/admin/jobs" },
                { label: "Register Company", to: "/admin/companies/create" },
                { label: "Recruiter Login", to: "/login" },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-gray-400 hover:text-purple-400 text-sm transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">support@jobportal.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  Bangalore, Karnataka, India
                </span>
              </li>
            </ul>

            {/* Newsletter mini */}
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-2">Get job alerts via email</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 outline-none focus:border-purple-500 transition-colors"
                />
                <button
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-white transition-all"
                  style={{ background: "linear-gradient(135deg, #6a38c2, #7209b7)" }}
                >
                  Go
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm">
            © 2025 JobPortal. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-gray-500 hover:text-purple-400 text-xs transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;