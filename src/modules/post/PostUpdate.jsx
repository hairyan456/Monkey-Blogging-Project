import axios from 'axios';
import { Button } from "../../components/button"; // eslint-disable-next-line
import { Radio } from "../../components/checkbox";
import { Dropdown } from "../../components/dropdown";
import { Field } from "../../components/field";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { postStatus } from "../../utils/constansts";
import ImageUpload from "../../components/image/ImageUpload";
import useFireBaseImage from "../../hooks/useFireBaseImage";
import Toggle from "../../components/toggle/Toggle";
import { collection, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase-config';
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageUploader from 'quill-image-uploader';
Quill.register('modules/imageUploader', ImageUploader);


const PostUpdate = () => {
    const { control, formState: { isSubmitting }, watch, setValue, getValues, handleSubmit, reset } = useForm({
        mode: "onChange",
        defaultValues: {
            title: '',
            slug: '',
            image: '',
            status: postStatus.PENDING,
            category: {},
            user: {},
            hot: false
        },
    });
    const watchStatus = watch("status");
    const watchHot = watch('hot');
    const [params] = useSearchParams();
    const postId = params?.get('id') || '';
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState({});
    const imageUrl = getValues("image");
    const imageRegex = /%2F(\S+)\?/gm.exec(imageUrl);
    const imageName = imageRegex?.length > 0 ? imageRegex[1] : "";
    const { imageURL, setImageURL, progress, handleOnchangeImage, handleDeleteImage } =
        useFireBaseImage(setValue, getValues, imageName, deletePostImage);
    const [authorName, setAuthorName] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchPostData() {
            if (!postId) return;
            const docRef = doc(db, 'posts', postId);
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot?.data()) {
                reset(docSnapshot.data());
                setAuthorName(docSnapshot.data()?.user?.username ?? '');
                setSelectedCategory(docSnapshot?.data()?.category ?? {});
                setContent(docSnapshot?.data()?.content ?? '');
            }
        }
        fetchPostData();
        document.title = 'Update post'
    }, [postId, reset]);

    useEffect(() => {
        setImageURL(imageUrl);
    }, [imageUrl, setImageURL]);

    const fetchDataCategory = useCallback(async () => {
        const q = query(collection(db, 'categories'), where('status', '==', 1));
        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map((item) => ({ id: item.id, data: item.data() }));
        setCategories(results);
    }, []);

    useEffect(() => {
        fetchDataCategory();
    }, [fetchDataCategory]);

    async function deletePostImage() {
        const colRef = doc(db, "posts", postId);
        await updateDoc(colRef, {
            image: "",
        });
    }

    const handleClickCategoryOption = async (item) => {
        const colRef = doc(db, 'categories', item?.id);
        const docData = await getDoc(colRef);
        setValue('category', {
            id: docData?.id, ...docData?.data()
        });
        setSelectedCategory(item?.data);
    }

    const modules = useMemo(() => ({
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['link', 'image']
        ],
        imageUploader: {
            // imgbbAPI key:
            upload: async (file) => {
                const bodyFormData = new FormData();
                bodyFormData.append('image', file);
                const res = await axios({
                    method: 'post',
                    url: 'https://api.imgbb.com/1/upload?key=e42cb29a2f81a73aaf30c0ae6b8b606e',
                    data: bodyFormData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
                return res?.data?.data?.url;
            }
        }
    }), []);

    const handleUppdatePost = async (values) => {
        const docRef = doc(db, 'posts', postId);
        await updateDoc(docRef, {
            ...values,
            image: imageURL || imageUrl,
            status: +(values?.status),
            content,
            updatedAt: serverTimestamp(),
        });
        toast.success("Update post information successfully!");
        navigate('/manage/posts');
    }

    if (!postId) return <></>;
    return (
        <>
            <h1 className="dashboard-heading">Update post</h1>
            <form onSubmit={handleSubmit(handleUppdatePost)}>
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
                                value={+postStatus.APPROVED}
                            >
                                Approved
                            </Radio>
                            <Radio
                                name="status"
                                control={control}
                                checked={+watchStatus === postStatus.PENDING}
                                value={+postStatus.PENDING}
                            >
                                Pending
                            </Radio>
                            <Radio
                                name="status"
                                control={control}
                                checked={+watchStatus === postStatus.REJECTED}
                                value={+postStatus.REJECTED}
                            >
                                Reject
                            </Radio>
                        </div>
                    </Field>
                    <Field>
                        <Label>Author</Label>
                        <Input control={control} placeholder="Find the author" value={authorName} readOnly />
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
                            <Dropdown.Select placeholder={selectedCategory?.name || 'Select the category'} />
                            <Dropdown.List >
                                {categories && categories.length > 0 &&
                                    categories.map(item =>
                                        <Dropdown.Option key={item?.id}
                                            onClick={() => handleClickCategoryOption(item)}
                                        >
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
                        <ImageUpload className={'h-[250px]'}
                            onChange={handleOnchangeImage}
                            handleDeleteImage={handleDeleteImage}
                            progress={progress}
                            image={imageURL}
                            imageName={imageName}
                        />
                    </Field>
                </div>
                <div className="mb-10">
                    <Field>
                        <Label>Content</Label>
                        <div className="w-full entry-content" >
                            <ReactQuill modules={modules} theme="snow" value={content} onChange={setContent} />
                        </div>
                    </Field>
                </div>
                <Button isLoading={isSubmitting} disabled={isSubmitting} type="submit" className="mx-auto w-[250px]">
                    Update post
                </Button>
            </form>
        </>
    )

};

export default PostUpdate;