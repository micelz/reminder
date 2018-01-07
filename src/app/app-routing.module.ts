import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { LoggingComponent } from './logging/logging.component';

const routes: Routes = [{
        path: '',
        component: OverviewComponent
    }, {
        path: 'info',
        component: OverviewComponent
    }, {
        path: 'preferences',
        component: PreferencesComponent
    }, {
        path: 'logs',
        component: LoggingComponent
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
