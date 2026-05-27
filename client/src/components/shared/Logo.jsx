import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ className = "text-daidong-black", textClassName = "text-xl", linkClassName = "" }) => {
  return (
    <Link to="/" className={`font-bold tracking-tight transition-colors duration-300 ${textClassName} ${className} ${linkClassName}`}>
      <span className="text-daidong-red">DAI</span>DONG.
    </Link>
  );
};

export default Logo;
