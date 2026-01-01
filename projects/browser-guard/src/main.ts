import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { LucideAngularModule, Activity, Shield, Copy, AlertTriangle, FileCode, Lock, CheckCircle, X } from 'lucide-angular';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(LucideAngularModule.pick({ Activity, Shield, Copy, AlertTriangle, FileCode, Lock, CheckCircle, X }))
  ]
})
  .catch((err) => console.error(err));
