<script>
	import { createEventDispatcher } from 'svelte';
  export let value;
	const dispatch = createEventDispatcher();
  const onChangeInput = () => {
    dispatch('value', {
      name: value,
    }) 
  }
</script>


<label for="bgcolor">
  <input type="color" name="bgcolor"  bind:value={value} on:change={onChangeInput} />
  {value}
</label>

<style lang="scss">
  label {
    display: flex;
    align-items: center;
  }
  input {
    margin-right: 10px;
    font-size: 16px;
    border-radius: 30px;
    padding: 5px 15px;
  }
</style>