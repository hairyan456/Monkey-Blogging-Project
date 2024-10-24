import React from 'react';
import styled from 'styled-components';
import HomeBanner from '../modules/home/HomeBanner';
import Layout from '../components/layout/Layout';
import HomeFeature from '../modules/home/HomeFeature';
import HomeNewest from '../modules/home/HomeNewest';

const HomePageStyles = styled.div`

`;

const HomePage = () => {

    return (
        <HomePageStyles>
            <Layout>
                <HomeBanner />
                <HomeFeature />
                <HomeNewest />
            </Layout>
        </HomePageStyles>
    );
};

export default HomePage;