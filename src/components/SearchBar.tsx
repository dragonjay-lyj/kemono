// src/components/SearchBar.tsx
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  debounceTime?: number;
}

// 自定义防抖hook
function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch = () => {},
  placeholder = "搜索帖子...",
  debounceTime = 300
}) => {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const debouncedSearch = useDebounce((query: string) => {
    setIsLoading(false);
    onSearch(query);
  }, debounceTime);

  const handleSearch = (newValue: string) => {
    setValue(newValue);
    setIsLoading(true);
    debouncedSearch(newValue);
  };

  const handleClear = () => {
    setValue("");
    setIsLoading(false);
    onSearch("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 relative group">
      <Input
        value={value}
        onValueChange={handleSearch}
        onClear={handleClear}
        placeholder={placeholder}
        isClearable
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        startContent={
          isLoading ? (
            <Spinner size="sm" color="primary" />
          ) : (
            <svg 
              className="w-5 h-5 text-default-400 transition-colors group-hover:text-primary-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          )
        }
        radius="lg"
        classNames={{
          base: "max-w-full transition-all duration-300 ease-in-out",
          inputWrapper: `
            shadow-lg 
            hover:shadow-xl 
            transition-all 
            duration-300 
            bg-content1 
            dark:bg-content2 
            backdrop-blur-lg 
            ${isFocused ? 'ring-2 ring-primary-500 ring-opacity-50' : ''}
            hover:scale-[1.01]
            group-hover:border-primary-500
          `,
          input: `
            text-sm
            placeholder:text-default-500
            transition-colors
            duration-300
          `,
          clearButton: `
            opacity-70 
            hover:opacity-100 
            transition-opacity
            hover:bg-danger-100
            dark:hover:bg-danger-100/20
            rounded-full
          `,
          mainWrapper: "group",
        }}
        aria-label="Search"
        size="lg"
        variant="bordered"
        description={
          <span className="text-xs text-default-400 mt-1 ml-1">
            按回车搜索
          </span>
        }
      />
      
      {value && isFocused && (
        <div className="
          absolute 
          top-full 
          left-0 
          right-0 
          mt-2 
          bg-content1 
          dark:bg-content2 
          rounded-lg 
          shadow-xl 
          backdrop-blur-lg 
          border 
          border-default-200 
          dark:border-default-100/20
          z-50
          transform
          transition-all
          duration-300
          opacity-0
          translate-y-2
          group-hover:opacity-100
          group-hover:translate-y-0
        ">
          {/* 搜索建议内容 */}
        </div>
      )}
    </div>
  );
};
