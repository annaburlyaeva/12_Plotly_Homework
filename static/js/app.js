function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var sampleMetadataPanel = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    sampleMetadataPanel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    d3.json("metadata/"+sample).then((sampleMetaData)=>{
      console.log(sampleMetaData);
      Object.entries(sampleMetaData).forEach(([key, value])=>{
        sampleMetadataPanel.append('p').text(`${key}: ${value}`)
      });
    });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots  
  // HINT: You will need to use slice() to grab the top 10 sample_values,
  // otu_ids, and labels (10 each).
  d3.json("samples/"+sample).then((sampleData)=>{
    
    // @TODO: Build a Bubble Chart using the sample data
    var bubbleChartTrace = {
      x: sampleData['otu_ids'],
      y: sampleData['sample_values'],
      mode: 'markers',
      type: 'scatter',
      text: sampleData[`otu_labels`],
      marker: {
        color: sampleData['otu_ids'],
        opacity:0.5,
        size:sampleData['sample_values']
      }
    };

    var bubbleChartData = [bubbleChartTrace];

    var bubbleChartLayout ={
      title:`Sample ${sample} (Bubble Chart)`,
      xaxis:{title:'otu ids'},
      yaxis:{title:'sample values'}
    };

    Plotly.newPlot('bubble', bubbleChartData, bubbleChartLayout);

  // @TODO: Build a Pie Chart
    var pieChartData=[{
      "labels":sampleData['otu_ids'].slice(0,10),
      "values":sampleData['sample_values'].slice(0,10),
      "type": 'pie',
      "hovertext":sampleData['otu_labels']
    }]
    
    var pieChartLayout = {title:`Sample ${sample} (Pie Chart)`};

    Plotly.newPlot('pie', pieChartData, pieChartLayout);

  });
  
}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

