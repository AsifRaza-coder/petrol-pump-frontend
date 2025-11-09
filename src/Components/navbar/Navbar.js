import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AuthContext from "../../context/auth/AuthContext";
import Dropdown from "../dropdown/Dropdown";
import { DOMAIN } from "../../backend/API";

// Menu Icon SVG
const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const Navbar = ({openSidebar,setOpenSidebar}) => {
  //Initializing the use Context to get dispatch method to change dark or light mode
  // const { darkMode, dispatch } = useContext(ModeContext);
  // Call Auth Context & Extract isAuthenticated
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const LogoutFunc = () => {
    logout();
    navigate("/");
  };
  //Initializing the Location Hook
  const location = useLocation();

  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  return (
    <div className="h-[65px] bg-[#1a4d4d] border-b border-[#155050] flex items-center text-sm text-white">
      <div className="flex items-center py-10 px-5 w-full justify-between">
        <div className="h-[40px] flex justify-center items-center gap-3">
         <button 
            className="md:opacity-0 md:transition-opacity md:duration-2000 opacity-100 text-white hover:bg-[#155050] p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white/50" 
            onClick={()=>setOpenSidebar(!openSidebar)}
          >
            <MenuIcon />
          </button> 
          <Link to="/" className="no-underline">
            <h1 className="sm:text-2xl md:text-3xl lg:text-3xl font-bold text-white cursor-pointer hover:text-gray-200 transition-colors">Mudasar Filling Station</h1>
          </Link>
        </div>

        {isAuthenticated ? (
          <>
            <div className="flex items-center">
              <div className="flex items-center mr-5 relative">
                <span className="text-white text-lg font-bold">
                  {user?.name ? user.name.split(" ")[0] : "User"},
                </span>
              </div>
              <button
                className="flex items-center mr-5 relative focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full transition-transform hover:scale-105"
                onClick={handleOpenUserMenu}
              >
                <img 
                  className="h-10 w-10 rounded-full object-cover border-2 border-white/30 hover:border-white/50 transition-colors" 
                  alt={user?.name || "User"} 
                  src={user?.pic ? `${DOMAIN}/public/users/images/${user.pic}` : "./img/avatarfile.png"} 
                />
              </button>
            
            <Dropdown
              className="profileMenu"
              anchorElUser={anchorElUser}
              setAnchorElUser={setAnchorElUser}
              BackdropProps={{ invisible: false }}
              logout={LogoutFunc}
            />
            </div>
          </>
        ) : (
          <div className="flex items-center">
            {location.pathname === "/" ? (
              <div className="flex items-center mr-5 relative">
                {/* Signup button can be added here if needed */}
              </div>
            ) : (
              <div className="flex items-center mr-5 relative">
                <Link to="/" className="no-underline">
                  <button
                    className="px-4 py-2 border-2 border-white text-white font-bold rounded-md hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                  >
                    Login
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
