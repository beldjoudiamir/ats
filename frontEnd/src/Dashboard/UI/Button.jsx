import React from "react";
import PropTypes from "prop-types";

const Button = ({ children, className = "", ...props }) => (
  <button
    className={`px-4 py-2 rounded transition ${className}`}
    {...props}
  >
    {children}
  </button>
);

Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Button; 