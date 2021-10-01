<script>
	import { createEventDispatcher } from 'svelte';
  export let value;
	const dispatch = createEventDispatcher();
  const onChangeSelect = () => {
    dispatch('value', {
      name: value,
    }) 
  }
</script>


<select bind:value={value} on:change={onChangeSelect}>
  <option value="normal">通常（normal）</option>
  <option value="darken">比較（暗）（darken）</option>
  <option value="multiply">乗算（multiply）</option>
  <option value="color-burn">焼き込み（color-burn）</option>
  <option value="lighten">比較（明）（lighten）</option>
  <option value="screen">スクリーン（screen）</option>
  <option value="color-dodge">覆い焼き（color-dodge）</option>
  <option value="overlay">オーバーレイ（overlay）</option>
  <option value="soft-light">ソフトライト（soft-light）</option>
  <option value="hard-light">ハードライト（hard-light）</option>
  <option value="difference">差の絶対値（difference）</option>
  <option value="exclusion">除外（exclusion）</option>
  <option value="hue">色相（hue）</option>
  <option value="saturation">彩度（saturation）</option>
  <option value="color">カラー（color）</option>
  <option value="luminosity">輝度（luminosity）</option>
</select>


<style lang="scss">
  select {
    font-size: 16px;
    border-radius: 30px;
    padding: 5px 15px;
  }
</style>