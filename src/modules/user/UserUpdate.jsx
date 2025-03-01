import { Button } from "../../components/button";
import { Radio } from "../../components/checkbox";
import { Field, FieldCheckboxes } from "../../components/field";
import ImageUpload from "../../components/image/ImageUpload";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
// import { Textarea } from "../../components/textarea";
import { useAuth } from "../../contexts/authContext";
import { db } from "../../firebase/firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import useFirebaseImage from "../../hooks/useFireBaseImage";
import DashboardHeading from "../../modules/dashboard/DashboardHeading";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from 'sweetalert2';
import { userRole, userStatus } from "../../utils/constansts";
import Textarea from "../../components/textarea/Textarea";

const UserUpdate = () => {
    const navigate = useNavigate();
    const { control, handleSubmit, watch, reset, getValues, setValue, formState: { isValid, isSubmitting } } = useForm({
        mode: "onChange",
    });
    const [params] = useSearchParams();
    const userId = params.get("id");
    const watchStatus = watch("status");
    const watchRole = watch("role");
    const imageUrl = getValues("avatar");
    const imageRegex = /%2F(\S+)\?/gm.exec(imageUrl);
    const imageName = imageRegex?.length > 0 ? imageRegex[1] : "";
    const { imageURL, setImageURL, progress, handleOnchangeImage, handleDeleteImage } =
        useFirebaseImage(setValue, getValues, imageName, deleteAvatar);
    const { userInfo } = useAuth();

    useEffect(() => {
        document.title = 'Update user';
    }, []);

    useEffect(() => {
        setImageURL(imageUrl);
    }, [imageUrl, setImageURL]);

    useEffect(() => {
        async function fetchData() {
            if (!userId) return;
            const colRef = doc(db, "users", userId);
            const docData = await getDoc(colRef);
            reset(docData?.data());
        }
        fetchData();
    }, [userId, reset]);

    const handleUpdateUser = async (values) => {
        if (!isValid) return;
        if (userInfo?.role !== userRole.ADMIN) {
            Swal.fire("Failed", "You have no right to do this action", "warning");
            return;
        }
        try {
            const colRef = doc(db, "users", userId);
            await updateDoc(colRef, {
                ...values,
                avatar: imageURL,
            });
            toast.success("Update user information successfully!");
            navigate('/manage/user');
        } catch (error) {
            console.log(error);
            toast.error("Update user failed!");
        }
    };

    async function deleteAvatar() {
        const colRef = doc(db, "users", userId);
        await updateDoc(colRef, {
            avatar: "",
        });
    }

    if (!userId) return null;
    return (
        <div>
            <DashboardHeading title="Update user" />
            <form onSubmit={handleSubmit(handleUpdateUser)}>
                <div className="w-[200px] h-[200px] mx-auto rounded-full mb-10">
                    <ImageUpload
                        className="!rounded-full h-full"
                        onChange={handleOnchangeImage}
                        handleDeleteImage={handleDeleteImage}
                        progress={progress}
                        image={imageURL}
                        imageName={imageName}
                    />
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>Fullname</Label>
                        <Input
                            name="fullName"
                            placeholder="Enter your fullname"
                            control={control}
                        ></Input>
                    </Field>
                    <Field>
                        <Label>Username</Label>
                        <Input
                            name="username"
                            placeholder="Enter your username"
                            control={control}
                        ></Input>
                    </Field>
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>Email</Label>
                        <Input
                            name="email"
                            placeholder="Enter your email"
                            control={control}
                            type="email"
                        ></Input>
                    </Field>
                    <Field>
                        <Label>Password</Label>
                        <Input
                            name="password"
                            placeholder="Enter your password"
                            control={control}
                            type="password"
                        ></Input>
                    </Field>
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>Status</Label>
                        <FieldCheckboxes>
                            <Radio
                                name="status"
                                control={control}
                                checked={Number(watchStatus) === userStatus.ACTIVE}
                                value={userStatus.ACTIVE}
                            >
                                Active
                            </Radio>
                            <Radio
                                name="status"
                                control={control}
                                checked={Number(watchStatus) === userStatus.PENDING}
                                value={userStatus.PENDING}
                            >
                                Pending
                            </Radio>
                            <Radio
                                name="status"
                                control={control}
                                checked={Number(watchStatus) === userStatus.BAN}
                                value={userStatus.BAN}
                            >
                                Banned
                            </Radio>
                        </FieldCheckboxes>
                    </Field>
                    <Field>
                        <Label>Role</Label>
                        <FieldCheckboxes>
                            <Radio
                                name="role"
                                control={control}
                                checked={Number(watchRole) === userRole.ADMIN}
                                value={userRole.ADMIN}
                            >
                                Admin
                            </Radio>
                            <Radio
                                name="role"
                                control={control}
                                checked={Number(watchRole) === userRole.MOD}
                                value={userRole.MOD}
                            >
                                Moderator
                            </Radio>
                            <Radio
                                name="role"
                                control={control}
                                checked={Number(watchRole) === userRole.USER}
                                value={userRole.USER}
                            >
                                User
                            </Radio>
                        </FieldCheckboxes>
                    </Field>
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>Description</Label>
                        <Textarea name="description" control={control} />
                    </Field>
                </div>
                <Button
                    kind="primary"
                    type="submit"
                    className="mx-auto w-[200px]"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                >
                    Update
                </Button>
            </form>
        </div>
    );
};

export default UserUpdate;