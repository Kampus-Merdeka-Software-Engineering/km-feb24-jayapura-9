document.addEventListener('DOMContentLoaded', function () {
    const menuLinks = document.querySelectorAll('.menu a');
    menuLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
        });
      });
    });
  
    let text = document.getElementById('text');
    let awankiri = document.getElementById('awankiri');
    let awankanan = document.getElementById('awankanan');
    let kotakiri = document.getElementById('kotakiri');
    let kotakanan = document.getElementById('kotakanan');
    
    window.addEventListener('scroll', () => {
      let value = window.scrollY;
    
      text.style.marginTop = value * 1.2 + 'px';
      awankiri.style.top = value * -1.5 + 'px';
      awankiri.style.left = value * -2.5 + 'px';
      awankanan.style.top = value * -1.5 + 'px';
      awankanan.style.left = value * 2.5 + 'px';
      kotakiri.style.left = value * -2.5 + 'px';
      kotakanan.style.left = value * 2.5 + 'px';
    });
    $(document).ready(function() {
      // Load JSON file
      $.getJSON("csvjson.json", function(data) {
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
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const menu = document.querySelector('.menu');
    
    hamburgerMenu.addEventListener('click', () => {
      menu.classList.toggle('show');
    });
  });
      })})})
