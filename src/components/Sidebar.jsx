import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { MdOutlineCancel } from "react-icons/md";

import { links } from "../data/dummy";
import { useStateContext } from "../contexts/ContextProvider";

// Custom Tooltip Component
const CustomTooltip = ({ content, children, position = "bottom" }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getTooltipClasses = () => {
    const baseClasses = "absolute z-50 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg whitespace-nowrap";
    
    switch (position.toLowerCase()) {
      case 'top':
        return `${baseClasses} bottom-full left-1/2 transform -translate-x-1/2 mb-2`;
      case 'left':
        return `${baseClasses} right-full top-1/2 transform -translate-y-1/2 mr-2`;
      case 'right':
        return `${baseClasses} left-full top-1/2 transform -translate-y-1/2 ml-2`;
      case 'bottomcenter':
      default: // bottom
        return `${baseClasses} top-full left-1/2 transform -translate-x-1/2 mt-2`;
    }
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && (
        <div className={getTooltipClasses()}>
          {content}
          {/* Tooltip Arrow */}
          <div className="absolute w-0 h-0 border-l-4 border-r-4 border-transparent border-t-4 border-gray-800 top-full left-1/2 transform -translate-x-1/2"></div>
        </div>
      )}
    </div>
  );
};

const Sidebar = () => {
  const { currentColor, activeMenu, setActiveMenu, screenSize } = useStateContext();

  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const activeLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2 shadow-sm";
  const normalLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 hover:bg-gray-50 hover:text-gray-900 m-2 transition-colors duration-200";

  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10 no-scrollbar bg-white border-r border-gray-200">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center bg-white">
            <Link
              to="/"
              onClick={handleCloseSideBar}
              className="items-center gap-3 ml-3 mt-1 flex"
            >
              <img
                src="/nuqigold.png"
                alt="Nuqi Gold Logo"
                className="h-10 bg-cover m-4"
              />
            </Link>
            <CustomTooltip content="Menu" position="bottomcenter">
              <button
                type="button"
                onClick={() => setActiveMenu(!activeMenu)}
                style={{ color: currentColor }}
                className="text-xl rounded-full p-3 hover:bg-gray-100 mt-4 block md:hidden transition-colors duration-200"
              >
                <MdOutlineCancel />
              </button>
            </CustomTooltip>
          </div>
    <div className="mt-4 bg-white">
  {links.map((item) => (
    <div key={item.title}>
      <p className="text-gray-500 m-3 mt-2 uppercase font-medium text-sm">
        {item.title}
      </p>
      {item.links.map((link) => (
        link.external ? (
          <a
            href={link.external}
            key={link.name}
            target="_blank"
            rel="noopener noreferrer"
            className={normalLink + " flex items-center gap-3 p-2 m-2 rounded-md hover:bg-gray-100"}
            onClick={handleCloseSideBar}
          >
            {link.icon}
            <span className="capitalize">{link.name}</span>
          </a>
        ) : (
          <NavLink
            to={`/${link.name}`}
            key={link.name}
            onClick={handleCloseSideBar}
            style={({ isActive }) => ({
              backgroundColor: isActive ? currentColor : "",
            })}
            className={({ isActive }) => (isActive ? activeLink : normalLink)}
          >
            {link.icon}
            <span className="capitalize">{link.name}</span>
          </NavLink>
        )
      ))}
    </div>
  ))}
</div>

        </>
      )}
    </div>
  );
};

export default Sidebar;