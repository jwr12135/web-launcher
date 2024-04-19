import {createResource} from 'solid-js';
import * as api from './api';

export const siteResource = createResource(api.getSite);
export const authStatusResource = createResource(api.authStatus);
