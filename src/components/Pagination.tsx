// src/components/Pagination.tsx
import React, { useState } from 'react';
import { Pagination } from "@heroui/pagination";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";

interface PaginationProps {
  total: number;
  page: number;
  onChange: (page: number) => void;
  itemsPerPage?: number;
}

export const CustomPagination: React.FC<PaginationProps> = ({
  total,
  page,
  onChange,
  itemsPerPage = 10
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const totalPages = Math.ceil(total / itemsPerPage);
  const startItem = ((page - 1) * itemsPerPage) + 1;
  const endItem = Math.min(page * itemsPerPage, total);

  const handlePageChange = (newPage: number) => {
    setIsAnimating(true);
    onChange(newPage);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className="flex flex-col items-center gap-4 my-8">
      <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* 页码信息 */}
        <div className="
          text-sm text-default-600 dark:text-default-400
          transition-all duration-300
          transform
          hover:text-primary-500 dark:hover:text-primary-400
        ">
          显示 {startItem} 到 {endItem} 中 {total} 项目
        </div>

        {/* 快速跳转按钮 */}
        <div className="flex gap-2">
          <Tooltip content="First page">
            <Button
              isIconOnly
              variant="light"
              size="sm"
              isDisabled={page === 1}
              onClick={() => handlePageChange(1)}
              className="transition-transform hover:scale-110"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </Button>
          </Tooltip>
          
          <Tooltip content="Last page">
            <Button
              isIconOnly
              variant="light"
              size="sm"
              isDisabled={page === totalPages}
              onClick={() => handlePageChange(totalPages)}
              className="transition-transform hover:scale-110"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* 主分页组件 */}
      <div className={`
        w-full 
        transition-all duration-300 
        ${isAnimating ? 'opacity-50 scale-98' : 'opacity-100 scale-100'}
      `}>
        <Pagination
          total={total}
          page={page}
          onChange={handlePageChange}
          color="primary"
          variant="flat"
          showControls
          showShadow
          boundaries={2}
          siblings={1}
          classNames={{
            wrapper: "gap-2 justify-center",
            item: `
              w-9 h-9
              text-sm font-medium
              transition-all duration-300
              hover:scale-110
              data-[active=true]:scale-110
              data-[active=true]:font-bold
              dark:bg-content2/50
              dark:hover:bg-content2
            `,
            cursor: `
              bg-primary-500 
              shadow-lg shadow-primary-500/30
              dark:shadow-primary-500/20
            `,
            next: `
              transition-transform duration-300
              hover:translate-x-1
            `,
            prev: `
              transition-transform duration-300
              hover:-translate-x-1
            `,
            base: "gap-2 sm:gap-3",
          }}
        />
      </div>

      {/* 跳转到指定页面 */}
      <div className="text-sm text-default-500">
        第 {page} 页，共 {totalPages} 页
      </div>
    </div>
  );
};
