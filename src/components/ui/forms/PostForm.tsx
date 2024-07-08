import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import Uploader from "@/components/ui/shared/Uploader"
import { postValidation } from "@/lib/validation"
import { Models } from "appwrite"
import { useUserContext } from "@/context/AuthContext"
import { useCreatePost } from "@/lib/react-query/queriesAndMutations"
import { useToast } from "../use-toast" 
import { useNavigate } from "react-router-dom"


type PostFormProps = {
    post?: Models.Document;
}
const PostForm = ({ post }:PostFormProps) => {
    // 1. Define your form.
  const {toast} = useToast();
  const navigate = useNavigate();
  const {user} = useUserContext();
  const {mutate : createPost,isError, isPending} = useCreatePost();
  const form = useForm<z.infer<typeof postValidation>>({
    resolver: zodResolver(postValidation),
    defaultValues: {
      caption: post ? post.caption : "",
      file : [],
      location: post? post.location : "",
      tags : post ? post.tags.join(",") : ""
    },
  })
 
  // 2. Define a submit handler.
   function onSubmit(values: z.infer<typeof postValidation>) {
    const newPost = createPost({
        ...values,
        userId: user.id
    }); 

   if(!isPending && isError){
    return toast({
        title: "something went wrong"
    })
   } 
   navigate("/");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form-label">Caption</FormLabel>
              <FormControl>
                <Textarea placeholder="shadcn" className="shad-textarea custom-scrollbar" {...field} /> 
              </FormControl>
              <FormMessage className="shad_form-message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form-label">Upload File</FormLabel>
              <FormControl>
                <Uploader
                    fieldChange={field.onChange}
                    mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad_form-message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form-label">Add location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field}/>
              </FormControl>
              <FormMessage className="shad_form-message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form-label">Add Tags(Seperated by comma ",")</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" placeholder="Art, Expression, Learn" {...field} />
              </FormControl>
              <FormMessage className="shad_form-message" />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-end gap-4">

        <Button type="button" className="shad-button_dark_4">Cancel</Button>
        <Button type="submit" className="shad-button_primary whitespace-nowrap">Submit</Button>
        </div>
      </form>
    </Form>
  )
}

export default PostForm