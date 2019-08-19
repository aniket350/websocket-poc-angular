import { Component } from "@angular/core";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import $ from "jquery";
import { registerContentQuery } from "@angular/core/src/render3";
// import { Session } from "inspector";
import { NodeInjectorFactory } from "@angular/core/src/render3/interfaces/injector";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  private serverUrl = "http://localhost:8080/socket";
  private title = "WebSockets chat";
  private stompClient;
  private sessionId;
  name: any;
  arr: string[] = [];

  constructor() {
    this.initializeWebSocketConnection();
    // let ws=new SockJS(this.serverUrl);
    // this.sessionId=ws._transport.unloadRef;
    //this.register();
  }

  initializeWebSocketConnection() {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function(frame) {
      console.log(ws, "???");
      console.log(ws._transport.unloadRef, "this is yor socket ID ..");
      that.sessionId = ws._transport.unloadRef;
      that.stompClient.subscribe(`/user/${ws._transport.unloadRef}/reply`,message => {
          console.log(message, "this is messgae ???");

          if (message.body) {
            $(".chat").append(
              "<div class='message'>" + message.body + "</div>"
            );
            console.log(message.body);
          }
        }
      );
    });
  }

      // that.stompClient.subscribe("/chat", (message) => {
      //   console.log(message, "this message should not get printed when reciever is Ruchik ")
      // })
   
  //  connect() {
  //   let ws = new SockJS(this.serverUrl);
  //   this.stompClient=Stomp.over(ws);
  //   this.stompClient.connect({},function(frame){
  //     var urlarray=ws._transport.url.split('/');
  //     var index=urlarray.length-2;
  //     this.sessionId=urlarray[index];
  //     this.stompClient.subscribe('/user',(notification)=>{
  //       notify(notification.body);
  //     });
  //     this.register(this.sessionId);
  //   });

  // }

  sendMessage(message) {
    let a = {
      message: message,
      sessionId: this.sessionId
    };

    this.arr.push(message);
    this.arr.push(this.sessionId);
    this.stompClient.send("/app/send/message", {},JSON.stringify(a));
    $("#input").val("");
  }
}
