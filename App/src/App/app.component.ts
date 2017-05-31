import { Component,  OnInit, OnDestroy, OnChanges, Input } from '@angular/core';
import { Subscription }   from 'rxjs/Subscription';
import { SocketService } from './app.service';

@Component({
    selector: 'app',
    host: {'window:beforeunload':'doSomething'},
    template: `
        <div class="wrapper">
            <p>Hello angular 2</p>
        </div>
    `,
      providers: [
          SocketService
    ]
})

export class AppComponent implements  OnInit, OnDestroy, OnChanges {
    private observable : Subscription;
    public users: Array<object>
    constructor (private socket: SocketService ) {
         this.socket.on('users').subscribe(
            (data) => {
                console.log('Success', data);
                this.users = data;
            },
            (error) => {
                console.log('Error', error);
            }
        );
        this.socket.on('users_disconect').subscribe(
              (data) => {
                this.users = data;
                console.log('User disconect', this.users);
            },
            (error) => {
                console.log('Error', error);
            }
        )

    }
    ngOnInit() {
       

    }
    ngOnDestroy() {
        // this.SocketService.deleteUser();
        // this.observable.unsubscribe();
    }
    ngOnChanges() {

    }
 }