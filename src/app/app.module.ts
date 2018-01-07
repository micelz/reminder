import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxElectronModule } from 'ngx-electron';
import { PreferencesComponent } from './preferences/preferences.component';
import { MomentModule } from 'angular2-moment';
import { FormsModule } from '@angular/forms';
// import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { OverviewComponent } from './overview/overview.component';
import { FileService } from './utils/services/file.service';
import { StorageService } from './utils/services/storage.service';
import { CryptoService } from './utils/services/crypto.service';
import { NotificationService } from './utils/services/notification.service';
import { SettingService } from './utils/services/setting.service';
import { LoggerService } from './utils/services/logger.service';
import { LoggingComponent } from './logging/logging.component';

@NgModule({
  declarations: [
    AppComponent,
    OverviewComponent,
    PreferencesComponent,
    LoggingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxElectronModule,
    MomentModule,
    FormsModule,
    MatTabsModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    CdkTableModule,
    MatProgressBarModule
  ],
  providers: [FileService, StorageService, CryptoService, NotificationService, SettingService, LoggerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
