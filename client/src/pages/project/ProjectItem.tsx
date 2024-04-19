import {Component} from 'solid-js';
import {Icon} from '~/components/ui/Icon';
import {Button} from '~/components/ui/Button';
import * as api from '~/api/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/Card';

const ProjectItem: Component<{
  projectView: api.ProjectView;
  setProjectView: (newValue: api.ProjectView) => void;
}> = (props) => {
  return (
    <Card class='mb-4'>
      <CardHeader>
        <CardTitle>
          <a
            class='hover:text-blue-800'
            href={`/projects/${props.projectView.project.id}`}
          >
            {props.projectView.project.name}
          </a>
        </CardTitle>
        <CardDescription>
          <a
            class='block font-light hover:text-blue-800'
            href={`/@${props.projectView.creator.username}`}
          >
            @
            {props.projectView.creator.displayName ||
              props.projectView.creator.username}
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          Created:{' '}
          {new Date(props.projectView.project.createdAt).toLocaleDateString()}
          <br />
          Updated:{' '}
          {new Date(props.projectView.project.updatedAt).toLocaleDateString()}
        </p>
        <Button
          variant='outline'
          size='sm'
          class='mt-2'
          onClick={async () => {
            const newProjectView = await (props.projectView.isStared
              ? api.projectDeleteStar(props.projectView.project.id)
              : api.projectCreateStar(props.projectView.project.id));

            props.setProjectView({
              ...props.projectView,
              stats: {
                ...props.projectView.stats,
                stars: newProjectView.stats.stars,
              },
              isStared: newProjectView.isStared,
            });
          }}
        >
          <Icon
            icon={
              props.projectView.isStared
                ? 'material-symbols:star-rounded'
                : 'material-symbols:star-outline-rounded'
            }
            class='pr-1'
            classList={{
              'text-yellow-500': props.projectView.isStared,
            }}
          />
          Star ({props.projectView.stats.stars})
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProjectItem;
