import { collection, deleteDoc, doc, getDocs, limit, onSnapshot, query, startAfter, where } from "firebase/firestore";
import { Table } from "../../components/table";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase-config";
import { useNavigate } from 'react-router-dom'
import ActionView from "../../components/action/ActionView";
import ActionEdit from "../../components/action/ActionEdit";
import ActionDelete from "../../components/action/ActionDelete";
import { Button } from "../../components/button";
import { debounce } from 'lodash'
import Swal from "sweetalert2";
import LabelStatus from "../../components/label/LabelStatus";
import { postStatus, userRole } from "../../utils/constansts";
import { useAuth } from "../../contexts/authContext";

const POST_PER_PAGE = 2;

const PostManage = () => {
    const [listPosts, setListPosts] = useState([]);
    const [filter, setFilter] = useState('');
    const [lastDoc, setLastDoc] = useState();
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();
    const { userInfo } = useAuth();

    useEffect(() => {
        document.title = 'Manage posts';
    }, []);

    useEffect(() => {
        async function fetchData() {
            const colRef = collection(db, "posts");
            const newRef = filter ? query(colRef, where("title", ">=", filter), where("title", "<=", filter + "utf8"))
                : query(colRef, limit(POST_PER_PAGE));
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
                setListPosts(results);
            });

            setLastDoc(lastVisible);
        };
        fetchData();
    }, [filter]);

    const handleDeletePost = async (postId) => {
        if (userInfo?.role !== userRole.ADMIN) {
            Swal.fire("Failed", "You have no right to do this action", "warning");
            return;
        }
        const colRef = doc(db, "posts", postId);
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteDoc(colRef);
                Swal.fire("Deleted!", "Your file has been deleted.", "success");
            }
        });
    };

    const handleInputFilter = debounce((e) => {
        setFilter(e.target.value);
    }, 500);

    const handleLoadMoreCategory = async () => {
        const nextRef = query(
            collection(db, "posts"),
            startAfter(lastDoc || 0),
            limit(POST_PER_PAGE)
        );

        onSnapshot(nextRef, (snapshot) => {
            let results = [];
            snapshot.forEach((doc) => {
                results.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setListPosts([...listPosts, ...results]);
        });
        const documentSnapshots = await getDocs(nextRef);
        const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
        setLastDoc(lastVisible);
    };

    const renderPostStatus = (status) => {
        switch (status) {
            case postStatus.APPROVED:
                return <LabelStatus type="success">Approved</LabelStatus>
            case postStatus.PENDING:
                return <LabelStatus type="warning">Pending</LabelStatus>
            case postStatus.REJECTED:
                return <LabelStatus type="danger">Rejected</LabelStatus>
            default:
                break;
        }
    }

    if (+userInfo?.role !== userRole.ADMIN) return <></>
    return (
        <div>
            <div className="flex justify-between">
                <h1 className="dashboard-heading">Posts </h1>
            </div>
            <div className="mb-10 flex justify-end">
                <div className="w-full max-w-[300px]">
                    <input
                        type="text"
                        className="w-full p-4 rounded-lg border border-solid border-gray-300"
                        placeholder="Search post..."
                        onChange={(e) => handleInputFilter(e)}

                    />
                </div>
            </div>
            <Table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Post</th>
                        <th>Category</th>
                        <th>Author</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {listPosts && listPosts.length > 0 &&
                        listPosts.map((item, index) => {
                            const date = item?.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000) : new Date();
                            const formatDate = new Date(date).toLocaleDateString('vi-Vi');
                            return (
                                <tr key={item?.id}>
                                    <td title={item?.id}>{item?.id?.slice(0, 5) + '...'}</td>
                                    <td>
                                        <div className="flex items-center gap-x-3">
                                            <img
                                                src={item?.image}
                                                alt=""
                                                className="w-[66px] h-[55px] rounded object-cover"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-semibold max-w-[300px] whitespace-pre-wrap">{item?.title}</h3>
                                                <time className="text-sm text-gray-500">
                                                    Date: {formatDate}
                                                </time>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="text-gray-500">{item?.category?.name}</span>
                                    </td>
                                    <td>
                                        <span className="text-gray-500">{item?.user?.username}</span>
                                    </td>
                                    <td>
                                        {renderPostStatus(item?.status)}
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-x-3 text-gray-500">
                                            <ActionView onClick={() => navigate(`/${item?.slug}`)} />
                                            <ActionEdit onClick={() => navigate(`/manage/update-post?id=${item?.id}`)} />
                                            <ActionDelete onClick={() => handleDeletePost(item?.id)} />
                                        </div>
                                    </td>
                                </tr>
                            )

                        })
                    }

                </tbody>
            </Table>
            {
                total > listPosts.length && (
                    <div className="mt-10">
                        <Button onClick={handleLoadMoreCategory} className="mx-auto">
                            Load more
                        </Button>
                    </div>
                )
            }
        </div>
    );
};

export default PostManage;