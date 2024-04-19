import {Component, Show, createResource} from 'solid-js';
import {useParams} from '@solidjs/router';
import * as api from '~/api/api';
import {ErrorMessage} from '~/components/ui/ErrorMessage';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/Card';
import {Title} from '~/components/Title';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '~/components/ui/Tabs';
import {NotFoundPage} from '../NotFoundPage';
import UserStarsSection from './UserStarsSection';
import UserProjectsSection from './UserProjectsSection';

const UserPage: Component = () => {
  const params = useParams();

  const [user] = createResource(
    () => params.username.split('@')[1],
    api.userGet,
  );

  const userTitle = () => user()!.displayName || user()!.username;

  return (
    <>
      <Show when={user.state === 'ready'}>
        <Title>{userTitle() + "'s Profile"}</Title>
        <CardHeader>
          <CardTitle>{userTitle()}</CardTitle>
          <CardDescription>{user()!.about}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue='projects'>
            <TabsList class='grid w-full grid-cols-2'>
              <TabsTrigger value='projects'>Projects</TabsTrigger>
              <TabsTrigger value='stars'>Stars</TabsTrigger>
            </TabsList>
            <TabsContent value='projects'>
              <UserProjectsSection username={user()!.username} />
            </TabsContent>
            <TabsContent value='stars'>
              <UserStarsSection username={user()!.username} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Show>
      <Show when={user.state === 'errored'}>
        <Show
          when={String(user.error) === 'Error: 404 Not Found'}
          fallback={<ErrorMessage>{user.error}</ErrorMessage>}
        >
          <NotFoundPage />
        </Show>
      </Show>
    </>
  );
};

export default UserPage;
