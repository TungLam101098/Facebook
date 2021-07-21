import StoryCard from "./StoryCard"

const stories = [
  {
    name: "Sonny Sangha",
    src: "https://yt3.ggpht.com/ytc/AAUvwngXcU2LcXQqcPyZFVwF_sV2zjB04K5RVFGE7heEwc4=s900-c-k-c0x00ffffff-no-rj",
    profile: "https://compassionate-leakey-e9b16b.netlify.app/images/IG_Sonny.jpeg"
  },
  {
    name: "Sonny Sangha1",
    src: "https://yt3.ggpht.com/ytc/AAUvwngXcU2LcXQqcPyZFVwF_sV2zjB04K5RVFGE7heEwc4=s900-c-k-c0x00ffffff-no-rj",
    profile: "https://compassionate-leakey-e9b16b.netlify.app/images/IG_Sonny.jpeg"
  },
  {
    name: "Sonny Sangha2",
    src: "https://yt3.ggpht.com/ytc/AAUvwngXcU2LcXQqcPyZFVwF_sV2zjB04K5RVFGE7heEwc4=s900-c-k-c0x00ffffff-no-rj",
    profile: "https://compassionate-leakey-e9b16b.netlify.app/images/IG_Sonny.jpeg"
  },
  {
    name: "Sonny Sangha3",
    src: "https://yt3.ggpht.com/ytc/AAUvwngXcU2LcXQqcPyZFVwF_sV2zjB04K5RVFGE7heEwc4=s900-c-k-c0x00ffffff-no-rj",
    profile: "https://compassionate-leakey-e9b16b.netlify.app/images/IG_Sonny.jpeg"
  },
  {
    name: "Sonny Sangha3",
    src: "https://yt3.ggpht.com/ytc/AAUvwngXcU2LcXQqcPyZFVwF_sV2zjB04K5RVFGE7heEwc4=s900-c-k-c0x00ffffff-no-rj",
    profile: "https://compassionate-leakey-e9b16b.netlify.app/images/IG_Sonny.jpeg"
  },
  
]

const Stories = () => {
  return (
    <div className="flex justify-center space-x-3 mx-auto">
      {stories.map((story, index) => (
        <StoryCard key={index} name={story.name} src={story.src} profile={story.src} />
      ))}
    </div>
  )
}

export default Stories
