export class e{
    constructor(kind){
        this.e = document.createElement(kind)
        this.selected = false
        this.id = null
        this.origbc = "#eee"
        this.selbc = "#0f0"
    }

    setid(id){
        this.id = id
        return this
    }

    setselbc(selbc){
        this.selbc = selbc
        return this
    }

    setorigbc(origbc){
        this.origbc = origbc
        return this
    }

    setselected(selected){
        this.selected = selected        
        this.bc(this.selected ? this.selbc : this.origbc)        
        return this
    }

    transition(transition){
        this.e.style.transition = transition        
        return this
    }

    txd(textdecoration){
        this.e.style.textDecoration = textdecoration
		return this
    }

    float(float){
        this.e.style.float = float
		return this
    }

    transform(transform){
        this.e.style.transform = transform
		return this
    }

    tsh(textshadow){
        this.e.style.textShadow = textshadow
		return this
    }

    shc(shadowcolor){        
		return this.c("transparent").tsh(`0 0 0 ${shadowcolor}`)
    }

    wsp(whitespace){
        this.e.style.whiteSpace = whitespace
		return this
    }

    tovf(textoverflow){
        this.e.style.textOverflow = textoverflow
		return this
    }

    ellipsis(){
        return this.ovf("hidden").wsp("nowrap").tovf("ellipsis")
    }

	scrollIntoView(param){
		this.e.scrollIntoView(param)
		return this
    }
    
    scrollcentersmooth(quick){        
        return this.scrollIntoView({block: "center", inline: "center", behavior: quick ? "auto" : "smooth"})
    }

    select(){
        this.e.select()
        return this
    }

    v(){
        return this.e.value
    }

    sv(value){
        this.e.value = value
        return this
    }

    html(content){
        this.e.innerHTML = content
        return this
    }

    focus(){
        this.e.focus()
        return this
    }

    op(opacity){
        this.e.style.opacity = "" + opacity
        return this
    }

    w(width){
        this.e.style.width = width + "px"
        return this
    }

    mw(width){
        this.e.style.minWidth = width + "px"
        return this
    }

    h(height){
        this.e.style.height = height + "px"
        return this
    }

    mh(height){
        this.e.style.minHeight = height + "px"
        return this
    }

    zi(zindex){
        this.e.style.zIndex = zindex
        return this
    }

    t(top){
        this.e.style.top = top + "px"
        return this
    }

    l(left){
        this.e.style.left = left + "px"
        return this
    }

    tl(vect){
        return this.t(vect.y).l(vect.x)
    }

    bc(color){
        this.e.style.backgroundColor = color
        return this
    }

    bimg(path){
        this.e.style.backgroundImage = `url(${path})`
        return this
    }

    c(color){
        this.e.style.color = color
        return this
    }

    ta(value){
        this.e.style.textAlign = value
        return this
    }

    border(style, width, radius, color){
        this.e.style.borderStyle = style
        if(arguments.length > 1) this.e.style.borderWidth = width + "px"
        if(arguments.length > 2) this.e.style.borderRadius = radius + "px"
        if(arguments.length > 3) this.e.style.borderColor = color
        return this
    }

    pad(value){
        this.e.style.padding = value + "px"
        return this
    }

    mar(value){
        this.e.style.margin = value + "px"
        return this
    }

    ml(value){
        this.e.style.marginLeft = value + "px"
        return this
    }

    mr(value){
        this.e.style.marginRight = value + "px"
        return this
    }

    mt(value){
        this.e.style.marginTop = value + "px"
        return this
    }

    mb(value){
        this.e.style.marginBottom = value + "px"
        return this
    }

    fs(value){
        this.e.style.fontSize = value + "px"
        return this
    }

    ff(value){
        this.e.style.fontFamily = value
        return this
    }

    fst(value){
        this.e.style.fontStyle = value
        return this
    }

    fw(value){
        this.e.style.fontWeight = value
        return this
    }

    disp(display){
        this.e.style.display = display
        return this
    }

    blink(){
        return this.ac("blink_me")
    }

    cp(){
        this.e.style.cursor = "pointer"
        return this
    }

    cm(){
        this.e.style.cursor = "move"
        return this
    }

    po(position){
        this.e.style.position = position
        return this
    }

    por(){
        return this.po("relative")
    }

    poa(){
        return this.po("absolute")
    }

    jc(justifycontent){
        this.e.style.justifyContent = justifycontent
        return this
    }

    ai(alignitems){
        this.e.style.alignItems = alignitems
        return this
    }

    fd(flexdirection){
        this.e.style.flexDirection = flexdirection
        return this
    }

    sa(key, value){
        this.e.setAttribute(key, value)
        return this
    }

    pl(padleft){
        this.e.style.paddingLeft = padleft + "px"
        return this
    }

    pr(padright){
        this.e.style.paddingRight = padright + "px"
        return this
    }

    a(...args){        
        for(let arg of args){            
            try{
                for(let arge of arg){
                    this.e.appendChild(arge.e)                            
                }
            }catch(e){                
                this.e.appendChild(arg.e)
            }
        }
        return this
    }

    ac(klass){
        this.e.classList.add(klass)
        return this
    }

    acc(cond, klass){
        if(cond) this.ac(klass)
        return this
    }

    rc(klass){
        this.e.classList.remove(klass)
        return this
    }

    ae(kind, handler){
        this.e.addEventListener(kind, handler)
        return this
    }

    ovf(overflow){
        this.e.style.overflow = overflow
        return this
    }

    bds(value){
        this.e.style.borderStyle = value
        return this
    }

    bdw(value){
        this.e.style.borderWidth = value + "px"
        return this
    }

    bdc(value){
        this.e.style.borderColor = value
        return this
    }

    bdr(value){
        this.e.style.borderRadius = value + "px"
        return this
    }

    get x(){                
        return this.html("")
    }

    curlyborder(borderradiusopt){
        let borderradius = borderradiusopt || 10
        return this.bds("solid").bdw(1).bdc("#777").bdr(borderradius)
    }
}

class Div_ extends e{
    constructor(){
        super("div")
    }
}
export function Div(){return new Div_()}

class Vect_{
    constructor(x, y){
        this.x = x
        this.y = y
    }

    s(s){
        return new Vect_(this.x * s, this.y * s)
    }

    m(v){
        return new Vect_(this.x - v.x, this.y - v.y)
    }

    p(v){
        return new Vect_(this.x + v.x, this.y + v.y)
    }

    l(){
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }
}

export function Vect(x, y){return new Vect_(x, y)}

export function getStyle(className) {
    let cssText = ""
    for(let si=0;si<document.styleSheets.length;si++){
        let classes = document.styleSheets[si].rules || document.styleSheets[0].cssRules
        for (let x = 0; x < classes.length; x++) {                            
            if (classes[x].selectorText == className) {
                cssText += classes[x].cssText || classes[x].style.cssText
            }         
        }
    }    
    return cssText
}

export function getelse(obj, key, defaultvalue){
    if(key in obj) return obj[key]
    return defaultvalue
}

export class LogItem{
    constructor(text){
        this.text = text
    }
}

export class Logger{
    constructor(props){
        this.items = []
        this.maxitems = props.maxitems || 50
        this.logref = props.logref
    }

    log(item){
        this.items.unshift(item)
        while(this.items.length > this.maxitems) this.items.pop()
        if(this.logref) if(this.logref.current) this.logref.current.value = this.text()
    }

    text(){
        return this.items.map((item)=>item.text).join("\n")
    }
}

// https://gist.github.com/gordonbrander/2230317
export function UID() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return 'id' + Math.random().toString(36).substr(2, 9)
}
