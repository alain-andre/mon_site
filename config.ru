use Rack::Static,
  :urls => ["/images", "/js", "/css"],
  :root => "_site"

run lambda { |env|
  [
    200,
    {
      'Content-Type'  => 'text/html',
      'Cache-Control' => '_site, max-age=86400'
    },
    File.open('_site/index.html', File::RDONLY)
  ]
}