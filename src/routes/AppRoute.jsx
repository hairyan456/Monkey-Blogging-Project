import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const HomePage = lazy(() => import('../pages/HomePage'));
const SignInPage = lazy(() => import('../pages/SignInPage'));
const SignUpPage = lazy(() => import('../pages/SignUpPage'));
const PostDetailsPage = lazy(() => import('../pages/PostDetailsPage'));
const DashboardLayout = lazy(() => import('../modules/dashboard/DashboardLayout'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const PostManage = lazy(() => import('../modules/post/PostManage'));
const PostAddNew = lazy(() => import('../modules/post/PostAddNew'));
const PostUpdate = lazy(() => import('../modules/post/PostUpdate'));
const CategoryPage = lazy(() => import('../pages/CategoryPage'));
const CategoryManage = lazy(() => import('../modules/category/CategoryManage'));
const CategoryUpdate = lazy(() => import('../modules/category/CategoryUpdate'));
const CategoryAddNew = lazy(() => import('../modules/category/CategoryAddNew'));
const UserManage = lazy(() => import('../modules/user/UserManage'));
const UserAddNew = lazy(() => import('../modules/user/UserAddNew'));
const UserUpdate = lazy(() => import('../modules/user/UserUpdate'));
const UserProfile = lazy(() => import('../modules/user/UserProfile'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

const AppRoute = () => {
    return (
        <>
            <Suspense>
                <Routes >
                    <Route path='/' element={<HomePage />}></Route>
                    <Route path='/sign-in' element={<SignInPage />} />
                    <Route path='/sign-up' element={<SignUpPage />} />
                    <Route path="/:slug" element={<PostDetailsPage />} />
                    <Route path="/category/:slug" element={<CategoryPage />} />
                    <Route element={<DashboardLayout></DashboardLayout>}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/manage/posts" element={<PostManage />} />
                        <Route path="/manage/add-post" element={<PostAddNew />} />
                        <Route path="/manage/update-post" element={<PostUpdate />} />
                        <Route path="/manage/category" element={<CategoryManage />} />
                        <Route path="/manage/add-category" element={<CategoryAddNew />} />
                        <Route path="/manage/update-category" element={<CategoryUpdate />} />
                        <Route path="/manage/user" element={<UserManage />} />
                        <Route path="/manage/add-user" element={<UserAddNew />} />
                        <Route path="/manage/update-user" element={<UserUpdate />} />
                        <Route path="/profile" element={<UserProfile></UserProfile>} />
                    </Route>
                    <Route path='*' element={<NotFoundPage />} />
                </Routes>
            </Suspense>
        </>
    )
}

export default AppRoute;