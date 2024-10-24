import { useParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import PostCategory from "../modules/post/PostCategory";
import PostImage from "../modules/post/PostImage";
import PostMeta from "../modules/post/PostMeta";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import NotFoundPage from "./NotFoundPage";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import parse from 'html-react-parser';
import AuthorBox from "../components/author/AuthorBox";
import PostRelated from "../modules/post/PostRelated";
import slugify from "slugify";

const PostDetailsPageStyles = styled.div`
  padding-bottom: 100px;
  .post {
    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 40px;
      margin: 40px 0;
    }
    &-feature {
      width: 100%;
      max-width: 640px;
      height: 466px;
      border-radius: 20px;
    }
    &-heading {
      font-weight: bold;
      font-size: 36px;
      margin-bottom: 16px;
    }
    &-info {
      flex: 1;
    }
    &-content {
      max-width: 700px;
      margin: 80px auto;
    }
  }
  .author {
    margin-top: 40px;
    margin-bottom: 80px;
    display: flex;
    border-radius: 20px;
    background-color: ${(props) => props.theme.grayF3};
    &-image {
      width: 200px;
      height: 200px;
      flex-shrink: 0;
      border-radius: inherit;
    }
    &-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: inherit;
    }
    &-content {
      flex: 1;
      padding: 20px;
    }
    &-name {
      font-weight: bold;
      margin-bottom: 10px;
      font-size: 20px;
    }
    &-desc {
      font-size: 14px;
      line-height: 2;
    }
  }
  @media screen and (max-width: 1023.98px) {
    padding-bottom: 40px;
    .post {
      &-header {
        flex-direction: column;
      }
      &-feature {
        height: auto;
      }
      &-heading {
        font-size: 26px;
      }
      &-content {
        margin: 40px 0;
      }
    }
    .author {
      flex-direction: column;
      &-image {
        width: 100%;
        height: auto;
      }
    }
  }
`;

const PostDetailsPage = () => {
  const { slug } = useParams();
  const [postInfo, setPostInfo] = useState({});
  const date = postInfo?.createdAt?.seconds ? new Date(postInfo.createdAt.seconds * 1000) : new Date();
  const formatDate = new Date(date).toLocaleDateString('vi-Vi');

  useEffect(() => {
    async function fetchData() {
      if (!slug) return;
      const colRef = query(collection(db, 'posts'), where('slug', '==', slug));
      onSnapshot(colRef, snapshot => {
        snapshot.forEach(doc => {
          if (doc?.data()) {
            setPostInfo(doc.data());
          }
        })
      })
    }
    document.body.scrollIntoView({ behavior: 'smooth', block: 'start' });
    fetchData();
  }, [slug]);

  if (!slug) return <NotFoundPage />
  if (!postInfo?.title) return <></>;
  return (
    <PostDetailsPageStyles>
      <Layout>
        <div className="container">
          <div className="post-header">
            <PostImage
              url={postInfo?.image}
              className="post-feature" />
            <div className="post-info">
              <PostCategory to={postInfo?.category?.slug} className="mb-6">{postInfo?.category?.name}</PostCategory>
              <h1 className="post-heading">
                {postInfo?.title}
              </h1>
              <PostMeta to={slugify(postInfo?.user?.fullName || '', { lower: true })} date={formatDate} authorName={postInfo?.user?.fullName} />
            </div>
          </div>
          <div className="post-content">
            <div className="entry-content">
              {parse(postInfo?.content ?? '')}
            </div>
            <AuthorBox userId={postInfo?.user?.id} />
          </div>
          <PostRelated categoryId={postInfo?.category?.id ?? ''} />
        </div>
      </Layout>
    </PostDetailsPageStyles>
  );
};

export default PostDetailsPage;