import { Routes, Route } from "react-router-dom"
import { Home, AllUsers, CreatePost, Explore, PostDetails, Profile, Saved, UpdatePost, UpdateProfile } from "./_root/pages"
import SigninForm from "./_auth/forms/SigninForm"
import SignupForm from "./_auth/forms/SignupForm"
import "./globals.css"
import AuthLayout from "./_auth/AuthLayout"
import RootLayout from "./_root/RootLayout"
import { Toaster } from "@/components/ui/toaster"

const App = () => {
  return (
    <main>
      <Routes>
          {/*public routes*/}
          <Route element={<AuthLayout/>}>
              <Route path="/sign-in" element = {<SigninForm/>} />
              <Route path="/sign-up" element = {<SignupForm/>} />
          </Route>
          <Route element={<RootLayout/>}>
              <Route index element = {<Home/>}/>
              <Route path="/explore" element = {<Explore/>}/>
              <Route path="/saved" element = {<Saved/>}/>
              <Route path="/all-users" element = {<AllUsers/>}/>
              <Route path="/create-post" element = {<CreatePost/>}/>
              <Route path="/update-post/:id" element = {<UpdatePost/>}/>
              <Route path="/posts/:id" element = {<PostDetails/>}/>
              <Route path="/profile/:id/*" element = {<Profile/>}/>
              <Route path="/update-profile/:id" element = {<UpdateProfile/>}/>
          </Route>
          {/*private routes*/}
      </Routes>
      <Toaster/>
    </main>
  )
}

export default App