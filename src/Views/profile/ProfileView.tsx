import ProfileForm from "@/components/profile/ProfileForm"
import { useAuth } from "@/hooks/UserAuth"

export const ProfileView = () => {

  const { data, isLoading } = useAuth()

  if (isLoading) return <div>Cargando...</div>
  if (data) return <ProfileForm data={data} />
}
