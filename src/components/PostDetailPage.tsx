import React, { useState, useRef, useEffect } from "react";
import { 
  Card, 
  CardBody, 
  Button, 
  Avatar, 
  Chip, 
  Divider, 
  Image, 
  Tooltip,
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
  Skeleton
} from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import type { CollectionEntry } from "astro:content";
import { format } from "date-fns";

interface PostDetailPageProps {
  post: CollectionEntry<"post">;
  author: CollectionEntry<"authors">;
  prevPost?: CollectionEntry<"post">;
  nextPost?: CollectionEntry<"post">;
  content: string;
}

export const PostDetailPage: React.FC<PostDetailPageProps> = ({ 
  post, 
  author, 
  prevPost, 
  nextPost,  
}) => {
  const { body } = post;
  const { title, publishDate, tags, files, platform } = post.data;
  const { name, avatar, banner, profileUrl } = author.data;
  
  // 状态管理
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [imageIndex, setImageIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // 引用
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  
  // Modal控制
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // 格式化日期
  const formattedDate = format(new Date(publishDate), "yyyy-MM-dd'T'HH:mm:ss");
  const readableDate = format(new Date(publishDate), "MMMM d, yyyy");
  
  // 监听滚动进度
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const scrollTop = window.scrollY;
        const scrollHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        setScrollProgress(progress);
        
        // 处理头部显示/隐藏
        if (scrollTop > 100) { // 只有滚动超过一定距离才考虑隐藏
          if (scrollTop > lastScrollY) {
            setIsHeaderVisible(false); // 向下滚动，隐藏头部
          } else {
            setIsHeaderVisible(true); // 向上滚动，显示头部
          }
        } else {
          setIsHeaderVisible(true); // 在顶部附近，始终显示头部
        }
        
        setLastScrollY(scrollTop);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);
  
  // 模拟内容加载
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // 处理图片点击
  const handleImageClick = (imageSrc: string, index: number) => {
    setActiveImage(imageSrc);
    setImageIndex(index);
    onOpen();
  };
  
  // 切换到下一张图片
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (files && files.length > 0) {
      const newIndex = (imageIndex + 1) % files.length;
      setImageIndex(newIndex);
      setActiveImage(files[newIndex].url);
    }
  };
  
  // 切换到上一张图片
  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (files && files.length > 0) {
      const newIndex = (imageIndex - 1 + files.length) % files.length;
      setImageIndex(newIndex);
      setActiveImage(files[newIndex].url);
    }
  };
  
  // 滚动到评论区
  const scrollToComments = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  // 滚动到顶部
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.main 
      className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12 overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 阅读进度条 */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-primary-400 to-secondary-400 z-50 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      ></div>
      
      {/* 粘性导航头部 */}
      <motion.div 
        ref={headerRef}
        className="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm"
        initial={{ y: 0 }}
        animate={{ y: isHeaderVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Avatar
              src={avatar}
              size="sm"
              isBordered
              color="primary"
              className="hidden sm:flex"
            />
            <div className="max-w-[200px] sm:max-w-xs truncate font-medium text-gray-800 dark:text-gray-200">
              {title}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="flat"
              color="primary"
              radius="full"
              onClick={scrollToComments}
              startContent={
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              }
              className="hidden sm:flex"
            >
              评论
            </Button>
            
            <div className="flex gap-1">
              {prevPost && (
                <Tooltip content="Previous Post">
                  <Button
                    as="a"
                    href={`/post/${prevPost.slug}`}
                    size="sm"
                    isIconOnly
                    variant="flat"
                    radius="full"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </Button>
                </Tooltip>
              )}
              
              {nextPost && (
                <Tooltip content="Next Post">
                  <Button
                    as="a"
                    href={`/post/${nextPost.slug}`}
                    size="sm"
                    isIconOnly
                    variant="flat"
                    radius="full"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </Tooltip>
              )}
            </div>
            
            <Tooltip content="Back to top">
              <Button
                size="sm"
                isIconOnly
                variant="flat"
                radius="full"
                onClick={scrollToTop}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </Button>
            </Tooltip>
          </div>
        </div>
      </motion.div>
      
      <section className="container mx-auto px-4 py-8">
        {/* 导航链接 */}
        <motion.nav 
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex space-x-4">
            {prevPost ? (
              <Button
                as="a"
                href={`/post/${prevPost.slug}`}
                variant="light"
                color="primary"
                size="sm"
                startContent={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                }
              >
                上一篇
              </Button>
            ) : (
              <Button
                variant="light"
                color="default"
                size="sm"
                isDisabled
                startContent={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                }
              >
                上一篇
              </Button>
            )}
          </div>
          <div className="flex space-x-4">
            {nextPost ? (
              <Button
                as="a"
                href={`/post/${nextPost.slug}`}
                variant="light"
                color="primary"
                size="sm"
                endContent={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                }
              >
                下一篇
              </Button>
            ) : (
              <Button
                variant="light"
                color="default"
                size="sm"
                isDisabled
                endContent={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                }
              >
                下一篇
              </Button>
            )}
          </div>
        </motion.nav>
        
        {/* 帖子头部 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card
            className="mb-8 border-none"
            shadow="sm"
            isBlurred
          >
            <CardBody className="p-0 overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* 左侧：作者信息 */}
                <div className="relative w-full md:w-1/3 h-64 md:h-auto">
                  {/* 背景图 */}
                  <div className="absolute inset-0 overflow-hidden">
                    <Image
                      src={banner}
                      alt={`${name}'s banner`}
                      removeWrapper
                      classNames={{
                        img: "w-full h-full object-cover transition-transform duration-10000 hover:scale-110"
                      }}
                      isBlurred
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                  </div>
                  
                  {/* 作者头像和名称 */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Tooltip content="View Author Profile">
                      <Button
                        as="a"
                        href={`/authors/${author.slug}`}
                        className="p-0 min-w-0 min-h-0 bg-transparent mb-4"
                        radius="full"
                        variant="light"
                      >
                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full opacity-70 group-hover:opacity-100 blur group-hover:blur-md transition duration-1000 group-hover:duration-200"></div>
                          <Avatar
                            src={avatar}
                            alt={`${name}'s avatar`}
                            className="w-24 h-24 text-large z-10"
                            isBordered
                            color="primary"
                            classNames={{
                              base: "ring-2 ring-white/50 dark:ring-black/20 group-hover:ring-white/80 dark:group-hover:ring-black/40 transition-all duration-300",
                              img: "object-cover scale-[1.01] group-hover:scale-110 transition-transform duration-700"
                            }}
                          />
                        </div>
                      </Button>
                    </Tooltip>
                    <Button
                      as="a"
                      href={`/authors/${author.slug}`}
                      variant="light"
                      color="primary"
                      size="sm"
                      className="text-white font-medium"
                      endContent={
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      }
                    >
                      {name}
                    </Button>
                  </div>
                </div>
                
                {/* 右侧：帖子信息 */}
                <div className="w-full md:w-2/3 p-6 md:p-8">
                  <div className="mb-2 flex flex-wrap gap-2">
                    {platform && (
                      <Chip
                        color="primary"
                        variant="flat"
                        size="sm"
                        classNames={{
                          base: "border-1 border-primary/30"
                        }}
                      >
                        {platform}
                      </Chip>
                    )}
                    <Chip
                      variant="dot"
                      color="default"
                      size="sm"
                    >
                      <time dateTime={formattedDate} className="text-xs">
                        {readableDate}
                      </time>
                    </Chip>
                  </div>
                  
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4 group">
                    {title}
                  </h1>
                  
                  {/* 标签 */}
                  {tags && tags.length > 0 && (
                    <section className="mt-6">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Tags:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {tags.map((tag) => (
                          <Chip
                            key={tag}
                            as="a"
                            href={`/authors/${author.slug}?tag=${tag}`}
                            variant="flat"
                            color="secondary"
                            size="sm"
                            className="cursor-pointer hover:scale-105 transition-transform"
                          >
                            {tag}
                          </Chip>
                        ))}
                      </div>
                    </section>
                  )}
                  
                  {/* 快速操作按钮 */}
                  <div className="mt-6 flex flex-wrap gap-2">
                    <Button 
                      onClick={scrollToComments}
                      color="primary"
                      variant="flat"
                      size="sm"
                      startContent={
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                      }
                    >
                      评论
                    </Button>
                    
                    <Button 
                      as="a"
                      href={profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="default"
                      variant="flat"
                      size="sm"
                      startContent={
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      }
                    >
                      原始帖子
                    </Button>
                    
                    <Button 
                      color="default"
                      variant="flat"
                      size="sm"
                      isIconOnly
                      className="ml-auto"
                      aria-label="Share post"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </Button>
                    
                    <Button 
                      color="default"
                      variant="flat"
                      size="sm"
                      isIconOnly
                      aria-label="Bookmark post"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
        
        {/* 内容区域 */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 主要内容区域 */}
          <div className="w-full lg:w-2/3">
            {/* 帖子内容 */}
            <motion.div
              ref={contentRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="mb-8 border-none" shadow="sm">
                <CardBody className="p-6 md:p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-3">
                      <svg className="h-4 w-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">内容</h2>
                  </div>
                  
                  <Divider className="my-4" />
                  
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="w-full h-6 rounded-lg" />
                      <Skeleton className="w-5/6 h-6 rounded-lg" />
                      <Skeleton className="w-full h-24 rounded-lg" />
                      <Skeleton className="w-11/12 h-6 rounded-lg" />
                      <Skeleton className="w-4/5 h-6 rounded-lg" />
                    </div>
                  ) : (
                    <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-800 dark:prose-headings:text-white prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-a:no-underline hover:prose-a:underline">
                      {body && <div className="mt-4" dangerouslySetInnerHTML={{ __html: body }}></div>}
                    </div>
                  )}
                </CardBody>
              </Card>
            </motion.div>
            
            {/* 评论区域 */}
            <motion.div 
              ref={scrollRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="border-none" shadow="sm">
                <CardBody className="p-6 md:p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-3">
                      <svg className="h-4 w-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">评论</h2>
                  </div>
                  
                  <Divider className="my-4" />
                  
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="w-full h-24 rounded-lg" />
                      <Skeleton className="w-full h-24 rounded-lg" />
                    </div>
                  ) : post.data.comments && post.data.comments.length > 0 ? (
                    <div className="space-y-4">
                      {post.data.comments.map((comment, index) => (
                        <motion.div
                          key={comment.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.1 * index }}
                        >
                          <Card
                            id={comment.id.toString()}
                            className="bg-default-50 dark:bg-default-100/5 border-none"
                            shadow="none"
                          >
                            <CardBody className="p-4">
                              <div className="flex items-center gap-3 mb-2">
                                <Avatar
                                  name={comment.author.charAt(0)}
                                  size="sm"
                                  color="primary"
                                  isBordered
                                />
                                <div>
                                  <p className="font-medium text-gray-800 dark:text-white">
                                    {comment.author}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    <time dateTime={comment.publishDate}>
                                      {format(new Date(comment.publishDate), "MMM d, yyyy 'at' h:mm a")}
                                    </time>
                                  </p>
                                </div>
                              </div>
                              <div className="prose prose-sm dark:prose-invert max-w-none mt-2">
                                <div dangerouslySetInnerHTML={{ __html: comment.content }} />
                              </div>
                            </CardBody>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-5xl mb-4">💬</div>
                      <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">还没有评论</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        第一个分享你的想法！
                      </p>
                      <Button
                        color="primary"
                        variant="flat"
                        endContent={
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        }
                      >
                        添加评论
                      </Button>
                    </div>
                  )}
                </CardBody>
              </Card>
            </motion.div>
          </div>
          
          {/* 侧边栏 */}
          <div className="w-full lg:w-1/3">
            {/* 文件/图片区域 */}
            {files && files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="mb-6 border-none sticky top-20" shadow="sm">
                  <CardBody className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-3">
                        <svg className="h-4 w-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-bold text-gray-800 dark:text-white">附件</h2>
                    </div>
                    
                    <Divider className="my-4" />
                    
                    {isLoading ? (
                      <div className="grid grid-cols-2 gap-3">
                        <Skeleton className="h-32 rounded-lg" />
                        <Skeleton className="h-32 rounded-lg" />
                        <Skeleton className="h-32 rounded-lg" />
                        <Skeleton className="h-32 rounded-lg" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        {files.map((file, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.05 * index }}
                            whileHover={{ scale: 1.05 }}
                            className="relative group"
                          >
                            <Button
                              className="p-0 w-full h-full min-w-0 bg-transparent"
                              onClick={() => handleImageClick(file.url, index)}
                              radius="lg"
                            >
                              <Image
                                src={file.thumbnail || file.url}
                                alt={file.name || `File ${index + 1}`}
                                radius="lg"
                                classNames={{
                                  wrapper: "w-full h-32",
                                  img: "object-cover w-full h-full"
                                }}
                                isBlurred
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
                                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                              </div>
                            </Button>
                            
                            <Tooltip content="Download file">
                              <Button
                                as="a"
                                href={file.url}
                                download={file.name}
                                isIconOnly
                                size="sm"
                                color="primary"
                                variant="flat"
                                radius="full"
                                className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                              </Button>
                            </Tooltip>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardBody>
                </Card>
              </motion.div>
            )}
            
            {/* 作者信息卡片 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="border-none" shadow="sm">
                <CardBody className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-3">
                      <svg className="h-4 w-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">关于作者</h2>
                  </div>
                  
                  <Divider className="my-4" />
                  
                  {isLoading ? (
                    <div className="flex flex-col items-center space-y-4">
                      <Skeleton className="w-20 h-20 rounded-full" />
                      <Skeleton className="w-32 h-6 rounded-lg" />
                      <Skeleton className="w-full h-16 rounded-lg" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center">
                      <Avatar
                        src={avatar}
                        className="w-20 h-20 mb-3"
                        isBordered
                        color="primary"
                      />
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{name}</h3>
                      {author.data.bio && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{author.data.bio}</p>
                      )}
                      <Button
                        as="a"
                        href={`/authors/${author.slug}`}
                        color="primary"
                        variant="flat"
                        size="sm"
                        endContent={
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        }
                      >
                        查看资料
                      </Button>
                    </div>
                  )}
                </CardBody>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* 图片查看器 Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="full"
        hideCloseButton
        classNames={{
          base: "bg-black/95",
          body: "p-0"
        }}
      >
        <ModalContent>
          <ModalBody>
            <div className="relative w-full h-full flex items-center justify-center">
              {/* 主图片 */}
              <div className="relative max-w-7xl max-h-[90vh]">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={activeImage}
                    src={activeImage || ""} 
                    alt="Full size" 
                    className="max-w-full max-h-[90vh] object-contain"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>
              </div>
              
              {/* 控制按钮 */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  isIconOnly
                  color="default"
                  variant="flat"
                  radius="full"
                  className="bg-black/50 text-white"
                  onClick={onClose}
                  aria-label="Close image viewer"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
              
              {/* 导航按钮 */}
              {files && files.length > 1 && (
                <>
                  <Button
                    isIconOnly
                    color="default"
                    variant="flat"
                    radius="full"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white"
                    onClick={prevImage}
                    aria-label="Previous image"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </Button>
                  <Button
                    isIconOnly
                    color="default"
                    variant="flat"
                    radius="full"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white"
                    onClick={nextImage}
                    aria-label="Next image"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </>
              )}
              
              {/* 缩略图导航 */}
              {files && files.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] p-2">
                  {files.map((file, index) => (
                    <Button
                      key={index}
                      className={`p-0 min-w-0 h-16 w-16 ${imageIndex === index ? 'ring-2 ring-primary-500' : ''}`}
                      onClick={() => {
                        setImageIndex(index);
                        setActiveImage(file.url);
                      }}
                    >
                      <Image
                        src={file.thumbnail || file.url}
                        alt={`Thumbnail ${index + 1}`}
                        className="h-full w-full object-cover"
                        radius="sm"
                      />
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      
      {/* 返回顶部按钮 */}
      <div className="fixed bottom-6 right-6 z-30">
        <Tooltip content="Back to top">
          <Button
            isIconOnly
            color="primary"
            variant="shadow"
            size="lg"
            radius="full"
            className="shadow-lg"
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </Button>
        </Tooltip>
      </div>
    </motion.main>
  );
};

export default PostDetailPage;
