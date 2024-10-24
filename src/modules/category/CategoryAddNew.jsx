import { toast } from "react-toastify";
import { Button } from "../../components/button";
import { Radio } from "../../components/checkbox";
import { Field, FieldCheckboxes } from "../../components/field";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import { categoryStatus } from "../../utils/constansts";
import DashboardHeading from "../dashboard/DashboardHeading";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import slugify from "slugify";
import { useNavigate } from "react-router-dom";

const CategoryAddNew = () => {
    const { control, formState: { isSubmitting, isValid }, watch, reset, handleSubmit }
        = useForm({
            mode: "onChange",
            defaultValues: {
                name: '',
                slug: '',
                status: categoryStatus.APPROVED,
                createdAt: new Date(),
            }
        });
    const navigate = useNavigate('');
    const watchStatus = watch('status');

    useEffect(() => {
        document.title = 'Monkey Blogging - Create new category'
    }, [])


    const handleAddNewCategory = async (values) => {
        if (!isValid) return;
        try {
            const categoryRef = collection(db, 'categories');
            await addDoc(categoryRef, {
                name: values?.name,
                slug: slugify(values?.slug || values?.name, { lower: true }),
                status: +(values?.status),
                createdAt: serverTimestamp(),
            });
            reset({
                name: '',
                slug: '',
                status: categoryStatus.APPROVED,
                createdAt: new Date(),
            });
            toast.success('Create new category success');
            navigate('/manage/category');

        } catch (err) {
            toast.error('Something wrong when adding new category!');
            console.log(err);
        }
    }
    return (
        <div>
            <DashboardHeading title="New category" desc="Add new category" />
            <form onSubmit={handleSubmit(handleAddNewCategory)} autoComplete="off">
                <div className="form-layout">
                    <Field>
                        <Label>Name</Label>
                        <Input
                            control={control}
                            name="name"
                            placeholder="Enter your category name"
                            required
                        ></Input>
                    </Field>
                    <Field>
                        <Label>Slug</Label>
                        <Input
                            control={control}
                            name="slug"
                            placeholder="Enter your slug"
                        ></Input>
                    </Field>
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>Status</Label>
                        <FieldCheckboxes>
                            <Radio name="status" control={control} checked={+watchStatus === categoryStatus.APPROVED}
                                value={categoryStatus.APPROVED}
                            >
                                Approved
                            </Radio>
                            <Radio name="status" control={control} checked={+watchStatus === categoryStatus.UNAPPROVED}
                                value={categoryStatus.UNAPPROVED}
                            >
                                Unapproved
                            </Radio>
                        </FieldCheckboxes>
                    </Field>
                </div>
                <Button kind="primary" isLoading={isSubmitting} disabled={isSubmitting} type="submit" className="mx-auto w-[220px]">
                    Add new category
                </Button>
            </form >
        </div >
    );
};

export default CategoryAddNew;