import { ID, Query} from "appwrite";

import { INewPost, INewUser } from "@/types";
import { account, appwriteConfig, avatars, databases, storage} from "./config";


export async function createUserAccount(user: INewUser){
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        )
        if(!newAccount) throw Error;
        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            imageUrl: avatarUrl,
            username: user.username,
        })

        return newUser;
    } catch (error) {
        console.log(error);
        return error;
    }

}

export async function saveUserToDB(user : {
    accountId : string,
    name : string,
    email : string,
    imageUrl: URL,
    username?:string,
}){
    try {
       const newUser = databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        ID.unique(),
        user
       ) 
       return newUser;
    } catch (error) {
       console.log(error) 
    }
}

export async function signInAccount(user: {
    email:string;
    password:string
}){
    try {
       const session = await account.createEmailPasswordSession(user.email,user.password) ;

       console.log(session.current)

       return session;
    } catch (error) {
       console.log(error) 
    }
}

export async function getCurrentUser(){
    try {
        const currentAccount = await account.get();
        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
        );
        if(!currentUser) throw Error;
        return currentUser.documents[0];
    } catch (error) {
       console.log(error) 
    }
}

export async function signOutAccount(){
    try {
       const session = account.deleteSession("current");
       
       return session
    } catch (error) {
        console.log("Error during deleting the sessoin");
        console.log(error);
    }
}

export async function createPost(post: INewPost) {
  try {
    // Upload file to appwrite storage
    const uploadedFile = await uploadFile(post.file[0],post.userId);

    if (!uploadedFile) throw Error;

    // Get file url
    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
}

// ============================== UPLOAD FILE
export async function uploadFile(file: File,userId : string) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file,
    );

    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    );

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

export async function getRecentPosts(){
  try {
   const posts = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    [Query.orderDesc("$createdAt"),Query.limit(20)]
   ) 

   if(!posts){
    throw Error("Error during fetching posts");
   }
   return posts;
  } catch (error) {
   console.log("something went wrong");
  }
}

export async function likePost(postId: string,likesArray: string[]){
  try {
   const updatePost = await databases.updateDocument(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    postId,
    {
      likes: likesArray 
    }
   );
   return updatePost;
  } catch (error) {
   console.log(error) 
  }
}

export async function savePost(postId: string,userId:string){
  try {
   const savePost = await databases.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.savesCollectionId,
    ID.unique(),
    {
      user: userId,
      post: postId
    }
   );
   return savePost;
  } catch (error) {
   console.log(error) 
  }
}

export async function deleteSavedPost(savedRecordId: string){
  try {
   const statusCode = await databases.deleteDocument(
    appwriteConfig.databaseId,
    appwriteConfig.savesCollectionId,
    savedRecordId

   );
   return statusCode;
  } catch (error) {
   console.log(error) 
  }
}
