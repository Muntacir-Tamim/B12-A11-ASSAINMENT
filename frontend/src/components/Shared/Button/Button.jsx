import Container from "../Container";
import { AiOutlineMenu } from "react-icons/ai";
import { useState } from "react";
import { Link } from "react-router";
import useAuth from "../../../hooks/useAuth";
import avatarImg from "../../../assets/images/placeholder.jpg";
import { MdOutlineReportProblem } from "react-icons/md";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed w-full bg-white z-10 shadow-sm">
      <div className="py-4">
        <Container>
          <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <MdOutlineReportProblem className="text-blue-600 text-3xl" />
              <span className="font-bold text-xl text-blue-700 hidden sm:block">
                CivicFix
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
              <Link to="/" className="hover:text-blue-600 transition">
                Home
              </Link>
              <Link to="/all-issues" className="hover:text-blue-600 transition">
                All Issues
              </Link>
              <Link
                to="/how-it-works"
                className="hover:text-blue-600 transition"
              >
                How It Works
              </Link>
              <Link to="/about" className="hover:text-blue-600 transition">
                About
              </Link>
            </div>

            {/* Dropdown */}
            <div className="relative">
              <div className="flex flex-row items-center gap-3">
                <div
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-4 md:py-1 md:px-2 border border-neutral-200 flex flex-row items-center
                    gap-3 rounded-full cursor-pointer hover:shadow-md transition"
                >
                  <AiOutlineMenu />
                  <div className="hidden md:block">
                    <img
                      className="rounded-full"
                      referrerPolicy="no-referrer"
                      src={user && user.photoURL ? user.photoURL : avatarImg}
                      alt="profile"
                      height="30"
                      width="30"
                    />
                  </div>
                </div>
              </div>

              {isOpen && (
                <div
                  className="absolute rounded-xl shadow-md w-[50vw] md:w-[12vw] bg-white
                  overflow-hidden right-0 top-12 text-sm z-20"
                >
                  <div className="flex flex-col cursor-pointer">
                    <Link
                      to="/"
                      onClick={() => setIsOpen(false)}
                      className="block md:hidden px-4 py-3 hover:bg-neutral-100 transition font-semibold"
                    >
                      Home
                    </Link>
                    <Link
                      to="/all-issues"
                      onClick={() => setIsOpen(false)}
                      className="block md:hidden px-4 py-3 hover:bg-neutral-100 transition font-semibold"
                    >
                      All Issues
                    </Link>

                    {user ? (
                      <>
                        <p className="px-4 py-2 text-xs text-gray-400 border-b truncate">
                          {user?.displayName}
                        </p>
                        <Link
                          to="/dashboard"
                          onClick={() => setIsOpen(false)}
                          className="px-4 py-3 hover:bg-neutral-100 transition font-semibold"
                        >
                          Dashboard
                        </Link>
                        <div
                          onClick={() => {
                            logOut();
                            setIsOpen(false);
                          }}
                          className="px-4 py-3 hover:bg-neutral-100 transition font-semibold cursor-pointer"
                        >
                          Logout
                        </div>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          onClick={() => setIsOpen(false)}
                          className="px-4 py-3 hover:bg-neutral-100 transition font-semibold"
                        >
                          Login
                        </Link>
                        <Link
                          to="/signup"
                          onClick={() => setIsOpen(false)}
                          className="px-4 py-3 hover:bg-neutral-100 transition font-semibold"
                        >
                          Sign Up
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Navbar;
