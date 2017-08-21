import {Injectable} from '@angular/core';

@Injectable()
export class GeneralServices{
    constructor() {}

    columnContentFormat(content, contentLen){
	    // receives a content and inserts each contentLen a \n (new line) so it does not collapse on the grid
	
        if ( content != null && content != undefined ) {
            let contentSub = [];
            let y = 0;
             
            if ( content.length <= contentLen ) {
                contentSub[y] = content;
            } else {

                for ( let x=0; x<content.length; x++ ) {
                    
                    if ( x == contentLen ) { 
                        contentSub[y] = content.slice(0,x);

                        if ( contentSub[y].substr(-1) != " " ) {
                            contentSub[y] = contentSub[y]+'\n';
                        }
                        content = content.slice(x);

                        if ( content.length <= x ) {
                            y++;
                            contentSub[y] = content;
                        }
                        y++;
                        x=0;
                    }			
                }
            }
            return contentSub.join('');
        }
        return content;
    }
}