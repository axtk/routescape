import {SimpleURL} from './SimpleURL';

export const IsomorphicURL = typeof URL === 'undefined' ? SimpleURL : URL;
