import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const PostMetaStyles = styled.div`
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
      font-weight: 500;
      color: inherit;

      .post{
        &-dot{
            display: inline-block;
            width: 4px;
            height: 4px;
            background-color: currentColor;
            border-radius: 100rem;
        }
      }
`;

const PostMeta = ({ date = 'Mar 23', authorName = '', className = '', to = '/' }) => {
    return (
        <PostMetaStyles className={className}>
            <span className="post-time">{date}</span>
            <span className="post-dot" />
            <Link to={`/author/${to}`}>
                <span className="post-author">{authorName}</span>
            </Link>
        </PostMetaStyles>
    );
};

export default PostMeta;