import type { ReactNode } from 'react'
import { Cable, ScanLine } from 'lucide-react'
import {
  SiFastapi,
  SiFigma,
  SiGithub,
  SiGitlab,
  SiNextdotjs,
  SiReact,
  SiStorybook,
  SiTypescript,
  SiVite,
  SiVitest,
} from 'react-icons/si'

export type Skill = { name: string; icon: ReactNode }

export const skills: Skill[] = [
  { name: 'React', icon: <SiReact /> },
  { name: 'TypeScript', icon: <SiTypescript /> },
  { name: 'Vite', icon: <SiVite /> },
  { name: 'Next.js', icon: <SiNextdotjs /> },
  { name: 'Figma', icon: <SiFigma /> },
  { name: 'Storybook', icon: <SiStorybook /> },
  { name: 'Vitest', icon: <SiVitest /> },
  { name: 'GitHub', icon: <SiGithub /> },
  { name: 'GitLab', icon: <SiGitlab /> },
  { name: 'Cornerstone.js', icon: <ScanLine /> },
  { name: 'FastAPI', icon: <SiFastapi /> },
  { name: 'RESTful API', icon: <Cable /> },
]
