import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ authReducer: { isAuthenticated, loading }, logout }) => {
  const authLinks = (
    <ul>
      <li>
        <Link to='/profiles'>Developers</Link>
      </li>
      <li>
        <Link to='/posts'>Posts</Link>
      </li>
      <li>
        <Link to='/dashboard'>Dashboard</Link>
      </li>
      <li>
        <i className='hide-sm'>
          <FontAwesomeIcon icon={faSignOutAlt} />
        </i>
        <a onClick={logout} href='/'>
          <span>Logout</span>
        </a>
      </li>
    </ul>
  );
  const guestLinks = (
    <ul>
      <li>
        <Link to='/profiles'>Developers</Link>
      </li>
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
    </ul>
  );
  return (
    <nav className='navbar bg-dark'>
      <h1>
        <Link to='/'>
          <FontAwesomeIcon icon={faCode} /> DevZone
        </Link>
      </h1>
      <>{isAuthenticated && !loading ? authLinks : guestLinks}</>
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  authReducer: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  authReducer: state.authReducer,
});

export default connect(mapStateToProps, { logout })(Navbar);
