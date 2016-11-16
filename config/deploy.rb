# config valid only for current version of Capistrano
lock '3.4.0'

set :application, :rabs_application
set :repo_url, ENV['GIT_REPO_URL'] || 'git@github.com:fidelisrafael/ruby-api-starter-boilerplate-angularjs-client.git'
set :scm, :git

set :linked_dirs, %w{}
set :deploy_to, -> { "/var/www/#{fetch(:application)}/#{fetch(:stage)}" }
set :pty, true

current_enviroment = fetch(:stage) || :staging

set :default_env, { NODE_ENV: current_enviroment }

set :rollbar_token, 'c6455e6fa27a4efda632068edb89b7f9'
set :rollbar_env, Proc.new { fetch :stage }
set :rollbar_role, Proc.new { :app }

namespace :deploy do
  desc "Make sure local git is in sync with remote."
  task :check_revision do
    on roles(:app) do
      unless `git rev-parse HEAD` == `git rev-parse origin/#{fetch(:branch)}`
        puts "WARNING: HEAD is not the same as origin/#{fetch(:branch)}"
        puts "Run `git push` to sync changes."
        exit
      end
    end
  end

  desc 'Restart application server'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      invoke 'deploy:restart_nginx'
    end
  end

  desc 'Upload rabs_application.conf'
  task :nginx_file_upload do
    on roles(:app) do
      execute "mkdir #{shared_path}/config -p"
      environment = fetch(:stage).to_s.downcase

      file = File.join(Dir.pwd, 'config', 'deploy', 'templates', environment, 'rabs_application.nginx.conf')

      upload! StringIO.new(File.read(file)), "#{shared_path}/config/rabs_application.nginx.conf"
    end
  end

  desc 'Replace current nginx configuration file for client'
  task :nginx_symlink do
    on roles(:app) do
      invoke 'deploy:nginx_file_upload'

      dir_schema = "/etc/nginx/%s/rabs_application_#{fetch(:stage)}"
      avaliable_target_file = dir_schema % 'sites-available'
      enabled_target_file = dir_schema % 'sites-enabled'

      if test "[ -f #{avaliable_target_file}]"
        info 'backuping current nginx configuration'
        info "backing up #{avaliable_target_file} to -> #{avaliable_target_file}.bkp"
        execute :sudo, 'mv #{avaliable_target_file} #{avaliable_target_file}.bkp'
      end

      info 'copying file in shared/config'

      execute :sudo, "cp #{shared_path}/config/rabs_application.nginx.conf #{avaliable_target_file}"

      if test "[ -f #{enabled_target_file}]"
        execute :sudo, "rm #{enabled_target_file}"
      end

      execute :sudo, "ln -s #{avaliable_target_file} #{enabled_target_file}"

      info 'restarting nginx'

      invoke 'deploy:restart_nginx'
    end
  end

  task :restart_nginx do
    on roles(:app) do
      execute :sudo, 'service nginx restart'
    end
  end

  task :test_nginx_conf do
    on roles(:app) do
      execute :sudo, 'service nginx configtest'
    end
  end

  desc 'Create Directories for nginx apps logs'
  task :make_dirs do
    on roles(:app) do
      execute "mkdir #{shared_path}/logs -p"
    end
  end

  after "deploy:check", :check_revision
  after :updated, :make_dirs
end
