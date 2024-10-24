import Heading from "../components/layout/Heading";
import Layout from "../components/layout/Layout";
import { db } from "../firebase/firebase-config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import PostItem from "../modules/post/PostItem";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CategoryPage = () => {
    const [posts, setPosts] = useState([]);
    const params = useParams();

    useEffect(() => {
        const docRef = query(collection(db, "posts"), where("category.slug", "==", params.slug));
        const unsubscribe = onSnapshot(docRef, (snapshot) => {
            const results = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPosts(results);
        });
        return () => unsubscribe(); // Hủy đăng ký khi component bị unmounted
    }, [params.slug]);


    if (posts.length <= 0) return null;
    return (
        <Layout>
            <div className="container">
                <div className="pt-10"></div>
                <Heading>Danh mục {params.slug}</Heading>
                <div className="grid-layout grid-layout--primary">
                    {posts.map((item) => (
                        <PostItem key={item.id} data={item}></PostItem>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default CategoryPage;