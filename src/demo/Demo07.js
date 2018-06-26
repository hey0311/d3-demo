import React, {Component} from 'react';
import * as d3 from 'd3';
import './Demo07.css'

//力向导图
class Demo07 extends Component {
    componentDidMount() {
        var city_name = [ "北京" , "上海" , "广州" , "深圳" , "香港"  ];
        // 城市人口的来源，如
        //				北京		上海
        //	北京		1000		3045
        //	上海		3214		2000
        // 表示北京市的人口有1000个人来自本地，有3045人是来自上海的移民，总人口为 1000 + 3045
        // 上海市的人口有2000个人来自本地，有3214人是来自北京的移民，总人口为 3214 + 2000
        var population = [
            [ 1000,  3045　 , 4567　, 1234 , 3714 ],
            [ 3214,  2000　 , 2060　, 124  , 3234 ],
            [ 8761,  6545　 , 3000　, 8045 , 647  ],
            [ 3211,  1067  , 3214 , 4000  , 1006 ],
            [ 2146,  1034　 , 6745 , 4764  , 5000 ]
        ];
        //2.转换数据，并输出转换后的数据
        var chord_layout = d3.layout.chord()
            .padding(0.03)		//节点之间的间隔
            .sortSubgroups(d3.descending)	//排序
            .matrix(population);	//输入矩阵
        var groups = chord_layout.groups();
        var chords = chord_layout.chords();
        console.log( groups );
        console.log( chords );
        //3.SVG，弦图，颜色函数的定义
        var width  = 600;
        var height = 600;
        var innerRadius = width/2 * 0.7;
        var outerRadius = innerRadius * 1.1;
        var color20 = d3.scale.category20();

        var svg = d3.select("#demo01").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

        //4.绘制节点（即分组，有多少个城市画多少个弧形），及绘制城市名称
        var outer_arc =  d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        var g_outer = svg.append("g");

        g_outer.selectAll("path")
            .data(groups)
            .enter()
            .append("path")
            .style("fill", function(d) { return color20(d.index); })
            .style("stroke", function(d) { return color20(d.index); })
            .attr("d", outer_arc );

        g_outer.selectAll("text")
            .data(groups)
            .enter()
            .append("text")
            .each( function(d,i) {
                d.angle = (d.startAngle + d.endAngle) / 2;
                d.name = city_name[i];
            })
            .attr("dy",".35em")
            .attr("transform", function(d){
                return "rotate(" + ( d.angle * 180 / Math.PI ) + ")" +
                    "translate(0,"+ -1.0*(outerRadius+10) +")" +
                    ( ( d.angle > Math.PI*3/4 && d.angle < Math.PI*5/4 ) ? "rotate(180)" : "");
            })
            .text(function(d){
                return d.name;
            });


        //5.绘制内部弦（即所有城市人口的来源，即有5*5=25条弧）
        var inner_chord =  d3.svg.chord()
            .radius(innerRadius);

        svg.append("g")
            .attr("class", "chord")
            .selectAll("path")
            .data(chords)
            .enter()
            .append("path")
            .attr("d", inner_chord )
            .style("fill", function(d) { return color20(d.source.index); })
            .style("opacity", 1)
            .on("mouseover",function(d,i){
                d3.select(this)
                    .style("fill","yellow");
            })
            .on("mouseout",function(d,i) {
                d3.select(this)
                    .transition()
                    .duration(1000)
                    .style("fill",color20(d.source.index));
            });


    }

    render = () => {
        return (
            <div id="demo01" className="d3-container">
                <p>和弦图</p>
            </div>
        );
    }
}

export default Demo07;
