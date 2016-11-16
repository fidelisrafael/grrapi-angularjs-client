require 'sinatra'

set :port, 3001
set :public_folder, '.'

get '/*' do
  send_file 'index.html'
end