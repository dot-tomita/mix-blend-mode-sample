<script>
  import Router, {link, location} from 'svelte-spa-router'
  import BgBlendMode from './pages/BgBlendMode.svelte'
  import MixBlendMode from './pages/MixBlendMode.svelte'
  import Issue01 from './pages/Issue01.svelte'
  
  const routes = {
    '/': MixBlendMode,
    '/bg/': BgBlendMode,
    '/issue01/': Issue01,
  };
</script>


<div class="wrap">
  <div class="nav">
    <!-- svelte-ignore a11y-missing-attribute -->
    <a use:link={{href:'/', disabled:false}} data-current={ $location === '/' ? 'true': 'false'}>mix-blend-mode sample</a>
    <!-- svelte-ignore a11y-missing-attribute -->
    <a use:link={{href:'/bg/', disabled:false}} data-current={ $location === '/bg/' ? 'true': 'false'}>background-blend-mode sample</a>
    <!-- svelte-ignore a11y-missing-attribute -->
    <a use:link={{href:'/issue01/', disabled:false}} data-current={ $location === '/issue01/' ? 'true': 'false'}>issue01</a>
  </div>
  <Router {routes}/>
</div>

<style lang="scss">
  .nav {
    display: flex;
  
    a {
      display: block;
      background: #fff;
      border: 1px solid #333;
      border-radius: 30px;
      padding: 5px 10px;
      text-decoration: none;
      color: #000;

      transition: 0.3s ease-out;
      transition-property: color,background-color;

      &:not(:first-child) {
        margin-left: 15px;
      }

      &:hover {
        color: #fff;
        background: #333;
      }

      &[data-current="true"] {
        color: #fff;
        background: #333;
      }

    }
  }
</style>