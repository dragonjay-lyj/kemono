import React, { useState, useEffect, useRef } from "react";
import type { CollectionEntry } from "astro:content";
import { 
  Input, 
  Button, 
  Chip, 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem,
  Pagination,
  Spinner,
  Select,
  SelectItem,
  Tooltip
} from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import PostCard from "./PostCard";
import AuthorHeader from "./AuthorHeader";

interface AuthorPageProps {
  author: CollectionEntry<"authors">;
  posts: CollectionEntry<"post">[];
  totalPosts: number;
  currentPage: number;
  searchQuery: string;
  tagFilter: string;
  baseUrl: string; // 用于构建分页链接
}

// 定义排序选项
type SortOption = {
  label: string;
  value: string;
  icon: React.ReactNode;
};

export const AuthorPage: React.FC<AuthorPageProps> = ({ 
  author, 
  posts: allPosts, 
  totalPosts,
  currentPage = 1,
  searchQuery = "",
  tagFilter = "",
  baseUrl
}) => {
  // 状态管理
  const [filteredPosts, setFilteredPosts] = useState<CollectionEntry<"post">[]>(allPosts);
  const [currentPosts, setCurrentPosts] = useState<CollectionEntry<"post">[]>([]);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [activeTags, setActiveTags] = useState<string[]>(tagFilter ? [tagFilter] : []);
  const [sortOption, setSortOption] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  
  // 引用
  const searchInputRef = useRef<HTMLInputElement>(null);
  const postsContainerRef = useRef<HTMLDivElement>(null);
  
  // 分页设置
  const postsPerPage = 12;
  const totalFilteredPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalFilteredPosts / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = Math.min(startIndex + postsPerPage, totalFilteredPosts);
  
  // 获取所有标签
  const allTags = React.useMemo(() => {
    const tagsSet = new Set<string>();
    allPosts.forEach(post => {
      post.data.tags?.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }, [allPosts]);
  
  // 排序选项
  const sortOptions: SortOption[] = [
    {
      label: "Newest First",
      value: "newest",
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
        </svg>
      )
    },
    {
      label: "Oldest First",
      value: "oldest",
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
        </svg>
      )
    },
    {
      label: "Title A-Z",
      value: "title-asc",
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
        </svg>
      )
    },
    {
      label: "Title Z-A",
      value: "title-desc",
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
        </svg>
      )
    }
  ];
  
  // 初始加载动画
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // 过滤和排序帖子
  useEffect(() => {
    setIsLoading(true);
    
    // 过滤帖子
    let filtered = [...allPosts];
    
    // 应用标签过滤
    if (activeTags.length > 0) {
      filtered = filtered.filter(post => {
        return activeTags.some(tag => post.data.tags?.includes(tag));
      });
    }
    
    // 应用搜索过滤
    if (searchQuery) {
      filtered = filtered.filter(post => 
        post.data.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.data.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // 应用排序
    switch (sortOption) {
      case "newest":
        filtered.sort((a, b) => new Date(b.data.publishDate).getTime() - new Date(a.data.publishDate).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.data.publishDate).getTime() - new Date(b.data.publishDate).getTime());
        break;
      case "title-asc":
        filtered.sort((a, b) => a.data.title.localeCompare(b.data.title));
        break;
      case "title-desc":
        filtered.sort((a, b) => b.data.title.localeCompare(a.data.title));
        break;
    }
    
    setFilteredPosts(filtered);
    
    // 短暂延迟以显示加载动画
    setTimeout(() => setIsLoading(false), 300);
  }, [allPosts, searchQuery, activeTags, sortOption]);
  
  // 更新当前显示的帖子
  useEffect(() => {
    setCurrentPosts(filteredPosts.slice(startIndex, endIndex));
  }, [filteredPosts, startIndex, endIndex]);
  
  // 处理搜索提交
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput) {
      // 构建搜索URL并重定向
      const searchUrl = new URL(baseUrl);
      searchUrl.searchParams.set("q", searchInput);
      searchUrl.searchParams.set("page", "1"); // 重置到第一页
      if (activeTags.length === 1) {
        searchUrl.searchParams.set("tag", activeTags[0]);
      }
      window.location.href = searchUrl.toString();
    } else {
      // 如果搜索框为空，清除搜索参数
      const searchUrl = new URL(baseUrl);
      searchUrl.searchParams.delete("q");
      if (activeTags.length === 1) {
        searchUrl.searchParams.set("tag", activeTags[0]);
      }
      window.location.href = searchUrl.toString();
    }
  };
  
  // 处理分页点击
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    
    // 构建分页URL并重定向
    const pageUrl = new URL(baseUrl);
    if (searchQuery) {
      pageUrl.searchParams.set("q", searchQuery);
    }
    if (activeTags.length === 1) {
      pageUrl.searchParams.set("tag", activeTags[0]);
    }
    pageUrl.searchParams.set("page", newPage.toString());
    window.location.href = pageUrl.toString();
    
    // 滚动到帖子容器顶部
    if (postsContainerRef.current) {
      postsContainerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  
  // 处理标签点击
  const handleTagToggle = (tag: string) => {
    // 如果已经有标签，替换它；如果没有，添加它
    setActiveTags([tag]);
    
    // 构建URL并重定向
    const tagUrl = new URL(baseUrl);
    tagUrl.searchParams.set("tag", tag);
    if (searchQuery) {
      tagUrl.searchParams.set("q", searchQuery);
    }
    tagUrl.searchParams.set("page", "1"); // 重置到第一页
    window.location.href = tagUrl.toString();
  };
  
  // 清除所有过滤器
  const clearAllFilters = () => {
    window.location.href = baseUrl;
  };
  
  // 切换搜索框展开状态
  const toggleSearchExpand = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 300);
    }
  };

  return (
    <motion.main 
      className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <section className="container mx-auto px-4">
        {/* 作者头部 */}
        <motion.div 
          className="mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <AuthorHeader author={author} />
        </motion.div>
        
        {/* 过滤和控制区域 */}
        <motion.div 
          className="sticky top-0 z-10 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-md py-4 mb-6 rounded-xl"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* 左侧：搜索和标签 */}
            <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3">
              {/* 搜索表单 */}
              <form 
                onSubmit={handleSearchSubmit}
                className={`relative transition-all duration-300 ${
                  isSearchExpanded ? "w-full sm:w-80" : "w-10"
                }`}
              >
                <AnimatePresence>
                  {isSearchExpanded && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "100%", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search posts..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onBlur={() => searchInput === "" && setIsSearchExpanded(false)}
                        classNames={{
                          base: "max-w-full",
                          inputWrapper: "bg-white dark:bg-gray-800 shadow-sm",
                        }}
                        radius="full"
                        startContent={
                          <svg className="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        }
                        endContent={
                          <Button 
                            type="submit" 
                            isIconOnly 
                            size="sm" 
                            variant="flat" 
                            className="bg-primary-500 text-white"
                            aria-label="Submit search"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </Button>
                        }
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {!isSearchExpanded && (
                  <Button
                    isIconOnly
                    variant="flat"
                    className="bg-white dark:bg-gray-800 shadow-sm"
                    radius="full"
                    onClick={toggleSearchExpand}
                    aria-label="Expand search"
                  >
                    <svg className="h-4 w-4 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </Button>
                )}
              </form>
              
              {/* 标签过滤下拉菜单 */}
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    variant="flat"
                    className="bg-white dark:bg-gray-800 shadow-sm"
                    radius="full"
                    endContent={
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    }
                  >
                    {activeTags.length > 0 ? `Tag: ${activeTags[0]}` : "Filter by Tag"}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Filter by tags"
                  closeOnSelect={true}
                  className="max-h-[400px] overflow-y-auto"
                  classNames={{
                    base: "p-0"
                  }}
                >
                  {allTags.length > 0 ? (
                    <>
                      {activeTags.length > 0 && (
                        <DropdownItem key="clear" textValue="Clear" onClick={() => clearAllFilters()}>
                          <div className="flex items-center text-danger">
                            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            清除标签筛选
                          </div>
                        </DropdownItem>
                      )}
                      {allTags.map(tag => (
                        <DropdownItem 
                          key={tag} 
                          textValue={tag}
                          onClick={() => handleTagToggle(tag)}
                        >
                          <div className="flex items-center justify-between">
                            <span>{tag}</span>
                            {activeTags.includes(tag) && (
                              <svg className="h-4 w-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </DropdownItem>
                      ))}
                    </>
                  ) : (
                    <DropdownItem isDisabled key={""}>无可用标签</DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
              
              {/* 活动标签显示 */}
              {activeTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {activeTags.map(tag => (
                    <Chip
                      key={tag}
                      onClose={() => clearAllFilters()}
                      variant="flat"
                      color="primary"
                      radius="sm"
                      classNames={{
                        base: "bg-primary-100 dark:bg-primary-900/30",
                        content: "text-primary-700 dark:text-primary-300",
                      }}
                    >
                      {tag}
                    </Chip>
                  ))}
                </div>
              )}
            </div>
            
            {/* 右侧：排序和视图控制 */}
            <div className="flex items-center gap-2">
              {/* 排序选择器 */}
              <Select
                size="sm"
                label="Sort by"
                selectedKeys={[sortOption]}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-40 min-w-0"
                classNames={{
                  trigger: "bg-white dark:bg-gray-800 shadow-sm h-10",
                }}
              >
                {sortOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    startContent={option.icon}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
              
              {/* 视图模式切换 */}
              <div className="flex rounded-lg overflow-hidden shadow-sm">
                <Tooltip content="Grid view">
                  <Button
                    isIconOnly
                    variant={viewMode === "grid" ? "solid" : "flat"}
                    className={viewMode === "grid" 
                      ? "bg-primary-500 text-white rounded-r-none" 
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-r-none"
                    }
                    onClick={() => setViewMode("grid")}
                    aria-label="Grid view"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </Button>
                </Tooltip>
                <Tooltip content="List view">
                  <Button
                    isIconOnly
                    variant={viewMode === "list" ? "solid" : "flat"}
                    className={viewMode === "list" 
                      ? "bg-primary-500 text-white rounded-l-none" 
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-l-none"
                    }
                    onClick={() => setViewMode("list")}
                    aria-label="List view"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>
          
          {/* 活动过滤器摘要 */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {searchQuery || activeTags.length > 0 ? (
                <span className="flex items-center">
                  <svg className="h-4 w-4 mr-1 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  筛选结果：共 {totalFilteredPosts} 篇，总计 {totalPosts} 篇
                </span>
              ) : (
                <span>显示全部 {totalPosts} 篇</span>
              )}
            </div>
            
            <div className="text-sm">
            显示第 {startIndex + 1} - {endIndex} 篇，共 {totalFilteredPosts} 篇
            </div>
          </div>
        </motion.div>
        
        {/* 顶部分页 */}
        {totalPages > 1 && (
          <div className="flex justify-center mb-8">
            <Pagination
              showControls
              total={totalPages}
              initialPage={currentPage}
              onChange={handlePageChange}
              classNames={{
                cursor: "bg-primary-500",
              }}
            />
          </div>
        )}
        
        {/* 帖子列表 */}
        <div ref={postsContainerRef}>
          {isInitialLoad ? (
            <div className="flex flex-col justify-center items-center py-20">
              <Spinner 
                size="lg" 
                color="primary" 
                classNames={{
                  circle1: "border-b-primary-500",
                  circle2: "border-b-primary-400",
                }}
              />
              <p className="mt-4 text-gray-600 dark:text-gray-400">正在加载内容...</p>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Spinner 
                size="lg" 
                color="primary" 
                classNames={{
                  circle1: "border-b-primary-500",
                  circle2: "border-b-primary-400",
                }}
              />
            </div>
          ) : currentPosts.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={`view-${viewMode}-page-${currentPage}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {currentPosts.map((post, index) => (
                      <motion.div 
                        key={post.slug} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="h-full"
                      >
                        <div className="h-full transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                          <PostCard post={post} href={`/post/${post.slug}`} />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentPosts.map((post, index) => (
                      <motion.div 
                        key={post.slug} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                          <a 
                            href={`/post/${post.slug}`}
                            className="flex flex-col md:flex-row"
                          >
                            <div className="w-full md:w-1/4 h-48 md:h-auto relative">
                              <img 
                                src={post.data.coverImage} 
                                alt={post.data.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-4 md:p-6 flex flex-col flex-grow">
                              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{post.data.title}</h3>
                              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{post.data.description}</p>
                              <div className="mt-auto flex flex-wrap items-center justify-between">
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  {new Date(post.data.publishDate).toLocaleDateString()}
                                </div>
                                {post.data.tags && (
                                  <div className="flex flex-wrap gap-1 mt-2 md:mt-0">
                                    {post.data.tags.slice(0, 3).map(tag => (
                                      <Chip 
                                        key={tag} 
                                        size="sm" 
                                        variant="flat" 
                                        color="primary"
                                        className="max-w-[100px]"
                                      >
                                        <span className="truncate">{tag}</span>
                                      </Chip>
                                    ))}
                                    {post.data.tags.length > 3 && (
                                      <Chip size="sm" variant="dot" color="default">+{post.data.tags.length - 3}</Chip>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </a>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">没有找到内容</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
                {searchQuery 
                  ? `No posts matching "${searchQuery}".` 
                  : activeTags.length > 0 
                    ? `No posts with tag "${activeTags.join(", ")}".`
                    : "This author hasn't published any posts yet."}
              </p>
              {(searchQuery || activeTags.length > 0) && (
                <Button 
                  color="primary" 
                  variant="flat"
                  onClick={clearAllFilters}
                  className="px-6"
                  startContent={
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  }
                >
                  清除所有筛选
                </Button>
              )}
            </motion.div>
          )}
        </div>
        
        {/* 底部分页 */}
        {totalPages > 1 && !isLoading && currentPosts.length > 0 && (
          <div className="flex justify-center mt-12">
            <Pagination
              showControls
              total={totalPages}
              initialPage={currentPage}
              onChange={handlePageChange}
              classNames={{
                cursor: "bg-primary-500",
              }}
            />
          </div>
        )}
        
        {/* 返回顶部按钮 */}
        <div className="fixed bottom-6 right-6">
          <Tooltip content="Back to top">
            <Button
              isIconOnly
              color="primary"
              variant="shadow"
              size="lg"
              radius="full"
              className="shadow-lg"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </Button>
          </Tooltip>
        </div>
      </section>
    </motion.main>
  );
};

export default AuthorPage;
