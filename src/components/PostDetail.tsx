// src/components/PostDetail.tsx
import React, { useState, useEffect } from 'react';
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { Card, CardBody } from "@heroui/card";
import { Link } from "@heroui/link";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { marked } from 'marked';

interface PostDetailProps {
  post: any;
  author: any;
  prevPost: any;
  nextPost: any;
}

export const PostDetail: React.FC<PostDetailProps> = ({
  post,
  author,
  prevPost,
  nextPost,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  // 修改后的图片预加载逻辑
  useEffect(() => {
    const imagesToLoad = [
      author.data.banner,
      author.data.avatar,
      author.data.platformIcon
    ];

    let loadedCount = 0;
    const totalImages = imagesToLoad.length;

    const preloadImage = (src: string) => {
      return new Promise<void>((resolve) => {
        const img = document.createElement('img');
        img.src = src;
        img.onload = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            setImageLoaded(true);
            setIsLoading(false);
          }
          resolve();
        };
        img.onerror = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            setImageLoaded(true);
            setIsLoading(false);
          }
          resolve();
        };
      });
    };

    // 并行加载所有图片
    Promise.all(imagesToLoad.map(preloadImage))
      .catch(() => {
        // 即使某些图片加载失败，也完成加载状态
        setImageLoaded(true);
        setIsLoading(false);
      });

    // 设置超时，防止加载时间过长
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // 5秒超时

    return () => {
      clearTimeout(timeout);
    };
  }, [author]);

  // 分享功能
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.data.title,
          text: `看看这篇文章 ${author.data.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('错误分享:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Spinner 
          size="lg" 
          color="primary"
        />
        <p className="text-default-500 animate-pulse">
          加载内容...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      {/* 导航按钮 */}
      <div className="flex justify-between mb-8 sticky top-4 z-10">
        <Button
          variant="shadow"
          color="primary"
          isDisabled={!prevPost}
          as={Link}
          href={prevPost ? `/posts/${prevPost.slug}` : '#'}
          className="w-[120px] backdrop-blur-md bg-background/60"
          startContent={<span className="text-lg">←</span>}
        >
          上一个
        </Button>
        
        <Button
          variant="shadow"
          color="primary"
          onClick={handleShare}
          className="backdrop-blur-md bg-background/60"
          isIconOnly
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
        </Button>

        <Button
          variant="shadow"
          color="primary"
          isDisabled={!nextPost}
          as={Link}
          href={nextPost ? `/posts/${nextPost.slug}` : '#'}
          className="w-[120px] backdrop-blur-md bg-background/60"
          endContent={<span className="text-lg">→</span>}
        >
          下一个
        </Button>
      </div>

      {/* 作者卡片 */}
      <Card 
        className="mb-8 overflow-hidden transform hover:scale-[1.01] transition-all duration-300"
        shadow="lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* 左侧：作者信息 */}
          <div className="relative h-[250px] md:h-[300px] group">
            <Image
              src={author.data.banner}
              alt={author.data.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              removeWrapper
              isZoomed
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 flex items-center gap-4">
              <div className="relative group">
                <Image
                  src={author.data.avatar}
                  alt={author.data.name}
                  className="w-20 h-20 rounded-full border-4 border-white/30 transition-all duration-300 group-hover:border-primary-500"
                  radius="full"
                />
                <div className="absolute inset-0 rounded-full bg-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <h2 className="text-white text-2xl font-bold tracking-tight">{author.data.name}</h2>
            </div>
          </div>

          {/* 右侧：帖子信息 */}
          <div className="p-8 flex flex-col justify-between bg-content1 dark:bg-content2">
            <div>
              <h1 className="text-3xl font-bold mb-4 text-foreground">{post.data.title}</h1>
              <Link
                href={author.data.platformUrl}
                isExternal
                color="primary"
                className="flex items-center gap-3 hover:gap-4 transition-all duration-300"
                showAnchorIcon
              >
                <Image
                  src={author.data.platformIcon}
                  alt={author.data.platform}
                  className="w-6 h-6"
                  radius="full"
                />
                <span className="text-lg">{author.data.platform}</span>
              </Link>
            </div>
            <div>
              <time className="text-default-500 block mb-4 text-sm">
                {post.data.date.toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <div className="flex flex-wrap gap-2">
                {post.data.tags.map((tag: string) => (
                  <Chip
                    key={tag}
                    variant="flat"
                    color="primary"
                    size="sm"
                    className="hover:scale-105 transition-transform cursor-pointer"
                  >
                    {tag}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 帖子内容 */}
      <Card className="prose-container" shadow="lg">
        <CardBody>
          <div 
            className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:text-foreground
              prose-p:text-foreground-800 dark:prose-p:text-foreground-200
              prose-a:text-primary hover:prose-a:text-primary-500
              prose-img:rounded-xl prose-img:shadow-lg
              prose-pre:bg-background-100 dark:prose-pre:bg-background-900
              transition-colors duration-300"
            dangerouslySetInnerHTML={{ __html: marked(post.data.content) }}
          />
        </CardBody>
      </Card>
    </div>
  );
};
