import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { addLike, removeLike, deletePost } from '../../actions/post';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faThumbsDown,
  faThumbsUp,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

const PostItem = ({
  post: { _id, text, name, avatar, user, likes, comments, date },
  authReducer,
  addLike,
  removeLike,
  deletePost,
  showActions,
}) => {
  return (
    <div className='post bg-white p-1 my-1'>
      <div>
        <Link to={`/profile/${user}`}>
          <img className='round-img' src={avatar} alt='Avatar' />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className='my-1'>{text}</p>
        <p className='post-date'>
          Posted on <Moment format='DD/MM/YYYY'>{date}</Moment>
        </p>
        {showActions && (
          <div>
            <button
              type='button'
              className='btn btn-light'
              onClick={(e) => {
                e.preventDefault();
                addLike(_id);
              }}
            >
              <FontAwesomeIcon icon={faThumbsUp} />
              {likes && likes.length > 0 && <span>{likes.length}</span>}
            </button>
            <button
              type='button'
              className='btn btn-light'
              onClick={(e) => {
                e.preventDefault();
                removeLike(_id);
              }}
            >
              <FontAwesomeIcon icon={faThumbsDown} />
            </button>
            <Link to={`/posts/${_id}`} className='btn btn-primary'>
              Discussion{' '}
              {comments && (
                <span className='comment-count'>{comments.length}</span>
              )}
            </Link>
            {!authReducer.loading && user === authReducer.user._id && (
              <button
                type='button'
                className='btn btn-danger'
                onClick={() => {
                  deletePost(_id);
                }}
              >
                {' '}
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

PostItem.defaultProps = {
  showActions: true,
};

PostItem.propTypes = {
  authReducer: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  showActions: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  authReducer: state.authReducer,
});

export default connect(mapStateToProps, {
  addLike,
  removeLike,
  deletePost,
})(PostItem);
