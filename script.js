import data from './nycdata.json' assert { type: 'json' }

document.addEventListener('DOMContentLoaded', function () {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const menu = document.querySelector('.menu');

    // Tambah event listener pada hamburgerMenu untuk toggle menu
    hamburgerMenu.addEventListener('click', function () {
        menu.classList.toggle('active');
    });

    // Tambah event listener pada setiap tautan di dalam menu
    const menuLinks = document.querySelectorAll('.menu a');
    menuLinks.forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });

                // Tutup menu hamburger setelah tautan diklik
                menu.classList.remove('active');
            }
        });
    });

    // Tambah event listener untuk menutup menu saat mengklik di luar menu
    document.addEventListener('click', function (event) {
        const targetElement = event.target;

        // Periksa apakah yang diklik bukan bagian dari menu atau hamburgerMenu
        if (!targetElement.closest('.menu') && !targetElement.closest('.hamburger-menu')) {
            // Tutup menu jika sedang terbuka
            if (menu.classList.contains('active')) {
                menu.classList.remove('active');
            }
        }
    });
});
  //paralax
  let text = document.getElementById('text');
  let awankiri = document.getElementById('awankiri');
  let awankanan = document.getElementById('awankanan');
  let kotakiri = document.getElementById('kotakiri');
  let kotakanan = document.getElementById('kotakanan');
  
  window.addEventListener('scroll', () => {
    let value = window.scrollY;
  
    // Menghitung margin-top baru untuk elemen text, dibatasi hingga maksimal 350px
    let newMarginTop = Math.min(50 + value * 1.2, 350);
    text.style.marginTop = newMarginTop + 'px';
    
    // Mengatur posisi elemen awankiri
    awankiri.style.top = value * -1.5 + 'px';
    awankiri.style.left = value * -2.5 + 'px';
  
    // Mengatur posisi elemen awankanan
    awankanan.style.top = value * -1.5 + 'px';
    awankanan.style.left = value * 2.5 + 'px';
  
    // Mengatur posisi elemen kotakiri
    kotakiri.style.left = value * -2.5 + 'px';
  
    // Mengatur posisi elemen kotakanan
    kotakanan.style.left = value * 2.5 + 'px';
  });
  
    $(document).ready(function() {
      // Load JSON file
      $.getJSON("nycdata.json", function(data) {
          // Initialize DataTable
          var dataTable = $('#dataTable').DataTable();
  
          // Variables for Chart.js
          var neighborhoods = [];
          var salePrices = [];
          var grossSquareFeet = [];
  
          // Populate DataTable and prepare data for Chart.js
          $.each(data, function(key, item) {
              dataTable.row.add([
                  item.BOROUGH,
                  item.NEIGHBORHOOD,
                  item.BUILDING_CLASS_CATEGORY,
                  item.TAX_CLASS_AT_PRESENT,
                  item.BUILDING_CLASS_AT_PRESENT,
                  item.LAND_SQUARE_FEET,
                  item.GROSS_SQUARE_FEET,
                  item.YEAR_BUILT,
                  item.TAX_CLASS_AT_TIME_OF_SALE,
                  item.BUILDING_CLASS_AT_TIME_OF_SALE,
                  item.SALE_PRICE,
                  item.SALE_DATE
              ]).draw();
  
              neighborhoods.push(item.NEIGHBORHOOD);
              salePrices.push(item.SALE_PRICE);
              grossSquareFeet.push(item.GROSS_SQUARE_FEET);
          });
  
          fetch('csvjson.json')
          .then(response => response.json())
          .then(data => {
              const salePrices = Object.values(data).map(item => item.SALE_PRICE);
              const neighborhoods = Object.values(data).map(item => item.NEIGHBORHOOD);
              const uniqueNeighborhoods = [...new Set(neighborhoods)];
      
              // Bar Chart: Total Sale Prices by Neighborhood
              const totalSalePricesByNeighborhood = uniqueNeighborhoods.map(neighborhood => {
                  return salePrices.reduce((total, price, index) => {
                      if (neighborhoods[index] === neighborhood) {
                          return total + price;
                      }
                      return total;
                  }, 0);
              });
      
              const barCtx = document.getElementById('barChart').getContext('2d');
              new Chart(barCtx, {
                  type: 'bar',
                  data: {
                      labels: uniqueNeighborhoods,
                      datasets: [{
                          label: 'Total Sale Prices',
                          data: totalSalePricesByNeighborhood,
                          backgroundColor: 'rgba(75, 192, 192, 0.2)',
                          borderColor: 'rgba(75, 192, 192, 1)',
                          borderWidth: 1
                      }]
                  },
                  options: {
                      scales: {
                          y: {
                              beginAtZero: true
                          }
                      }
                  }
              });
      
              // Pie Chart: Number of Sales by Neighborhood
              const salesCountByNeighborhood = uniqueNeighborhoods.map(neighborhood => {
                  return neighborhoods.filter(n => n === neighborhood).length;
              });
      
              const pieCtx = document.getElementById('pieChart').getContext('2d');
              new Chart(pieCtx, {
                  type: 'pie',
                  data: {
                      labels: uniqueNeighborhoods,
                      datasets: [{
                          label: 'Number of Sales',
                          data: salesCountByNeighborhood,
                          backgroundColor: uniqueNeighborhoods.map((_, i) => `hsl(${i * 60}, 70%, 50%)`),
                          borderColor: '#fff',
                          borderWidth: 1

                      }]
                  }
              });
      
              document.querySelectorAll('.glossary-item header').forEach(header => {
                header.addEventListener('click', () => {
                    const content = header.nextElementSibling;
                    content.style.display = content.style.display === 'none' ? 'block' : 'none';
                });
            });

            let lineAreaChart
            let horizontalBarChart
            let pieChart
            let monthlySalesChart
            
            const boroughNames = {
              1: 'Manhattan',
              2: 'Bronx',
              3: 'Brooklyn',
              4: 'Queens',
              5: 'Staten Island',
            }
            
            function updateCharts() {
              const selectedBoroughs = Array.from(
                document.querySelectorAll('#boroughFilter input:checked')
              ).map((checkbox) => checkbox.value)
              const selectedBuildingClasses = Array.from(
                document.querySelectorAll('#buildingClassFilter input:checked')
              ).map((checkbox) => checkbox.value)
            
              const filteredData = data.filter(
                (item) =>
                  (selectedBoroughs.length === 0 ||
                    selectedBoroughs.includes(boroughNames[item.BOROUGH])) &&
                  (selectedBuildingClasses.length === 0 ||
                    selectedBuildingClasses.includes(item.BUILDING_CLASS_CATEGORY))
              )
            
              // Update total sales, average sale price, average building area, average land area
              const totalPenjualan = filteredData.reduce(
                (sum, item) => sum + item.SALE_PRICE,
                0
              )
              document.getElementById('totalPenjualan').textContent =
                totalPenjualan.toLocaleString( )
            
              const rataRataHargaPenjualan = totalPenjualan / filteredData.length
              document.getElementById('rataRataHargaPenjualan').textContent =
                rataRataHargaPenjualan.toLocaleString()
            
              const totalLuasBangunan = filteredData.reduce(
                (sum, item) => sum + item['GROSS_SQUARE_FEET'],
                0
              )
              const rataRataLuasBangunan = totalLuasBangunan / filteredData.length
              document.getElementById('rataRataLuasBangunan').textContent =
                rataRataLuasBangunan.toLocaleString()
            
              const totalLuasTanah = filteredData.reduce(
                (sum, item) => sum + item.LAND_SQUARE_FEET,
                0
              )
              const rataRataLuasTanah = totalLuasTanah / filteredData.length
              document.getElementById('rataRataLuasTanah').textContent =
                rataRataLuasTanah.toLocaleString()
            
              // Update line chart for average land and building area over time
              const boroughs = [...new Set(filteredData.map((item) => boroughNames[item.BOROUGH]))]
              lineAreaChart.data.labels = boroughs
              lineAreaChart.data.datasets[0].data = boroughs.map(
                (borough) =>
                  filteredData
                    .filter((item) => boroughNames[item.BOROUGH] === borough)
                    .reduce((sum, item) => sum + item.LAND_SQUARE_FEET, 0) /
                  filteredData.filter((item) => boroughNames[item.BOROUGH] === borough).length
              )
              lineAreaChart.data.datasets[1].data = boroughs.map(
                (borough) =>
                  filteredData
                    .filter((item) => boroughNames[item.BOROUGH] === borough)
                    .reduce((sum, item) => sum + item['GROSS_SQUARE_FEET'], 0) /
                  filteredData.filter((item) => boroughNames[item.BOROUGH] === borough).length
              )
              lineAreaChart.update()
            
              // Update horizontal bar chart for land and building area by building type
              const buildingTypes = [
                ...new Set(filteredData.map((item) => item.BUILDING_CLASS_CATEGORY)),
              ]
              horizontalBarChart.data.labels = buildingTypes
              horizontalBarChart.data.datasets[0].data = buildingTypes.map(
                (type) =>
                  filteredData
                    .filter((item) => item.BUILDING_CLASS_CATEGORY === type)
                    .reduce((sum, item) => sum + item.LAND_SQUARE_FEET, 0) /
                  filteredData.filter((item) => item.BUILDING_CLASS_CATEGORY === type).length
              )
              horizontalBarChart.data.datasets[1].data = buildingTypes.map(
                (type) =>
                  filteredData
                    .filter((item) => item.BUILDING_CLASS_CATEGORY === type)
                    .reduce((sum, item) => sum + item['GROSS_SQUARE_FEET'], 0) /
                  filteredData.filter((item) => item.BUILDING_CLASS_CATEGORY === type).length
              )
              horizontalBarChart.update()
            
              // Update pie chart for sales distribution by borough
              const salesByBorough = boroughs.map(
                (borough) =>
                  filteredData.filter((item) => boroughNames[item.BOROUGH] === borough).length
              )
              pieChart.data.labels = boroughs
              pieChart.data.datasets[0].data = salesByBorough
              pieChart.update()
            
              // Update monthly sales chart
              const monthlySales = new Array(12).fill(0)
              filteredData.forEach((item) => {
                const saleDate = new Date(item['SALE_DATE'])
                const month = saleDate.getMonth()
                monthlySales[month]++
              })
              monthlySalesChart.data.labels = [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ]
              monthlySalesChart.data.datasets[0].data = monthlySales
              monthlySalesChart.update()
            }
            
            function initializeFilters() {
              const boroughFilter = document.getElementById('boroughFilter')
              const buildingClassFilter = document.getElementById('buildingClassFilter')
            
              const boroughs = [...new Set(data.map((item) => item.BOROUGH))]
              boroughs.forEach((borough) => {
                const label = document.createElement('label')
                label.innerHTML = `<input type="checkbox" value="${boroughNames[borough]}" /> ${
                  boroughNames[borough]
                }`
                boroughFilter.appendChild(label)
              })
            
              const buildingClasses = [
                ...new Set(data.map((item) => item.BUILDING_CLASS_CATEGORY)),
              ]
              buildingClasses.forEach((buildingClass) => {
                const label = document.createElement('label')
                label.innerHTML = `<input type="checkbox" value="${buildingClass}" /> ${buildingClass}`
                buildingClassFilter.appendChild(label)
              })
            }
            
            function initializeCharts() {
              const ctxLineArea = document.getElementById('lineAreaChart').getContext('2d')
              const ctxHorizontalBar = document.getElementById(
                'horizontalBarChart'
              ).getContext('2d')
              const ctxPie = document.getElementById('pieChart').getContext('2d')
              const ctxMonthlySales = document.getElementById(
                'monthlySalesChart'
              ).getContext('2d')
            
              lineAreaChart = new Chart(ctxLineArea, {
                type: 'line',
                data: {
                  labels: [],
                  datasets: [
                    {
                      label: 'Rata-Rata Luas Tanah',
                      borderColor: 'rgba(75, 192, 192, 1)',
                      backgroundColor: 'rgba(75, 192, 192, 0.2)',
                      data: [],
                    },
                    {
                      label: 'Rata-Rata Luas Bangunan',
                      borderColor: 'rgba(153, 102, 255, 1)',
                      backgroundColor: 'rgba(153, 102, 255, 0.2)',
                      data: [],
                    },
                  ],
                },
              })
            
              horizontalBarChart = new Chart(ctxHorizontalBar, {
                type: 'bar',
                data: {
                  labels: [],
                  datasets: [
                    {
                      label: 'Luas Tanah',
                      backgroundColor: 'rgba(75, 192, 192, 0.2)',
                      borderColor: 'rgba(75, 192, 192, 1)',
                      data: [],
                    },
                    {
                      label: 'Luas Bangunan',
                      backgroundColor: 'rgba(153, 102, 255, 0.2)',
                      borderColor: 'rgba(153, 102, 255, 1)',
                      data: [],
                    },
                  ],
                },
              })
            
              pieChart = new Chart(ctxPie, {
                type: 'pie',
                data: {
                  labels: [],
                  datasets: [
                    {
                      label: 'Distribusi Penjualan',
                      backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                      ],
                      borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                      ],
                      data: [],
                    },
                  ],
                },
              })
            
              monthlySalesChart = new Chart(ctxMonthlySales, {
                type: 'line',
                data: {
                  labels: [],
                  datasets: [
                    {
                      label: 'Penjualan Bulanan',
                      borderColor: 'rgba(255, 159, 64, 1)',
                      backgroundColor: 'rgba(255, 159, 64, 0.2)',
                      data: [],
                    },
                  ],
                },
              })
            }
            
            document.addEventListener('DOMContentLoaded', () => {
              initializeFilters()
              initializeCharts()
              updateCharts()
            
              document
                .getElementById('boroughFilter')
                .addEventListener('change', updateCharts)
              document
                .getElementById('buildingClassFilter')
                .addEventListener('change', updateCharts)
            })
            
        // Tangkap peristiwa pengiriman formulir
        document.querySelector('form').addEventListener('submit', function(e) {
            e.preventDefault(); // Mencegah perilaku bawaan pengiriman formulir
    
            // Lakukan pengiriman formulir menggunakan AJAX atau caranya
            // Contoh: dengan menggunakan Fetch API
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: new FormData(this)
            })
            .then(response => {
                if (response.ok) {
                    // Pesan berhasil terkirim
                    alert('Message Sent Successfully');
                    redirectToHome(); // Arahkan kembali ke bagian "Home"
                } else {
                    // Gagal mengirim pesan
                    alert('Failed to send message');
                }
            })
            .catch(error => {
                console.error('Error sending message:', error);
                alert('An error occurred while sending the message');
            });
        });

  });
      })})
