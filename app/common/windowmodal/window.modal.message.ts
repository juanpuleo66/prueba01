import { Component } from '@angular/core';

@Component({
    selector: 'window-modal-message',
    templateUrl: 'app/common/windowmodal/window.modal.message.html',
})

export class WindowModalMessage {
	public windowModalIsVisible: boolean = false;
	public windowModalMessage: string;

	showWindowModalMessage(msg: string)
    {
        this.windowModalMessage = msg;
        this.windowModalIsVisible = true;
    }

    hideWindowModalMessage()
    {
        this.windowModalIsVisible = false;
    }
}
