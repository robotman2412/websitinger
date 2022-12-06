<!DOCTYPE html>
<html>
<head>
	<?php require "../../s/php/index.php"; ?>
	<title>Blog - RobotMan2412's website</title>
</head>
<body onload="loaded();">
<div id="template_builder" style="display:none;"></div>
<div id="outer_content" class="content-o">
	<?php page_header(); ?>
	<div id="inner_content" class="content-i">
		<div class="header"><h1>Oct 30 2022: 3D on an ESP32</h1></div>
		<div class="block-full">
			<h3 class="p-header">Related project pages</h3>
			<ul>
				<li><a href="/project/pax-gfx">PAX graphics</a></li>
			</ul>
		</div>
		<div class="block-full">
			<h3 class="p-header">A quick hack, to turn 2D into 3D</h3>
			<div class="right-image skinny">
				<img class="may-big" src="/i/mch2021/badge_3d_1.jpg" alt="Also with 3D anaglyph!">
				<p>Also with 3D anaglyph!</p>
			</div>
			<div class="right-image skinny">
				<img class="may-big" src="/i/mch2021/badge_3d_0.jpg" alt="The first 3D on the MCH2022 badge">
				<p>3D on the MCH2022 badge</p>
			</div>
			<p class="justify">
				After recently uncovering some
				<a href="https://en.wikipedia.org/wiki/Anaglyph_3D" target="_blank">
				<img style="height: 1em" src="/i/3d_glasses.png" title="Red/Cyan 3D anaglyph glasses" alt="Red/Cyan 3D anaglyph glasses"></a>,
				I decided it would be a cool idea to make a small demo of "Anaglyph 3D",
				a technique using one color per eye, filtered by the
				<a href="https://en.wikipedia.org/wiki/Anaglyph_3D" target="_blank">
				<img style="height: 1em" src="/i/3d_glasses.png" title="Red/Cyan 3D anaglyph glasses" alt="Red/Cyan 3D anaglyph glasses"></a>
				(<span style="color:#f00">Red</span> left eye, <span style="color:#0ff">Cyan</span> right eye).
			</p>
			<p class="justify">
				So I set off to make the effect, starting with simple 3D drawing.
				It is mostly the same as 2D, with the exception of the extra dimension and an extra step.
			</p>
		</div>
		<div class="block-full">
			<h3 class="p-header">3D math is deceptively simple</h3>
			<div style="clear: right" class="right-image skinny">
				<img class="may-big" src="/i/3d_rendering.png" alt="3D has extra steps">
				<p>3D has extra steps</p>
			</div>
			<p class="justify">
				Everything starts with the graphics stack getting a command (e.g. draw a rectangle of a certain size).
				The size and position of this shape is usually relative, so it needs to <i>transformed</i> into a set of absolute positions.
				For 2D, this would be perfect to draw right away, but for 3D, it's not so easy.
				3D needs to be <i><a href="https://en.wikipedia.org/wiki/3D_projection#Perspective_projection">projected</a></i> first.
				I'll get to how that works in a bit.
				Assuming projection is done, the next step is <i>rasterisation</i>.
				Rasterisation is the process of turning a shape defined by it's outline into a series of dots on a grid.
				In simpler terms; To rasterise is to produce the pixels you see based on the shape.
			</p>
			<div style="clear: right" class="right-image skinny">
				<img class="may-big" src="/i/3d_projection.png" alt="Projecting 3D into 2D">
				<p>Projecting 3D into 2D</p>
			</div>
			<p class="justify" style="margin-bottom: 0;">
				The reason for 3D having the extra step is because of how our eyes work.
				Our eyes see farther away objects as smaller than close objects; the light covers a smaller portion of the eye.<br>
				Let's take a look at the diagram first.
				The horizontal blue line here represents the axis <nobr><i>&#x1d467; = 0</i></nobr>, and the vertical represents <nobr><i>&#x1d465; = 0</i></nobr>.
				The <span style="color: #ff0000">red dot</span> represents the <i>original point in 3D space</i>,
				and the <span style="color: #00ff00">green dot</span> represents the <i>projected point in 2D space</i> to calculate.<br>
				You can see that <nobr><i>&#x1d467;<sub>projected</sub> = 0</i></nobr>. Now look at the triangles in the diagram.
				The bigger triangle is in reality a scaled up version of the smaller.
				The relative scale &#x1d460; of the smaller triangle can be calculated using <nobr><i>&#x1d460; = &#x1d453; ÷ (&#x1d467;<sub>original</sub> + &#x1d453;)</i></nobr>.
				This is always a fraction because a number <nobr><i>&#x1d460; &gt; 1</i></nobr> would mean that the projected triangle is bigger (which we'll assume it isn't).
				The final <nobr><i>&#x1d465;<sub>projected</sub></i></nobr> can simply be found by multiplying <nobr><i>&#x1d465;<sub>original</sub></i></nobr> by &#x1d460;.<br>
				Finally, we're left with this formula: <nobr><i>&#x1d465;<sub>projected</sub> = &#x1d465;<sub>original</sub> ⋅ &#x1d453; ÷ (&#x1d467;<sub>original</sub> + &#x1d453;)</i></nobr><br>
				This can be applied to the &#x1d466; as well coordinate by simply substituting &#x1d465; for &#x1d466;.
			</p>
		</div>
		<div class="block-full">
			<h3 class="p-header">Picture time!</h3>
			<div class="center-image">
				<img class="may-big" src="/i/mch2021/badge_3d_2.jpg" alt="Monkey with global lighting coming from the top right"></img>
				<p>A demonstration with Suzanne, a built-in model from <a href="https://www.blender.org/" target="_blank">Blender</a></p>
			</div>
			<div class="center-image">
				<video src="/i/mch2021/badge_3d_4.mp4" controls></video>
				<p>Suzanne rendered in realtime</p>
			</div>
			<div class="center-image">
				<video src="/i/mch2021/badge_3d_3.mp4" controls></video>
				<p>Suzanne in 3D anaglyph</p>
			</div>
		</div>
		<?php blog_footer(); footer(); ?>
	</div>
</div>
</body>
</html>
