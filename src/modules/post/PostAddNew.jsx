import { Button } from "../../components/button"; // eslint-disable-next-line
import { Radio } from "../../components/checkbox";
import { Dropdown } from "../../components/dropdown";
import { Field } from "../../components/field";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { postStatus } from "../../utils/constansts";
import slugify from 'slugify';
import ImageUpload from "../../components/image/ImageUpload";
import useFireBaseImage from "../../hooks/useFireBaseImage";
import Toggle from "../../components/toggle/Toggle";
import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase-config';
import { useAuth } from "../../contexts/authContext";
import { toast } from "react-toastify";

const PostAddNewStyles = styled.div``;

const PostAddNew = () => {
    const { control, formState: { isSubmitting }, watch, setValue, getValues, handleSubmit, reset } = useForm({
        mode: "onChange",
        defaultValues: {
            title: '',
            slug: '',
            image_name: '',
            image: '',
            status: postStatus.PENDING,
            hot: false
        },
    });
    const watchStatus = watch("status");
    const watchHot = watch('hot');
    const { userInfo } = useAuth();
    const { progress, imageURL, handleResetUpload, handleOnchangeImage, handleDeleteImage } =
        useFireBaseImage(setValue, getValues);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState({});

    const fetchDataCategory = useCallback(async () => {
        const categoryRef = collection(db, 'categories');
        const q = query(categoryRef, where('status', '==', 1));
        const querySnapshot = await getDocs(q);
        if (querySnapshot) {
            const results = [];
            querySnapshot.forEach((item) => {
                results.push({ id: item.id, data: item.data() });
            });
            setCategories(results);
        }
    }, []); // Không có dependencies nên hàm chỉ được tạo một lần

    useEffect(() => {
        async function fetchUserData() {
            if (!userInfo?.email) return;
            const q = query(collection(db, 'users'), where('email', '==', userInfo.email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(doc => {
                setValue('user', { id: doc?.id, ...doc.data() });
            });
        }

        fetchUserData();
        document.title = 'Create new post';

        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, []);

    useEffect(() => {
        fetchDataCategory();
    }, [fetchDataCategory]);

    const handleClickCategoryOption = async (item) => {
        const colRef = doc(db, 'categories', item?.id);
        const docData = await getDoc(colRef);
        setValue('category', {
            id: docData?.id, ...docData?.data()
        });
        setSelectedCategory(item);
    }

    // Submit form:
    const handleAddNewPost = async (values) => {
        try {
            const postRef = collection(db, 'posts');
            await addDoc(postRef, {
                title: values?.title,
                slug: slugify(values?.slug || values?.title, { lower: true }),
                image: imageURL || '',
                user: values?.user,
                status: +(values?.status),
                category: values?.category,
                hot: values?.hot,
                createdAt: serverTimestamp()
            });
            reset({
                title: '', slug: '', image_name: '', image: '', status: postStatus.PENDING, hot: false,
                user: {}, category: {}
            });
            handleResetUpload();
            setSelectedCategory({});
            toast.success('Create new post success');
        } catch (err) {
            toast.error('Something wrong when adding new post!');
            console.log(err);
        }
    };

    return (
        <PostAddNewStyles>
            <h1 className="dashboard-heading">Add new post</h1>
            <form onSubmit={handleSubmit(handleAddNewPost)}>
                <div className="grid grid-cols-2 gap-x-10 mb-10">
                    <Field>
                        <Label>Title</Label>
                        <Input
                            control={control}
                            placeholder="Enter your title"
                            name="title"
                            required
                        ></Input>
                    </Field>
                    <Field>
                        <Label>Slug</Label>
                        <Input
                            control={control}
                            placeholder="Enter your slug"
                            name="slug"
                        ></Input>
                    </Field>
                </div>

                <div className="grid grid-cols-2 gap-x-10 mb-10">
                    <Field>
                        <Label>Status</Label>
                        <div className="flex items-center gap-x-5">
                            <Radio
                                name="status"
                                control={control}
                                checked={+watchStatus === postStatus.APPROVED}
                                value={postStatus.APPROVED}
                            >
                                Approved
                            </Radio>
                            <Radio
                                name="status"
                                control={control}
                                checked={+watchStatus === postStatus.PENDING}
                                value={postStatus.PENDING}
                            >
                                Pending
                            </Radio>
                            <Radio
                                name="status"
                                control={control}
                                checked={+watchStatus === postStatus.REJECTED}
                                value={postStatus.REJECTED}
                            >
                                Reject
                            </Radio>
                        </div>
                    </Field>
                    <Field>
                        <Label>Author</Label>
                        <Input control={control} placeholder="Find the author"></Input>
                    </Field>
                </div>
                <div className="grid grid-cols-2 gap-x-10 mb-10">
                    <Field>
                        <Label>Feature post</Label>
                        <Toggle on={watchHot} onClick={() => setValue('hot', !watchHot)} />
                    </Field>
                    <Field>
                        <Label>Category</Label>
                        <Dropdown>
                            <Dropdown.Select placeholder={selectedCategory?.data?.name || 'Select the category'} />
                            <Dropdown.List >
                                {categories && categories.length > 0 &&
                                    categories.map(item =>
                                        <Dropdown.Option key={item?.id} onClick={() => handleClickCategoryOption(item)}>
                                            {item?.data?.name ?? ''}
                                        </Dropdown.Option>
                                    )
                                }
                            </Dropdown.List>
                        </Dropdown>
                    </Field>
                    <Field></Field>
                </div>
                <div className="w-1/2 gap-x-10 mb-10 ">
                    <Field>
                        <Label>Image</Label>
                        <ImageUpload image={imageURL} progress={progress}
                            onChange={handleOnchangeImage}
                            handleDeleteImage={handleDeleteImage}
                        />
                    </Field>
                </div>
                <Button isLoading={isSubmitting} disabled={isSubmitting} type="submit" className="mx-auto w-[250px]">
                    Add new post
                </Button>
            </form>
        </PostAddNewStyles>
    );
};

export default PostAddNew;