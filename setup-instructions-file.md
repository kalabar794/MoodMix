# 01. Setup Instructions for MoodMix

## Initialize Your Next.js Project

### Step 1: Create New Project
```bash
npx create-next-app@latest moodmix --typescript --tailwind --app
```

When prompted:
- ✓ Would you like to use ESLint? → Yes
- ✓ Would you like to use `src/` directory? → No
- ✓ Would you like to customize the default import alias? → No

### Step 2: Install Additional Dependencies
```bash
cd moodmix
npm install framer-motion
npm install @radix-ui/react-slider
npm install lucide-react
npm install axios
npm install color
npm install @types/color
```

### Step 3: Clean Up Default Files
Delete the following:
- Everything inside `app/globals.css` (keep the file, we'll add our own styles)
- Everything inside `app/page.tsx` (keep the file)
- Delete `app/favicon.ico` (optional)

### Step 4: Update app/layout.tsx
Replace the contents with:

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MoodMix - Music for Your Mood',
  description: 'Discover music that matches your current vibe',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

### Step 5: Create Basic Folder Structure
Create these folders in your project root:
- `components/`
- `lib/`
- `app/api/`
- `app/api/mood-to-music/`
- `app/api/spotify-auth/`

### Step 6: Test Your Setup
```bash
npm run dev
```

Visit http://localhost:3000 - you should see a blank page (that's good!)

## Next Steps
Once this is complete, move on to `02-environment-config.md` to set up your API keys.