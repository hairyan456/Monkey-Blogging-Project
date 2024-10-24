import Heading from "../../components/layout/Heading";
import PostNewestItem from "../post/PostNewestItem";
import PostNewestLarge from "../post/PostNewestLarge";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { collection, limit, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";

const HomeNewestStyles = styled.div`
  .layout {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-gap: 40px;
    margin-bottom: 64px;
    align-items: start;
  }
  .sidebar {
    padding: 28px 20px;
    background-color: #f3edff;
    border-radius: 16px;
  }
  
`;

const HomeNewest = () => {
    const [posts, setPosts] = useState([]);


    const fetchDataPosts = useCallback(() => {
        const postRef = collection(db, 'posts');
        const q = query(postRef, where('status', '==', 1), where('hot', '==', false), limit(4));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const results = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPosts(results);
        });
        return unsubscribe; // Return hàm unsubscribe để cleanup khi component unmount
    }, []);

    useEffect(() => {
        const unsubscribe = fetchDataPosts();
        return () => unsubscribe(); // Cleanup listener khi component unmount
    }, [fetchDataPosts]);

    if (posts.length <= 0) return null;
    const [first, ...other] = posts;

    return (
        <HomeNewestStyles className="home-block">
            <div className="container">
                <Heading>Mới nhất</Heading>
                <div className="layout">
                    <PostNewestLarge data={first} />
                    <div className="sidebar">
                        {other && other.length > 0 &&
                            other.map(item => (
                                <PostNewestItem key={item?.id} data={item} />
                            ))
                        }
                    </div>
                </div>
            </div>
        </HomeNewestStyles>
    );
};

export default HomeNewest;