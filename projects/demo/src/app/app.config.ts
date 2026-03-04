import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { SP_CUSTOM_NODES } from 'smart-player';
import { QuizNodeComponent } from './components/quiz-node.component';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    {
      provide: SP_CUSTOM_NODES,
      useValue: [
        { type: 'quiz', component: QuizNodeComponent, label: 'Quiz' }
      ]
    }
  ]
};
