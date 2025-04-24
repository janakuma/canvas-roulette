import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { RouletteComponent } from './roulette/roulette.component';

@NgModule({
    declarations: [AppComponent, RouletteComponent],
    imports: [BrowserModule, FormsModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
