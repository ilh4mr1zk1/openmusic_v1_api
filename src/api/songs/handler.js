const ClientError = require('../../exceptions/ClientError');

class SongsHandler {

	constructor(service, validator) {
		this._service = service;
  	this._validator = validator;

  	this.getSongsHandler = this.getSongsHandler.bind(this);
  	this.postSongsHandler = this.postSongsHandler.bind(this);
    this.getSongsByIdHandler = this.getSongsByIdHandler.bind(this);
    this.putSongsByIdHandler = this.putSongsByIdHandler.bind(this);
    this.deleteSongsByIdHandler = this.deleteSongsByIdHandler.bind(this);
	}

	async getSongsHandler(request, h) {
		
		const song = await this._service.getSongs();
    // const getDataSong = song.filter((sg) => sg.albumId === albumId);
    const songs = song.map(detail => ({ id: detail.id, title: detail.title, performer : detail.performer }));


	    return {
	      status: 'success',
	      data: {
	        songs
	      },
	    };

	}

	async postSongsHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const { title, year, performer, genre, duration, albumId } = request.payload;
 
      const songId = await this._service.addSong({ title, year, performer, genre, duration, albumId });
 
      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan',
        data: {
          songId
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

  async getSongsByIdHandler(request, h) {
    try {
      const { id } = request.params;

      const song = await this._service.getSongById(id);

      return {
        status: 'success',
        data: {
          song
        },
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

  async putSongsByIdHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const { title, year, performer, genre, duration, albumId  } = request.payload;
      const { id } = request.params;
 
      await this._service.editSongById(id, { title, year, performer, genre, duration, albumId  });
 
      return {
        status: 'success',
        message: 'Lagu Berhasil Diperbaharui',
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

  async deleteSongsByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteSongById(id);
      
      return {
        status: 'success',
        message: 'Lagu berhasil dihapus',
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

module.exports = SongsHandler;