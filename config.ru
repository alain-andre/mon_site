require "rack/contrib/try_static"
require "rack/contrib/not_found"

use Rack::TryStatic, {
  root: "_site",
  urls: %w[/],
  try:  %w[
    .html index.html /index.html
    .js .css .xml .json
    .eot .svg .ttf .woff .woff2
  ],
  :header_rules => [
    # Cache all static files in public caches (e.g. Rack::Cache)
    #  as well as in the browser
    [%w[json], {'Content-Type' => 'application/json'}]
  ]
}

run lambda{ |env|
  four_oh_four_page = File.expand_path("../_site/404/index.html", __FILE__)
  [ 404, { 'Content-Type'  => 'text/html'}, [ File.read(four_oh_four_page) ]]
}
