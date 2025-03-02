import React, { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardBody, Button, Spinner, Chip } from "@heroui/react";
import { motion } from "framer-motion";

interface TwikooCommentsProps {
  envId: string;
  region?: string;
  lang?: string;
  path?: string;
  className?: string;
  title?: string;
  showCommentCount?: boolean;
  onLoaded?: () => void;
}

const TwikooComments: React.FC<TwikooCommentsProps> = ({
  envId,
  region,
  lang = "zh-CN",
  path,
  className = "",
  title = "Comments",
  showCommentCount = true,
  onLoaded
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [commentCount, setCommentCount] = useState<number | null>(null);
  const [showRecent, setShowRecent] = useState(false);

  useEffect(() => {
    // 加载Twikoo脚本
    const loadTwikoo = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        // 检查是否已经加载了Twikoo
        if (!(window as any).twikoo) {
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/npm/twikoo@1.6.41/dist/twikoo.all.min.js";
          script.async = true;
          script.onload = initTwikoo;
          script.onerror = handleError;
          document.body.appendChild(script);
        } else {
          initTwikoo();
        }
      } catch (error) {
        handleError(error);
      }
    };

    // 初始化Twikoo
    const initTwikoo = async () => {
      try {
        const twikoo = (window as any).twikoo;
        
        // 获取评论数
        if (showCommentCount && path) {
          try {
            const countResult = await twikoo.getCommentsCount({
              envId,
              region,
              urls: [path],
              includeReply: true
            });
            
            if (countResult && countResult.length > 0) {
              setCommentCount(countResult[0].count);
            }
          } catch (error) {
            console.error("Failed to get comment count:", error);
          }
        }
        
        // 初始化评论系统
        await twikoo.init({
          envId,
          el: containerRef.current,
          region,
          path: path || location.pathname,
          lang,
          onCommentLoaded: () => {
            setIsLoading(false);
            if (onLoaded) onLoaded();
          }
        });
      } catch (error) {
        handleError(error);
      }
    };

    const handleError = (error: any) => {
      console.error("Failed to load Twikoo:", error);
      setIsError(true);
      setIsLoading(false);
    };

    loadTwikoo();

    // 清理函数
    return () => {
      // 如果需要在组件卸载时执行清理操作，可以在这里添加
    };
  }, [envId, region, lang, path, onLoaded, showCommentCount]);

  const toggleRecentComments = () => {
    setShowRecent(!showRecent);
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = new Date();
    const commentDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  };

  return (
    <Card 
      className={`w-full overflow-hidden shadow-md bg-content1/60 backdrop-blur-md ${className}`}
      radius="lg"
    >
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 px-6 pt-6 pb-0">
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-xl font-bold"
          >
            {title}
          </motion.div>
          
          {commentCount !== null && (
            <Chip 
              color="primary" 
              variant="flat" 
              size="sm"
              className="transition-all duration-300"
            >
              {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
            </Chip>
          )}
        </div>
      </CardHeader>
      
      <CardBody className="px-6 py-4">
        
        {/* 加载状态 */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Spinner color="primary" size="lg" />
            <p className="mt-4 text-foreground-500">加载评论……</p>
          </div>
        )}
        
        {/* 错误状态 */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-danger mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">加载评论失败</h3>
            <p className="text-foreground-500 mb-4">
              加载评论系统出错。请稍后再试。
            </p>
            <Button 
              color="primary" 
              onClick={() => window.location.reload()}
            >
              刷新页面
            </Button>
          </div>
        )}
        
        {/* Twikoo 容器 */}
        <div 
          ref={containerRef} 
          className={`twikoo-container transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        ></div>
      </CardBody>
    </Card>
  );
};

export default TwikooComments;
