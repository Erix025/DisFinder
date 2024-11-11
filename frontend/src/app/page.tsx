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

      {/* 渲染搜索框 */}
      <SearchBox />

      <ThemeSwitcher />

      {/* 你可以在这里添加其他内容，例如展示商品列表 */}
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold">热门商品</h2>
        {/* 在这里展示商品列表 */}
      </div>
    </div>
  );
}
