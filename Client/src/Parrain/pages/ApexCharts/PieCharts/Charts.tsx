import useChartColors from "Common/useChartColors";
import React from "react";
import ReactApexChart from "react-apexcharts";

// image
import small1 from "assets/images/small/img-1.jpg"
import small2 from "assets/images/small/img-2.jpg"
import small4 from "assets/images/small/img-4.jpg"
import small6 from "assets/images/small/img-6.jpg"

const SimplePie = ({ chartId, taskStatus = {} }: any) => {
  const chartColors = ['#FF5733', '#FFC300', '#36A2EB'];

  // Convert the tasksStatus object into an array of objects
  const statusArray = Object.keys(taskStatus).map((status) => ({
    status,
    numberOfTasks: taskStatus[status],
  }));

  // Extracting status labels and task numbers from the array
  const series = statusArray.map((item) => item.numberOfTasks);
  const labels = statusArray.map((item) => item.status);


  const options: any = {
    chart: {
      height: 350,
      type: 'pie',
    },
    labels: ["Todo","Doing","Done"],
    colors: chartColors,
    legend: {
      position: 'bottom'
    }
  };

  return (
    <React.Fragment>
      <ReactApexChart
        dir="ltr"
        options={options}
        series={series || []}
        id={chartId}
        className="apex-charts"
        height={350}
        type="pie"
      />
    </React.Fragment>

  );
};

const SimpleDonut = ({ chartId }: any) => {
  const chartColors = useChartColors(chartId);

  const series = [44, 55, 41, 17, 15];
  var options: any = {
    chart: {
      height: 350,
      type: 'donut',
    },
    colors: chartColors,
    legend: {
      position: 'bottom'
    },
  };

  return (
    <React.Fragment>
      <ReactApexChart
        dir="ltr"
        options={options}
        series={series || []}
        data-chart-colors='["bg-custom-500", "bg-orange-500", "bg-green-500", "bg-sky-500", "bg-yellow-500"]'
        id={chartId}
        className="apex-charts"
        height={350}
        type="donut"
      />
    </React.Fragment>
  );
};


const DonutUpdate = ({ chartId }: any) => {
  const chartColors = useChartColors(chartId);

  const series = [44, 55, 13, 33];
  var options: any = {
    chart: {
      width: 380,
      type: 'donut',
    },
    dataLabels: {
      enabled: false
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          show: false
        }
      }
    }],
    colors: chartColors,
    legend: {
      position: 'right',
      offsetY: 0,
      height: 230,
    }
  };

  return (
    <React.Fragment>
      <ReactApexChart
        dir="ltr"
        options={options}
        series={series || []}
        data-chart-colors='["bg-custom-400", "bg-orange-400", "bg-green-400", "bg-yellow-400"]'
        id={chartId}
        className="apex-charts"
        height={230}
        type="donut"
      />
    </React.Fragment>
  );
};

const MonochromePie = ({ chartId }: any) => {
  const chartColors = useChartColors(chartId);

  const series = [25, 15, 44, 55, 41, 17];
  var options: any = {
    chart: {
      height: 300,
      width: '100%',
      type: 'pie',
    },
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    plotOptions: {
      pie: {
        dataLabels: {
          offset: -5
        }
      }
    },
    dataLabels: {
      formatter(val: any, opts: any) {
        const name = opts.w.globals.labels[opts.seriesIndex]
        return [name, val.toFixed(1) + '%']
      }
    },
    theme: {
      monochrome: {
        enabled: true,
        color: chartColors[0] ?? "#3B82F6",
        shadeTo: 'light',
        shadeIntensity: 0.6
      }
    },
    legend: {
      show: false
    }
  };

  return (
    <React.Fragment>
      <ReactApexChart
        dir="ltr"
        options={options}
        series={series || []}
        data-chart-colors='["bg-custom-500"]'
        id={chartId}
        className="apex-charts"
        height={300}
        type="pie"
      />
    </React.Fragment>
  );
};

