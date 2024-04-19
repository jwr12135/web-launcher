import {createSignal} from 'solid-js';

const apiHost = 'http://localhost:3333';

export interface Site {
  createdAt: string;
  updatedAt: string;
  setup: boolean;
  name: string;
  description: string;
  openRegistration: boolean;
}
export interface Session {
  token: string;
  expires: string;
}
export interface User {
  id: number;
  createdAt: string;
  updatedAt: string;
  username: string;
  role: string;
  displayName: string;
  about: string;
}
export interface Project {
  id: number;
  createdAt: string;
  updatedAt: string;
  type: string;
  userID: number;
  visibility: string;
  name: string;
  data: Map<string, unknown>;
}
export interface ProjectStats {
  stars: number;
}
export interface ProjectView {
  project: Project;
  creator: User;
  stats: ProjectStats;
  isStared: boolean;
}
const authTokenKey = 'sourcetab-auth';
const [authToken, setAuthTokenSignal] = createSignal(
  localStorage.getItem(authTokenKey) ?? '',
);
function setAuthToken(newValue: string) {
  setAuthTokenSignal(newValue);
  localStorage.setItem(authTokenKey, newValue);
}

function handleHttpError(res: Response) {
  if (!res.ok || res.status >= 400) {
    throw new Error(`${res.status} ${res.statusText}`);
  }
}
function authHeaders(): Record<string, string> {
  if (authToken()) {
    return {Authorization: `Bearer ${authToken()}`};
  }
  return {};
}

export async function getSite() {
  const res = await fetch(`${apiHost}/api/v1/site`, {
    headers: authHeaders(),
  });

  handleHttpError(res);

  return (await res.json()) as Site;
}

export async function authRegister(
  username: string,
  email: string,
  password: string,
  adminCode?: string,
) {
  const res = await fetch(`${apiHost}/api/v1/auth/register`, {
    method: 'POST',
    body: JSON.stringify({username, email, password, adminCode}),
    headers: authHeaders(),
  });

  handleHttpError(res);
}

export async function authLogin(username: string, password: string) {
  const res = await fetch(`${apiHost}/api/v1/auth/login`, {
    method: 'POST',
    body: JSON.stringify({username, password}),
    headers: authHeaders(),
  });

  handleHttpError(res);

  const result = (await res.json()) as {
    session: Session;
    user: User;
  };

  setAuthToken(result.session.token);

  return result;
}

export async function authRefresh() {
  const res = await fetch(`${apiHost}/api/v1/auth/refresh`, {
    method: 'POST',
    headers: authHeaders(),
  });

  handleHttpError(res);

  const result = (await res.json()) as {
    session: Session;
  };

  setAuthToken(result.session.token);

  return result;
}

export async function authLogout() {
  const res = await fetch(`${apiHost}/api/v1/auth/logout`, {
    method: 'POST',
    headers: authHeaders(),
  });

  handleHttpError(res);

  setAuthToken('');

  return (await res.json()) as {
    user: User;
  };
}

export async function authStatus() {
  const res = await fetch(`${apiHost}/api/v1/auth/status`, {
    headers: authHeaders(),
  });

  handleHttpError(res);

  return (await res.json()) as {
    session: {
      expires: string;
    };
    user: User;
  };
}

export async function projectList(params: {
  sort?: string;
  createdBy?: string;
  staredBy?: string;
  projectType?: string;
}) {
  const url = new URL(`${apiHost}/api/v1/projects`);
  for (const key of Object.keys(params) as any as Array<keyof typeof params>) {
    url.searchParams.set(key, params[key]!);
  }
  const res = await fetch(url, {
    headers: authHeaders(),
  });

  handleHttpError(res);

  return (await res.json()) as ProjectView[];
}

export async function projectGet(id: number) {
  const res = await fetch(`${apiHost}/api/v1/projects/${id}`, {
    headers: authHeaders(),
  });

  handleHttpError(res);

  return (await res.json()) as ProjectView;
}

export async function projectCreateStar(id: number) {
  const res = await fetch(`${apiHost}/api/v1/projects/${id}/star`, {
    method: 'POST',
    headers: authHeaders(),
  });

  handleHttpError(res);

  return (await res.json()) as {
    stats: {stars: number};
    isStared: boolean;
  };
}

export async function projectDeleteStar(id: number) {
  const res = await fetch(`${apiHost}/api/v1/projects/${id}/star`, {
    method: 'DELETE',
    headers: authHeaders(),
  });

  handleHttpError(res);

  return (await res.json()) as {
    stats: {stars: number};
    isStared: boolean;
  };
}

export async function userGet(username: string) {
  const res = await fetch(`${apiHost}/api/v1/users/${username}`, {
    headers: authHeaders(),
  });

  handleHttpError(res);

  return (await res.json()) as User;
}
