source 'https://rubygems.org'

# deploy specific
group :development do
  gem 'rollbar', require: 'false'
  gem 'capistrano', require: false
  gem 'capistrano-rvm', require: false
  gem 'capistrano-bundler', '~> 1.1.2', require: false

  # pretty print for capistrano tasks
  gem 'airbrussh', :require => false

  # srever selection on deploy (in case theres more than 1 server)
  gem 'capistrano-hostmenu', require: false

  # ensure folders creation and ownership
  gem 'capistrano-safe-deploy-to', '~> 1.1.1', require: false

  # good
  gem 'capistrano-ssh-doctor', '~> 1.0'
end
