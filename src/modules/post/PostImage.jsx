import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const PostImageStyles = styled.div`
    img{
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: inherit;
    }
`;

const PostImage = ({ className = '', url = '', alt = '', to = '' }) => {
    if (to)
        return (
            <Link to={`/${to}`} style={{ display: 'block', cursor: 'pointer' }}>
                <PostImageStyles className={`post-image ${className}`}>
                    <img src={url} alt={alt} loading='lazy' />
                </PostImageStyles>
            </Link>
        );

    return (
        <PostImageStyles className={`post-image ${className}`}>
            <img src={url} alt={alt} loading='lazy' />
        </PostImageStyles>
    );
};

export default PostImage;