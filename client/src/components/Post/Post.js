import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layouts/Spinner';
import { getPost } from '../../actions/post';
import PostItem from '../posts/PostItem';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

const Post = ({ getPost, postReducer: { post, loading }, match }) => {
  useEffect(() => {
    getPost(match.params.id);
  }, [getPost, match.params.id]);
  return (
    <div>
      <Link to='/posts' className='btn'>
        Back To Posts
      </Link>

      {loading || post === null ? (
        <Spinner />
      ) : (
        <div>
          <PostItem showActions={false} post={post} />
          <CommentForm postId={post._id} />
          <div className='comments'>
            {post.comments.map((comment) => (
              <div key={comment._id}>
                <CommentItem postId={post._id} comment={comment} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  postReducer: state.postReducer,
});
export default connect(mapStateToProps, { getPost })(Post);
