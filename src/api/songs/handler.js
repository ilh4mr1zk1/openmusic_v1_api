const ClientError = require('../../exceptions/ClientError');
const autoBind = require('auto-bind');

class SongsHandler {

	constructor(service, validator) {
		this._service = service;
  	this._validator = validator;

    autoBind(this);

	}

	async getSongsHandler(request, h) {

    let songs = [];
		let {title = '', performer = ''} = request.query;
    let hasil = -1;

		const dataSong = await this._service.getSongs();
    
    const dataSongs = dataSong.map(detail => ({ id: detail.id, title: detail.title, performer : detail.performer }));

    for (let i = 0; i < dataSong.length; i++) {
      hasil = -1;

      if ( title !== '' || performer !== '' ) {

        if ( title === dataSong[i].title || performer === dataSong[i].performer ) {
          console.log(dataSong[i].title);
          hasil = 1;
        } else if ( title === dataSong[i].title && performer === dataSong[i].performer ) {
          hasil = 2;
        } else if ( dataSong[i].title.toLowerCase().includes(title.toLowerCase()) && title !== '' ) {
          hasil = 3;
        } else if ( dataSong[i].performer.toLowerCase().includes(performer.toLowerCase()) && performer !== '' ) {
          hasil = 4;
        }

      } else {
        hasil = 0;
      }

      if (hasil >= 0) {

        songs.push({
            id: dataSong[i].id, 
            title: dataSong[i].title,
            performer: dataSong[i].performer
        });

      }

    }

    return {
      status: 'success',
      data: {
        songs
      },
    };

	}

	async postSongsHandler(request, h) {

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

  }

  async getSongsByIdHandler(request, h) {

    const { id } = request.params;

    const song = await this._service.getSongById(id);

    return {
      status: 'success',
      data: {
        song
      },
    };

  }

  async putSongsByIdHandler(request, h) {

    this._validator.validateSongPayload(request.payload);
    const { title, year, performer, genre, duration, albumId  } = request.payload;
    const { id } = request.params;

    await this._service.editSongById(id, { title, year, performer, genre, duration, albumId  });

    return {
      status: 'success',
      message: 'Lagu Berhasil Diperbaharui',
    };

  }

  async deleteSongsByIdHandler(request, h) {

    const { id } = request.params;
    await this._service.deleteSongById(id);
    
    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };

  }

}

module.exports = SongsHandler;