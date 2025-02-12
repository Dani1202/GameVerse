import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './modules/app-routing.module';
import { LayoutModule } from './modules/layout.module';
import { ViewsModule } from './modules/views.module';
import { i18nModule } from './modules/i18n.module';

@NgModule({
    declarations: [
        AppComponent,
    ],
    providers: [],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        NgbModule,
        AppRoutingModule,
        LayoutModule,
        ViewsModule,
        i18nModule
        ],
})
export class AppModule { }