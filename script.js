let educationURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
let countyURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

let countyData
let educationData

let svg = d3.select('#canvas')
let tooltip = d3.select('#tooltip')

let drawMap = () => {

    svg.selectAll('path')
             .data(countyData)
             .enter()
             .append('path')
             .attr('d', d3.geoPath())
             .attr('class', 'county')
             .attr('fill', (d) => {
                let id = d['id']
                let county = educationData.find((x) => {
                    return x['fips'] === id
                })
                let percentage = county['bachelorsOrHigher']
                if(percentage < 15){
                    return 'lightgreen'
                }else if(percentage <=30){
                    return 'limegreen'
                }else if(percentage <= 45){
                    return 'green'
                }else{
                    return 'darkgreen'
                }
             })
             .attr('data-fips', (d)=> d['id'])
             .attr('data-education', (d)=>{
                let id = d['id']
                let county = educationData.find((x) => {
                    return x['fips'] === id
                })
                let percentage = county['bachelorsOrHigher']
                return percentage
             })
             .on('mouseover', (d) => {
                tooltip.transition()
                        .style('visibility', 'visible')

                let id = d['id']
                let county = educationData.find((x) => {
                    return x['fips'] === id
             })

             tooltip.text(county['area_name'] + ', ' + county['state'] + ': ' + county['bachelorsOrHigher'] + '%')
             tooltip.attr('data-education', county['bachelorsOrHigher'])
            })
            .on('mouseout', (d) => {
                tooltip.transition()
                        .style('visibility', 'hidden')
            })

}

d3.json(countyURL).then(
    (data, error) => {
        if(error){
            console.log(error)
        } else{
            countyData = topojson.feature(data, data.objects.counties).features
            console.log(countyData)

            d3.json(educationURL).then(
                (data, error) => {
                    if(error){
                        console.log(error)
                    } else {
                        educationData = data
                        console.log(educationData)
                        drawMap()
                    }
                }
            )
        }
    }
)