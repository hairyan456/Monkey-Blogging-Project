import React from 'react';
import styled, { css } from 'styled-components';
import { LoadingSpinner } from '../loading';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

const ButtonStyles = styled.button`
    cursor: pointer;
    outline: none;
    padding: 0 25px;
    line-height: 1;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    ${props => props.kind === 'secondary' && css`
        color: ${props => props.theme.primary};
        background-color: white;
    `};
    ${props => props.kind === 'primary' && css`
        color: white;
        background-image: linear-gradient(to right bottom, ${props => props.theme.primary},${props => props.theme.secondary});
    `};
    ${(props) => props.kind === "ghost" && css`
      color: ${(props) => props.theme.primary};
      background-color: rgba(29, 192, 113, 0.1);
    `};
    border-radius: 8px;
    font-size: 18px;
    font-weight: 600;
    /* width: 100% ; */
    height: ${props => props.height || '66px'};
    &:disabled{
    opacity: 0.5;
    pointer-events: none;
}
`;

const Button = ({ children, type = 'button', onClick = () => { }, kind = 'primary', ...props }) => {
    const { isLoading, to } = props;
    const child = !!isLoading ? <LoadingSpinner /> : children;

    if (to && typeof (to) === 'string') {
        return (
            <NavLink to={to} className='inline-block' >
                <ButtonStyles type={type} kind={kind} {...props}>
                    {child}
                </ButtonStyles>
            </NavLink>
        )
    }

    return (
        <ButtonStyles type={type} kind={kind} onClick={onClick} {...props}>
            {child}
        </ButtonStyles>
    );
};

Button.propTypes = {
    type: PropTypes.oneOf(['button', 'submit']),
    kind: PropTypes.oneOf(['primary', 'secondary']),
    isLoading: PropTypes.bool,
    onClick: PropTypes.func,
    children: PropTypes.node
};

export default Button;