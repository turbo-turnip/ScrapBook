import { NextRouter } from "next/router";
import { FC } from "react";
import { PostType } from "../util/postType.util";
import styles from "../styles/post.module.css";
import Link from "next/link";
import { UserType } from "../util/userType.util";
import { useState } from "react";

interface PostProps {
  post?: PostType | null;
  showComments: boolean;
  setShowComments: (prevState: any) => any;
  showFolders: boolean;
  setShowFolders: (prevState: any) => any;
  index: number;
  router: NextRouter;
  userID: string | undefined;
  setAlerts: (prevState: any) => any;
  setErrorPopups: (prevState: any) => any;
  setSuccessPopups: (prevState: any) => any;
  setCommunity: (prevState: any) => any;
  actionPermissions: boolean;
  account: UserType;
}

export const Post: FC<PostProps> = (
  {
    account,
    post,
    showFolders,
    showComments,
    router,
    setShowFolders,
    setShowComments,
    index,
    userID,
    setAlerts,
    setErrorPopups,
    setSuccessPopups,
    setCommunity,
    actionPermissions
  },
) => {
  const [folderIndexSelected, setFolderIndexSelected] = useState(0);

  const likePost = async () => {
    const accessToken = localStorage.getItem("at") || "";
    const refreshToken = localStorage.getItem("rt") || "";

    const req = await fetch(backendPath + "/posts/like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken,
        refreshToken,
        postID: post?.id || "",
      }),
    });
    const res = await req.json();
    if (res.success) {
      if (res.generateNewTokens) {
        localStorage.setItem("at", res?.newAccessToken);
        localStorage.setItem("rt", res?.newRefreshToken);
      }

      setCommunity(res?.community);
      setSuccessPopups((
        prevState: Array<string>,
      ) => [...prevState, `You ${res?.option || "like"} this post`]);
      return;
    } else {
      setErrorPopups((
        prevState: Array<string>,
      ) => [
        ...prevState,
        res?.error ||
        "An error occurred. Please refresh the page and try again",
      ]);
      return;
    }
  };

  const likeComment = async (commentID: string) => {
    const accessToken = localStorage.getItem("at") || "";
    const refreshToken = localStorage.getItem("rt") || "";

    const req = await fetch(backendPath + "/posts/likeComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken,
        refreshToken,
        commentID,
      }),
    });
    const res = await req.json();
    if (res.success) {
      if (res.generateNewTokens) {
        localStorage.setItem("at", res?.newAccessToken);
        localStorage.setItem("rt", res?.newRefreshToken);
      }

      setCommunity(res?.community);
      setSuccessPopups((
        prevState: Array<string>,
      ) => [...prevState, `You ${res?.option || "like"} this comment`]);
      return;
    } else {
      setErrorPopups((
        prevState: Array<string>,
      ) => [
        ...prevState,
        res?.error ||
        "An error occurred. Please refresh the page and try again",
      ]);
      return;
    }
  };

  const createComment = async (comment: string) => {
    const accessToken = localStorage.getItem("at") || "";
    const refreshToken = localStorage.getItem("rt") || "";

    const req = await fetch(backendPath + "/posts/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken,
        refreshToken,
        comment,
        postID: post?.id || "",
      }),
    });
    const res = await req.json();
    if (res.success) {
      if (res.generateNewTokens) {
        localStorage.setItem("at", res?.newAccessToken);
        localStorage.setItem("rt", res?.newRefreshToken);
      }

      setCommunity(res?.community);
      setSuccessPopups((
        prevState: Array<string>,
      ) => [...prevState, "Successfully commented"]);
      return;
    } else {
      setErrorPopups((
        prevState: Array<string>,
      ) => [
        ...prevState,
        res?.error ||
        "An error occurred. Please refresh the page and try again",
      ]);
      return;
    }
  };

  const replyComment = async (reply: string, commentID: string) => {
    const accessToken = localStorage.getItem("at") || "";
    const refreshToken = localStorage.getItem("rt") || "";

    const req = await fetch(backendPath + "/posts/replyComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken,
        refreshToken,
        reply,
        commentID,
      }),
    });
    const res = await req.json();
    if (res.success) {
      if (res.generateNewTokens) {
        localStorage.setItem("at", res?.newAccessToken);
        localStorage.setItem("rt", res?.newRefreshToken);
      }

      setCommunity(res?.community);
      setSuccessPopups((
        prevState: Array<string>,
      ) => [...prevState, "Successfully replied"]);
      return;
    } else {
      setErrorPopups((
        prevState: Array<string>,
      ) => [
        ...prevState,
        res?.error ||
        "An error occurred. Please refresh the page and try again",
      ]);
      return;
    }
  };

  const deletePost = async () => {
    const accessToken = localStorage.getItem("at") || "";
    const refreshToken = localStorage.getItem("rt") || "";

    const req = await fetch(backendPath + "/posts/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken,
        refreshToken,
        postID: post?.id || "",
      }),
    });
    const res = await req.json();

    if (res.success) {
      if (res.generateNewTokens) {
        localStorage.setItem("at", res?.newAccessToken);
        localStorage.setItem("rt", res?.newRefreshToken);
      }

      setCommunity(res?.community);
      setSuccessPopups((
        prevState: Array<string>,
      ) => [...prevState, "Successfully deleted post"]);
      return;
    } else {
      setErrorPopups((
        prevState: Array<string>,
      ) => [
        ...prevState,
        res?.error ||
        "An error occurred. Please refresh the page and try again",
      ]);
      return;
    }
  };

  const moveToFolder = async (folderID: string) => {
    const accessToken = localStorage.getItem("at") || "";
    const refreshToken = localStorage.getItem("rt") || "";

    const req = await fetch(backendPath + "/folders/addPost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken,
        refreshToken,
        folderID,
        postID: post?.id || "",
      }),
    });
    const res = await req.json();

    if (res.success) {
      if (res.generateNewTokens) {
        localStorage.setItem("at", res?.newAccessToken);
        localStorage.setItem("rt", res?.newRefreshToken);
      }

      setCommunity(res?.community);
      setSuccessPopups((
        prevState: Array<string>,
      ) => [...prevState, "Successfully added post to folder"]);
      return;
    } else {
      setErrorPopups((
        prevState: Array<string>,
      ) => [
        ...prevState,
        res?.error ||
        "An error occurred. Please refresh the page and try again",
      ]);
      return;
    }
  };

  return (
    <div
      className={styles.post}
      data-posted-by={`Posted by ${post?.user?.name || "anonymous"}`}
    >
      {!post && <h1>Loading...</h1>}
      {(!showComments && !showFolders && post) &&
        (
          <>
            <div>
              <div
                className={styles.postBody}
                dangerouslySetInnerHTML={{
                  __html: post?.body || (post?.images?.length > 0
                    ? `${post.images.length} Image`
                    : "No content"),
                }}
              >
              </div>
              {(post?.images || []).map((image, i) =>
                (
                  <img
                    src={image?.url}
                    alt="Post image"
                    key={i}
                    className={styles.postImage}
                    onClick={() => window.open(image?.url)}
                  />
                )
              )}
            </div>
            <div className={styles.postRight}>
              <div
                data-tooltip={`Posted by ${post.user.name}`}
                onClick={() => router.push(`/user/${post.user.name}`)}
              >
                <img className={styles.posterAvatar} src={post.user.avatar} />
              </div>
              <div
                style={{ cursor: actionPermissions ? "pointer" : "default" }}
                data-info={post.likes}
                data-tooltip={actionPermissions ?
                    !(post.membersLiked.find((member) =>
                      member.userID === userID
                    ))
                    ? "Like this post?"
                    : "Liked this post"
                    : "Join this community to like this post"}
                onClick={() => actionPermissions && likePost()}
              >
                {actionPermissions ? 
                  !(post.membersLiked.find((member) => member.userID === userID))
                  ? "🤍"
                  : "❤️"
                  : <span>Like{post.membersLiked.length !== 1 && "s"}</span>}
              </div>
              <div
                data-info={post.comments.length}
                data-tooltip="Comments"
                onClick={() => {
                  setShowComments((prevState: Array<boolean>) =>
                    prevState.map((show, i2) => i2 === index ? true : show)
                  );
                }}
              >
                💬
              </div>
              <div
                data-info=""
                data-tooltip="Share"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${frontendPath}/post/${post.id}`,
                  );
                }}
              >
                🔗
              </div>
              <div
                className={styles.morePostOptions}
                data-tooltip="More options"
              >
                •••
                <div className={styles.postOptions}>
                  {post.userID === userID &&
                    <Link href={`/post/${post.id}/edit`}>Edit Post</Link>}
                  {post.userID === userID && (
                    <p
                      onClick={() =>
                        setAlerts((
                          prevState: any,
                        ) => [...prevState, {
                          message:
                            "Are you sure you want to delete this post? It's not recoverable!",
                          buttons: [{
                            message: "Yes 😬",
                            color: "#ed3b3b",
                            onClick: () => deletePost(),
                          }, { message: "No ☝️", color: "var(--blue)" }],
                        }])}
                    >
                      Delete Post
                    </p>
                  )}
                  {actionPermissions && 
                    <p
                      onClick={() =>
                        setShowFolders((prevState: Array<boolean>) =>
                          prevState.map((show, i2) => i2 === index ? true : show)
                        )}
                    >
                      Add to folder
                    </p>}
                </div>
              </div>
            </div>
          </>
        )}
      {(showFolders && post) &&
        (
          <div className={styles.postFolders}>
            <h4>Which folder do you want to move this folder to?</h4>
            {account?.folders?.filter((folder) =>
              !(folder?.posts?.find((p) => p.id === post.id)?.id)
            )?.map((folder, i) =>
              (
                <p
                  className={styles.postFolder}
                  key={i}
                  data-selected={folderIndexSelected === i}
                  onClick={() => setFolderIndexSelected(i)}
                >
                  {folder.label}
                </p>
              )
            )}
            {account?.folders?.filter((folder) =>
                  !(folder?.posts?.find((p) => p.id === post.id)?.id)
                )?.length === 0 &&
              (
                <h4>You don't seem to have any folders to put this post in...
                </h4>
              )}
            {(account?.folders?.filter((folder) =>
                  !(folder?.posts?.find((p) => p.id === post.id)?.id)
                )?.length || 0) > 0 &&
              (
                <button
                  className={styles.folderAdd}
                  onClick={() =>
                    moveToFolder(
                      account?.folders?.filter((folder) =>
                        !(folder?.posts?.find((p) => p.id === post.id)?.id)
                      )?.[folderIndexSelected]?.id || "",
                    )}
                >
                  Add this post to
                  "{(account?.folders?.[folderIndexSelected]?.label ||
                    "this folder")}"
                </button>
              )}
          </div>
        )}
      {(showComments && post) &&
        (
          <div className={styles.postComments}>
            <div
              className={styles.closeComments}
              onClick={() => {
                setShowComments((prevState: Array<boolean>) =>
                  prevState.map((show, i2) => i2 === index ? false : show)
                );
              }}
            >
              &times;
            </div>
            {actionPermissions && (
              <button
                className={styles.createComment}
                onClick={() => {
                  setAlerts((
                    prevState: any,
                  ) => [...prevState, {
                    message: "Create a new comment",
                    buttons: [{
                      message: "Create",
                      color: "var(--orange)",
                      onClickInput: (input: string) => createComment(input),
                    }, { message: "Cancel", color: "var(--blue)" }],
                    input: { placeholder: "Your comment goes here..." },
                  }]);
                }}
              >
                Create a comment
              </button>
            )}
            <div className={styles.comments}>
              {post.comments.length === 0 && (
                <h4 className={styles.info}>
                  There aren't any comments for this post yet...
                </h4>
              )}
              {post.comments.map((comment, i) =>
                (
                  <div className={styles.commentContainer} key={i}>
                    <div className={styles.comment}>
                      {actionPermissions && 
                        <div
                          className={styles.replyComment}
                          onClick={() => {
                            setAlerts((
                              prevState: any,
                            ) => [...prevState, {
                              message: `Reply to ${comment.user.name}'s comment`,
                              buttons: [{
                                message: "Create",
                                color: "var(--orange)",
                                onClickInput: (input: string) =>
                                  replyComment(input, comment?.id || ""),
                              }, { message: "Cancel", color: "var(--blue)" }],
                              input: { placeholder: "Your reply goes here..." },
                            }]);
                          }}
                        >
                          ✍️ Reply
                        </div>}
                      <div className={styles.commentPoster}>
                        <img
                          src={comment.user.avatar}
                          alt={`${comment.user.name}'s avatar`}
                        />
                        <p>
                          Posted by {comment.user.name}
                        </p>
                      </div>
                      <p>{comment?.content || "No comment"}</p>
                      <span
                        className={styles.commentLikes}
                        data-likes={comment.likes}
                        style={{ cursor: actionPermissions ? "pointer" : "default" }}
                        onClick={() => actionPermissions && likeComment(comment.id)}
                      >
                        {actionPermissions ?
                          (!(comment.memberLikes.find((member) =>
                              member.userID === userID
                            ))
                            ? "🤍"
                            : "❤️")
                            : `Like${(comment.likes != 1) ? "s" : ""}`}
                      </span>
                    </div>
                    <div className={styles.commentReplies}>
                      {comment.replies.map((reply, i) =>
                        (
                          <div className={styles.commentReply} key={i}>
                            <div className={styles.replyUser}>
                              <img
                                src={reply.user.avatar}
                                alt={`${reply.user.name}'s avatar`}
                              />
                              <p>
                                Posted by {reply.user.name}
                              </p>
                            </div>
                            <p>{reply.content}</p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
    </div>
  );
};
