import { Component } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { SocketService } from './app.service';

@Component({
    selector: 'app',
    host: { 'window:beforeunload': 'doSomething' },
    template: `
        <div class="wrapper">
            <p> Active Users</p>
            <ul>
             <li *ngFor="let user of users" class="users">
                <div>
                    <p class="user-text">
                    <img [src]="user.user_image" [title]="user.user_name" class="user-image" />
                    {{user.user_name}} </p>
                </div>
             </li>
            </ul>
        </div>
    `,
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