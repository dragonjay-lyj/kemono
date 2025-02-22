// src/components/PostCard.tsx
import React, { useState, useEffect } from 'react';
import { Card } from "@heroui/card";
import { Image } from "@heroui/image";
import { Link } from "@heroui/link";
import { Spinner } from "@heroui/spinner";
import { Tooltip } from "@heroui/tooltip";

interface PostCardProps {
  title: string;
  date: Date;
  image: string;
  alt: string;
  href: string;
}

export const PostCard: React.FC<PostCardProps> = ({
  title,
  date,
  image,
  alt,
  href
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // 图片预加载
  useEffect(() => {
    const img = document.createElement('img');
    img.src = image;
    img.onload = () => {
      setIsImageLoaded(true);
      setIsLoading(false);
    };
    img.onerror = () => setIsLoading(false);

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [image]);

  if (isLoading) {
    return (
      <Card className="w-full h-[300px] sm:h-[400px] flex items-center justify-center bg-gradient-to-br from-content1/80 to-content2/80 dark:from-content1/20 dark:to-content2/20 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <Spinner 
            size="lg" 
            color="primary"
            className="opacity-80"
          />
          <span className="text-default-500 animate-pulse">
            加载帖子...
          </span>
        </div>
      </Card>
    );
  }

  return (
    <Link
      href={href}
      className="block w-full group/card"
      color="foreground"
    >
      <Card
        isHoverable
        className={`
          relative w-full h-[300px] sm:h-[400px] 
          overflow-hidden
          transition-all duration-500
          group/post
          hover:shadow-2xl
          hover:shadow-primary-500/20
          dark:hover:shadow-primary-500/10
          ${isImageLoaded ? 'opacity-100' : 'opacity-0'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 背景图片 */}
        <Image
          src={image}
          alt={alt}
          className={`
            absolute inset-0 w-full h-full 
            object-cover 
            transition-all duration-700 ease-out
            ${isHovered ? 'scale-110 blur-[2px]' : 'scale-100'}
          `}
          removeWrapper
        />
        
        {/* 渐变遮罩 */}
        <div className={`
          absolute inset-0 
          bg-gradient-to-b from-black/70 via-transparent to-black/70
          transition-opacity duration-500
          ${isHovered ? 'opacity-90' : 'opacity-60'}
          dark:from-black/80 dark:to-black/80
        `} />

        {/* 内容容器 */}
        <div className={`
          absolute inset-0 
          flex flex-col justify-between
          p-6 
          transition-transform duration-500
          ${isHovered ? 'scale-[0.98]' : 'scale-100'}
        `}>
          {/* 标题 */}
          <div className={`
            transform 
            transition-all duration-500 ease-out
            ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <h3 className="
              text-white text-2xl font-bold
              leading-tight
              tracking-tight
              text-shadow-lg
              dark:text-white/90
            ">
              {title}
            </h3>
          </div>

          {/* 日期 */}
          <div className={`
            transform
            transition-all duration-500 ease-out delay-100
            ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <time 
              className="
                text-white/90 
                text-sm 
                font-medium
                dark:text-white/70
              "
              dateTime={date.toISOString()}
            >
              {date.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
        </div>

        {/* 悬浮装饰效果 */}
        <div className={`
          absolute inset-0 
          border-2 border-primary-500/0
          rounded-lg
          transition-all duration-500
          ${isHovered ? 'border-primary-500/50 scale-95' : 'scale-100'}
        `} />

        {/* 交互提示 */}
        <div className={`
          absolute top-1/2 left-1/2 
          -translate-x-1/2 -translate-y-1/2
          transition-all duration-300
          ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
        `}>
          <Tooltip content="Click to view details">
            <div className="
              w-12 h-12 
              rounded-full 
              bg-primary-500/30 
              backdrop-blur-md
              flex items-center justify-center
              text-white/90
            ">
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M14 5l7 7m0 0l-7 7m7-7H3" 
                />
              </svg>
            </div>
          </Tooltip>
        </div>
      </Card>
    </Link>
  );
};
