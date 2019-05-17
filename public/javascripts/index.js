document.addEventListener("DOMContentLoaded", function (event) {

  var sites_container = document.getElementById('sites');

  fetch('https://api.mercadolibre.com/sites')
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      var sites_label = document.createElement('label');
      sites_label.innerText = "Sitios";
      var sites = document.createElement('select');
      sites.name = "sites";
      sites.className = 'sites form-control';

      this.sites = sites;

      let option = document.createElement('option');
      option.value = "";
      option.textContent = "Seleccione un sitio";
      sites.appendChild(option);

      myJson.map(function (site) {
        var option = document.createElement('option');
        option.value = site.id;
        option.textContent = site.name;
        sites.appendChild(option);
      });
      sites_container.appendChild(sites_label);
      sites_container.appendChild(sites);
    });

  sites.addEventListener("change", function() {

    var categories_container = document.getElementById('categories');
    categories_container.innerHTML = "";

    fetch('https://api.mercadolibre.com/sites/' + sites.value + "/categories")
      .then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        var categories_label = document.createElement('label');
        categories_label.innerText = "Categorías";
        var categories = document.createElement('select');
        categories.name = "categories";
        categories.className = 'categories form-control';

        this.categories = categories;

        let option = document.createElement('option');
        option.value = "todas";
        option.textContent = "Todas";
        categories.appendChild(option);

        myJson.map(function (cat) {
          var option = document.createElement('option');
          option.value = cat.id;
          option.textContent = cat.name;
          categories.appendChild(option);
        });
        categories_container.appendChild(categories_label);
        categories_container.appendChild(categories);
      })
  });


  var btn = document.getElementById("submit_button");

  btn.addEventListener("click", function() {

  });

});
