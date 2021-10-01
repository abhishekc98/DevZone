import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';
import DashboardActions from './DashboardActions';
import Education from './Education';
import Experience from './Experience';
import Spinner from '../layouts/Spinner';

const Dashboard = ({
  getCurrentProfile,
  authReducer: { user },
  profileReducer: { profile, loading },
  deleteAccount,
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  return loading && profile === null ? (
    <div>
      <Spinner />
    </div>
  ) : (
    <div>
      <h1 className='large text-primary'>Dashboard</h1>
      <p className='lead'>Hi {user && user.name}</p>
      {profile !== null ? (
        <Fragment>
          <DashboardActions />
          <Experience experience={profile.experience} />
          <Education education={profile.education} />
        </Fragment>
      ) : (
        <Fragment>
          <p>You do not have a profile yet</p>
          <Link to='create-profile' className='btn btn-primary my-1'>
            Create profile
          </Link>
        </Fragment>
      )}
      <div className='my my-2'>
        <button className='btn btn-danger' onClick={deleteAccount}>
          Delete account
        </button>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  authReducer: PropTypes.object.isRequired,
  profileReducer: PropTypes.object.isRequired,
  deleteAccount: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  authReducer: state.authReducer,
  profileReducer: state.profileReducer,
});
export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(
  Dashboard
);
