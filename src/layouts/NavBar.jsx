import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"; // For mobile menu icons
// import { FaUser } from "react-icons/fa";
import { useAuth } from "../hooks/useContext";
import { useAdmin } from "../hooks/useAdminContext";
import {
  FaChevronDown,
  FaChevronUp,
  FaUser,
  FaUserCircle,
} from "react-icons/fa";
import { Settings } from 'lucide-react';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);

  const { user, logout } = useAuth();
  const { admin, isAdminLoggedIn } = useAdmin();

  const handleProfileMenu = () => {
    setProfileMenu(!profileMenu);
  };

  const navLinkClasses =
    "relative font-semibold text-sm text-[#080546] after:absolute after:left-0 after:-bottom-1.5 after:h-0.5 after:w-full after:origin-center after:scale-x-0 after:bg-[#080546] after:transition-transform hover:text-[#080546] hover:after:scale-x-100 after:duration-300";

  const activeLinkClasses = "text-[#080546]";

  const navLinks = (
    <>
      <NavLink
        to="/"
        className={({ isActive }) =>
          `${navLinkClasses} ${isActive ? activeLinkClasses : ""}`
        }
      >
        Home
      </NavLink>
      <NavLink
        to="/course-page"
        className={({ isActive }) =>
          `${navLinkClasses} ${isActive ? activeLinkClasses : ""}`
        }
      >
        Course
      </NavLink>
      <NavLink
        to="/current-affairs"
        className={({ isActive }) =>
          `${navLinkClasses} ${isActive ? activeLinkClasses : ""}`
        }
      >
        Current Affairs
      </NavLink>
      <NavLink
        to="/contact"
        className={({ isActive }) =>
          `${navLinkClasses} ${isActive ? activeLinkClasses : ""}`
        }
      >
        Contact
      </NavLink>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 py-2.5 lg:py-2 shadow-sm backdrop-blur-sm transition-all duration-300">
      <div className="container mx-auto flex items-center justify-between px-2 lg:px-8">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center gap-6">
          <Link className="text-2xl font-bold" to="/">
           LOGO
          </Link>
          <div className="relative hidden">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search for exams..."
              className="w-80 focus:ring inset-3.5 focus:ring-blue-400 border bg-white border-gray-300 px-10 py-1.5 rounded-sm text-gray-600 placeholder:text-gray-400 outline-none"
            />
          </div>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden items-center gap-5 lg:flex">
          {navLinks}
          {user ? (
            <div className="relative">
              <button
                onClick={handleProfileMenu}
                className="text-[#080546] flex items-center text-sm gap-1 font-semibold"
              >
                Profile
                {profileMenu ? (
                  <FaChevronUp className="text-xs" />
                ) : (
                  <FaChevronDown className="text-xs" />
                )}
              </button>

              {profileMenu && (
                <div className="absolute right-0 mt-4 w-40  border border-gray-100 bg-white shadow-lg z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setProfileMenu(false)}
                  >
                    My Profile
                  </Link>
                                          <Link
                          to="/performance-dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setProfileMenu(false)}
                        >
                          My Performance Dashboard
                        </Link>
                                                
                  <button
                    onClick={() => {
                      logout();

                      setProfileMenu(false);
                    }}
                    className="w-full text-left block px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="text-white bg-[#080546] font-medium text-sm px-6 py-[5px] rounded-full"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            className="cursor-pointer"
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-8 w-8 text-gray-700" />
            ) : (
              <Bars3Icon className="h-8 w-8 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white py-6 shadow-md lg:hidden">
          <div className="container mx-auto flex flex-col items-center gap-6 px-6">
            {navLinks}
            <div>
                {user ? (
                  <div className="relative">
                    <button
                      onClick={handleProfileMenu}
                      className="text-gray-700 flex items-center text-sm gap-1 font-medium"
                    >
                      Profile
                      {profileMenu ? (
                        <FaChevronUp className="text-xs" />
                      ) : (
                        <FaChevronDown className="text-xs" />
                      )}
                    </button>

                    {profileMenu && (
                      <div className="absolute right-0 mt-4 w-40  border border-gray-100 bg-white shadow-lg z-50">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setProfileMenu(false)}
                        >
                          My Profile
                        </Link>
                        <Link
                          to="/performance-dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setProfileMenu(false)}
                        >
                          My Performance Dashboard
                        </Link>
                        {isAdminLoggedIn() ? (
                          <Link
                            to="/admin/dashboard"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            onClick={() => setProfileMenu(false)}
                          >
                            <Settings size={14} />
                            Admin Dashboard
                          </Link>
                        ) : (
                          <Link
                            to="/admin/login"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            onClick={() => setProfileMenu(false)}
                          >
                            <Settings size={14} />
                            Admin Login
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            logout();

                            setProfileMenu(false);
                          }}
                          className="w-full text-left block px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="text-white bg-[#080546] font-medium text-sm px-4 py-[5px] rounded-full"
                  >
                    Login
                  </Link>
                )}
              </div>
            <div className="flex w-full flex-col gap-4">
              {/* <Link to="/signup" className="rounded-md px-5 py-2 text-center text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 transition-all duration-200 hover:bg-gray-100">
                Sign up
              </Link> */}
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search for exams..."
                  className="w-full focus:ring inset-3.5 focus:ring-blue-400 border bg-white border-gray-300 px-10 py-2 rounded-sm text-gray-600 placeholder:text-gray-400 outline-none"
                />
              </div>
              
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
