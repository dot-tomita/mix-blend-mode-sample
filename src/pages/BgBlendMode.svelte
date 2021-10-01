<script>
	import { fade, scale } from 'svelte/transition';
	import SelectMixmode from '../component/SelectMixmode.svelte'
	import InputColor from '../component/InputColor.svelte'
	import FileReader from '../component/FileReader.svelte'
	let animate = true;
	let mode = 'multiply'
	let bgcolor = "#ff0000"
	let bgImg = '../../img/sample_img01.jpg'
	const handleChangeSelected = (evt) => {
		mode = evt.detail.name
	}
	const handleChangeInput = (evt) => {
		bgcolor = evt.detail.name
	}
	const handleChangeBgImage = (evt) => {
		bgImg = evt.detail.src
	}
	const handleClickFadeIn = () => {
		animate = false;
		setTimeout( () => {
			animate = true
		},700)
	}
</script>

<main in:fade="{{delay: 500, duration: 500}}" out:fade="{{duration: 500}}">
	<h1 class="title">background blend mode sample</h1>
	<div class="wrap">
		<div class="img">
			<div class="bg {animate ? 'fadein' : 'hide'}" style="background-blend-mode: {mode}; background-color: {bgcolor}; background-image: url({bgImg});"></div>
		</div>
		<div class="dashbord">
			<div class="row">
				<h2 class="row__title">描画モード</h2>
				<SelectMixmode value={mode} on:value={handleChangeSelected} />
			</div>
			<div class="row">
				<h2 class="row__title">背景色</h2>
				<InputColor value={bgcolor} on:value={handleChangeInput} />
			</div>
			<div class="row">
				<h2 class="row__title">背景画像</h2>
				<FileReader on:value={handleChangeBgImage} />
			</div>
			<div class="row">
				<h2 class="row__title">アニメーション</h2>
				<button on:click={handleClickFadeIn}>フェードイン</button>
			</div>
		</div>
	</div>
</main>

<style lang="scss">
	.wrap {
		display: flex;
	}
	.img {
		width: 500px;
		height: 500px;
		margin-right: 50px;
	}
	.bg {
		width: 100%;
		height: 100%;
		background-repeat: no-repeat;
		background-position: 50% 0;
		background-size: cover;
		transition: opacity 0.8s ease-out;
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
	.fadein {
		opacity: 1;
	}
	.hide {
		opacity: 0;
	}
</style>