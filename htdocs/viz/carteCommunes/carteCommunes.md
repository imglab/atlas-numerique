# CarteCommunes
by lmk (& medialab)


## description
Carte des communes: chaque cercle figure une commune dans conbavil. La taille du cercle est proportionnelle au nombre de délibérations concernant la commune.
Graphique des avis du conseil.

Couleurs: rouge pour sélection, gris pour inactif.

## fonctionnement
Initialement, tous les lieux sont sélectionnés et le graphique figure l’ensemble des affaires. 
En cliquant sur un lieu, on affiche un extrait des délibérations concernées

Le bouton "que les prisons" est un début de tri par type d'édifice. Il sélectionne les communes pour lequelles il existe au moins une délibération associée au type "prison". La taille des cercle n'est cepedant pas encore ajustée.

## librairie
- D3.js https://d3js.org

## sources des données
Pour l'instant, 24'000 des 26'000 délibérations sont figurées. Certaines, étant des affaires administratives non localisées, ne le sont pas.
Certaines communes n'ont pas encore été géolocalisées, dû à des problèmes d'encodage ou d'homonymie par exemple. 

### CONBAVIL

Ces données sont issues de la base de données CONBAVIL. Elles sont la propriété exclusive du Centre André-Chastel. Leur diffusion sur ce site est effectuée à seule fin de recherche, avec leur aimable autorisation. 

_CONBAVIL. Dépouillement analytique des procès-verbaux des séances du Conseil des Bâtiments civils (1795-1840)_ (2009) [Base de données en ligne], réalisée sous la direction de Françoise Boudon et Werner Szambien, Centre André Chastel (CRNS, UMR 8150), Paris : INHA. https://www.inha.fr/fr/ressources/outils-documentaires/conseil-des-batiments-civils-conbavil.html. Tous droits réservés, Centre André Chastel.

- `conbavil.json`: Export de la base de données CONBAVIL (Filemaker) en XML par Emmanuel Château-Dutier. Extrait transformé en JSON pour les présentes visualisations par Lena Krause, avec l'aide notamment de Stéfan Sinclair. 

### Données géolocalisées: 
Liste des communes mentionnées dans CONBAVIL.

- `geoCommunesConbavil.json`: liste des communes situées en France actuelle. Utilisation du fichier https://github.com/gregoiredavid/france-geojson trouvé sur Github. À partir des contours des contours des communes, simplification dans QGIS pour identifier les centroids. Script pour associer à la liste des communes leur géolocalisation. Limitations: certaines communes n'ont pas encore été géolocalisées, dû à des problèmes d'encodage ou d'homonymie par exemple. 
- `geoCommunesConbavil.json`: liste des communes situées à l'étranger aujourd'hui. La géolocalisation es centroid a été effecutée en utilisant l'API _nominatim_ d'OpenStreetMap.


Travail effectué au Médialab à SciencesPo Paris, sous la direction de Paul Girard, avec la précieuse et joyeuse aide de toute l'équipe de développeurs (merci particulier à Arnaud Pichon).

### Fichier de données géo-historiques
Données historiques du contour des départements français en 1813, obtenues lors de l'école d'été en cartographie numérique (UQAM, été 2018, GRHS/PIREH) et réutilisées avec leur autorisation. 

- `france-dpt-proj.geojson`: conversion du shpfile au format geojson avec https://mygeodata.cloud/. 