import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from './page.module.css'
import Player from './player/page'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    // <div>1232</div>
    <Player />
  )
}
