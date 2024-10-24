import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase-config';

const AuthorBox = ({ userId = '' }) => {
    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        async function fetchUserData() {
            if (!userId) return;
            const docRef = doc(db, 'users', userId);
            const docSnapshot = await getDoc(docRef);
            setUserInfo(docSnapshot?.data() ?? {});
        }
        fetchUserData();
    }, [userId]);

    if (!userId || !userInfo?.email) return <></>;
    return (
        <div className="author">
            <div className="author-image">
                <img src={userInfo?.avatar ?? ''} alt="" />
            </div>
            <div className="author-content">
                <h3 className="author-name">{userInfo?.fullName ?? ''}</h3>
                <p className="author-desc">{userInfo?.description ?? 'Not description...'}</p>
            </div>
        </div>
    );
};

export default AuthorBox;