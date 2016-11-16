# Load DSL and set up stages
require 'capistrano/setup'

# Include default deployment tasks
require 'capistrano/deploy'

### Plugins
require 'capistrano/safe_deploy_to'
require 'capistrano/ssh_doctor'
require 'capistrano/hostmenu'
require 'airbrussh/capistrano'

require 'rollbar/capistrano3'

Dir.glob('lib/capistrano/tasks/*.rake').each { |r| import r }
