export class Style extends Object{
    constructor(){
      super()
    }
  
    por(){
      this.position = "relative"
      return this
    }
  
    poa(){
      this.position = "absolute"
      return this
    }
  
    t(t){
      this.top = t + "px"
      return this
    }
  
    l(l){
      this.left = l + "px"
      return this 
    }

    w(w){
        this.width = w + "px"
        return this 
    }

    h(h){
        this.height = h + "px"
        return this 
    }

    bc(bc){
        this.backgroundColor = bc
        return this
    }

    disp(disp){
        this.display = disp
        return this
    }

    ai(ai){
        this.alignItems = ai
        return this
    }

    jc(jc){
        this.justifyContent = jc
        return this
    }
  }
  
  export function st(){return new Style()}