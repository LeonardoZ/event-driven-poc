create table users(
    id int primary key auto_increment not null,
    email varchar(255) not null unique,
    fullname varchar(255) not null,
    role varchar(15) not null default 'user'
);

create table teams(
    id int primary key auto_increment not null,
    team_foreign_id int not null,
    description varchar(200) not null unique,
    active boolean not null default true
);

create table projects(
    id int primary key auto_increment not null,
    name varchar(200) not null unique,
    project_status varchar(200) not null default 'defined'
);

create table project_teams(
    id int primary key auto_increment not null,
    project_id int not null,
    team_id int not null,
    active boolean not null default true,
    foreign key (team_id) references teams(id),
    foreign key (project_id) references projects(id)
);

create table project_teams_members(
    id int primary key auto_increment not null,
    project_id int not null,
    team_id int not null,
    member_name varchar(255) not null,
    role varchar(15) not null,
    foreign key (project_id) references projects(id),
    foreign key (team_id) references teams(id)
);

CREATE USER 'maxwell'@'%' IDENTIFIED BY '123456';
GRANT ALL ON maxwell.* TO 'maxwell'@'%';
GRANT SELECT, REPLICATION CLIENT, REPLICATION SLAVE ON *.* TO 'maxwell'@'%';
