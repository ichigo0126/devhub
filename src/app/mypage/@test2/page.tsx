import React from 'react'
import Review_in_mypage from "@/components/review_in_mypage"

const page = async () => {
  await new Promise(resolve => setTimeout(resolve, 2000))
  return (
    <Review_in_mypage />
  )
}

export default page