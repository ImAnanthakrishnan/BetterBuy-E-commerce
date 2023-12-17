var sidebarOpen = false;
var sidebar = document.getElementById("sidebar");

function openSidebar(){
    if(!sidebarOpen){
        sidebar.classList.add("sidebar-responsive");
        sidebarOpen=true;
    }
}

function closeSidebar(){
    if(sidebarOpen){
        sidebar.classList.remove("sidebar-responsive");
        sidebarOpen=false;
    }
}

/*var filterOpen = false;
var filter = document.getElementById("sidebar");

function openfilter(){
    if(!filterOpen){
        filter.classList.add("filter-responsive");
        filterOpen=true;
        filter.style.display = "none";
    }
}

function closefilter(){
    if(filterOpen){
        filter.classList.remove("filter-responsive");
        filterOpen=false;
       
    }
}*/

function openFilter() {
  var sidebar = document.getElementById('sidebar');
  sidebar.style.display = 'block';
}

function closeSidebar() {
  var sidebar = document.getElementById('sidebar');
  sidebar.style.display = 'none';
  
}

function closeSidebar1() {
  var sidebar = document.getElementById('sidebar');
  sidebar.style.display = 'none';
}


function uncheckOutOfStock() {
  document.getElementById('stock1').checked = false;
}

function uncheckInStock() {
  document.getElementById('stock').checked = false;
}




//validation




//charts
var barChartOptions = {
    series: [{
    data: [10,8,6,4,2]
  }],
    chart: {
    type: 'bar',
    height: 350,
    toolbar:{
        show:false
    }
  },
  colors:[
    "#246dec",
    "#cc3c43",
    "#367952",
    "#f5b74f",
    "#4f35a1"
  ],
  plotOptions: {
    bar: {
        distributed:true,
      borderRadius: 4,
      horizontal: false,
      columnWidth:'40%'
    }
  },
  dataLabels: {
    enabled: false
  },
  legend:{
    show:false
  },
  xaxis: {
    categories: ['Fruits','Vegetables','Meat','Bread','Drinks'
    ],
  },
  yaxis:{
    title:{
        text:"Count"
    }
  }
  };

  var barChart = new ApexCharts(document.querySelector("#bar-chart"), barChartOptions);
  barChart.render();

//cvher
  var areaChartOptions = {
    series: [{
    name: 'Purchase Orders',

    data: [31,40,28,51,42,109,100]
  }, {
    name: 'Sales Orders',

    data: [11,32,45,32,34,52,41]
  }],
    chart: {
    height: 350,
    type: 'area',
    toolbar:{
        show:false
    }
  },
  colors:["#4f35a1","#246dec"],
  dataLabels:{
    enabled:false
  },
  stroke: {
    curve: 'smooth'
  },
 
  labels: ["Sept","Oct","Nov","Dec","Jan","Feb","March"],
  markers: {
    size: 0
  },
  yaxis: [
    {
      title: {
        text: 'Purchase Orders',
      },
    },
    {
      opposite: true,
      title: {
        text: 'Sales Orders',
      },
    },
  ],
  tooltip: {
    shared: true,
    intersect: false,
    y: {
      formatter: function (y) {
        if(typeof y !== "undefined") {
          return  y.toFixed(0) + " points";
        }
        return y;
      }
    }
  }
  };

  var areaChart = new ApexCharts(document.querySelector("#area-chart"), areaChartOptions);
  areaChart.render();


 