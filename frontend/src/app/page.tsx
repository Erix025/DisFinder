// app/page.tsx
'use client';  // 表明该页面在客户端渲染

import MyNavbar from '../components/Navbar';
import SearchBox from '../components/SearchBox';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';


export default function HomePage() {
  return (
    <div className="h-screen w-full text-foreground bg-background">
      {/* 渲染导航栏 */}
      <MyNavbar />

      {/* 渲染 DisFinder 标题 */}
      <div className="flex justify-center items-center mt-10 h-[30vh]">
        <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
          DisFinder
        </h1>
      </div>

      {/* 渲染搜索框 */}
      <SearchBox />
    </div>
  );
}
