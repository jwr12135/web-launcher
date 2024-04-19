import {Component} from 'solid-js';
import {Title} from '~/components/Title';

export const NotFoundPage: Component = () => (
  <h1 class='text-center text-2xl font-medium'>
    <Title>Page Not Found</Title>
    Page Not Found
    <br />
    <br />
    <span class='text-xl'>404 Error</span>
  </h1>
);
