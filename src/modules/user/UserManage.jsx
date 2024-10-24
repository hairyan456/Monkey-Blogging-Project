import { Button } from "../../components/button";
import DashboardHeading from "../../modules/dashboard/DashboardHeading";
import React, { useEffect, useState } from "react";// eslint-disable-next-line
import { useAuth } from "../../contexts/authContext";// eslint-disable-next-line
import { userRole } from "../../utils/constansts";
import UserTable from "./UserTable";
import { collection, getDocs, limit, onSnapshot, query, startAfter, where } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { debounce } from "lodash";

const USER_PER_PAGE = 2;

const UserManage = () => {
    const [userList, setUserList] = useState([]);
    const [filter, setFilter] = useState('');
    const [lastDoc, setLastDoc] = useState();
    const [total, setTotal] = useState(0);
    const { userInfo } = useAuth();

    useEffect(() => {
        document.title = 'Manage users';
    }, []);

    useEffect(() => {
        async function fetchData() {
            const colRef = collection(db, "users");
            const newRef = filter ? query(colRef, where("username", ">=", filter), where("username", "<=", filter + "utf8"))
                : query(colRef, limit(USER_PER_PAGE));
            const documentSnapshots = await getDocs(newRef);
            const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];

            onSnapshot(colRef, (snapshot) => {
                setTotal(+snapshot.size); // sizes of collection
            });

            onSnapshot(newRef, (snapshot) => {
                const results = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUserList(results);
            });

            setLastDoc(lastVisible);
        }
        fetchData();
    }, [filter]);

    const handleLoadMoreUsers = async () => {
        const nextRef = query(
            collection(db, "users"),
            startAfter(lastDoc || 0),
            limit(USER_PER_PAGE)
        );

        onSnapshot(nextRef, (snapshot) => {
            let results = [];
            snapshot.forEach((doc) => {
                results.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setUserList([...userList, ...results]);
        });
        const documentSnapshots = await getDocs(nextRef);
        const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
        setLastDoc(lastVisible);
    };

    const handleInputFilter = debounce((e) => {
        setFilter(e.target.value);
    }, 500);

    if (+userInfo?.role !== userRole.ADMIN) return null;
    return (
        <div>
            <DashboardHeading title="Users" >
                <Button kind="ghost" to="/manage/add-user"> Add new user</Button>
            </DashboardHeading>
            <div className="flex justify-start mb-10">
                <input
                    type="text"
                    placeholder="Search username..."
                    className="px-5 py-4 w-[350px] border border-solid border-gray-300 rounded-lg outline-none"
                    onChange={(e) => handleInputFilter(e)}
                />
            </div>
            <UserTable userList={userList} />
            {
                total > userList.length && (
                    <div className="mt-10">
                        <Button onClick={handleLoadMoreUsers} className="mx-auto">
                            Load more
                        </Button>
                    </div>
                )
            }
        </div >
    );
};

export default UserManage;