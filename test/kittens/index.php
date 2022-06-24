<!DOCTYPE html>
<html>
<head>
	<?php require "../s/php/index_a.php"; ?>
	<title>Kittens in Valthe</title>
	<!-- Metadata for third parties !-->
	<meta property="og:type" content="website">
	<meta property="og:title" content="Kittens in Valthe">
	<meta property="og:description" content="Er zijn kittens te koop!">
	<meta property="og:image" content="/kittens/preview.png">
	<meta name="theme-color" content="#6942a2">
	<!-- Style I guess !-->
	<style>
		div.yt-embed {
			position:    relative;
			overflow:    hidden;
			width:       100%;
			padding-top: 56.25%;
		}
		.yt-embed iframe {
			display:       block;
			position:      absolute;
			left:          0;
			top:           0;
			width:         100%;
			height:        100%;
			border-radius: 10px;
		}
	</style>
</head>
<body onload="loaded();">
<div id="template_builder" style="display:none;"></div>
<div id="outer_content" class="content-o">
	<?php page_header(); ?>
<?php
function show_kitten_age() {
	date_default_timezone_set('UTC');
    $now   = time();
    $start = 1652565600;
    $days  = (int) (($now - $start) / 3600 / 24);
    $weeks = (int) ($days / 7);
    $days %= 7;
    echo $weeks. " weken";
    if ($days == 1) {
    	echo " en 1 dag";
    } else if ($days > 1) {
    	echo " en ". $days. " dagen";
    }
}
?>
	<div id="inner_content" class="content-i">
		<div class="header"><h1>Kittens!</h1></div>
		<!-- <div class="block-full">
			<h3 class="p-header">Filmpje van de kittens</h3>
			<div class="yt-embed">
				<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ" title="YouTube video player" frameborder="0" allow="encrypted-media; picture-in-picture" allowfullscreen></iframe>
			</div>
		</div> !-->
		<div class="block-full">
			<!-- &#x2640; Male   &#x2642; Female !-->
			<h3 class="p-header">Vier kittens uit Valthe</h3>
			<div class="right-image">
				<img class="may-big" alt="NaamVanKitten in een slof" src="0.jpg">
				NaamVanKitten in een slof
			</div>
			<p class="justify">
				Wij hebben vier lieve kittens te koop, geboren op 15 mei (1 mannetje en 3 vrouwtjes).
				Ze zijn nu <?php show_kitten_age(); ?> oud en zindelijk.
				Ze groeien op in een huiselijke sfeer bij een lieve zorgzame mama-poes.
			</p>
			<div class="left-image">
				<img class="may-big" alt="NaamVanKitten &#x2642;" src="1.jpg">
				NaamVanKitten &#x2642;
			</div>
			<p class="justify">
                De kittens zijn op zoek naar een eigen baasje en kunnen tussen 18 en 31 juli worden opgehaald (dan zijn ze tussen 9 en 10 weken).
                Ze zijn dan ontwormd volgens schema.
			</p>
			<div class="right-image">
				<img class="may-big" alt="NaamVanKitten is aan het spelen" src="2.jpg">
				NaamVanKitten is aan het spelen
			</div>
			<p class="justify">
                Kom gerust kennismaken!
                Reserveren mag tegen aanbetaling.
			</p>
			<div class="left-image">
				<img class="may-big" alt="NaamVanKitten &#x2642; en NaamVanKitten" src="3.jpg">
				NaamVanKitten &#x2642; en NaamVanKitten
			</div>
			<div class="right-image">
				<img class="may-big" alt="NaamVanKitten &#x2642; valt NaamVanKitten aan" src="4.jpg">
				NaamVanKitten &#x2642; valt NaamVanKitten aan
			</div>
			<div class="left-image">
				<img class="may-big" alt="Even eten bij mama" src="5.jpg">
				Even drinken bij mama
			</div>
			<div class="left-image">
				<img class="may-big" alt="Wat een feestje!" src="6.jpg">
				Wat een feestje!
			</div>
		</div>
		<?php footer(); ?>
	</div>
</div>
</body>
</html>
