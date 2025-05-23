class JumpTimer{
	constructor(x, y, w, h, value){
		this.x = x
		this.y = y
		this.w = w
		this.h = h
		this.value = value
	}
	show(){
		fill('red')
		rect(this.x, this.y, this.w, this.h)
		fill('green')
		rect(this.x, this.y,(this.value*this.w)/100 , this.h)
		
	}
}