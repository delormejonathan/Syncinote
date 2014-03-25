# config valid only for Capistrano 3.1
lock '3.1.0'

set :application, 'my_app_name'
set :repo_url, '/data/git/repositories/personnal/syncinote.git'

set :deploy_to, '/home/syncinote'

set :format, :pretty
set :log_level, :info
set :keep_releases, 3

after 'deploy:finishing', 'deploy:cleanup'