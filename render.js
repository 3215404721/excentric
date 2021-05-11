window.onload = function(){
const request = new XMLHttpRequest();
request.open('get','https://vega.github.io/vega-lite/examples/data/cars.json');
request.send(null);
request.onload = function(){
    console.log("/////");
    const rawData = JSON.parse(this.responseText);

    const position = [];

    const g = d3.select("#svg").append('g').attr("transform",'translate(50,50)');

    const yScale = d3.scaleLinear()
            .domain([0,250])
            .range([400, 0]);

    const xScale = d3.scaleLinear()
        .domain([0, 50])
        .range([0, 400]);

    const yAxis = d3.axisLeft(yScale).ticks(10);
    g.append('g').call(yAxis).selectAll('.tick').append('line')
        .attr('x2','400')
        .attr('stroke','#aaa5a6');

    const xAxis = d3.axisBottom(xScale).ticks(10);
    g.append('g').call(xAxis).attr('transform','translate(0,400)').selectAll('.tick').append('line')
        .attr('y2','-400')
        .attr('stroke','#aaa5a6');

    console.log("||||||");

    const color = function(d){
        switch(d){
            case 'USA':
                return '#be4757';
            case 'Japan':
                return '#e47012';
            case 'Europe':
                return '#373c85';
        }
    }

    const p = g.append('g').attr('id','points')
        .selectAll('.point')
        .data(rawData)
        .enter()
        .append('circle')
        .attr('class', 'point')
        .attr('fill', d => color(d.Origin))
        .attr("cy", (d, i) => yScale(d['Horsepower']))
        .attr('cx', d => xScale(d['Miles_per_Gallon']))
        .attr('r',4)
        .attr('name',d => d['Name']);

    class TooltipTool{
        constructor(args){    
            this.frameCommand = args['frameCommand'];
            this.events = ['mousemove'];      
        }
        bind(root){
            this.labels = [];
            this.svg = root.appendChild(document.createElement("g"));
            this.svg.setAttribute('id','circle');
            return this;
        }
        update(x,y){
            /*
            console.log(x,y);
            this.svg.innerHTML = '';
            let circle = document.createElement('circle');
            circle.setAttribute('r',100);
            circle.setAttribute('cx',x);
            circle.setAttribute('cy',y);
            circle.setAttribute('fill','#0edb3b');
            let group = document.createElement('g');
            group.appendChild(circle);
            group.setAttribute('id','circle');
            this.labels.forEach((element,i) => {
                let label = document.createElement('text');
                label.setAttribute('text',element);
                label.setAttribute('x',x+20);
                label.setAttribute('y',y+20*i);
                group.appendChild(label);
            })
            this.svg.appendChild(group);*/

            if(this.c){
                this.c.remove();
            }
            if(this.l){
                this.l.remove();
            }

            this.c = g.append('circle').attr('r',10)
                .attr('cy',y)
                .attr('cx',x)
                .attr('fill','#0edb3b');

            this.l = g.selectAll('.text')
                .data(this.labels)
                .enter()
                .append('text')
                .attr('class','text')
                .attr('x',d => x+10)
                .attr('y',(d,i) => y+i*20)
                .text(d => d);
        }
    }
    
    const tooltipLayer = new Layer(svg.firstChild,document.getElementById('points'));
    
    const updateExcentricLabel = function(event){
        let x = event.clientX-55;
        let y = event.clientY-55;
        position[0] = x;
        position[1] = y;
        tooltipLayer.tool.labels = new Array();
        //console.log(typeof(this.childNodes.length));
        for(let i = 0;i < this.children.length;i++){
            let element = this.children[i];
            if((element.getAttribute('cx')-x)*(element.getAttribute('cx')-x)+(element.getAttribute('cy')-y)*(element.getAttribute('cy')-y)<100){
                tooltipLayer.tool.labels.push(element.getAttribute('name'));
                //console.log(element.getAttribute('name'));
            }
        }
        tooltipLayer.tool.update(x,y);
    };
    
    tooltipLayer.attach({
        tool: new TooltipTool({
            frameCommand: updateExcentricLabel
        })
    });
        

}
}