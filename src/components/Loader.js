import React from 'react';
import loaderImage from '../three-dots.svg';

const Loader = ({ isLoading }) => (
  <div className="loader-wrapper">
  {isLoading ?
  <img className="loader" src={loaderImage} alt="loader" />
    : null
  }
  </div>
)

export default Loader;