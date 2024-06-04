import {ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const regexpUsername = /^\w+$/;
export const regexpUsernameWithAt = /^@\w+$/;
export const regexpUsernameStrict = /^[\dA-Za-z]\w{3,31}$/;
