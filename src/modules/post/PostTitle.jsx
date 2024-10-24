import React from 'react';
import styled, { css } from "styled-components";
import { Link } from 'react-router-dom';

const PostTitleStyles = styled.h3`
    font-weight: 600;
    line-height: 1.5;
    ${props => props.size === 'normal' && css`
        font-size: 18px;
    ` };
    ${props => props.size === 'big' && css`
        font-size: 22px;
    ` };

    a{
        display: block;
    }
    
`;
const PostTitle = ({ children, className = '', size = 'normal', to = '/' }) => {
    return (
        <PostTitleStyles size={size} className={`post-title ${className}`}>
            <Link to={`/${to}`}>
                {children}
            </Link>
        </PostTitleStyles>
    );
};

export default PostTitle;