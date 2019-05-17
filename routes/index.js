var express = require('express');
var router = express.Router();
var resolve = require('path').resolve;
var images = require('google-images');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(resolve('views/index.html'));
});

router.get('/trends', function(req, res, next) {
  res.sendFile(resolve('views/trends.html'));
});

router.get('/images', function(req, res, next) {
  var image_url = "example.png";
  images.search(req.query.nombre_tendencia || "MercadoLibre", function (error, images) {
    image_url = images[0].url;
  });
  res.end(image_url);

});


module.exports = router;
