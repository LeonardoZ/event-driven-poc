create table users(
    id int primary key auto_increment not null,
    email varchar(255) not null unique,
    fullname varchar(255) not null,
    role varchar(12) not null default 'user'
);


create table teams(
    id int primary key auto_increment not null,
    description varchar(200) not null unique,
    team_type varchar (12) not null default 'fixed',
    active boolean not null default true
);


 create table team_roles(
    id int primary key auto_increment not null,
    team_id int not null,
    user_id int not null,
    task_description text,
    active boolean not null default true,
    foreign key (team_id) references teams(id),
    foreign key (user_id) references users(id)
);
       

alter table team_roles add unique (team_id, user_id)

CREATE USER 'maxwell'@'%' IDENTIFIED BY '123456';
GRANT ALL ON maxwell.* TO 'maxwell'@'%';
GRANT SELECT, REPLICATION CLIENT, REPLICATION SLAVE ON *.* TO 'maxwell'@'%';
