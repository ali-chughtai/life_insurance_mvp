export default function Home() {
  return <div>HomePage</div>
} 


// 'use client'

// import { useEffect } from 'react'
// import { useRouter } from 'next/navigation'

// export default function Home() {
//   const router = useRouter()

//   useEffect(() => {
//     const token = localStorage.getItem('token')
//     if (token) {
//       router.replace('/user')
//     } else {
//       router.replace('/login')
//     }
//   }, [router])

//   return <h1>Home Page</h1>
// }
