import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFunc } from "../../redux/sidebarSlice/sidebarSlice";
import { Link } from "react-router-dom";
import { useLocalHook } from "./SidebarSource";

// SVG Icons for dropdown - SIMPLE AND DIRECT
const ExpandLessIcon = () => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none"
  >
    <path 
      d="M5 15l7-7 7 7" 
      stroke="white" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

const ExpandMoreIcon = () => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none"
  >
    <path 
      d="M19 9l-7 7-7-7" 
      stroke="white" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

const Sidebar = ({openSidebar, setOpenSidebar}) => {
  const { listItems } = useLocalHook();

  //Extract toggleList State from Redux store
  const sidebar = useSelector((state) => state.sidebar);
  
  function getToggle(item, id) {
    return item.id === id;
  }
  const toggle = (id) =>
    sidebar.filter((item) => {
      return getToggle(item, id);
    });

    
  //Initializing the use Dispatch
  const dispatch = useDispatch();

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      // Auto-close sidebar when resizing from mobile to desktop
      if (!mobile && openSidebar && setOpenSidebar) {
        setOpenSidebar(false);
      }
    };
    
    checkMobile(); // Initial check
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, [openSidebar, setOpenSidebar]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobile && openSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-[998] transition-opacity duration-300"
          onClick={() => {
            // Close sidebar when clicking backdrop
            if (setOpenSidebar) {
              setOpenSidebar(false);
            }
          }}
        />
      )}
      
      {/* Start of Sidebar Component */}
      <aside 
        className={`
          bg-[#1a4d4d] shadow-lg
          ${
            isMobile
              ? `fixed left-0 top-0 z-[999] transform transition-transform duration-300 ease-in-out ${
                  openSidebar ? "translate-x-0" : "-translate-x-full"
                }`
              : "relative block"
          }
          ${isMobile ? "w-[280px] sm:w-[320px]" : "w-full max-w-[280px] px-5 py-5 min-w-[280px]"}
          ${isMobile ? "h-screen" : ""}
        `}
        style={{
          height: isMobile ? "100vh" : "calc(100vh - 65px)",
        }}
        aria-label="Sidebar"
      >
        <div className="h-full overflow-auto overflow-x-hidden border-r border-[#155050] scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {listItems.map((listItem) => {
          const isOpen = toggle(listItem.id)[0]?.toggle === true;
          // SOLID CHECK: Ensure nested exists and has items
          const hasNested = Boolean(
            listItem.nested && 
            Array.isArray(listItem.nested) && 
            listItem.nested.length > 0
          );
          
          // Debug log for items with nested (can remove later)
          if (hasNested && process.env.NODE_ENV === 'development') {
            console.log(`✅ Dropdown icon should show for: "${listItem.label}" (ID: ${listItem.id})`);
          }
          
          return (
            <div key={listItem.id} className="w-full">
              {/* Category Header */}
              {listItem.category && (
                <div className="text-[14px] font-bold text-white/60 mt-[15px] ml-2 mb-1 uppercase tracking-wider">
                  {listItem.category}
                </div>
              )}
              
              {/* Main List Item */}
              {listItem.url ? (
                <Link 
                  to={listItem.url} 
                  className="no-underline"
                  onClick={(e) => {
                    if (listItem.nested) {
                      e.preventDefault();
                      dispatch(toggleFunc(listItem.id));
                    }
                    // Close sidebar on mobile when clicking a link
                    if (isMobile && setOpenSidebar && !listItem.nested) {
                      setOpenSidebar(false);
                    }
                  }}
                >
                  <button
                    className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/10 transition-colors duration-200 rounded-md"
                    onClick={(e) => {
                      if (listItem.nested) {
                        e.preventDefault();
                        dispatch(toggleFunc(listItem.id));
                      }
                    }}
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0 w-10 flex items-center justify-center text-white">
                      {listItem.icon}
                    </div>
                    
                    {/* Label */}
                    <span className="flex-1 text-md font-medium text-white">
                      {listItem.label}
                    </span>
                    
                    {/* Dropdown Icon - Right Side */}
                    {listItem.nested && listItem.nested.length > 0 && (
                      <span className="ml-auto flex items-center flex-shrink-0">
                        {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </span>
                    )}
                  </button>
                </Link>
              ) : (
                <button
                  className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/10 transition-colors duration-200 rounded-md"
                  onClick={() => {
                    if (listItem.nested) {
                      dispatch(toggleFunc(listItem.id));
                    } else {
                      listItem.clickFunc && listItem.clickFunc();
                    }
                  }}
                >
                    {/* Icon */}
                    <div className="flex-shrink-0 w-10 flex items-center justify-center text-white">
                      {listItem.icon}
                    </div>
                    
                    {/* Label */}
                  <span className="flex-1 text-md font-medium text-white">
                    {listItem.label}
                  </span>
                  
                  {/* Dropdown Icon - Right Side */}
                  {listItem.nested && listItem.nested.length > 0 && (
                    <span className="ml-auto flex items-center flex-shrink-0">
                      {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </span>
                  )}
                </button>
              )}

              {/* Nested Items */}
              {hasNested && (
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="pl-4">
                    {listItem.nested.map((nestedItem) => (
                      <Link
                        key={nestedItem.itemId}
                        to={nestedItem.url}
                        className="no-underline block"
                        onClick={() => {
                          // Close sidebar on mobile when clicking a nested link
                          if (isMobile && setOpenSidebar) {
                            setOpenSidebar(false);
                          }
                        }}
                      >
                        <button className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/10 transition-colors duration-200 rounded-md">
                          {/* Nested Icon */}
                          <div className="flex-shrink-0 w-10 flex items-center justify-center text-white">
                            {nestedItem.icon}
                          </div>
                          
                          {/* Nested Label */}
                          <span className="flex-1 text-sm font-medium text-white/90">
                            {nestedItem.label}
                          </span>
                        </button>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
