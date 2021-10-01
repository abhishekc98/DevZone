import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getProfileById } from '../../actions/profile';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileExperience from './ProfileExperience';
import ProfileEducation from './profileEducation';
import ProfileGithub from './ProfileGithub';
import Spinner from '../layouts/Spinner';
import { connect } from 'react-redux';

//@desc Displays profile , enable authenticated edit
const Profile = ({
  getProfileById,
  profileReducer: { profile, loading },
  authReducer,
  match,
}) => {
  useEffect(() => {
    getProfileById(match.params.id);
  }, [getProfileById, match.params.id]);

  return profile === null && loading ? (
    <div>
      <Spinner />
    </div>
  ) : (
    <div>
      <Link to='/profiles' className='btn btn-light'>
        Back to profiles
      </Link>
      {authReducer.isAuthenticated &&
        authReducer.loading === false &&
        profile &&
        authReducer.user._id === profile.user._id && (
          <Link to='/edit-profile' className='btn btn-dark'>
            Edit Profile
          </Link>
        )}
      <div className='profile-grid my-1'>
        {profile && <ProfileTop profile={profile} />}
        {profile && <ProfileAbout profile={profile} />}
        <div className='profile-exp bg-white p-2'>
          <h2 className='text-primary'>Experience</h2>

          {profile && profile.experience && profile.experience.length > 0 ? (
            profile.experience.map((exp) => (
              <div key={exp._id}>
                <ProfileExperience experience={exp} />
              </div>
            ))
          ) : (
            <h4>Experience not added</h4>
          )}
        </div>

        <div className='profile-edu bg-white p-2'>
          <h2 className='text-primary'>Education</h2>

          {profile && profile.education && profile.education.length > 0 ? (
            profile.education.map((edu) => (
              <div key={edu._id}>
                <ProfileEducation education={edu} />
              </div>
            ))
          ) : (
            <h4>Education not added</h4>
          )}
        </div>
        {profile && profile.githubusername && (
          <ProfileGithub username={profile.githubusername} />
        )}
      </div>
    </div>
  );
};

Profile.propTypes = {
  profileReducer: PropTypes.object.isRequired,
  getProfileById: PropTypes.func.isRequired,
  authReducer: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profileReducer: state.profileReducer,
  authReducer: state.authReducer,
});

export default connect(mapStateToProps, { getProfileById })(Profile);
