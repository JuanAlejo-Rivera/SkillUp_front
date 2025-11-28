import ProfileForm from "@/components/profile/ProfileForm"
import ReactSpinner from "@/components/ReactSpinner/ReactSpinner"
import { useAuth } from "@/hooks/UserAuth"

export const ProfileView = () => {

  const { data, isLoading } = useAuth()

  if (isLoading) return <ReactSpinner />
  if (data) return <ProfileForm data={data} />
}
