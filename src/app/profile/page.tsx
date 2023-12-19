import ProfileContent from "@/components/forProfile/ProfileContent"
import Navbar from "@/components/navBar/Navbar"

const ProfilePage = () => {
    return (
        <div className="w-screen h-screen">
          <Navbar/>
          <ProfileContent />
        </div>
    )
}

export default ProfilePage