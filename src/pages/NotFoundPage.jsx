import { NavLink } from "react-router-dom";
import styled from "styled-components";

const NotFoundPageStyles = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    .logo{
        display: inline-block;
        margin-bottom: 40px;
    }

    .heading{
        font-size: 60px;
        margin-bottom: 25px;
        font-weight: bold;
    }

    .back{
        display: inline-block;
        padding: 15px 30px;
        color: white;
        background-color: ${props => props.theme.primary};
        border-radius: 8px;
        font-weight: 500;
    }
`;

const NotFoundPage = () => {
    return (
        <NotFoundPageStyles >
            <NavLink to={'/'} className={'logo'}>
                <img srcSet="/logo.png 2x" alt="money-blogging" />
            </NavLink>
            <h1 className="heading">Opps! Page Not Found</h1>
            <NavLink to={'/'} className={'back'}>
                Back to homepage
            </NavLink>
        </NotFoundPageStyles>
    )
}

export default NotFoundPage;