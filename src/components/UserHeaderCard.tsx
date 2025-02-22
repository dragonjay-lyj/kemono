// src/components/UserHeaderCard.tsx
import React, { useState, useEffect } from 'react';
import { Card } from "@heroui/card";
import { Image } from "@heroui/image";
import { Link } from "@heroui/link";
import { Spinner } from "@heroui/spinner";
import { Tooltip } from "@heroui/tooltip";

interface UserHeaderCardProps {
  name: string;
  platform: string;
  platformUrl: string;
  avatar: string;
  banner: string;
  platformIcon: string;
  isPreview?: boolean;
}

export const UserHeaderCard: React.FC<UserHeaderCardProps> = ({
  name,
  platform,
  platformUrl,
  avatar,
  banner,
  platformIcon,
  isPreview = false,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isImageError, setIsImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const cardHeight = isPreview ? "h-[200px]" : "h-[250px] sm:h-[300px]";

  // 图片预加载
  useEffect(() => {
    const loadImages = async () => {
      try {
        await Promise.all([
          preloadImage(banner),
          preloadImage(avatar),
          preloadImage(platformIcon)
        ]);
        setIsLoading(false);
      } catch (error) {
        setIsImageError(true);
        setIsLoading(false);
      }
    };

    loadImages();
  }, [banner, avatar, platformIcon]);

  const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img');
      img.src = src;
      img.onload = () => resolve();
      img.onerror = () => reject();
    });
  };

  if (isLoading) {
    return (
      <Card className={`w-full ${cardHeight} flex items-center justify-center bg-gradient-to-r from-content1 to-content2`}>
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" color="primary" />
          <span className="text-default-500 animate-pulse">加载资料...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className={`
        w-full relative overflow-hidden ${cardHeight} 
        transition-all duration-500 
        hover:shadow-xl 
        group
        ${isPreview ? 'cursor-pointer' : ''}
      `}
      // 移除 isPressable，因为我们现在使用外层链接
      isHoverable={isPreview}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 背景图片 */}
      <Image
        src={banner}
        alt={`${name}'s banner`}
        className={`
          absolute inset-0 w-full h-full object-cover
          transition-transform duration-700 ease-out
          ${isHovered ? 'scale-110' : 'scale-100'}
        `}
        removeWrapper
        fallbackSrc="/path/to/fallback-image.jpg"
        loading="eager"
      />
      
      {/* 渐变遮罩 */}
      <div className={`
        absolute inset-0 
        bg-gradient-to-r from-black/80 via-black/60 to-transparent
        transition-opacity duration-300
        ${isHovered ? 'opacity-90' : 'opacity-70'}
      `} />

      {/* 内容区域 */}
      <div className="relative z-10 flex items-center h-full p-6 gap-6">
        {/* 头像区域 */}
        <div className="shrink-0 group/avatar">
          <div className="relative">
            <Image
              src={avatar}
              alt={`${name}'s avatar`}
              className={`
                ${isPreview ? 'w-16 h-16' : 'w-24 h-24 sm:w-32 sm:h-32'} 
                rounded-full 
                border-4 
                transition-all 
                duration-300
                ${isHovered ? 'border-primary-500 scale-105' : 'border-white/30'}
              `}
              radius="full"
              loading="eager"
              fallbackSrc="/path/to/avatar-fallback.jpg"
            />
            <div className={`
              absolute inset-0 
              rounded-full 
              bg-primary-500/20 
              transition-opacity 
              duration-300
              ${isHovered ? 'opacity-100' : 'opacity-0'}
            `} />
          </div>
        </div>

        {/* 文字信息区域 */}
        <div className="flex flex-col justify-center">
          <Link
            href={platformUrl}
            isExternal={!isPreview}
            className="group/link flex items-center gap-3 hover:gap-4 transition-all duration-300"
            color="foreground"
          >
            <Tooltip content={`View on ${platform}`}>
              <Image
                src={platformIcon}
                alt={platform}
                className={`
                  ${isPreview ? 'w-5 h-5' : 'w-6 h-6 sm:w-8 sm:h-8'}
                  transition-transform duration-300
                  group-hover/link:rotate-12
                `}
                radius="full"
                loading="eager"
              />
            </Tooltip>
            <h1 className={`
              text-white 
              ${isPreview ? 'text-xl' : 'text-2xl sm:text-3xl'} 
              font-bold 
              transition-all 
              duration-300
              group-hover/link:text-primary-400
              tracking-tight
            `}>
              {name}
            </h1>
          </Link>
          <span className={`
            text-white/70 
            text-sm 
            mt-2
            transition-all
            duration-300
            ${isHovered ? 'translate-x-2' : ''}
          `}>
            {platform}
          </span>
        </div>
      </div>

      {/* 悬浮效果装饰 */}
      {isPreview && (
        <div className={`
          absolute inset-0 
          border-2 border-primary-500/0
          transition-all duration-500
          ${isHovered ? 'border-primary-500/50 scale-[0.98]' : 'scale-100'}
        `} />
      )}
    </Card>
  );
};
