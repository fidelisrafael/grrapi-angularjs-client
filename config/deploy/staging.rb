server '', user: 'ubuntu', roles: %w{app web}

set :ssh_options, {
 keys: File.join(ENV['HOME'], '.ssh', 'your-staging-key'),
 forward_agent: true,
 auth_methods: %w(publickey),
 # verbose: :debug
}

set :branch, ENV['BRANCH'] || :develop
set :stage, :staging
