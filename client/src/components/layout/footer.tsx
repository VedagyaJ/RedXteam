import React from "react";
import { Link } from "wouter";
import { BugIcon } from "lucide-react";
import { 
  FaTwitter, 
  FaLinkedin, 
  FaGithub, 
  FaDiscord 
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-secondary py-12 text-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
                <BugIcon className="text-white h-6 w-6" />
              </div>
              <span className="ml-3 text-xl font-bold text-white">
                RedX<span className="text-primary">team</span>
              </span>
            </div>
            <p className="text-sm mb-4">
              Connecting organizations with ethical hackers to build a more secure digital world.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white">
                <FaTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <FaLinkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <FaGithub className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <FaDiscord className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-medium mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-neutral-400 hover:text-white">How it works</a>
                </Link>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white">Features</a>
              </li>
              <li>
                <Link href="/programs">
                  <a className="text-neutral-400 hover:text-white">Programs</a>
                </Link>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white">Pricing</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-neutral-400 hover:text-white">Documentation</a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white">Blog</a>
              </li>
              <li>
                <Link href="/resources">
                  <a className="text-neutral-400 hover:text-white">Knowledge Base</a>
                </Link>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white">Community</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-neutral-400 hover:text-white">About</a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white">Careers</a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white">Contact</a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white">Press</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-neutral-400 hover:text-white">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white">Cookie Policy</a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white">Responsible Disclosure</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-secondary-dark text-center text-sm text-neutral-400">
          <p>© {new Date().getFullYear()} RedXteam. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
