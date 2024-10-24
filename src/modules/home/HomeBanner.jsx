import React from 'react';
import styled from 'styled-components';
import Button from '../../components/button/Button';

const HomeBannerStyles = styled.div`
    min-height: 520px;
    padding: 40px 0;
    background-image:  linear-gradient(to right bottom, ${props => props.theme.primary}, ${props => props.theme.secondary});
    margin-bottom: 40px;
    .banner{
        display: flex;
        justify-content: space-between;
        align-items: center;

        &-content{
            max-width: 600px;
            color:white;
        }

        &-heading{
            font-size: 45px;
            font-weight: bold;
            margin-bottom: 20px;
        }

        &-desc{
            line-height: 1.75;
            margin-bottom: 40px;
        }
    }
`;

const HomeBanner = () => {
    return (
        <HomeBannerStyles >
            <div className="container">
                <div className="banner">
                    <div className="banner-content">
                        <h1 className='banner-heading'>Money blogging</h1>
                        <p className='banner-desc'>
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Pariatur possimus aliquam accusamus provident inventore cupiditate ut doloribus consectetur mollitia, deleniti incidunt laborum sed nostrum fugit ea est! Mollitia, pariatur iure?
                        </p>
                        <Button kind={'secondary'} to={'/sign-up'}>Get started</Button>
                    </div>
                    <div className="banner-image">
                        <img src='/img-banner.png' alt='' />
                    </div>
                </div>
            </div>
        </HomeBannerStyles>
    );
};

export default HomeBanner;