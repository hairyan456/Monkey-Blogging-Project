import React, { useEffect, useState } from 'react';
import Heading from '../../components/layout/Heading';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase-config';
import PostItem from './PostItem';

const PostRelated = ({ categoryId = '' }) => {
    const [relatedPosts, setRelatedPosts] = useState([]);

    useEffect(() => {
        const docRef = query(collection(db, 'posts'), where('category.id', '==', categoryId));
        onSnapshot(docRef, (snapshot) => {
            if (snapshot) {
                setRelatedPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            }
        });

    }, [categoryId]);

    if (!categoryId || relatedPosts.length <= 0) return <></>;
    return (
        <div className="post-related">
            <Heading>Bài viết liên quan</Heading>
            <div className="grid-layout grid-layout--primary">
                {
                    relatedPosts?.map(item => (
                        <PostItem key={item?.id} data={item} />
                    ))
                }
            </div>
        </div>
    );
};

export default PostRelated;