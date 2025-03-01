import { ActionDelete, ActionEdit, ActionView } from "../../components/action";
import { Button } from "../../components/button";
import { LabelStatus } from "../../components/label";
import { Table } from "../../components/table";
import { db } from "../../firebase/firebase-config";
import { collection, deleteDoc, doc, getDocs, limit, onSnapshot, query, startAfter, where } from "firebase/firestore";
import DashboardHeading from "../../modules/dashboard/DashboardHeading";
import React, { useEffect, useState } from "react";
import { categoryStatus, userRole } from "../../utils/constansts";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { useAuth } from "../../contexts/authContext";

const CATEGORY_PER_PAGE = 2;

const CategoryManage = () => {
    const navigate = useNavigate();
    const { userInfo } = useAuth();
    const [categoryList, setCategoryList] = useState([]);
    const [filter, setFilter] = useState('');
    const [lastDoc, setLastDoc] = useState();
    const [total, setTotal] = useState(0);

    const handleLoadMoreCategory = async () => {
        const nextRef = query(
            collection(db, "categories"),
            startAfter(lastDoc || 0),
            limit(CATEGORY_PER_PAGE)
        );

        onSnapshot(nextRef, (snapshot) => {
            let results = [];
            snapshot.forEach((doc) => {
                results.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setCategoryList([...categoryList, ...results]);
        });
        const documentSnapshots = await getDocs(nextRef);
        const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
        setLastDoc(lastVisible);
    };

    useEffect(() => {
        document.title = 'Manage categories';
    }, []);

    useEffect(() => {
        async function fetchData() {
            const colRef = collection(db, "categories");
            const newRef = filter ? query(colRef, where("name", ">=", filter), where("name", "<=", filter + "utf8"))
                : query(colRef, limit(CATEGORY_PER_PAGE));
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
                setCategoryList(results);
            });

            setLastDoc(lastVisible);
        }
        fetchData();
    }, [filter]);

    const handleDeleteCategory = async (docId) => {
        // if (userInfo?.role !== userRole.ADMIN) {
        //     Swal.fire("Failed", "You have no right to do this action", "warning");
        //     return;
        // }
        const colRef = doc(db, "categories", docId);
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

    if (+userInfo?.role !== userRole.ADMIN) return null;

    return (
        <div>
            <DashboardHeading title="Categories" >
                <Button kind="ghost" height="60px" to="/manage/add-category">
                    Create category
                </Button>
            </DashboardHeading>
            <div className="flex justify-start mb-10">
                <input
                    type="text"
                    placeholder="Search category..."
                    className="px-5 py-4 w-[350px] border border-solid border-gray-300 rounded-lg outline-none"
                    onChange={(e) => handleInputFilter(e)}
                />
            </div>
            <Table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Slug</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categoryList && categoryList.length > 0 &&
                        categoryList.map((category) => (
                            <tr key={category?.id}>
                                <td>{category?.id}</td>
                                <td>{category?.name}</td>
                                <td>
                                    <span className="italic text-gray-400">{category?.slug}</span>
                                </td>
                                <td>
                                    {+(category?.status) === categoryStatus.APPROVED &&
                                        <LabelStatus type="success">Approved</LabelStatus>
                                    }
                                    {+(category?.status) === categoryStatus.UNAPPROVED &&
                                        <LabelStatus type="warning">Unapproved</LabelStatus>
                                    }
                                </td>
                                <td>
                                    <div className="flex items-center text-gray-500 gap-x-3">
                                        <ActionView onClick={() => navigate(`/category/${category.slug}`)} />
                                        <ActionEdit onClick={() => navigate(`/manage/update-category?id=${category.id}`)} />
                                        <ActionDelete onClick={() => handleDeleteCategory(category?.id)} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </Table>
            {
                total > categoryList.length && (
                    <div className="mt-10">
                        <Button onClick={handleLoadMoreCategory} className="mx-auto">
                            Load more
                        </Button>
                    </div>
                )
            }
        </div >
    );
};

export default CategoryManage;