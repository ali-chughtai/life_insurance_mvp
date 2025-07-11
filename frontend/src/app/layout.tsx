import './globals.css'
import Navbar from '../components/navbar'

export const metadata = {
  title: 'Life Insurance App',
  description: 'Simple insurance recommendation frontend',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
          {children}
        </main>
      </body>
    </html>
  )
}
