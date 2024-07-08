import Loader from "@/components/ui/shared/Loader";
import { Models } from "appwrite";
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations";
import PostCard from "@/components/ui/shared/PostCard";


const Home = () => {
  const {data: posts, isPending: isPostLoading, isError: isErrorPost} = useGetRecentPosts();

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="w-full text-left h3-bold md:h2-bold">
            Home Feed
          </h2>
          {isPostLoading && !posts ? (
            <Loader />
          ):(
            <ul className="flex flex-col flex-1 w-full gap-9">
              {posts?.documents.map((post: Models.Document,index:number)=>(
                <PostCard key={index} post = {post} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home