import React, { useState } from "react";
import { Card, CardBody, CardFooter, Button, Chip, Tooltip, Image } from "@heroui/react";
import { motion } from "framer-motion";
import type { CollectionEntry } from "astro:content";

interface PostCardProps {
  post: CollectionEntry<"post">;
  href: string;
  variant?: "default" | "compact" | "featured";
}

export const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  href,
  variant = "default" 
}) => {
  const { title, publishDate, coverImage, description, tags, author } = post.data;
  const [isHovered, setIsHovered] = useState(false);
  
  // 格式化日期
  const formattedDate = new Date(publishDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  // 根据变体调整卡片高度
  const getCardHeight = () => {
    switch(variant) {
      case "compact": return "h-[280px] sm:h-[320px]";
      case "featured": return "h-[400px] sm:h-[500px]";
      default: return "h-[350px] sm:h-[400px]";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.2 }
      }}
      className="h-full"
    >
      <Card
        isPressable
        isHoverable
        as="article"
        className={`w-full overflow-hidden ${getCardHeight()} bg-gradient-to-br from-background to-default-50 dark:from-default-50 dark:to-default-100 backdrop-blur-sm border border-transparent dark:border-default-200/10`}
        shadow="sm"
        disableRipple
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => window.location.href = href}
      >
        <CardBody className="p-0 overflow-hidden">
          <div className="relative w-full h-full">
            {/* 背景图片 */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <Image
                removeWrapper
                src={coverImage}
                alt={title}
                classNames={{
                  img: `w-full h-full object-cover transition-all duration-700 ease-out scale-100 ${
                    isHovered ? "scale-110 blur-[2px]" : ""
                  }`
                }}
                radius="none"
              />
              
              {/* 渐变叠加层 */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20 transition-opacity duration-500 ${
                isHovered ? "opacity-80" : "opacity-60"
              }`}></div>
            </div>
            
            {/* 内容容器 */}
            <div className="relative z-10 flex flex-col h-full p-5">
              {/* 标签 - 顶部 */}
              {tags && tags.length > 0 && (
                <div className={`flex flex-wrap gap-1 mb-2 transition-all duration-500 ${
                  isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                }`}>
                  {tags.slice(0, 2).map(tag => (
                    <Chip
                      key={tag}
                      size="sm"
                      variant="flat"
                      classNames={{
                        base: "bg-primary-500/30 backdrop-blur-md border border-primary-500/20",
                        content: "text-primary-50 font-medium text-xs",
                      }}
                    >
                      {tag}
                    </Chip>
                  ))}
                  {tags.length > 2 && (
                    <Chip
                      size="sm"
                      variant="flat"
                      classNames={{
                        base: "bg-default-100/30 backdrop-blur-md",
                        content: "text-white/90 font-medium text-xs",
                      }}
                    >
                      +{tags.length - 2}
                    </Chip>
                  )}
                </div>
              )}
              
              {/* 标题和描述 - 中部 */}
              <div className="mt-auto mb-auto">
                <h2 className={`text-xl sm:text-2xl font-bold text-white mb-2 line-clamp-2 transition-all duration-500 ${
                  isHovered ? "text-primary-300 translate-y-0" : "translate-y-2"
                }`}>
                  {title}
                </h2>
                
                <p className={`text-sm text-white/80 line-clamp-2 transition-all duration-500 delay-100 ${
                  isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}>
                  {description}
                </p>
              </div>
              
              {/* 日期和阅读按钮 - 底部 */}
              <div className={`mt-auto flex justify-between items-end transition-all duration-500 ${
                isHovered ? "opacity-100 translate-y-0" : "opacity-70 translate-y-2"
              }`}>
                <time 
                  className="text-xs text-white/80 font-medium flex items-center"
                  dateTime={publishDate.toISOString()}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-3.5 w-3.5 mr-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                    />
                  </svg>
                  {formattedDate}
                </time>
                
                <Button
                  size="sm"
                  variant="flat"
                  radius="full"
                  className={`bg-white/10 backdrop-blur-md text-white border border-white/10 transition-all duration-500 ${
                    isHovered ? "opacity-100 scale-100" : "opacity-0 scale-90"
                  }`}
                  endContent={
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = href;
                  }}
                >
                  看
                </Button>
              </div>
            </div>
            
            {/* 光效和装饰 */}
            <div className={`absolute inset-0 transition-opacity duration-700 ${isHovered ? "opacity-100" : "opacity-0"}`}>
              {/* 左上角装饰 */}
              <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary-500/20 rounded-full blur-xl"></div>
              
              {/* 右下角装饰 */}
              <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-primary-500/20 rounded-full blur-xl"></div>
              
              {/* 顶部光效 */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"></div>
              
              {/* 底部光效 */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </div>
          </div>
        </CardBody>
        
        {/* 悬停时显示的互动元素 */}
        <div 
          className={`absolute top-3 right-3 z-20 transition-all duration-300 ${
            isHovered ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip content="Save for later">
            <Button
              isIconOnly
              size="sm"
              radius="full"
              variant="flat"
              className="bg-black/20 backdrop-blur-md text-white border border-white/10"
              aria-label="Save post"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </Button>
          </Tooltip>
        </div>
        
        {/* 悬停时的边框效果 */}
        <div 
          className={`absolute inset-0 rounded-xl border border-primary-500/50 transition-opacity duration-300 pointer-events-none ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        ></div>
      </Card>
    </motion.div>
  );
};

export default PostCard;
