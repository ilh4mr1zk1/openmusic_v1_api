// mengimpor dotenv dan menjalankan konfigurasinya
require('dotenv').config();

const ClientError = require('./exceptions/ClientError');
const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const AlbumsService = require('./services/postgres/album/AlbumsService');
const AlbumsValidator = require('./validator/album');
const songs = require('./api/songs');
const SongsService = require('./services/postgres/song/SongsService');
const SongsValidator = require('./validator/song');

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
        plugin: albums,
        options: {
            service: albumsService,
            validator: AlbumsValidator
        }
    },
    {
        plugin: songs,
        options: {
            service: songsService,
            validator: SongsValidator
        }
    },
  ]);

  server.ext('onPreResponse', (request, h) => {

    const { response } = request;
    if (response instanceof Error) {
 
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });

        newResponse.code(response.statusCode);
        return newResponse;

      }

      if (!response.isServer) {
        return h.continue;
      }
      
      const newResponse = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server.',
      });

      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);

};
 
 
init();