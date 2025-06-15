import type {AreaHTMLAttributes} from 'react';
import type {EnhanceHref} from './EnhanceHref';
import type {LinkNavigationProps} from './LinkNavigationProps';

export type AreaProps = EnhanceHref<AreaHTMLAttributes<HTMLAreaElement>> &
    LinkNavigationProps;
