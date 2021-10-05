<script>
	import { fade } from 'svelte/transition';
	import SelectMixmode from '../component/SelectMixmode.svelte'
	import InputColor from '../component/InputColor.svelte'
	import FileReader from '../component/FileReader.svelte'
	import InputTxt from '../component/InputTxt.svelte'
	let animate = true
	let animateTxt = true
	let mode = 'multiply'
	let modebgimg = 'normal'
	let bgcolor = "#ffee00"
	let txtbgcolor = "#ff0000"
	let txtcolor = "#ffffff"
	let sampleTxt = 'TEXTTEXTTEXT'
	let bgImg = './img/sample_img01.jpg'
	const handleChangeSelected = (evt) => {
		mode = evt.detail.name
	}
	const handleChangeInputBg = (evt) => {
		bgcolor = evt.detail.name
	}
	const handleChangeInputTxtBg = (evt) => {
		txtbgcolor = evt.detail.name
	}
	const handleChangeInputTxt = (evt) => {
		txtcolor = evt.detail.name
	}
	const handleChangeTxt = (evt) => {
		sampleTxt = evt.detail.name
	}
	const handleChangeSelecteBgImage = (evt) => {
		modebgimg = evt.detail.name
	}
	const handleChangeBgImage = (evt) => {
		bgImg = evt.detail.src
	}
	const handleClickFadeIn = () => {
		animate = false;
		setTimeout( () => {
			animate = true
		},800)
	}
	const handleClickFadeInTxt = () => {
		animateTxt = false;
		setTimeout( () => {
			animateTxt = true
		},800)
	}
</script>

<main in:fade="{{delay: 500, duration: 500}}" out:fade="{{duration: 500}}">
	<h1 class="title">mix blend mode sample</h1>
	<div class="wrap">
		<div class="img">
			<div class="inner {animate ? 'fadein' : 'hide'}" style="background-color: {bgcolor}; ">
				<span class="overtxt {animateTxt ? 'fadein' : 'hide'}" style="color: {txtcolor};background-color: {txtbgcolor};mix-blend-mode: {mode};">{sampleTxt}</span>
				<img src="{bgImg}" alt="" style="mix-blend-mode: {modebgimg};">
			</div>
		</div>
		<div class="dashbord">
			<div class="row">
				<h2 class="row__title">テキスト描画モード</h2>
				<SelectMixmode value={mode} on:value={handleChangeSelected} />
			</div>
			<div class="row">
				<h2 class="row__title">テキスト背景色</h2>
				<InputColor value={txtbgcolor} on:value={handleChangeInputTxtBg} />
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
				<h2 class="row__title">背景色</h2>
				<InputColor value={bgcolor} on:value={handleChangeInputBg} />
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
				<h2 class="row__title">全体アニメーション</h2>
				<button on:click={handleClickFadeIn}>フェードイン</button>
			</div>
			<div class="row">
				<h2 class="row__title">文字だけアニメーション</h2>
				<button on:click={handleClickFadeInTxt}>フェードイン</button>
			</div>
		</div>
	</div>
</main>

<style lang="scss">
	.wrap {
		position: relative;
		display: flex;
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