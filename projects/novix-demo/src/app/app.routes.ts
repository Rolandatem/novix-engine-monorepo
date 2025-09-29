import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { ColorsDemo } from './pages/colors-demo/colors-demo';
import { UtilitiesDemo } from './pages/utilities-demo/utilities-demo';
import { ThemesDemo } from './pages/themes-demo/themes-demo';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'colors-demo', component: ColorsDemo },
  { path: 'utilities-demo', component: UtilitiesDemo },
  { path: 'themes-demo', component: ThemesDemo }
];
