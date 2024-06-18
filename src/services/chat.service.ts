import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { Client, Subscription, over } from 'stompjs';
import { environment } from '../environments/environment';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private url = environment.webSocketUrl;
  private socket?: WebSocket;
  private stomp?: Client;
  private chatterName = '';

  constructor(private msgService: MessageService) { }

  connect(): Observable<boolean> {
    this.socket = new WebSocket(this.url + 'ws');
    this.stomp = over(this.socket);
    return new Observable((subscriber: Subscriber<boolean>) => {
      this.stomp!.connect({}, frame => {
        this.msgService.success("Attached to chat server");
        subscriber.next(true);
        subscriber.complete();
      }, error => {
        this.msgService.error("Chat server error");
        console.error("Char server error", error);
        subscriber.next(false);
        subscriber.complete();
      })
    });
  }

  sendName(name: string) {
    // this.stomp?.send('/app/hello',{}, `{"name": "${name}"}`);
    this.stomp?.send('/app/hello',{}, JSON.stringify({name}));
    this.chatterName = name;
  }
  sendMessage(message: string) {
    this.stomp?.send('/app/message',{}, JSON.stringify({name: this.chatterName, message}));
  }

  listenMessages(): Observable<ChatMessage> {
    return new Observable(subscriber => {
      const msgSubscription = this.stomp?.subscribe('/topic/messages', msg => {
        subscriber.next(JSON.parse(msg.body) as ChatMessage);
      });
      return {
        unsubscribe: () => {
          msgSubscription?.unsubscribe();
        }
      }
    });
  }
  listenGreetings(): Observable<ChatMessage> {
    return new Observable(subscriber => {
      const greetSubsc = this.stomp?.subscribe('/topic/greetings', msg => {
        let jsonObj = JSON.parse(msg.body) as {content: string};
        subscriber.next(new ChatMessage('SERVER', jsonObj.content));
      })
      return {
        unsubscribe: () => greetSubsc?.unsubscribe()
      }
    });
  }

  disconnect() {
    this.stomp?.disconnect(()=>this.msgService.success("Disconnected from chat"));
    
  }
}

export class ChatMessage {
  constructor(
    public name: string,
    public message: string
  ){}
}
