class Layer{
    constructor(svg,root){
        this.root = root;
        this.svg = svg;
    }
    attach(args){
        for(let i in args){
            this[i] = args[i];
        }
        this.tool.bind(this.svg);
        this.root.addEventListener(this.tool.events[0],this.tool.frameCommand);
    }
    onObject(){
        return true;
    }
    objects(){
        return [];
    }
}

class Tool{}
class HoverTool extends Tool{}

