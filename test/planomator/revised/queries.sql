
-- planner index
create table planner_index (
	id         SERIAL      PRIMARY KEY,
	name       VARCHAR(64) NOT NULL, -- title for planner on website
	show_att   boolean     NOT NULL, -- whether or not to show attendance
	show_food  boolean     NOT NULL, -- whether or not to show food
	show_bring boolean     NOT NULL, -- whether or not to show snaxx
	name_att   VARCHAR(64) NOT NULL, -- name for attendance on website
	name_food  VARCHAR(64) NOT NULL, -- name for food on website
	name_bring VARCHAR(64) NOT NULL  -- name for bring on website
);

-- planner dates
create table planner_dates (
	row_id SERIAL   PRIMARY KEY,
	id     integer  NOT NULL, -- row_id of planner in planner_index
	val    date     NOT NULL  -- date shown on website
);

-- planner snaxx
create table planner_bring (
	row_id SERIAL      PRIMARY KEY,
	id     integer     NOT NULL, -- id of planner in planner_index
	val    VARCHAR(64) NOT NULL  -- name of table row on website
);

-- planner people
create table planner_people (
	row_id SERIAL      PRIMARY KEY,
	id     integer     NOT NULL, -- id of planner in planner_index
	val    VARCHAR(64) NOT NULL  -- name of the person
);

-- planner attendance
create table planner_dates_value (
	row_id  SERIAL      PRIMARY KEY,
	id      integer     NOT NULL, -- id of planner in planner_index
	person  integer     NOT NULL, -- row_id of person in planner_people
	date_id integer     NOT NULL, -- row_id of date in planner_dates
	val     VARCHAR(16) NOT NULL  -- can_go/cannot_go/unknown
);

-- planner food
create table planner_food_value (
	row_id  SERIAL       PRIMARY KEY,
	id      integer      NOT NULL, -- id of planner in planner_index
	person  integer      NOT NULL, -- row_id of person in planner_people
	date_id integer      NOT NULL, -- row_id of date in planner_dates
	val     VARCHAR(256) NOT NULL  -- whichever requested food
);

-- planner snaxx entry
create table planner_bring_value (
	row_id   SERIAL       PRIMARY KEY,
	id       integer      NOT NULL, -- id of planner in planner_index
	person   integer      NOT NULL, -- row_id of person in planner_people
	bring_id integer      NOT NULL, -- row_id of snaxx in planner_bring
	val      VARCHAR(256) NOT NULL  -- whichever brought snaxx food
);
