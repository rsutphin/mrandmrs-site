task :build do
  sh 'bundle exec middleman build'
  sh 'git rev-list --max-count=1 HEAD > build/REVISION'
end

task :clean do
  rm_rf 'build'
end

task :deploy => :build do
  sh 'rsync -vlr --del build/ detailedbalance.net:/var/www/mrandmrs-static/'
end
