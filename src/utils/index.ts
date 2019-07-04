import { curry, pipe, map } from 'lodash/fp';
/**
 * 美化命令行终端日志输出
 */
export const log = {
  suc: (_: any, ...args: any[]) => {
    console.log(`%c ${_}`, 'color: #86d850;font-size:12px;font-weight:bold;', ...args);
  },
  info: (_: any, ...args: any[]) => {
    console.log(`%c ${_}`, 'color: #27a8f2;font-size:12px;font-weight:bold;', ...args);
  },
  err: (_: any, ...args: any[]) => {
    console.log(`%c ${_}`, 'color: red;font-size:12px;font-weight:bold;', ...args);
  },
};

// String Helpers
export const capitalizeFirstLetter = (message: string) => message.charAt(0).toUpperCase() + message.slice(1).toLowerCase();

export const uncapitalizeFirstLetter = (message: string) => message.charAt(0).toLowerCase() + message.slice(1).toLowerCase();

export const kebab = (message: string) => (message || '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

export const randomElement = (arr = []) => arr[Math.floor(Math.random() * arr.length)];

export const slugify = (words: string) => pipe(
  (words: string) => words.split(' '),
  map(word => word.toLowerCase()),
  (words: string[]) => words.join('-'),
)(words);

export const surround = (words: string) => words.replace(/^(w+)$/, '"$1"');
