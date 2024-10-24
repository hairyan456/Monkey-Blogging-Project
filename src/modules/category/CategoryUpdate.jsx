import { Button } from "../../components/button";
import { Radio } from "../../components/checkbox";
import { Field } from "../../components/field";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import { useAuth } from "../../contexts/authContext";
import { db } from "../../firebase/firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import DashboardHeading from "../../modules/dashboard/DashboardHeading";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import slugify from "slugify";
import Swal from "sweetalert2";
import { categoryStatus, userRole } from "../../utils/constansts";

const CategoryUpdate = () => {
    const { control, reset, watch, handleSubmit, formState: { isSubmitting } } = useForm({
        mode: "onChange",
        defaultValues: {},
    });
    const { userInfo } = useAuth();
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const categoryId = params.get("id");
    const watchStatus = watch("status");

    useEffect(() => {
        async function fetchData() {
            const colRef = doc(db, "categories", categoryId);
            const singleDoc = await getDoc(colRef);
            reset(singleDoc.data());
        }
        fetchData();
    }, [categoryId, reset]);


    const handleUpdateCategory = async (values) => {
        if (userInfo?.role !== userRole.ADMIN) {
            Swal.fire("Failed", "You have no right to do this action", "warning");
            return;
        }
        const colRef = doc(db, "categories", categoryId);
        await updateDoc(colRef, {
            name: values?.name,
            slug: slugify(values?.slug || values?.name, { lower: true }),
            status: +(values?.status),
        });
        toast.success("Update category successfully!");
        navigate("/manage/category");
    };

    if (!categoryId) return null;
    return (
        <div>
            <DashboardHeading title="Update category" />
            <form onSubmit={handleSubmit(handleUpdateCategory)}>
                <div className="form-layout">
                    <Field>
                        <Label>Name</Label>
                        <Input
                            control={control}
                            name="name"
                            placeholder="Enter your category name"
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
                        <div className="flex flex-wrap gap-x-5">
                            <Radio
                                name="status"
                                control={control}
                                checked={+watchStatus === categoryStatus.APPROVED}
                                value={categoryStatus.APPROVED}
                            >
                                Approved
                            </Radio>
                            <Radio
                                name="status"
                                control={control}
                                checked={+watchStatus === categoryStatus.UNAPPROVED}
                                value={categoryStatus.UNAPPROVED}
                            >
                                Unapproved
                            </Radio>
                        </div>
                    </Field>
                </div>
                <Button
                    kind="primary"
                    className="mx-auto w-[230px]"
                    type="submit"
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                >
                    Update category
                </Button>
            </form>
        </div>
    );
};

export default CategoryUpdate;