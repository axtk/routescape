import type {AnchorHTMLAttributes} from 'react';
import type {EnhanceHref} from './EnhanceHref';
import type {LinkNavigationProps} from './LinkNavigationProps';

export type AProps = EnhanceHref<AnchorHTMLAttributes<HTMLAnchorElement>> &
    LinkNavigationProps;
