import { collection, onSnapshot, query, where } from "firebase/firestore";
import Heading from "../../components/layout/Heading";
import { db } from "../../firebase/firebase-config";
import PostFeatureItem from '../post/PostFeatureItem';
import React, { useCallback, useEffect, useState } from "react";
import styled from 'styled-components';

const HomeFeatureStyles = styled.div``;

const HomeFeature = () => {
    const [posts, setPosts] = useState([]);

    const fetchDataPosts = useCallback(() => {
        const postRef = collection(db, 'posts');
        const q = query(postRef, where('status', '==', 1));
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
    return (
        <HomeFeatureStyles className="home-block">
            <div className="container">
                <Heading>Bài viết nổi bật</Heading>
                <div className="grid-layout">
                    {posts.map((item, index) => (
                        <PostFeatureItem key={item.id} data={item} />
                    ))}
                </div>
            </div>
        </HomeFeatureStyles>
    );
};

export default HomeFeature;