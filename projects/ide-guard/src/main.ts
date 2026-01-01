import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { LucideAngularModule, Terminal } from 'lucide-angular';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(LucideAngularModule.pick({ Terminal }))
  ]
})
  .catch((err) => console.error(err));
