import './styles/main.scss';
import { startApp } from './ui/app';

const root = document.querySelector<HTMLDivElement>('.root');

if (root) {
  startApp(root);
}
