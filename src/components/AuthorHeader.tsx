import React, { useState, useEffect } from "react";
import { Card, CardBody, Avatar, Chip, Button, Tooltip } from "@heroui/react";
import { Image } from "@heroui/image";
import { motion, AnimatePresence } from "framer-motion";
import type { CollectionEntry } from "astro:content";

interface AuthorHeaderProps {
  author: CollectionEntry<"authors">;
}

export const AuthorHeader: React.FC<AuthorHeaderProps> = ({ author }) => {
  const { name, avatar, banner, platform, profileUrl, social } = author.data;
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // 在组件挂载后添加加载动画
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // 平台图标映射
  const platformIcons = {
    patreon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14.82 2.41c3.96 0 7.18 3.24 7.18 7.22 0 3.97-3.22 7.21-7.18 7.21-3.97 0-7.19-3.24-7.19-7.21 0-3.98 3.22-7.22 7.19-7.22M2 21.6h3.5V2.41H2V21.6z" />
      </svg>
    ),
    fanbox: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.12 4.53L17 2.45l2.05 1.86-1.85 2.11-2.08-1.89zM12 8.8l3.74-4.22 2.06 1.86L12 12.75 4.2 4.5 2 6.75l10 10.04 3.9-4.1 3.77 3.4-1.86 2.1-1.94-1.75L12 21.08 0 8.81 4.2 4.5 12 12.75V8.8z" />
      </svg>
    ),
    default: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  };

  // 获取平台图标
  const getPlatformIcon = (platform: string) => {
    return platformIcons[platform.toLowerCase() as keyof typeof platformIcons] || platformIcons.default;
  };

  // 社交媒体图标
  const socialIcons = {
    twitter: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
      </svg>
    ),
    instagram: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
      </svg>
    ),
    facebook: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    youtube: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isLoaded ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full"
    >
      <Card
        isBlurred
        className="border-none bg-background/60 dark:bg-default-100/50 backdrop-blur-md"
        shadow="sm"
        as="header"
        itemScope
        itemType="https://schema.org/Person"
      >
        <CardBody className="p-0 overflow-hidden">
          <div className="relative flex flex-col md:flex-row h-[280px] md:h-[220px]">
            {/* 作者头像 - 左侧（移动端在顶部） */}
            <motion.div 
              className="absolute top-4 left-4 z-20 md:relative md:top-0 md:left-0 md:w-1/4 md:h-full flex items-center justify-center p-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Tooltip 
                content="View Profile" 
                placement="bottom"
                delay={500}
                closeDelay={0}
                classNames={{
                  base: "py-2 px-4 shadow-xl rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 text-white",
                  arrow: "bg-indigo-500"
                }}
              >
                <Button
                  as="a"
                  href={profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-0 min-w-0 min-h-0 bg-transparent"
                  aria-label={`${name}'s profile`}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full opacity-70 group-hover:opacity-100 blur group-hover:blur-md transition duration-1000 group-hover:duration-200"></div>
                    <Avatar
                      isBordered
                      showFallback
                      src={avatar}
                      alt={`${name}'s avatar`}
                      className="w-24 h-24 md:w-32 md:h-32 text-large z-10"
                      classNames={{
                        base: "ring-2 ring-white/50 dark:ring-black/20 group-hover:ring-white/80 dark:group-hover:ring-black/40 transition-all duration-300",
                        img: "object-cover scale-[1.01] group-hover:scale-110 transition-transform duration-700"
                      }}
                      fallback={
                        <span className="text-2xl font-bold text-white">{name.charAt(0)}</span>
                      }
                    />
                  </div>
                </Button>
              </Tooltip>
            </motion.div>

            {/* 背景封面 - 右侧（移动端为全宽） */}
            <div className="relative w-full md:w-3/4 h-full overflow-hidden">
              <Image
                removeWrapper
                src={banner}
                alt={`${name}'s banner`}
                classNames={{
                  img: "w-full h-full object-cover transform scale-[1.01] transition-transform duration-10000 hover:scale-110 hover:duration-5000"
                }}
                loading="eager"
              />
              
              {/* 渐变叠加层 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              
              {/* 作者信息 */}
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 flex flex-col">
                <motion.div 
                  className="flex flex-wrap items-center gap-2 mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Chip
                    startContent={getPlatformIcon(platform)}
                    variant="shadow"
                    classNames={{
                      base: "bg-gradient-to-br from-indigo-500 to-purple-500 border-small border-white/50 shadow-pink-500/20",
                      content: "text-white/90 text-sm font-medium",
                    }}
                  >
                    {platform}
                  </Chip>
                  
                  {/* 社交媒体链接 */}
                  {social && Object.entries(social).length > 0 && (
                    <div className="flex gap-1 ml-1">
                      <AnimatePresence>
                        {Object.entries(social).map(([key, url], index) => (
                          <motion.div
                            key={key}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                          >
                            <Tooltip content={key.charAt(0).toUpperCase() + key.slice(1)}>
                              <Button
                                as="a"
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                isIconOnly
                                size="sm"
                                variant="light"
                                className="text-white/80 hover:text-white bg-white/10 backdrop-blur-md hover:bg-white/20"
                              >
                                {socialIcons[key as keyof typeof socialIcons] || (
                                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.172 13.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" />
                                  </svg>
                                )}
                              </Button>
                            </Tooltip>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
                
                <motion.h1 
                  className="text-2xl md:text-3xl font-bold text-white group"
                  itemProp="name"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <a 
                    href={profileUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center relative"
                    itemProp="url"
                  >
                    <span className="relative">
                      {name}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
                    </span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 ml-2 opacity-70 transform transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </a>
                </motion.h1>
                
                {/* 可选的作者简介 */}
                {author.data.bio && (
                  <motion.p 
                    className="text-white/80 text-sm mt-2 max-w-md line-clamp-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    {author.data.bio}
                  </motion.p>
                )}
              </div>
            </div>
          </div>
          
          {/* 鼠标悬停时显示的光效 */}
          <AnimatePresence>
            {isHovered && (
              <motion.div 
                className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl opacity-30 blur-xl z-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default AuthorHeader;