const GradientDonut = ({ chartId }: any) => {
  const chartColors = useChartColors(chartId);

  const series = [44, 55, 41, 17, 15];
  var options: any = {
    chart: {
      height: 280,
      type: 'donut',
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270
      }
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      type: 'gradient',
    },
    colors: chartColors,
    legend: {
      formatter: function (val: any, opts: any) {
        return val + " - " + opts.w.globals.series[opts.seriesIndex]
      },
      position: 'bottom'
    },
  };

  return (
    <React.Fragment>
      <ReactApexChart
        dir="ltr"
        options={options}
        series={series || []}
        data-chart-colors='["bg-custom-500", "bg-orange-500", "bg-green-500", "bg-yellow-500", "bg-purple-500"]'
        id={chartId}
        className="apex-charts"
        height={280}
        type="donut"
      />
    </React.Fragment>
  );
};

const SemiDonut = ({ chartId }: any) => {
  const chartColors = useChartColors(chartId);

  const series = [44, 55, 41, 17, 15];
  var options: any = {
    chart: {
      height: 280,
      type: 'donut'
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 90,
        offsetY: 5
      }
    },
    grid: {
      padding: {
        bottom: -80
      }
    },
    colors: chartColors,
    legend: {
      position: 'bottom'
    }
  };

  return (
    <React.Fragment>
      <ReactApexChart
        dir="ltr"
        options={options}
        series={series || []}
        data-chart-colors='["bg-custom-500", "bg-orange-500", "bg-green-500", "bg-yellow-500", "bg-purple-500"]'
        id={chartId}
        className="apex-charts"
        height={280}
        type="donut"
      />
    </React.Fragment>
  );
};

const PatternDonut = ({ chartId }: any) => {
  const chartColors = useChartColors(chartId);

  const series = [44, 55, 41, 17, 15];
  var options: any = {
    chart: {
      height: 350,
      type: 'donut',
      dropShadow: {
        enabled: true,
        color: '#111',
        top: -1,
        left: 3,
        blur: 3,
        opacity: 0.2
      }
    },
    stroke: {
      width: 0,
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              showAlways: true,
              show: true
            }
          }
        }
      }
    },
    labels: ["Comedy", "Action", "SciFi", "Drama", "Horror"],
    dataLabels: {
      dropShadow: {
        blur: 3,
        opacity: 0.8
      }
    },
    fill: {
      type: 'pattern',
      opacity: 1,
      pattern: {
        enabled: true,
        style: ['verticalLines', 'squares', 'horizontalLines', 'circles', 'slantedLines'],
      },
    },
    states: {
      hover: {
        filter: 'none'
      }
    },
    colors: chartColors,
    theme: {
      palette: 'palette2'
    },
    legend: {
      position: 'bottom'
    }
  };

  return (
    <React.Fragment>
      <ReactApexChart
        dir="ltr"
        options={options}
        series={series || []}
        data-chart-colors='["bg-custom-500", "bg-orange-500", "bg-green-500", "bg-yellow-500", "bg-purple-500"]'
        id={chartId}
        className="apex-charts"
        height={350}
        type="donut"
      />
    </React.Fragment>
  );
};

const ImagePie = ({ chartId }: any) => {
  const chartColors = useChartColors(chartId);

  const series = [44, 33, 54, 45];
  var options: any = {
    chart: {
      height: 350,
      type: 'pie',
    },
    colors: chartColors,
    fill: {
      type: 'image',
      opacity: 0.85,
      image: {
        src: [small1, small2, small4, small6],
        width: 25,
        imagedHeight: 25
      },
    },
    stroke: {
      width: 4
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#111']
      },
      background: {
        enabled: true,
        foreColor: '#fff',
        borderWidth: 0
      }
    },
    legend: {
      position: 'bottom'
    }
  };

  return (
    <React.Fragment>
      <ReactApexChart
        dir="ltr"
        options={options}
        series={series || []}
        data-chart-colors='["bg-custom-500", "bg-orange-500", "bg-green-500", "bg-yellow-500", "bg-purple-500"]'
        id={chartId}
        className="apex-charts"
        height={350}
        type="pie"
      />
    </React.Fragment>
  );
};

export { SimplePie, SimpleDonut, DonutUpdate, MonochromePie, GradientDonut, SemiDonut, PatternDonut, ImagePie };