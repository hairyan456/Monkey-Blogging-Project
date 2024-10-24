import { Button } from "../../components/button";
import { Radio } from "../../components/checkbox";
import { Field, FieldCheckboxes } from "../../components/field";
import ImageUpload from "../../components/image/ImageUpload";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import DashboardHeading from "../../modules/dashboard/DashboardHeading";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { userRole, userStatus } from "../../utils/constansts";
import useFirebaseImage from "../../hooks/useFireBaseImage";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/firebase-config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import slugify from "slugify";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/authContext";
import Swal from "sweetalert2";

const UserAddNew = () => {
    const { control, handleSubmit, setValue, watch, getValues, formState: { isValid, isSubmitting }, reset } = useForm({
        mode: "onChange",
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            username: "",
            avatar: "",
            status: userStatus.ACTIVE,
            role: userRole.USER,
            createdAt: new Date(),
        },
    });
    const { imageURL, handleResetUpload, progress, handleOnchangeImage, handleDeleteImage }
        = useFirebaseImage(setValue, getValues);
    const { userInfo } = useAuth();
    const watchStatus = watch("status");
    const watchRole = watch("role");

    useEffect(() => {
        document.title = 'Create new user';
    }, []);

    const handleCreateUser = async (values) => {
        if (!isValid) return;
        if (userInfo?.role !== userRole.ADMIN) {
            Swal.fire("Failed", "You have no right to do this action", "warning");
            return;
        }
        try {
            await createUserWithEmailAndPassword(auth, values?.email, values?.password);
            await addDoc(collection(db, "users"), {
                fullName: values?.fullName,
                email: values?.email,
                password: values?.password,
                username: slugify(values?.username || values?.fullName, {
                    lower: true,
                    replacement: " ",
                    trim: true,
                }),
                avatar: imageURL || '',
                status: +(values?.status),
                role: +(values?.role),
                createdAt: serverTimestamp(),
            });
            toast.success(`Create new user with email: ${values?.email} successfully!`);
            reset({
                fullName: "",
                email: "",
                password: "",
                username: "",
                avatar: "",
                status: userStatus.ACTIVE,
                role: userRole.USER,
                createdAt: new Date(),
            });
            handleResetUpload();
        } catch (error) {
            console.log(error);
            toast.error("Can not create new user");
        }
    };

    if (+userInfo.role !== userRole.ADMIN) return null;
    return (
        <div>
            <DashboardHeading title="New user" />
            <form onSubmit={handleSubmit(handleCreateUser)}>
                <div className="w-[200px] h-[200px] mx-auto rounded-full mb-10">
                    <ImageUpload
                        className="!rounded-full h-full"
                        onChange={handleOnchangeImage}
                        handleDeleteImage={handleDeleteImage}
                        progress={progress}
                        image={imageURL}
                    ></ImageUpload>
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>Fullname</Label>
                        <Input
                            name="fullName"
                            placeholder="Enter your fullName"
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
                                checked={+(watchStatus) === userStatus.ACTIVE}
                                value={userStatus.ACTIVE}
                            >
                                Active
                            </Radio>
                            <Radio
                                name="status"
                                control={control}
                                checked={+(watchStatus) === userStatus.PENDING}
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
                <Button
                    kind="primary"
                    type="submit"
                    className="mx-auto w-[200px]"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                >
                    Add new user
                </Button>
            </form>
        </div>
    );
};

export default UserAddNew;