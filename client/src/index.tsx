/* @refresh reload */
import {render} from 'solid-js/web';

import './index.css';
import {Component, ParentComponent, Show, lazy} from 'solid-js';
import {Router, Route} from '@solidjs/router';
import {authStatusResource, siteResource} from './api/globalResources';
import {Button} from './components/ui/Button';
import {NotFoundPage} from './pages/NotFoundPage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './components/ui/DropdownMenu';
import {Icon} from './components/ui/Icon';
import {Title} from './components/Title';

const Shell: ParentComponent = (props) => {
  const [authStatus] = authStatusResource;

  return (
    <>
      <Title />
      <nav class='px-8 py-3 border-b-2 flex'>
        <Button as='a' href='/' variant='link'>
          Home
        </Button>
        <Button as='a' href='/explore' variant='link'>
          Explore
        </Button>
        <span class='grow' />
        <Show when={authStatus()}>
          {authStatus()!.user.role === 'GUEST' ? (
            <>
              <Button as='a' href='/login' variant='link'>
                Login
              </Button>
              <Button as='a' href='/register' variant='link'>
                Register
              </Button>
            </>
          ) : (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger as={Button} variant='ghost'>
                  {authStatus()!.user.username}
                  <Icon icon='material-symbols:arrow-drop-down' />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    as='a'
                    href={`/@${authStatus()!.user.username}`}
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem as='a' href='/logout'>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </Show>
      </nav>
      <div class='m-8'>{props.children}</div>
    </>
  );
};

const Routes: Component = () => (
  <Router>
    <Route path='/' component={lazy(async () => import('./app/App'))} />

    <Route path='**' component={Shell}>
      <Route
        path='/explore'
        component={lazy(async () => import('./pages/explore/ExplorePage'))}
      />
      <Route
        path='/projects/:id'
        component={lazy(async () => import('./pages/project/ProjectPage'))}
      />
      <Route
        path='/users/:id'
        component={lazy(async () => import('./pages/users/UserRedirectPage'))}
      />
      <Route
        path='/login'
        component={lazy(async () => import('./pages/account/LoginPage'))}
      />
      <Route
        path='/register'
        component={lazy(async () => import('./pages/account/RegisterPage'))}
      />
      <Route
        path='/logout'
        component={lazy(async () => import('./pages/account/LogoutPage'))}
      />
      <Route
        path=':username'
        component={lazy(async () => import('./pages/users/UserPage'))}
        matchFilters={{
          username: /^@[\w\d]+$/,
        }}
      />
      <Route path='**' component={NotFoundPage} />
    </Route>
  </Router>
);

render(() => <Routes />, document.querySelector('#root')!);
