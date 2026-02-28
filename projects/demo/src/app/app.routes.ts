import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { ScenarioComponent } from './pages/scenario.component';
import { UploadComponent } from './pages/upload.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'scenario/:id', component: ScenarioComponent },
  { path: 'upload', component: UploadComponent },
  { path: '**', redirectTo: '' },
];
