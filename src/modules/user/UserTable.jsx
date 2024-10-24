import { ActionDelete, ActionEdit } from "../../components/action";
import { LabelStatus } from "../../components/label";
import { Table } from "../../components/table";
import { useAuth } from "../../contexts/authContext";
import { db } from "../../firebase/firebase-config";
import { deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { userRole, userStatus } from "../../utils/constansts";

const UserTable = ({ userList }) => {
    const navigate = useNavigate();
    const { userInfo } = useAuth();

    const renderRoleLabel = (role) => {
        switch (role) {
            case userRole.ADMIN:
                return "ADMIN";
            case userRole.MOD:
                return "MODERATOR";
            case userRole.USER:
                return "USER";
            default:
                break;
        }
    };

    const renderLabelStatus = (status) => {
        switch (status) {
            case userStatus.ACTIVE:
                return <LabelStatus type="success">Active</LabelStatus>;
            case userStatus.PENDING:
                return <LabelStatus type="warning">Pending</LabelStatus>;
            case userStatus.BAN:
                return <LabelStatus type="danger">Rejected</LabelStatus>;
            default:
                break;
        }
    };

    // flex-shrink-0 đảm bảo ảnh đại diện không co lại
    // flex-1 cho phép thông tin của người dùng mở rộng để chiếm không gian còn lại trong hàng ngang.
    const renderUserItem = (user) => {
        return (
            <tr key={user.id}>
                <td title={user.id}>{user.id.slice(0, 5) + "..."}</td>
                <td className="whitespace-nowrap">
                    <div className="flex items-center gap-x-3">
                        <img src={user?.avatar} alt="" className="flex-shrink-0 object-cover w-10 h-10 rounded-md" />
                        <div className="flex-1">
                            <h3>{user?.fullName}</h3>
                            <time className="text-sm text-gray-400">
                                {new Date(user?.createdAt?.seconds * 1000).toLocaleDateString("vi-VI")}
                            </time>
                        </div>
                    </div>
                </td>
                <td>{user?.username}</td>
                <td title={user?.email}>{user?.email.slice(0, 6) + "..."}</td>
                <td>{renderLabelStatus(Number(user?.status))}</td>
                <td>{renderRoleLabel(Number(user.role))}</td>
                <td>
                    <div className="flex items-center text-gray-500 gap-x-3">
                        <ActionEdit onClick={() => navigate(`/manage/update-user?id=${user.id}`)} />
                        <ActionDelete onClick={() => handleDeleteUser(user)} />
                    </div>
                </td>
            </tr>
        );
    };

    // Firebase ko cho xóa user trong Authentication!
    const handleDeleteUser = async (user) => {
        if (userInfo?.role !== userRole.ADMIN) {
            Swal.fire("Failed", "You have no right to do this action", "warning");
            return;
        }
        const colRef = doc(db, "users", user.id);
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
                Swal.fire("Deleted!", "The user has been deleted.", "success");
            }
        });
    };

    return (
        <>
            <Table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Info</th>
                        <th>Username</th>
                        <th>Email address</th>
                        <th>Status</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {userList.length > 0 && userList.map(user => renderUserItem(user))}
                </tbody>
            </Table>
        </>
    );
};

export default UserTable;