import InputBox from './InputBox'
import Posts from './Posts'
import Stories from './Stories'

const Feed = ({ posts, user }) => {
  return (
    <div className="flex-grow h-screen pb-44 pt-6 mr-4 xl:mr-40 overflow-y-auto scrollbar-hide">
      <div className="mx-auto max-w-md md:max-w-2xl">
      {/* Stories */}
      <Stories />
      {/* InputBox */}
      <InputBox user={user} />
      {/* Posts */}
      <Posts posts={posts} uid={user.uid} />
    </div>
    </div>
  )
}

export default Feed
