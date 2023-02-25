const ClientError = require('../../exceptions/ClientError');

class AlbumsHandler {
  
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postAlbumsHandler = this.postAlbumsHandler.bind(this);
    this.getAlbumsByIdHandler = this.getAlbumsByIdHandler.bind(this);
    this.putAlbumsByIdHandler = this.putAlbumsByIdHandler.bind(this);
    this.deleteAlbumsByIdHandler = this.deleteAlbumsByIdHandler.bind(this);
  }

  async postAlbumsHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);
      const { name, year } = request.payload;
 
      const albumId = await this._service.addAlbum({ name, year });
 
      const response = h.response({
        status: 'success',
        message: 'Album berhasil ditambahkan',
        data: {
          albumId
        },
      });

      response.code(201);
      return response;

    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });

        response.code(error.statusCode);
        return response;
      }
 
      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server.',
      });

      response.code(500);
      console.error(error);

      return response;
    }

  }

  async getAlbumsByIdHandler(request, h) {
    try {
      const { albumId } = request.params;

      const album = await this._service.getAlbumById(albumId);
      const song = await this._service.getSongs();

      const checkData = song.filter((sg) => sg.albumId === albumId).length > 0;
      // console.log(checkData);
      const getDataSong = song.filter((sg) => sg.albumId === albumId);
      const songs = getDataSong.map(detail => ({ id: detail.id, title: detail.title, performer : detail.performer }));

      if (checkData) {
        album.songs = songs
        // console.log(album);

        return {
          status: 'success',
          data: {
            album
          },
        };
      } else {
        // console.log(album);
        album.songs = []
        return {
          status: 'success',
          data: {
            album
          },
        };
      }

    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
 
      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server.',
      });

      response.code(500);
      console.error(error);

      return response;
    }

  }

  async putAlbumsByIdHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);
      const { name, year } = request.payload;
      const { id } = request.params;
 
      await this._service.editAlbumById(id, { name, year });
 
      return {
        status: 'success',
        message: 'Album Berhasil Diperbaharui',
      };

    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        
        response.code(error.statusCode);
        return response;
      }
 
      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server.',
      });

      response.code(500);
      console.error(error);

      return response;

    }

  }

  async deleteAlbumsByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteAlbumById(id);
      
      return {
        status: 'success',
        message: 'Album berhasil dihapus',
      };

    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });

        response.code(error.statusCode);
        return response;
      }
 
      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server.',
      });

      response.code(500);
      console.error(error);

      return response;

    }

  }

}

module.exports = AlbumsHandler;