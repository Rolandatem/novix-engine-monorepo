import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { ColorsDemo } from './pages/colors-demo/colors-demo';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'colors-demo', component: ColorsDemo }
];
