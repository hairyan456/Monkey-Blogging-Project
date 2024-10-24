import { doc, updateDoc } from "firebase/firestore";
import { Button } from "../../components/button";
import { Field } from "../../components/field";
import ImageUpload from "../../components/image/ImageUpload";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import { useAuth } from "../../contexts/authContext";
import DashboardHeading from "../../modules/dashboard/DashboardHeading";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { db } from "../../firebase/firebase-config";
import useFireBaseImage from "../../hooks/useFireBaseImage";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
    const { control, handleSubmit, reset, getValues, setValue, watch, formState: { isValid, isSubmitting } } = useForm({
        mode: "onChange",
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    });
    const navigate = useNavigate();
    const { userInfo } = useAuth();
    const imageUrl = getValues("avatar");
    const imageRegex = /%2F(\S+)\?/gm.exec(imageUrl);
    const imageName = imageRegex?.length > 0 ? imageRegex[1] : "";
    const { imageURL, setImageURL, progress, handleOnchangeImage, handleDeleteImage } =
        useFireBaseImage(setValue, getValues, imageName, deleteAvatar);
    const watchPassword = watch('password');
    const watchConfirmPassword = watch('confirmPassword');

    useEffect(() => {
        if (!userInfo?.uid) return;
        reset({
            fullName: userInfo?.fullName,
            username: userInfo?.username,
            email: userInfo?.email,
            avatar: userInfo?.avatar,
        });

        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        setImageURL(imageUrl);
    }, [imageUrl, setImageURL]);

    async function deleteAvatar() {
        const colRef = doc(db, "users", userInfo?.uid);
        await updateDoc(colRef, {
            avatar: "",
        });
    }

    const handleUpdateProfile = async (values) => {
        if (!isValid) return;
        if (watchPassword !== watchConfirmPassword) {
            toast.warning('New password & cofirm password are not the same!');
            return;
        }
        try {
            const colRef = doc(db, "users", userInfo?.uid);
            await updateDoc(colRef, {
                ...values,
                avatar: imageURL,
                password: getValues('password') ? getValues('password') : userInfo?.password,
            });
            toast.success("Update user profile successfully!");
            navigate('/manage/user');
        } catch (error) {
            console.log(error);
            toast.error("Update user profile failed!");
        }
    };

    if (!userInfo?.uid) return <></>;
    return (
        <div>
            <DashboardHeading title="Account information" />
            <form onSubmit={handleSubmit(handleUpdateProfile)}>
                <div className="text-center mb-10">
                    <ImageUpload className="!w-[200px] h-[200px] !rounded-full min-h-0 mx-auto"
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
                            control={control}
                            name="fullName"
                            placeholder="Enter your fullname"
                        ></Input>
                    </Field>
                    <Field>
                        <Label>Username</Label>
                        <Input
                            control={control}
                            name="username"
                            placeholder="Enter your username"
                        ></Input>
                    </Field>
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>Email</Label>
                        <Input
                            control={control}
                            name="email"
                            type="email"
                            placeholder="Enter your email address"
                        ></Input>
                    </Field>
                    <Field></Field>
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>New Password</Label>
                        <Input
                            control={control}
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                        ></Input>
                    </Field>
                    <Field>
                        <Label>Confirm Password</Label>
                        <Input
                            control={control}
                            name="confirmPassword"
                            type="password"
                            placeholder="Enter your confirm password"
                        ></Input>
                    </Field>
                </div>
                <Button kind="primary" className="mx-auto w-[200px]" type="submit"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                >
                    Update
                </Button>
            </form>
        </div>
    );
};

export default UserProfile;