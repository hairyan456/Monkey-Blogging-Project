import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const AuthenticationPageStyles = styled.div`
    min-height: 100vh;
    padding: 40px;
    .logo{
        margin: 0 auto 20px;
    }
    .heading{
        text-align: center;
        color: ${props => props.theme.primary};
        font-weight: 500;
        font-size: 40px;
        margin-bottom: 60px;
    }

    .form{
        max-width: 600px;   
        margin: 0 auto;
    }

    .error{
        font-size: 0.9rem;
        --tw-text-opacity: 1;
        color: rgb(239 68 68 / var(--tw-text-opacity))
    }

    .have-account{
        margin-bottom: 20px;
        a{
            display: inline-block;
            color: ${props => props.theme.primary};
            font-weight: 500;
            margin-left: 8px;

            &:hover{
                text-decoration: underline;
            }
        }
    }
`;

const AuthenticationPage = ({ children, ...props }) => {
    return (
        <AuthenticationPageStyles>
            <div className="container">
                <NavLink to={'/'}>
                    <img srcSet='/logo.png 2x' alt='monkey-bloging' className='logo' />
                </NavLink> 
                <h1 className='heading'>Monkey Blogging</h1>
                {children || <></>}
            </div>
        </AuthenticationPageStyles>
    );
};

export default AuthenticationPage;