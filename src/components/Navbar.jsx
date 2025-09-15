import React, { useEffect, useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { FiLogOut } from 'react-icons/fi';

import { useStateContext } from '../contexts/ContextProvider';
import LogoutConfirmationModal from './LogoutConfirmationModal';

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

const NavButton = ({ title, customFunc, icon, color }) => (
  <CustomTooltip content={title} position="bottom">
    <button
      type="button"
      onClick={() => customFunc()}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray transition-colors duration-200"
    >
      {icon}
    </button>
  </CustomTooltip>
);

const Navbar = () => {
  const { currentColor, activeMenu, setActiveMenu, setScreenSize, screenSize } = useStateContext();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [setScreenSize]);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize, setActiveMenu]);

  const handleActiveMenu = () => setActiveMenu(!activeMenu);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleCloseLogoutModal = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <div className="flex justify-between p-2 md:ml-6 md:mr-6 relative">
        <NavButton title="Menu" customFunc={handleActiveMenu} color={currentColor} icon={<AiOutlineMenu />} />
        <div className="flex gap-1">
        <a href="https://ngtech.nuqigold.com/signin">
  <button className="px-4 py-2 text-sm font-medium bg-white text-yellow-600 border border-yellow-600 rounded-lg shadow hover:bg-yellow-600 hover:text-white transition duration-200 ease-in-out">
    ng-tech
  </button>
</a>

          <NavButton title="Logout" customFunc={handleLogoutClick} color={currentColor} icon={<FiLogOut />} />
       
        </div>
      </div>
      
      <LogoutConfirmationModal 
        isOpen={showLogoutModal} 
        onClose={handleCloseLogoutModal} 
      />
    </>
  );
};

export default Navbar;