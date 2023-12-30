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


//cvher



 