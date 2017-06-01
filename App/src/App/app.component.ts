import { Component } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { SocketService } from './app.service';
<any>require('reset-css/reset.css');

@Component({
    selector: 'app',
    templateUrl: './src/App/app.layout.html',
    styleUrls: [ './src/App/app.style.css' ],
    providers: [
        SocketService
    ]
})

export class AppComponent {
    private observable: Subscription;
    users: Array<object>
    constructor(private socket: SocketService) {
        this.socket.on('users').subscribe(
            (data) => {
                console.log('Success', data);
                this.users = data;
            },
            (error) => {
                console.log('Error', error);
            }
        );
    }
}