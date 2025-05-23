class Button{
    constructor(text, x, y, w, h) {
        this.text = text
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }
    draw(){
        fill('white')
        rect(this.x, this.y, this.w, this.h)
        fill('black')
        text(this.text, this.x + this.w/2, this.y + this.h/2)
    }
    isPressed(){
        if(mouseX>=this.x && mouseX<=this.x + this.w && mouseY>=this.y && mouseY<=this.y+this.h){
            return true
        }else{
            return false
        }

    }
}