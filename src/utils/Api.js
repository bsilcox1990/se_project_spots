export default class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  }

  _request({ url, options }) {
    return fetch(url, options).then(this._checkResponse);
  }

  getAppInfo() {
    return Promise.all([this.getInitialCards(), this.getUserInfo()]);
  }

  getInitialCards() {
    /* return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Error: ${res.status}`);
    }); */
    return this._request({
      url: `${this._baseUrl}/cards`,
      options: { headers: this._headers },
    });
  }

  getUserInfo() {
    return this._request({
      url: `${this._baseUrl}/users/me`,
      options: { headers: this._headers },
    });
    /* return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Error: ${res.status}`);
    }); */
  }

  editUserInfo({ name, about }) {
    return this._request({
      url: `${this._baseUrl}/users/me`,
      options: {
        method: "PATCH",
        headers: this._headers,
        body: JSON.stringify({ name, about }),
      },
    });
    /* return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name,
        about,
      }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Error: ${res.status}`);
    }); */
  }

  editAvatar(avatar) {
    return this._request({
      url: `${this._baseUrl}/users/me/avatar`,
      options: {
        method: "PATCH",
        headers: this._headers,
        body: JSON.stringify({ avatar }),
      },
    });
    /* return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar,
      }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Error: ${res.status}`);
    }); */
  }

  addNewcard({ name, link }) {
    return this._request({
      url: `${this._baseUrl}/cards`,
      options: {
        method: "POST",
        headers: this._headers,
        body: JSON.stringify({ name, link }),
      },
    });
    /*  return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name,
        link,
      }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Error: ${res.status}`);
    }); */
  }

  deleteCard(id) {
    return this._request({
      url: `${this._baseUrl}/cards/${id}`,
      options: { method: "DELETE", headers: this._headers },
    });

    /* return fetch(`${this._baseUrl}/cards/${id}`, {
      method: "DELETE",
      headers: this._headers,
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Error: ${res.status}`);
    }); */
  }

  toggleLike(id, isLiked) {
    return this._request({
      url: `${this._baseUrl}/cards/${id}/likes`,
      options: { method: isLiked ? "DELETE" : "PUT", headers: this._headers },
    });
    /* return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: isLiked ? "DELETE" : "PUT",
      headers: this._headers,
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Error: ${res.status}`);
    }); */
  }
}
