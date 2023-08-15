# projet-pfe

Application de Centralisation et Gestion des Feedbacks Clients
Cette application, développée avec Symfony 6 pour le backend, React pour le frontend, une base de données MySQL et des dashboards PowerBI intégrés, vise à centraliser et à gérer efficacement les interactions avec les clients, ainsi que la gestion de projets et de tickets associés. Elle offre une collaboration transparente entre les administrateurs, les gestionnaires et les membres de l'équipe pour fournir un service client exceptionnel.

Fonctionnalités Principales


Inscription et Validation des Utilisateurs : Les utilisateurs peuvent s'inscrire sur la plateforme. Les administrateurs reçoivent une notification et un e-mail lorsqu'un nouvel utilisateur s'inscrit. 
Les administrateurs peuvent valider les utilisateurs en leur envoyant un lien d'activation et un mot de passe temporaire.

Authentification et Gestion des Comptes : Les utilisateurs peuvent se connecter après avoir été validés. 
En cas d'oubli de mot de passe, ils peuvent réinitialiser leur mot de passe.

Gestion des Profils Utilisateurs: les administrateurs peuvent activer ou désactiver un utilisateur , modifier un utilisateur et accéder à son profil et  attribuer un ou plusieurs role à un utilisateur .

Gestion des Profils Utilisateurs : Les utilisateurs peuvent modifier leurs données affichées dans leur profil, ainsi que leur mot de passe.

Gestion des Projets : Les administrateurs et les gestionnaires peuvent ajouter des projets et les visualiser. Les clients et les membres  voient uniquement les projets qui leur sont affectés.

Gestion des Tickets : Les client et les gestionnaire peuvent créer des tickets et les ajouter à des projets. Les tickets sont affichés sous forme de tableau Kanban. Les détails des tickets peuvent être consultés.

Affectation et Commentaires : Les gestionnaires peuvent affecter des tickets à des membres du projet. Les utilisateurs peuvent ajouter des commentaires textuels, des commentaires basés sur des ID de commit ou même des scripts SQL aux tickets.

Intégration PowerBI : Des dashboards PowerBI sont intégrés pour fournir des analyses visuelles avancées basées sur les données de l'application.

Notifications : Les notifications sont envoyées dans divers scénarios, notamment lors de l'inscription d'un nouvel utilisateur, de l'affectation d'un membre/client à un projet, de l'affectation d'un membre à un ticket et de l'ajout de commentaires.
Les notifications non lues sont mises en évidence.

Installation et Utilisation 
Clonez ce référentiel sur votre machine locale.

Configurez les détails de la base de données et d'intégration PowerBI dans les fichiers de configuration appropriés.

Installez les dépendances backend en exécutant composer install dans le répertoire Symfony.

Installez les dépendances frontend en exécutant npm install dans le répertoire React.

Exécutez le backend Symfony en utilisant symfony serve.

Exécutez le frontend React en utilisant npm start.

Accédez à l'application dans votre navigateur à l'adresse http://localhost:3000.
