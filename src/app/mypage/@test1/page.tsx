import React from 'react'
import ProfileCard_in_mypage from "@/components/profileCard_in_mypage"

const page = async () => {
  await new Promise(resolve => setTimeout(resolve, 2000))
  return (
    <ProfileCard_in_mypage />
  )
}

export default page