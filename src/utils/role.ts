import { auth, clerkClient } from "@clerk/nextjs/server"

export async function checkrole() {
  const user = auth()
  if (!user.userId) {
    return false
  }
  const client = await clerkClient()

  const userinfo = await client.users.getUser(user.userId)
  return userinfo.privateMetadata.role === "admin"
}