import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Github, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <div className="flex items-center">
              <Package className="h-10 w-10 text-primary-600" />
              <span className="ml-3 text-xl font-bold text-primary-600">APK Store</span>
            </div>
            <p className="text-gray-500 text-base">
              A platform for discovering, sharing, and downloading mobile applications.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">GitHub</span>
                <Github className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="mailto:contact@apkstore.com" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Email</span>
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Explore
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="/apps" className="text-base text-gray-500 hover:text-gray-900">
                      Browse Apps
                    </Link>
                  </li>
                  <li>
                    <Link to="/categories" className="text-base text-gray-500 hover:text-gray-900">
                      Categories
                    </Link>
                  </li>
                  <li>
                    <Link to="/popular" className="text-base text-gray-500 hover:text-gray-900">
                      Popular Apps
                    </Link>
                  </li>
                  <li>
                    <Link to="/new" className="text-base text-gray-500 hover:text-gray-900">
                      Newest Apps
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Account
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="/profile" className="text-base text-gray-500 hover:text-gray-900">
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/upload" className="text-base text-gray-500 hover:text-gray-900">
                      Upload App
                    </Link>
                  </li>
                  <li>
                    <Link to="/my-apps" className="text-base text-gray-500 hover:text-gray-900">
                      My Apps
                    </Link>
                  </li>
                  <li>
                    <Link to="/settings" className="text-base text-gray-500 hover:text-gray-900">
                      Settings
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Company
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="/about" className="text-base text-gray-500 hover:text-gray-900">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link to="/blog" className="text-base text-gray-500 hover:text-gray-900">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link to="/jobs" className="text-base text-gray-500 hover:text-gray-900">
                      Jobs
                    </Link>
                  </li>
                  <li>
                    <Link to="/partners" className="text-base text-gray-500 hover:text-gray-900">
                      Partners
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Legal
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="/privacy" className="text-base text-gray-500 hover:text-gray-900">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms" className="text-base text-gray-500 hover:text-gray-900">
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link to="/copyright" className="text-base text-gray-500 hover:text-gray-900">
                      Copyright
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} APK Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;