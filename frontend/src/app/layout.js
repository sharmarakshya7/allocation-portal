import './globals.css'

export const metadata = {
  title: 'Allocation Portal',
  description: 'Investment fund infrastructure, built for everyone',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
