<script>
	import { createEventDispatcher } from 'svelte';
  let value;
	const dispatch = createEventDispatcher();
  const fileReader = new FileReader();
  const onChangeInput = (evt) => {
    const file = evt.target.files[0]
    if(!file.type.match('image.*')) return;
    fileReader.readAsDataURL(file);
    
    fileReader.onload = () => {
      dispatch('value', {
        src: fileReader.result,
      }) 
    }
  }
</script>


<label for="bgcolor">
  <input type="file" accept="image/*" on:change={onChangeInput}/>
</label>

<style lang="scss">
  label {
    display: flex;
    align-items: center;
  }
  input {
    margin-right: 10px;
    font-size: 16px;
  }
</style>