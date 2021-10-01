import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layouts/Spinner';
import ProfileItem from './ProfileItem';
import { getProfiles } from '../../actions/profile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faConnectdevelop } from '@fortawesome/free-brands-svg-icons';

const Profiles = ({ getProfiles, profileReducer: { profiles, loading } }) => {
  //when profile loads run getprofile
  useEffect(() => {
    getProfiles();
  }, [getProfiles]);
  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <div>
          <h1 className='large text-primary'>Developers</h1>
          <p className='lead'>
            <FontAwesomeIcon icon={faConnectdevelop} />{' '}
            <i>Connect With Developers</i>
          </p>
          <div className='profiles'>
            {profiles && profiles.length > 0 ? (
              profiles.map((profile) => (
                <ProfileItem key={profile._id} profile={profile} />
              ))
            ) : (
              <h4>No profile found</h4>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profileReducer: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  profileReducer: state.profileReducer,
});
export default connect(mapStateToProps, { getProfiles })(Profiles);
