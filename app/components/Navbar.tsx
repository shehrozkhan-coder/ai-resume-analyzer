import { Link } from "react-router"

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/">
      <p className="text-2x1 font-bold text-gradient">ResuLens-AI</p>
      </Link>
      <Link to="/upload" className="primary-button w-fit">
      Upload Resume
      </Link>
    </nav>
  )
}

export default Navbar
