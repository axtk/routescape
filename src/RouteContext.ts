import {createContext} from 'react';
import {NavigationLocation} from '../lib/url/NavigationLocation';

export const RouteContext = createContext(new NavigationLocation());
