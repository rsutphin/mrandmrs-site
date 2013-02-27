require 'pathname'
JS_TEMPLATE_HASH_FILE = Pathname.new('.handlebars-templates-hash')

task :build => :compile_js_templates do
  sh 'bundle exec middleman build'
  sh 'git rev-list --max-count=1 HEAD > build/REVISION'
end

task :clean do
  rm_rf 'build'
  rm_f JS_TEMPLATE_HASH_FILE.to_s
end

task :deploy => :build do
  sh 'rsync -vlr --del build/ detailedbalance.net:/var/www/mrandmrs-static/'
end

task :compile_js_templates do
  require 'digest/sha1'

  templates = Dir['source/javascripts/handlebars-templates/*.handlebars'].sort

  current_hash = Digest::SHA1.hexdigest(templates.map { |t| File.read(t) }.join(''))
  last_built_hash = JS_TEMPLATE_HASH_FILE.exist? ? JS_TEMPLATE_HASH_FILE.read : nil

  if current_hash != last_built_hash
    sh "handlebars '#{templates.join("' '")}' -f source/javascripts/compiled_templates.js -o"
    JS_TEMPLATE_HASH_FILE.open('w') { |f| f.write(current_hash) }
  end
end
