
-- Create the table.
create table page_visits(
	id				SERIAL PRIMARY KEY,
	visit_url		VARCHAR(128) NOT NULL,
	visit_date		timestamp NOT NULL,
	client_address	VARCHAR(32) NOT NULL
);
alter table public.page_visits OWNER to php;

-- Test entry.
insert into page_visits (visit_url, visit_date) values ('/lol_url', current_timestamp);
