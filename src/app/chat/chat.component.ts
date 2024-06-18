import { Component, ElementRef, OnDestroy, inject, viewChild } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';
import { FormsModule } from '@angular/forms';
import { ChatMessage, ChatService } from '../../services/chat.service';
import { Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [MaterialModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnDestroy{
  nameInputS = viewChild.required<ElementRef>('nameInput');
  msgInputS = viewChild.required<ElementRef>('msgInput');

  name = '';
  chatService = inject(ChatService);
  messages: ChatMessage[] = [];
  msgToSend = '';
  messagesSubscription?: Subscription;
  greetingsSubscription?: Subscription;
  connected = false;

  connect(){
    if (this.name) {
      this.chatService.connect().pipe(
        tap(ok => {
          if (ok) {
            this.connected = true;
            this.listenEndpoints();
            this.chatService.sendName(this.name);
            setTimeout(() => this.msgInputS().nativeElement.focus(), 0);
            console.log("!!! Connected");
          }
        })
      ).subscribe();
    }
  }

  listenEndpoints() {
    this.messagesSubscription = this.chatService.listenMessages().subscribe(message => {
      this.messages = [...this.messages, message];
    });
    this.greetingsSubscription = this.chatService.listenGreetings().subscribe(message => {
      this.messages = [...this.messages, message];
    });
  }

  sendMessage() {
    this.chatService.sendMessage(this.msgToSend);
    this.msgToSend = '';
    setTimeout(() => this.msgInputS().nativeElement.focus(), 0);
  }

  disconnect() {
    this.messagesSubscription?.unsubscribe();
    this.greetingsSubscription?.unsubscribe();
    console.log("!!! Disconnecting");
    this.chatService.disconnect();
    this.connected = false;
    this.messages = [];
    setTimeout(() => this.nameInputS().nativeElement.focus(), 0);
  }

  ngOnDestroy(): void {
    this.disconnect();   
  }
}
