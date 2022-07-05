
create table game_users (
    id    varchar(64) not null unique primary key,
    nick  varchar(64) not null,
    score integer     not null
);
