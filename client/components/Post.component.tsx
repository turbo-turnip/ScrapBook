import { NextRouter } from "next/router";
import { FC } from "react";
import { PostType } from "../util/postType.util";
import styles from '../styles/post.module.css';
import Link from "next/link";

interface PostProps {
  post?: PostType|null;
  showComments: boolean;
  setShowComments: (prevState: any) => any;
  index: number;
  router: NextRouter;
  userID: string|undefined;
  setAlerts: (prevState: any) => any;
  setErrorPopups: (prevState: any) => any;
  setSuccessPopups: (prevState: any) => any;
  setCommunity: (prevState: any) => any;
}

export const Post: FC<PostProps> = ({ post, showComments, router, setShowComments, index, userID, setAlerts, setErrorPopups, setSuccessPopups, setCommunity }) => {
  const likePost = async () => {
    const accessToken = localStorage.getItem("at") || "";
    const refreshToken = localStorage.getItem("rt") || "";

    const req = await fetch(backendPath + "/posts/like", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        accessToken, refreshToken,
        postID: post?.id || ""
      })
    });
    const res = await req.json();
    if (res.success) {
      if (res.generateNewTokens) {
        localStorage.setItem("at", res?.newAccessToken);
        localStorage.setItem("rt", res?.newRefreshToken);
      }

      setCommunity(res?.community);
      setSuccessPopups((prevState: Array<string>) => [...prevState, `You ${res?.option || "like"} this post`]);
      return;
    } else {
      setErrorPopups((prevState: Array<string>) => [...prevState, res?.error || "An error occurred. Please refresh the page and try again"]);
      return;
    }
  }

  const likeComment = async (commentID: string) => {
    const accessToken = localStorage.getItem("at") || "";
    const refreshToken = localStorage.getItem("rt") || "";

    const req = await fetch(backendPath + "/posts/likeComment", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        accessToken, refreshToken,
        commentID
      })
    });
    const res = await req.json();
    if (res.success) {
      if (res.generateNewTokens) {
        localStorage.setItem("at", res?.newAccessToken);
        localStorage.setItem("rt", res?.newRefreshToken);
      }

      setCommunity(res?.community);
      setSuccessPopups((prevState: Array<string>) => [...prevState, `You ${res?.option || "like"} this comment`]);
      return;
    } else {
      setErrorPopups((prevState: Array<string>) => [...prevState, res?.error || "An error occurred. Please refresh the page and try again"]);
      return;
    }
  }

  const createComment = async (comment: string) => {
    const accessToken = localStorage.getItem("at") || "";
    const refreshToken = localStorage.getItem("rt") || "";

    const req = await fetch(backendPath + "/posts/comment", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        accessToken, refreshToken,
        comment, 
        postID: post?.id || ""
      })
    });
    const res = await req.json();
    if (res.success) {
      if (res.generateNewTokens) {
        localStorage.setItem("at", res?.newAccessToken);
        localStorage.setItem("rt", res?.newRefreshToken);
      }

      setCommunity(res?.community);
      setSuccessPopups((prevState: Array<string>) => [...prevState, "Successfully commented"]);
      return;
    } else {
      setErrorPopups((prevState: Array<string>) => [...prevState, res?.error || "An error occurred. Please refresh the page and try again"]);
      return;
    }
  }

  const replyComment = async (reply: string, commentID: string) => {
    const accessToken = localStorage.getItem("at") || "";
    const refreshToken = localStorage.getItem("rt") || "";

    const req = await fetch(backendPath + "/posts/replyComment", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        accessToken, refreshToken,
        reply, 
        commentID
      })
    });
    const res = await req.json();
    if (res.success) {
      if (res.generateNewTokens) {
        localStorage.setItem("at", res?.newAccessToken);
        localStorage.setItem("rt", res?.newRefreshToken);
      }

      setCommunity(res?.community);
      setSuccessPopups((prevState: Array<string>) => [...prevState, "Successfully replied"]);
      return;
    } else {
      setErrorPopups((prevState: Array<string>) => [...prevState, res?.error || "An error occurred. Please refresh the page and try again"]);
      return;
    }
  }

  const deletePost = async () => {
    const accessToken = localStorage.getItem("at") || "";
    const refreshToken = localStorage.getItem("rt") || "";

    const req = await fetch(backendPath + "/posts/delete", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        accessToken, refreshToken,
        postID: post?.id || ""
      })
    });
    const res = await req.json();

    if (res.success) {
      if (res.generateNewTokens) {
        localStorage.setItem("at", res?.newAccessToken);
        localStorage.setItem("rt", res?.newRefreshToken);
      }

      setCommunity(res?.community);
      setSuccessPopups((prevState: Array<string>) => [...prevState, "Successfully deleted post"]);
      return;
    } else {
      setErrorPopups((prevState: Array<string>) => [...prevState, res?.error || "An error occurred. Please refresh the page and try again"]);
      return;
    }
  }

  return (
    <div className={styles.post} data-posted-by={`Posted by ${post?.user?.name || "anonymous"}`}>
      {!post && <h1>Loading...</h1>}
      {(!showComments && post) && 
        <>
          <div>
            <div className={styles.postBody} dangerouslySetInnerHTML={{ __html: post?.body || (post?.images?.length > 0 ? `${post.images.length} Image` : 'No content') }}></div>
            {(post?.images || []).map((image, i) => 
              <img src={image?.url} alt="Post image" key={i} className={styles.postImage} onClick={() => window.open(image?.url)} />)}
          </div>
          <div className={styles.postRight}>
            <div data-tooltip={`Posted by ${post.user.name}`} onClick={() => router.push(`/user/${post.user.name}`)}>
              <img className={styles.posterAvatar} src={post.user.avatar} />
            </div>
            <div data-info={post.likes} data-tooltip={!(post.membersLiked.find(member => member.userID === userID)) ? "Like this post?" : "Liked this post"} onClick={() => likePost()}>
              {!(post.membersLiked.find(member => member.userID === userID)) ? "🤍" : "❤️"}
            </div>
            <div data-info={post.comments.length} data-tooltip="Comments" onClick={() => {
              setShowComments((prevState: Array<boolean>) => prevState.map((show, i2) => i2 === index ? true : show));
            }}>💬</div>
            <div data-info="" data-tooltip="Share" onClick={() => {
              navigator.clipboard.writeText(`${frontendPath}/post/${post.id}`);
            }}>🔗</div>
            {post.user.id === userID && 
              <div className={styles.morePostOptions} data-tooltip="More options">
                •••  
                <div className={styles.postOptions}>
                  <Link href={`/post/${post.id}/edit`}>Edit Post</Link>
                  <p onClick={() => setAlerts((prevState: any) => [...prevState, { message: "Are you sure you want to delete this post? It's not recoverable!", buttons: [{ message: "Yes 😬", color: "#ed3b3b", onClick: () => deletePost() }, { message: "No ☝️", color: "var(--blue)" }] }])}>Delete Post</p>
                </div>
              </div>}
          </div> 
        </>}
      {(showComments && post) &&
        <div className={styles.postComments}>
          <div className={styles.closeComments} onClick={() => {
            setShowComments((prevState: Array<boolean>) => prevState.map((show, i2) => i2 === index ? false : show));
          }}>&times;</div>
          {<button className={styles.createComment} onClick={() => {
            setAlerts((prevState: any) => [...prevState, { message: "Create a new comment", buttons: [{ message: "Create", color: "var(--orange)", onClickInput: (input: string) => createComment(input) }, { message: "Cancel", color: "var(--blue)" }], input: { placeholder: "Your comment goes here..." } }]);
          }}>Create a comment</button>}
          <div className={styles.comments}>
            {post.comments.length === 0 && <h4 className={styles.info}>There aren't any comments for this post yet...</h4>}
            {post.comments.map((comment, i) =>
              <div className={styles.commentContainer} key={i}>
                <div className={styles.comment}>
                  <div className={styles.replyComment} onClick={() => {
                    setAlerts((prevState: any) => [...prevState, { message: `Reply to ${comment.user.name}'s comment`, buttons: [{ message: "Create", color: "var(--orange)", onClickInput: (input: string) => replyComment(input, comment?.id || "") }, { message: "Cancel", color: "var(--blue)" }], input: { placeholder: "Your reply goes here..." } }]);
                  }}>✍️ Reply</div>
                  <div className={styles.commentPoster}>
                    <img src={comment.user.avatar} alt={`${comment.user.name}'s avatar`} />
                    <p>Posted by {comment.user.name}</p>
                  </div>
                  <p>{comment?.content || "No comment"}</p>
                  <span className={styles.commentLikes} data-likes={comment.likes} onClick={() => likeComment(comment.id)}>
                    {!(comment.memberLikes.find(member => member.userID === userID)) ? "🤍" : "❤️"}
                  </span>
                </div>
                <div className={styles.commentReplies}>
                  {comment.replies.map((reply, i) => 
                    <div className={styles.commentReply} key={i}>
                      <div className={styles.replyUser}>
                        <img src={reply.user.avatar} alt={`${reply.user.name}'s avatar`} />
                        <p>Posted by {reply.user.name}</p>
                      </div>
                      <p>{reply.content}</p>
                    </div>)}
                </div>
              </div>)}
          </div>
        </div>}
    </div>
  );
}
