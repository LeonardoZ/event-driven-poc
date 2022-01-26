# POC - RabbitMQ, Arquitetura Event-Driven para Integração Entre sistemas

## Objetivo

Validar se podemos implantar a integração de sistemas capturando eventos e integrando na aplicação destino utilizando RabbitMQ + Aplicação NodeJS fazendo o papel de orquestradora.

## Solution Design

### Cenário 1 -> Eager Data Replication System A -> System B

Producer: Rabbit <- System A Events (CDC) - Nifi

Consumer: Node <- Rabbit
Data enrichement (SQL or HTTP Get)
Integrate to System B database

### Cenário 2 -> Lazy data Integration -> System B -> Orchestrator -> System B

Producer: Rabbit <- Sustem B Events (CDC) - Nifi

Consumer: Node <- Rabbit
Data enrichement from System A
Integrate do System B Database

## Aplicação Base

### System A: Team Management

Sistema que gerencia equipes (teams) de uma empresa.

#### Entidades

users
id, email (unique), role (admin, team_manager, user), fullname, nickname
teams
id, description, type (fixed, dynamic), active
team_role:
id, user_id (unique), task_description, situation, active
situation:  
 member: user that belongs to a team.
leader: user that commands the team.

Users:
Leo
Anthony
Barbara
Marcus
Johnny Boy
Charles
Xavier

Teams:
Earth
Members: Marcus, Barbara
Leader: Johnny Boy

Wind
Members: Charles, Xavier
Leader: Leo

Fire
Leader: Anthony

### System B: Project Management

### Entidades

users
id, email, fullname, role (project_manager, stakeholder)
teams
id, description, active,
project
id, name, status (defined, on_hold, on_progress, cancelled, done)
project_teams
id, team_id, active,
project_teams_members
id, project_id, member_name, role (leader, member),

users
Leo
Barbara
teams
Earth
Wind
project
Bus Project
project_teams
Earth
Wind
project_team_members
Marcus, Barbara, Johny Boy, Charles, Xavier, Leo

### Integrations

Eager
System A -> System B: teams

Lazy
System B -> Orchestrator / System A -> System B: project_teams_members on System B = Todos os membros (members) das equipes definidas (criadas como ativas, ou ativadas) em project_teams (system b)
triggers: project_teams created e updated (active = true)

### Event Design

System A
teams.created -> System B teams
teams.deleted -> System B teams
teams.updated -> System B teams

System B
project_teams.created -> get all team_members from system a and integrate into project_teams_members
project_teams.activated -> get all team_members from system a and integrate into project_teams_members

# Plano de Ação

OK Setup RabbitMQ
OK Criar projeto Orchestrador

- Implantar Esttrutura consumers
- Implantar eventos System A
- Implantar eventos System B
