import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'generateDate'})
export class GenerateDatePipe implements PipeTransform{
	transform(value):string{
		let date = new Date(value*1000);

		let day = date.getDate();
		let final_day = day.toString();

		if (day <= 9){
			final_day = "0"+day;
		}
		
		let month = (date.getMonth()+1);
		let final_month = month.toString();

		if (month <= 9){
			final_month = "0"+month;
		}

		let hour = date.getHours();
		let final_hour = hour.toString();

		if (hour <= 9){
			final_hour = "0"+hour;
		}

    	let minutes = date.getMinutes();
		let final_minutes = minutes.toString();

		if (minutes <= 9){
			final_minutes = "0"+minutes;
		}

    	let seconds = date.getSeconds();
		let final_seconds = seconds.toString();

		if (seconds <= 9){
			final_seconds = "0"+seconds;
		}

		let result = final_month+"/"+final_day+"/"+date.getFullYear()+" "+final_hour+":"+final_minutes+":"+final_seconds;
		return result;
	}


}