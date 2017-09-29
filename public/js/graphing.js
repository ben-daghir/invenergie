window.onload = function () {
	var chart = new CanvasJS.Chart("chartContainer",
	{
		animationEnabled: true,
      	theme: "theme2",
		title:{
			text: "Multi Series Spline Chart - Hide / Unhide via Legend"
		},
      	axisY:[{
          lineColor: "#4F81BC",
          tickColor: "#4F81BC",
          labelFontColor: "#4F81BC",
          titleFontColor: "#4F81BC",
          lineThickness: 2,
      	},
        {
          lineColor: "#C0504E",
          tickColor: "#C0504E",
          labelFontColor: "#C0504E",
          titleFontColor: "#C0504E",
          lineThickness: 2,

      	}],
		data: [
		{
			type: "spline", //change type to bar, line, area, pie, etc
			showInLegend: true,
			dataPoints: [
				{ x: 0.00, y: 0 },
			]
			},
			{
			type: "spline",
                        axisYIndex: 1,
			showInLegend: true,
			dataPoints: [
				{ x: 10, y: 201 },
				{ x: 20, y: 404},
				{ x: 30, y: 305 },
				{ x: 40, y: 405 },
				{ x: 50, y: 905 },
				{ x: 60, y: 508 },
				{ x: 70, y: 108 },
				{ x: 80, y: 300 },
				{ x: 90, y: 101}
			]
			}
		],
		legend: {
			cursor: "pointer",
			itemclick: function (e) {
				if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
					e.dataSeries.visible = false;
				} else {
					e.dataSeries.visible = true;
			}
			chart.render();
			}
		}
	});

	chart.render();
}
