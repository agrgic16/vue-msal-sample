<template>
  <div id="app">
    <img src="./assets/logo.png">
    <h1>{{ msg }}</h1>
    <button @click="login" type="button" v-if="!user">Login with Microsoft</button>
    <button @click="getMyInfo" type="button" v-if="user">
      Call Graph's /me API
    </button>
    <button @click="getCareerPathsInfo" type="button" v-if="user">
      Get Career Paths Pages
    </button>
    <button @click="logout" type="button" v-if="user">
      Logout
    </button>
    <h3 v-if="user">Hello {{ user.name }}</h3>
    <pre v-if="responseInfo">{{ JSON.stringify(responseInfo, null, 4) }}</pre>
    <p v-if="loginFailed">Login unsuccessful</p>
    <p v-if="apiCallFailed">Graph API call unsuccessful</p>
  </div>
</template>

<script>
import AuthService from './services/auth.service';
import GraphService from './services/graph.service';

export default {
  name: 'app',
  data() {
    return {
      msg: 'Welcome to Your Vue.js + MSAL.js App',
      user: null,
      responseInfo: null,
      apiCallFailed: false,
      loginFailed: false
    }
  },
  created() {
    this.authService = new AuthService();
    this.graphService = new GraphService();
  },
  methods: {
    getMyInfo() {
      this.apiCallFailed = false;
      this.authService.getToken().then(
        token => {
          this.graphService.getUserInfo(token).then(
            data => {
              this.responseInfo = data;
            },
            error => {
              console.error(error);
              this.apiCallFailed = true;
            }
          );
        },
        error => {
          console.error(error);
          this.apiCallFailed = true;
        }
      );
    },

    getCareerPathsInfo() {
      this.apiCallFailed = false;
      this.authService.getToken().then(
        token => {
          this.graphService.getCareerPathsSitePages(token).then(
            data => {
              this.responseInfo = data;
            },
            error => {
              console.error(error);
              this.apiCallFailed = true;
            }
          );
        },
        error => {
          console.error(error);
          this.apiCallFailed = true;
        }
      );
    },
    logout() {
      this.authService.logout();
    },

    login() {
      this.loginFailed = false;
      this.authService.login().then(
        user => {
          if (user) {
            this.user = user;
          } else {
            this.loginFailed = true;
          }
        },
        () => {
          this.loginFailed = true;
        }
      );
    }
  }

}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

button {
  margin: 15px;
}
</style>
