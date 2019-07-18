export default class GraphService {
  constructor() {
    this.graphUrl = 'https://graph.microsoft.com';
  }

  get(uri, token) {
    const headers = new Headers({ Authorization: `Bearer ${token}` });
    const options = {
      headers
    };
    return fetch(`${this.graphUrl}${uri}`, options)
      .then(response => response.json())
      .catch(response => {
        throw new Error(response.text());
      });
  }

  getUserInfo(token) {
    return this.get('/v1.0/me', token);
  };

  getCareerPathsSitePages(token) {
    return this.get('/beta/sites/spr.sharepoint.com,e8c80ec5-683b-4a0b-91bb-4a92971c2bad,ec4c99c5-6d43-40cb-b3d3-bf2736def980/pages', token)
      .then(data => data.value.map(({webParts}) => {
          return webParts.map(({data}) => {
            return data.innerHTML;
          });
        })
      );
  }
}
