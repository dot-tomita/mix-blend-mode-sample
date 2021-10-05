<script>
	import { fade } from 'svelte/transition';
	import { spring } from 'svelte/motion';
	import SelectMixmode from '../component/SelectMixmode.svelte'
	import InputColor from '../component/InputColor.svelte'
	import FileReader from '../component/FileReader.svelte'
	import InputTxt from '../component/InputTxt.svelte'
	let coords = spring({ x: 50, y: 50 }, {
		stiffness: 0.1,
		damping: 0.3
	});
	let size = spring(10);

	let animate = true
	let bgTransparent = false
	let mode = 'multiply'
	let modebgimg = 'normal'
	let bgcolor = "#ffee00"
	let cursorbgcolor = "#ff0000"
	let txtcolor = "#333333"
	let sampleTxt = 'TEXTTEXTTEXT'
	let bgImg = './img/sample_img01.jpg'
  let txtSize = '24';
	const handleChangeSelected = (evt) => {
		mode = evt.detail.name
	}
	const handleChangeInputBg = (evt) => {
		bgcolor = evt.detail.name
	}
	const handleChangeInputCursorBg = (evt) => {
		cursorbgcolor = evt.detail.name
	}
	const handleChangeSelecteBgImage = (evt) => {
		modebgimg = evt.detail.name
	}
	const handleChangeBgImage = (evt) => {
		bgImg = evt.detail.src
	}
	const handleChangeInputTxt = (evt) => {
		txtcolor = evt.detail.name
	}
	const handleChangeTxt = (evt) => {
		sampleTxt = evt.detail.name
	}
	const handleClickFadeIn = () => {
		animate = false;
		setTimeout( () => {
			animate = true
		},800)
	}
</script>

<svelte:window 
  on:mousemove="{e => {
    coords.set({ x: e.clientX, y: e.clientY })
  }}"
	on:mouseup="{handleClickFadeIn}"
/>

<main in:fade="{{delay: 500, duration: 500}}" out:fade="{{duration: 500}}" style="background-color: {bgTransparent ? 'transparent': bgcolor};">
	<h1 class="title">mix blend mode spring sample</h1>
	<div class="wrap">
		<div class="img">
			<div class="inner" style="background-color: {bgTransparent ? 'transparent': bgcolor};">
				<img src="{bgImg}" alt="" style="mix-blend-mode: {modebgimg};">
			</div>
      <div class="txt" style="font-size: {txtSize}px; color: {txtcolor}; ">{sampleTxt}</div>
		</div>
		<div class="dashbord">
			<div class="row">
				<h2 class="row__title">マウスカーソル描画モード</h2>
				<SelectMixmode value={mode} on:value={handleChangeSelected} />
			</div>
			<div class="row">
				<h2 class="row__title">マウスカーソル色</h2>
				<InputColor value={cursorbgcolor} on:value={handleChangeInputCursorBg} />
			</div>
			<div class="row">
				<h2 class="row__title">背景色</h2>
				<InputColor value={bgcolor} on:value={handleChangeInputBg} />
        
        <label for="bgTransparent">
          <input id="bgTransparent" name="bgTransparent" type="checkbox"  bind:checked={bgTransparent} />背景を透過にする
        </label>
			</div>
			<div class="row">
				<h2 class="row__title">画像描画モード</h2>
				<SelectMixmode value={modebgimg} on:value={handleChangeSelecteBgImage} />
			</div>
			<div class="row">
				<h2 class="row__title">画像</h2>
				<FileReader on:value={handleChangeBgImage} />
			</div>
			<div class="row">
				<h2 class="row__title">テキスト色</h2>
				<InputColor value={txtcolor} on:value={handleChangeInputTxt} />
			</div>
			<div class="row">
				<h2 class="row__title">テキスト</h2>
				<InputTxt value={sampleTxt} on:value={handleChangeTxt} />
			</div>
			<div class="row">
				<h2 class="row__title">テキストサイズ</h2>
        <input type="range" min="10" max="90" bind:value={txtSize} />
			</div>
	</div>
</main>

<span
	class="cursor {animate ? 'fadein' : 'hide'}" style="top: {$coords.y}px; left: {$coords.x}px; mix-blend-mode: {mode}; background-color: {cursorbgcolor};">
</span>

<style lang="scss">

	.cursor {
    display: block;
		width: 100px;
		height: 100px;
		position: fixed;
		transform: translate(-50%,-50%);
    border-radius: 50px;
    pointer-events: none;
		transition: 0.8s ease-out;
    transition-property: opacity, background-color;
    z-index: 9999;
	}

	.wrap {
		position: relative;
		display: flex;
    padding-bottom: 50px;
	}
	.img {
		width: 500px;
		height: 500px;
		margin-right: 50px;
		position: sticky;
		top: 0;
	}
	.inner {
		display: flex;
		justify-content: center;
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		transition: all 0.8s ease-out;
		.overtxt {
			display: block;
			position: absolute;
			top: 50%;
			left: 50%;
			font-size: 60px;
			transform: translate(-50%, -50%);
			width: 100%;
			width: 100%;
			padding: 10px;
			text-align: center;
			word-break: break-all;
			transition: all 0.8s ease-out;
		}
		img {
			object-fit: cover;
		}
	}
  .txt {
    margin: 30px;
    word-break: break-all;
  }
	.row {
		&:not(:first-child) {
			margin-top: 30px;
		}
	}
	.row__title {
		font-size: 16px;
		margin: 5px 0;
	}
	@keyframes fadein {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 100%;
		}
	}
	.fadein {
		opacity: 1;
	}
	.hide {
		opacity: 0;
	}
</style>