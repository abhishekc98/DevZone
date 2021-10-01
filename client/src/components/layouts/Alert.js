import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Alert = (props) => {
  const alerts = props.alerts;
  if (alerts !== null && alerts.length > 0) {
    return alerts.map((alert) => (
      <div key={alert.id} className={`alert alert-${alert.alertType}`}>
        {alert.msg}
      </div>
    ));
  }
  return null;
};

Alert.propTypes = { alerts: PropTypes.array.isRequired };

const mapStateToProps = (state) => ({ alerts: state.alertReducer });

export default connect(mapStateToProps)(Alert);
