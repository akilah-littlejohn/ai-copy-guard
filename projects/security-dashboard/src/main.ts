import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { LucideAngularModule, Activity, Shield, AlertTriangle, FileCode, CheckCircle, Terminal } from 'lucide-angular';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(LucideAngularModule.pick({ Activity, Shield, AlertTriangle, FileCode, CheckCircle, Terminal }))
  ]
})
  .catch((err) => console.error(err));
