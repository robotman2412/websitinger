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
			<h3 class="p-header">Contact</h3>
			<ul>
				<li>Email: <a href="mailto:maja@kuilman.net">maja@kuilman.net</a></li>
				<li>Telefoon en Whatsapp: <a href="https://wa.me/31615445714">06 15 44 57 14</a></li>
			</ul>
		</div>
		<div class="block-full">
			<!-- &#x2640; Female   &#x2642; Male !-->
			<h3 class="p-header">Lieve kittens uit Valthe</h3>
			<div class="right-image">
				<img class="may-big" alt="Die slof is toch veel te groot voor je!" src="0.jpg">
				&#x2642; Die slof is toch veel te groot voor je!
			</div>
			<p class="justify">
				Wij hebben hele schattige kittens te koop, geboren op 15 mei
				(1 mannetje&#x2642; en 3 vrouwtjes&#x2640;).
				Ze zijn nu <?php show_kitten_age(); ?> oud, en ze zijn zindelijk.
				Ze groeien op in een huiselijke sfeer bij een lieve zorgzame mama-poes.
			</p>
			<div class="left-image">
				<img class="may-big" alt="&#x2640; Op avontuur uit" src="1.jpg">
				&#x2640; Op avontuur uit
			</div>
			<p class="justify">
                De kittens zijn op zoek naar een eigen baasje en kunnen tussen 18 en 31 juli worden opgehaald (dan zijn ze tussen 9 en 10 weken).
                Ze zijn dan ontwormd volgens schema.
			</p>
			<div class="right-image">
				<img class="may-big" alt="NaamVanKitten is aan het spelen" src="2.jpg">
				&#x2640; Aan het spelen
			</div>
			<p class="justify">
                Kom gerust kennismaken!
                Reserveren mag tegen aanbetaling.
			</p>
			<div class="left-image">
				<img class="may-big" alt="NaamVanKitten &#x2642; en NaamVanKitten" src="3.jpg">
				? (links) &#x2640; (rechts) In de tunnel
			</div>
			<div class="right-image">
				<img class="may-big" alt="NaamVanKitten &#x2642; valt NaamVanKitten aan" src="4.jpg">
				&#x2640; (links) &#x2642; (rechts) Wel lief zijn h&#x00e9;?
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
