import React from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

const PostCategoryStyles = styled.div`
      display: inline-block;
      padding: 4px 10px;
      border-radius: 10px;
      color: ${props => props.theme.gray6B};
      font-size: 14px;
      font-weight: 600;
      background-color: #f3f3f3;
      ${props => props.type === 'primary' && css`
            background-color: ${props => props.theme.grayF3};
      `};
      ${props => props.type === 'secondary' && css`
            background-color: white;
      `};
      
      a{
        display: block;
      }

`;

const PostCategory = ({ children, type = 'primary', className = '', to = '/' }) => {
    return (
        <PostCategoryStyles type={type} className={`post-category ${className}`}>
            <Link to={`/category/${to}`}>
                {children}
            </Link>
        </PostCategoryStyles>
    );
};

export default PostCategory;