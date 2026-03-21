import { MdOutlineReportProblem } from "react-icons/md";
import { Link } from "react-router";
import Container from "../Container"; // path adjust korbi

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <Container>
        <div className="py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MdOutlineReportProblem className="text-blue-400 text-2xl" />
              <span className="font-bold text-white text-lg">CivicFix</span>
            </div>
            <p className="text-sm">
              A digital platform for citizens to report public infrastructure
              issues and track their resolution in real time.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-400">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/all-issues" className="hover:text-blue-400">
                  All Issues
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-blue-400">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-400">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>Pothole</li>
              <li>Streetlight</li>
              <li>Water Leakage</li>
              <li>Garbage Overflow</li>
              <li>Damaged Footpath</li>
            </ul>
          </div>
        </div>
      </Container>

      <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">
        © 2025–2026 CivicFix. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
