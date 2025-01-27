import {
  Component, ViewEncapsulation, ViewChild, ElementRef,
  AfterViewChecked, ViewChildren, QueryList, OnDestroy
} from '@angular/core';

import { Subscription } from 'rxjs';

import { ClientService, Message } from '../../services/client.service';
import { SoundService, Sound } from '../../services/sound.service';
import { environment } from '../../../environments/environment';

interface ChatMessage extends Message {
  date: number;
  odd: boolean;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: [ './chat.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class ChatComponent implements OnDestroy, AfterViewChecked {
  public padding = 0;

  public message = '';
  public messages = [] as ChatMessage[];

  public constructor(
    private client: ClientService,
    private sound: SoundService
  ) {
    this.messageSubscription = client.messageReception.subscribe(message => {
      this.messages.push({ ...message, date: Date.now(), odd: this.odd });

      if (this.messages.length > 100) {
        if (this.entryRefQuery && this.entryRefQuery.first) {
          const entryElem = this.entryRefQuery.first.nativeElement;

          this.messages.splice(0, this.messages.length - 100);
          this.scrollBack = entryElem.getBoundingClientRect().height;
        }
        else {
          // We still delete the first message
          this.messages.shift();
        }
      }

      this.odd = !this.odd;
      this.newMessage = true;

      this.sound.play(Sound.Message);
    });

    this.activationSubscription = client.activationStateChange.subscribe(state => {
      if (!state && this.inputRef) {
        this.inputRef.nativeElement.blur();
        this.message = '';
      }
    });
  }

  public ngOnDestroy(): void {
    this.messageSubscription.unsubscribe();
    this.activationSubscription.unsubscribe();
  }

  public ngAfterViewChecked(): void {
    if (this.newMessage) {
      if (this.autoScroll) {
        this.logScroll();
      }
      else if (this.logRef.nativeElement.scrollTop !== this.maxScroll) {
        this.scrollBack += this.padding;

        this.logRef.nativeElement.scrollTop -= Math.floor(this.scrollBack);

        setTimeout(() => {
          this.padding = this.scrollBack % 1;
          this.scrollBack = 0;
        }, 0);
      }

      this.newMessage = false;
    }
  }

  public sendMessage(): void {
    if (this.message) {
      if (this.message.length > environment.chatMessageLengthLimit) {
        this.client.messageReception.next({content: `You cannot send a message longer than ${environment.chatMessageLengthLimit} characters.`});
        return;
      }

      this.client.sendMessage(this.message);
      this.sound.play(Sound.Focus);
      this.message = '';
    }

    this.focusMessage();
  }

  public onLogScroll(): void {
    this.autoScroll = this.maxScroll - this.logRef.nativeElement.scrollTop < 3;
  }

  public logScroll(): void {
    this.logRef.nativeElement.scrollTop = this.maxScroll;
  }

  public focus(): void {
    this.focusMessage();
  }

  public blur(): void {
    this.inputRef.nativeElement.blur();
  }

  @ViewChild('input')
  private inputRef!: ElementRef;

  @ViewChildren('entry')
  private entryRefQuery!: QueryList<ElementRef>;

  @ViewChild('log')
  private logRef!: ElementRef;

  private odd = false;
  private autoScroll = true;
  private newMessage = false;

  private scrollBack = 0;

  private messageSubscription: Subscription;
  private activationSubscription: Subscription;

  private get maxScroll(): number {
    return this.logRef.nativeElement.scrollHeight - this.logRef.nativeElement.clientHeight;
  }

  private focusMessage(): void {
    this.inputRef.nativeElement.focus();
  }
}
