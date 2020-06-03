<template>
  <div id="app">
    <Header />
      <div id="appen">
        <p style="width:100%">Denna app är tänkt lite som att hålla ordning på vad som finns på vinden </p>
    </div>

    <PostComponent/>
    <Footer />
  </div>
</template>

<script>
import PostComponent from './components/PostComponent.vue'
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

export default {
  name: 'App',
  components: {
    Header,
    PostComponent,
    Footer
  }
}
</script>

<style>
#app 
{
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #1a2530;
  background-color:#e3e3e3;
}

#appen p
{
  padding: 1em;
  margin: auto;
  width: 40%;
}

img 
{
  border-radius: 0.5em;
  width:99%;
}

.header,.footer
  {
    background: #333;
    color:#fff;
    text-align: center;
    padding:8px;
  }

  .footer
  {
    margin-bottom: 5px;
    padding:2em 0;
  }

</style>
