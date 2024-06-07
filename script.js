document.addEventListener('DOMContentLoaded', function () {
  const hamburgerMenu = document.querySelector('.hamburger-menu')
  const menu = document.querySelector('.menu')

  // Tambah event listener pada hamburgerMenu untuk toggle menu
  hamburgerMenu.addEventListener('click', function () {
    menu.classList.toggle('active')
  })

  // Tambah event listener pada setiap tautan di dalam menu
  const menuLinks = document.querySelectorAll('.menu a')
  menuLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault()

      const targetId = this.getAttribute('href')
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
        })

        // Tutup menu hamburger setelah tautan diklik
        menu.classList.remove('active')
      }
    })
  })

  // Tambah event listener untuk menutup menu saat mengklik di luar menu
  document.addEventListener('click', function (event) {
    const targetElement = event.target

    // Periksa apakah yang diklik bukan bagian dari menu atau hamburgerMenu
    if (
      !targetElement.closest('.menu') &&
      !targetElement.closest('.hamburger-menu')
    ) {
      // Tutup menu jika sedang terbuka
      if (menu.classList.contains('active')) {
        menu.classList.remove('active')
      }
    }
  })

  // Tambah event listener untuk glossary
  const glossaryItems = document.querySelectorAll('.glossary-item')
  glossaryItems.forEach(function (item) {
    const header = item.querySelector('header')
    const content = item.querySelector('.content')

    header.addEventListener('click', function () {
      content.classList.toggle('active')
    })
  })
})

window.addEventListener('scroll', () => {
  //paralax
  let text = document.getElementById('text')
  let awankiri = document.getElementById('awankiri')
  let awankanan = document.getElementById('awankanan')
  let kotakiri = document.getElementById('kotakiri')
  let kotakanan = document.getElementById('kotakanan')

  let value = window.scrollY

  // Menghitung margin-top baru untuk elemen text, dibatasi hingga maksimal 350px
  let newMarginTop = Math.min(50 + value * 1.2, 350)
  text.style.marginTop = newMarginTop + 'px'

  // Mengatur posisi elemen awankiri
  awankiri.style.top = value * -1.5 + 'px'
  awankiri.style.left = value * -2.5 + 'px'

  // Mengatur posisi elemen awankanan
  awankanan.style.top = value * -1.5 + 'px'
  awankanan.style.left = value * 2.5 + 'px'

  // Mengatur posisi elemen kotakiri
  kotakiri.style.left = value * -2.5 + 'px'

  // Mengatur posisi elemen kotakanan
  kotakanan.style.left = value * 2.5 + 'px'
})

$(document).ready(function () {
  // Load JSON file
  $.getJSON('nycdata.json', function (data) {
    // Initialize DataTable
    var dataTable = $('#dataTable').DataTable()

    // Variables for Chart.js
    var neighborhoods = []
    var salePrices = []
    var grossSquareFeet = []

    // Populate DataTable and prepare data for Chart.js
    $.each(data, function (key, item) {
      dataTable.row
        .add([
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
          item.SALE_DATE,
        ])
        .draw()

      neighborhoods.push(item.NEIGHBORHOOD)
      salePrices.push(item.SALE_PRICE)
      grossSquareFeet.push(item.GROSS_SQUARE_FEET)
    })
  })
})
