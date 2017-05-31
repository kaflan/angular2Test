import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import * as io from "socket.io-client";

@Injectable()

export class SocketService {
    private host: string = 'http://localhost:3000';
    private socket: any;
    private connected() {
        console.log('Connected');
    }
    private disconnected() {
        console.log('Disconnected');
    }

    constructor() {
        this.socket = io(this.host);
        this.socket.on("connect", () => this.connected());
        this.socket.on("disconnect", () => this.disconnected());
        this.socket.on("error", (error: string) => {
            console.log(`ERROR: "${error}" (${this.host})`);
        });
    }
    connect () {
        this.socket.connect();
    }
    disconnect () {
        this.socket.disconnect();
    }
    emit(chanel:string, message:any) {
        return new Observable<any>(observer => {
            this.socket.emit(chanel, message, function (data: any) {
                if (data.success) {
                    // Успех
                    observer.next(data.msg);
                } else {
                    // Что-то пошло не так
                    observer.error(data.msg);
                }
                observer.complete();
            });
        });
    }

    on(event_name: string) {
        return new Observable<any>(observer => {
            this.socket.off(event_name);
            this.socket.on(event_name, (data: any) => {
                observer.next(data);
            });
        });
    }
    deleteUser(): Array<object> {
        this.socket.send('hi from cli, delete user');
        return [];
    }

}