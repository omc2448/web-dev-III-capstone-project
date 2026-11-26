import React from 'react';
import { Building2, GraduationCap, Github, Shield, MapPin, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Project Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">RentEasy</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Full-Stack MERN Property Rental Listing platform connecting property owners and tenants 
              with seamless listing CRUD, visit scheduling, enquiries, shortlist bookmarks, and admin rate analytics.
            </p>

            {/* Student Credential Card */}
            <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60 max-w-md">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-blue-400">Academic Submission</h4>
                  <p className="text-sm font-bold text-white mt-0.5">Om Chaurasia</p>
                  <p className="text-xs text-slate-300">Roll No: <span className="font-mono font-semibold text-blue-300">2501010063</span></p>
                  <p className="text-xs text-slate-400">KR Mangalam University | Web Development (3rd Sem Capstone)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-100 mb-4">Core Modules</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="hover:text-white transition cursor-pointer">🏠 Property Search & Filters</li>
              <li className="hover:text-white transition cursor-pointer">🔑 Role-Based Auth (Tenant/Owner/Admin)</li>
              <li className="hover:text-white transition cursor-pointer">📅 Visit Scheduling & Enquiries</li>
              <li className="hover:text-white transition cursor-pointer">⭐ Saved Properties Shortlist</li>
              <li className="hover:text-white transition cursor-pointer">📊 Area Average Rent Aggregation</li>
              <li className="hover:text-white transition cursor-pointer">🛡️ Admin Listing Approval Workflow</li>
            </ul>
          </div>

          {/* Technology Stack */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-100 mb-4">Technology Stack</h3>
            <div className="flex flex-wrap gap-1.5 text-xs">
              <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-md text-slate-300">React.js</span>
              <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-md text-slate-300">Node.js</span>
              <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-md text-slate-300">Express</span>
              <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-md text-slate-300">MongoDB</span>
              <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-md text-slate-300">Mongoose</span>
              <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-md text-slate-300">JWT Auth</span>
              <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-md text-slate-300">Bcrypt</span>
              <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-md text-slate-300">Tailwind CSS</span>
              <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-md text-slate-300">Context API</span>
              <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-md text-slate-300">Vite</span>
            </div>
            <div className="mt-6 text-xs text-slate-500">
              <p>Database: local MongoDB (mongodb://127.0.0.1:27017/renteasy)</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 RentEasy. Built by Om Chaurasia (Roll No: 2501010063) for KR Mangalam University.</p>
          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Shield className="w-3.5 h-3.5 text-blue-500" />
              <span>Verified Capstone Project</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
