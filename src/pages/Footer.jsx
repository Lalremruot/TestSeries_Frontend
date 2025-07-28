import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-gray-900 mt-12 lg:mt-24 text-gray-200 pt-12 pb-6 px-4 md:px-0">
    <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
      {/* Brand & Tagline */}
      <div>
        LOGO
        <p className="text-gray-400 mb-4">
          Empowering your exam journey with expert-crafted test series for India’s top exams.
        </p>
        <p className="text-gray-500 text-xs">© {new Date().getFullYear()} OnlineTest Series. All rights reserved.</p>
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-white">Quick Links</h3>
        <ul className="space-y-2">
          <li><Link to="/" className="hover:text-blue-400 transition">Home</Link></li>
          <li><Link to="/exams" className="hover:text-blue-400 transition">All Exams</Link></li>
          <li><Link to="/about" className="hover:text-blue-400 transition">About Us</Link></li>
          <li><Link to="/pricing" className="hover:text-blue-400 transition">Pricing</Link></li>
          <li><Link to="/faqs" className="hover:text-blue-400 transition">FAQs</Link></li>
          <li><Link to="/contact" className="hover:text-blue-400 transition">Contact Us</Link></li>
          <li><Link to="/blog" className="hover:text-blue-400 transition">Blog</Link></li>
        </ul>
      </div>

      {/* Popular Exams */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-white">Popular Exams</h3>
        <ul className="space-y-2">
          <li><Link to="/exams/upsc" className="hover:text-blue-400 transition">UPSC</Link></li>
          <li><Link to="/exams/ssc" className="hover:text-blue-400 transition">SSC</Link></li>
          <li><Link to="/exams/banking" className="hover:text-blue-400 transition">Banking</Link></li>
          <li><Link to="/exams/railways" className="hover:text-blue-400 transition">Railways</Link></li>
          <li><Link to="/exams/jee" className="hover:text-blue-400 transition">IIT JEE</Link></li>
          <li><Link to="/exams/neet" className="hover:text-blue-400 transition">NEET</Link></li>
          <li><Link to="/exams/defence" className="hover:text-blue-400 transition">Defence</Link></li>
        </ul>
      </div>

      {/* Resources & Social */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-white">Resources</h3>
        <ul className="space-y-2">
          <li><Link to="/previous-papers" className="hover:text-blue-400 transition">Previous Year Papers</Link></li>
          <li><Link to="/syllabus" className="hover:text-blue-400 transition">Syllabus</Link></li>
          <li><Link to="/strategy" className="hover:text-blue-400 transition">Preparation Tips</Link></li>
          <li><Link to="/login" className="hover:text-blue-400 transition">Login</Link></li>
          <li><Link to="/register" className="hover:text-blue-400 transition">Register</Link></li>
        </ul>
        <div className="flex space-x-4 mt-4">
          <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
            <span className="sr-only">Facebook</span>
            <svg fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5"><path d="M22.676 0H1.326C.594 0 0 .593 0 1.326v21.348C0 23.406.594 24 1.326 24H12.82v-9.294H9.692v-3.622h3.127V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.314h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.324-.594 1.324-1.326V1.326C24 .593 23.406 0 22.676 0"></path></svg>
          </a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
            <span className="sr-only">Twitter</span>
            <svg fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5"><path d="M24 4.557a9.828 9.828 0 0 1-2.828.775A4.932 4.932 0 0 0 23.337 3.1a9.864 9.864 0 0 1-3.127 1.195A4.916 4.916 0 0 0 16.616.64c-2.733 0-4.945 2.213-4.945 4.945 0 .388.045.765.128 1.124C7.728 6.52 4.1 4.865 1.671 2.149a4.93 4.93 0 0 0-.666 2.485c0 1.713.872 3.228 2.195 4.117A4.904 4.904 0 0 1 .964 7.1v.062c0 2.392 1.702 4.385 3.958 4.835-.415.113-.853.174-1.304.174-.319 0-.626-.03-.928-.086.627 1.956 2.444 3.377 4.6 3.415A9.867 9.867 0 0 1 0 21.539a13.94 13.94 0 0 0 7.548 2.209c9.057 0 14.009-7.514 14.009-14.009 0-.213-.005-.425-.014-.636A10.025 10.025 0 0 0 24 4.557z"></path></svg>
          </a>
          <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400">
            <span className="sr-only">Instagram</span>
            <svg fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.35 3.608 1.324.974.974 1.262 2.241 1.324 3.608.058 1.266.069 1.646.069 4.85s-.011 3.584-.069 4.85c-.062 1.366-.35 2.633-1.324 3.608-.975.974-2.242 1.262-3.608 1.324-1.266.058-1.646.069-4.85.069s-3.584-.011-4.85-.069c-1.366-.062-2.633-.35-3.608-1.324-.974-.975-1.262-2.242-1.324-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.35-2.633 1.324-3.608C4.531 2.584 5.798 2.296 7.164 2.234c1.266-.058 1.646-.07 4.85-.07zm0-2.163C8.741 0 8.332.017 7.052.072 5.77.127 4.665.372 3.68 1.357c-.986.985-1.23 2.09-1.285 3.372C2.017 5.669 2 6.08 2 12c0 5.92.017 6.331.072 7.611.055 1.282.299 2.387 1.285 3.372.985.986 2.09 1.23 3.372 1.285C8.331 23.983 8.741 24 12 24s3.669-.017 4.949-.072c1.282-.055 2.387-.299 3.372-1.285.986-.985 1.23-2.09 1.285-3.372.055-1.28.072-1.691.072-7.611 0-5.92-.017-6.331-.072-7.611C21.631 2.09 21.387.986 20.401 1.001 19.119.946 18.709.929 12 .929S4.881.946 3.599 1.001C2.613.986 2.369 2.09 2.314 3.372.017 5.669 0 6.08 0 12c0 5.92.017 6.331.072 7.611.055 1.282.299 2.387 1.285 3.372.985.986 2.09 1.23 3.372 1.285C8.331 23.983 8.741 24 12 24s3.669-.017 4.949-.072c1.282-.055 2.387-.299 3.372-1.285.986-.985 1.23-2.09 1.285-3.372.055-1.28.072-1.691.072-7.611 0-5.92-.017-6.331-.072-7.611-.055-1.282-.299-2.387-1.285-3.372C19.119.946 18.709.929 12 .929z"/><path d="M12 5.838A6.162 6.162 0 0 0 5.838 12 6.162 6.162 0 0 0 12 18.162 6.162 6.162 0 0 0 18.162 12 6.162 6.162 0 0 0 12 5.838zm0 10.162A4 4 0 1 1 12 8a4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;